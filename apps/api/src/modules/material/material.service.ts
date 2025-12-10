import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Material, SupplierPrice } from "@kompass/shared";
import {
  MaterialRepository,
} from './material.repository';
import {
  CreateMaterialDto,
  UpdateMaterialDto,
  AddSupplierPriceDto,
} from './dto/material.dto';
import { SearchService } from '../search/search.service';

@Injectable()
export class MaterialService {
  constructor(
    private readonly materialRepository: MaterialRepository,
    private readonly searchService: SearchService,
  ) { }

  async findAll(
    options: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
    } = {},
  ) {
    if (options.search) {
      try {
        const searchResults = await this.searchService.search(
          'materials',
          options.search,
          {
            limit: options.limit || 20,
            offset: options.page
              ? (options.page - 1) * (options.limit || 20)
              : 0,
          },
        );
        const ids = searchResults.hits.map((h: any) => h.id);
        if (ids.length === 0) return { data: [], total: 0 };

        const materials = await Promise.all(
          ids.map((id) => this.materialRepository.findById(id)),
        );
        return {
          data: materials.filter((m) => m !== null),
          total: searchResults.estimatedTotalHits,
        };
      } catch (error) {
        return this.materialRepository.searchByName(options.search, options);
      }
    }
    if (options.category) {
      return this.materialRepository.findByCategory(options.category, options);
    }
    return this.materialRepository.findAll(options);
  }

  async findById(id: string): Promise<Material> {
    const material = await this.materialRepository.findById(id);
    if (!material) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Material with ID '${id}' not found`,
        resourceType: 'Material',
        resourceId: id,
      });
    }
    return material;
  }

  async findBySupplier(
    supplierId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.materialRepository.findBySupplier(supplierId, options);
  }

  async create(
    dto: CreateMaterialDto,
    user: { id: string; email?: string },
  ): Promise<Material> {
    // Validate unique item number
    const existing = await this.materialRepository.findByItemNumber(
      dto.itemNumber,
    );
    if (existing) {
      throw new ConflictException({
        type: 'https://api.kompass.de/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail: `Material with item number '${dto.itemNumber}' already exists`,
        conflictType: 'duplicate_item_number',
        existingResourceId: existing._id,
      });
    }

    // Calculate price statistics if supplierPrices provided
    const priceStats = this.calculatePriceStats(dto.supplierPrices);

    const materialData = {
      ...dto,
      currency: dto.currency || 'EUR',
      ...priceStats,
    };

    const newMaterial = await this.materialRepository.create(
      materialData as Partial<Material>,
      user.id,
      user.email,
    );
    this.indexMaterial(newMaterial);
    return newMaterial;
  }

  async update(
    id: string,
    dto: UpdateMaterialDto,
    user: { id: string; email?: string },
  ): Promise<Material> {
    const existing = await this.findById(id);

    // Validate unique item number if changing
    if (dto.itemNumber && dto.itemNumber !== existing.itemNumber) {
      const duplicate = await this.materialRepository.findByItemNumber(
        dto.itemNumber,
      );
      if (duplicate) {
        throw new ConflictException({
          type: 'https://api.kompass.de/errors/conflict',
          title: 'Conflict',
          status: 409,
          detail: `Material with item number '${dto.itemNumber}' already exists`,
          conflictType: 'duplicate_item_number',
          existingResourceId: duplicate._id,
        });
      }
    }

    // Calculate price statistics if supplierPrices changed
    let priceStats = {};
    if (dto.supplierPrices !== undefined) {
      priceStats = this.calculatePriceStats(dto.supplierPrices);
    }

    const updated = await this.materialRepository.update(
      id,
      { ...dto, ...priceStats } as Partial<Material>,
      user.id,
      user.email,
    );
    this.indexMaterial(updated);
    return updated;
  }

  async delete(
    id: string,
    user: { id: string; email?: string },
  ): Promise<void> {
    await this.findById(id);
    return this.materialRepository.delete(id, user.id, user.email);
  }

  /**
   * Add or update a supplier price for a material
   */
  async addSupplierPrice(
    materialId: string,
    dto: AddSupplierPriceDto,
    user: { id: string; email?: string },
  ): Promise<Material> {
    const material = await this.findById(materialId);
    const supplierPrices = [...(material.supplierPrices || [])];

    // Check if supplier already exists
    const existingIndex = supplierPrices.findIndex(
      (p) => p.supplierId === dto.supplierId,
    );

    const newPrice: SupplierPrice = {
      supplierId: dto.supplierId,
      supplierName: dto.supplierName,
      unitPrice: dto.unitPrice,
      currency: 'EUR',
      minimumOrderQuantity: dto.minimumOrderQuantity ?? 1,
      leadTimeDays: dto.leadTimeDays ?? 14,
      isPreferred: dto.isPreferred ?? false,
      notes: dto.notes,
      lastUpdated: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // Update existing
      supplierPrices[existingIndex] = newPrice;
    } else {
      // Add new
      supplierPrices.push(newPrice);
    }

    // If this is set as preferred, unset others
    if (newPrice.isPreferred) {
      supplierPrices.forEach((p, i) => {
        if (p.supplierId !== dto.supplierId) {
          supplierPrices[i] = { ...p, isPreferred: false };
        }
      });
    }

    const priceStats = this.calculatePriceStats(supplierPrices);

    return this.materialRepository.update(
      materialId,
      { supplierPrices, ...priceStats },
      user.id,
      user.email,
    );
  }

  /**
   * Remove a supplier price from a material
   */
  async removeSupplierPrice(
    materialId: string,
    supplierId: string,
    user: { id: string; email?: string },
  ): Promise<Material> {
    const material = await this.findById(materialId);
    const supplierPrices = (material.supplierPrices || []).filter(
      (p) => p.supplierId !== supplierId,
    );

    const priceStats = this.calculatePriceStats(supplierPrices);

    return this.materialRepository.update(
      materialId,
      { supplierPrices, ...priceStats },
      user.id,
      user.email,
    );
  }

  /**
   * Calculate average and lowest prices from supplier prices
   */
  private calculatePriceStats(supplierPrices?: { unitPrice: number }[]): {
    averagePrice?: number;
    lowestPrice?: number;
  } {
    if (!supplierPrices || supplierPrices.length === 0) {
      return { averagePrice: undefined, lowestPrice: undefined };
    }

    const prices = supplierPrices.map((p) => p.unitPrice).filter((p) => p > 0);
    if (prices.length === 0) {
      return { averagePrice: undefined, lowestPrice: undefined };
    }

    const sum = prices.reduce((acc, p) => acc + p, 0);
    return {
      averagePrice: Math.round((sum / prices.length) * 100) / 100,
      lowestPrice: Math.min(...prices),
    };
  }

  private async indexMaterial(material: Material) {
    try {
      await this.searchService.addDocuments('materials', [
        {
          id: material._id,
          itemNumber: material.itemNumber,
          name: material.name,
          category: material.category,
        },
      ]);
    } catch (e) {
      console.error('Failed to index material', e);
    }
  }
}
