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

  // Status & Blacklist
  status?: 'Active' | 'Inactive' | 'Blacklisted' | 'PendingApproval' | 'Rejected';

  // Approval Info
  approvedBy?: string; // userId
  approvedAt?: string; // ISO date
  rejectedBy?: string; // userId
  rejectedAt?: string; // ISO date
  rejectionReason?: string;

  // Blacklist Info
  blacklistReason?: string;
  blacklistedBy?: string; // userId
  blacklistedAt?: string; // ISO date
  reinstatedBy?: string; // userId
  reinstatedAt?: string; // ISO date

  // Operational
  activeProjectCount?: number;
}
