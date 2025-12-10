import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository, BaseEntity } from '../../shared/base.repository';
import * as Nano from 'nano';

export interface Address {
  street: string;
  streetNumber?: string;
  addressLine2?: string;
  zipCode: string;
  city: string;
  state?: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface Supplier extends BaseEntity {
  type: 'supplier';

  companyName: string;
  supplierNumber?: string;
  vatNumber?: string;

  email?: string;
  phone?: string;
  website?: string;

  billingAddress: Address;

  paymentTerms?: string;
  deliveryTerms?: string;

  // Evaluation
  rating?: SupplierRating;
  category?: string[];

  status?: 'Active' | 'Inactive' | 'Blacklisted' | 'PendingApproval' | 'Rejected';

  // Approval Info
  approvedBy?: string; // userId
  approvedAt?: string; // ISO date
  rejectedBy?: string; // userId
  rejectedAt?: string; // ISO date
  rejectionReason?: string;

  blacklistReason?: string;
  blacklistedBy?: string;
  blacklistedAt?: string;
  reinstatedBy?: string;
  reinstatedAt?: string;
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

@Injectable()
export class SupplierRepository extends BaseRepository<Supplier> {
  protected readonly entityType = 'supplier';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Supplier>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  async findByRating(
    minRating: number,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ 'rating.overall': { $gte: minRating } }, options);
  }

  async searchByName(
    searchTerm: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector(
      { companyName: { $regex: `(?i)${searchTerm}` } },
      options,
    );
  }

  async findByCategory(
    category: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector(
      { category: { $elemMatch: { $eq: category } } },
      options,
    );
  }
}
