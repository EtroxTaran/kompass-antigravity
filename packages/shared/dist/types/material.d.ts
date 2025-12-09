import { BaseEntity } from "./base";
/**
 * Supplier-specific pricing for a material
 * Enables multi-supplier price comparison for KALK estimates
 */
export interface SupplierPrice {
    supplierId: string;
    supplierName: string;
    unitPrice: number;
    currency: "EUR";
    minimumOrderQuantity: number;
    leadTimeDays: number;
    isPreferred: boolean;
    notes?: string;
    lastUpdated?: string;
}
export interface Material extends BaseEntity {
    type: "material";
    itemNumber: string;
    name: string;
    description?: string;
    category: string;
    unit: "pc" | "m" | "m2" | "m3" | "kg" | "l";
    purchasePrice: number;
    currency: string;
    validFrom?: string;
    supplierPrices?: SupplierPrice[];
    averagePrice?: number;
    lowestPrice?: number;
    preferredSupplierId?: string;
    supplierItemNumber?: string;
    inStock?: number;
}
