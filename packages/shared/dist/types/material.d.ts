import { BaseEntity } from './base';
export interface Material extends BaseEntity {
    type: 'material';
    itemNumber: string;
    name: string;
    description?: string;
    category: string;
    unit: 'pc' | 'm' | 'm2' | 'm3' | 'kg' | 'l';
    purchasePrice: number;
    currency: string;
    validFrom?: string;
    preferredSupplierId?: string;
    supplierItemNumber?: string;
    inStock?: number;
}
