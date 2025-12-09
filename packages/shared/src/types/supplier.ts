import { BaseEntity, Address } from "./base";

export interface Supplier extends BaseEntity {
  type: "supplier";

  companyName: string;
  supplierNumber?: string;
  vatNumber?: string;

  // Contact info
  email?: string;
  phone?: string;
  website?: string;

  billingAddress: Address;

  // Terms
  paymentTerms?: string;
  deliveryTerms?: string;

  // Evaluation
  rating?: "A" | "B" | "C";
  category?: string[]; // e.g., 'wood', 'metal', 'electronics'
}
