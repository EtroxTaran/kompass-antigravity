import { BaseEntity } from "./base";

/**
 * Supplier-specific pricing for a material
 * Enables multi-supplier price comparison for KALK estimates
 */
export interface SupplierPrice {
  supplierId: string;
  supplierName: string; // Denormalized for quick display
  unitPrice: number; // € per unit
  currency: "EUR";
  minimumOrderQuantity: number; // MOQ
  leadTimeDays: number; // Delivery time in days
  isPreferred: boolean; // Preferred supplier for this material
  notes?: string; // Price conditions, terms
  lastUpdated?: string; // ISO date string
  rating?: number; // Overall supplier rating 1-5 scale
}

export interface Material extends BaseEntity {
  type: "material";

  itemNumber: string;
  name: string;
  description?: string;

  // Categorization
  category: string;
  unit: "pc" | "m" | "m2" | "m3" | "kg" | "l";

  // Pricing (legacy single-supplier)
  purchasePrice: number;
  currency: string;
  validFrom?: string;

  // Multi-Supplier Pricing
  supplierPrices?: SupplierPrice[];
  averagePrice?: number; // Calculated: average of supplier prices
  lowestPrice?: number; // Calculated: min of supplier prices

  // Supplier (legacy - kept for backward compatibility)
  preferredSupplierId?: string;
  supplierItemNumber?: string;

  // Inventory (Simple for Phase 1)
  inStock?: number;
}
