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
  rating?: SupplierRating;
  ratingsHistory?: SupplierRatingHistoryItem[];
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

export interface SupplierRating {
  overall: number;          // 1-5 stars, weighted average
  quality: number;          // 1-5
  reliability: number;      // 1-5
  communication: number;    // 1-5
  priceValue: number;       // 1-5
  reviewCount: number;
  lastUpdated: string;      // ISO date
}

export interface SupplierRatingHistoryItem {
  projectId?: string;
  ratings: {
    quality: number;
    reliability: number;
    communication: number;
    priceValue: number;
  };
  feedback?: string;
  ratedBy: string; // userId
  ratedAt: string; // ISO date
}

export interface RateSupplierDto {
  quality: number;
  reliability: number;
  communication: number;
  priceValue: number;
  feedback?: string;
  projectId?: string;
}
