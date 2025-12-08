import { BaseEntity } from './base';

export interface Material extends BaseEntity {
    type: 'material';

    itemNumber: string;
    name: string;
    description?: string;

    // Categorization
    category: string;
    unit: 'pc' | 'm' | 'm2' | 'm3' | 'kg' | 'l';

    // Pricing
    purchasePrice: number;
    currency: string;
    validFrom?: string;

    // Supplier
    preferredSupplierId?: string;
    supplierItemNumber?: string;

    // Inventory (Simple for Phase 1)
    inStock?: number;
}
