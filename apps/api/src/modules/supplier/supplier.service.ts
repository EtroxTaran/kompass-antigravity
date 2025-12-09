import { Injectable, NotFoundException } from '@nestjs/common';
import { SupplierRepository, Supplier } from './supplier.repository';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';

@Injectable()
export class SupplierService {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async findAll(
    options: {
      page?: number;
      limit?: number;
      search?: string;
      rating?: string;
    } = {},
  ) {
    if (options.search) {
      return this.supplierRepository.searchByName(options.search, options);
    }
    if (options.rating) {
      return this.supplierRepository.findByRating(options.rating, options);
    }
    return this.supplierRepository.findAll(options);
  }

  async findById(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Supplier with ID '${id}' not found`,
        resourceType: 'Supplier',
        resourceId: id,
      });
    }
    return supplier;
  }

  async create(
    dto: CreateSupplierDto,
    user: { id: string; email?: string },
  ): Promise<Supplier> {
    const supplierData = {
      ...dto,
      category: dto.category || [],
      billingAddress: {
        ...dto.billingAddress,
        country: dto.billingAddress.country || 'Deutschland',
      },
    };
    return this.supplierRepository.create(
      supplierData as Partial<Supplier>,
      user.id,
      user.email,
    );
  }

  async update(
    id: string,
    dto: UpdateSupplierDto,
    user: { id: string; email?: string },
  ): Promise<Supplier> {
    await this.findById(id);
    return this.supplierRepository.update(
      id,
      dto as Partial<Supplier>,
      user.id,
      user.email,
    );
  }

  async delete(
    id: string,
    user: { id: string; email?: string },
  ): Promise<void> {
    await this.findById(id);
    return this.supplierRepository.delete(id, user.id, user.email);
  }
}
