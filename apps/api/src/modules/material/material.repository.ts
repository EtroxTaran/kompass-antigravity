import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository, BaseEntity } from '../../shared/base.repository';
import * as Nano from 'nano';

/**
 * Supplier-specific pricing for a material
 */
export interface SupplierPrice {
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  currency: 'EUR';
  minimumOrderQuantity: number;
  leadTimeDays: number;
  isPreferred: boolean;
  notes?: string;
  lastUpdated?: string;
}

export interface Material extends BaseEntity {
  type: 'material';

  itemNumber: string;
  name: string;
  description?: string;

  // Categorization
  category: string;
  unit: 'pc' | 'm' | 'm2' | 'm3' | 'kg' | 'l';

  // Pricing (legacy)
  purchasePrice: number;
  currency: string;
  validFrom?: string;

  // Multi-Supplier Pricing
  supplierPrices?: SupplierPrice[];
  averagePrice?: number;
  lowestPrice?: number;

  // Supplier (legacy)
  preferredSupplierId?: string;
  supplierItemNumber?: string;

  // Inventory
  inStock?: number;
}

@Injectable()
export class MaterialRepository extends BaseRepository<Material> {
  protected readonly entityType = 'material';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Material>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  /**
   * Find materials by category
   */
  async findByCategory(
    category: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ category }, options);
  }

  /**
   * Find materials by supplier
   */
  async findBySupplier(
    supplierId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ preferredSupplierId: supplierId }, options);
  }

  /**
   * Search materials by name
   */
  async searchByName(
    searchTerm: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector(
      {
        name: { $regex: `(?i)${searchTerm}` },
      },
      options,
    );
  }

  /**
   * Find material by item number
   */
  async findByItemNumber(itemNumber: string): Promise<Material | null> {
    const result = await this.findBySelector({ itemNumber }, { limit: 1 });
    return result.data.length > 0 ? result.data[0] : null;
  }
}
