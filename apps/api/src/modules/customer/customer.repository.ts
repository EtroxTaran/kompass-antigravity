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
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface DsgvoConsent {
  marketing?: boolean;
  aiProcessing?: boolean;
  dataSharing?: boolean;
  grantedAt?: string;
  grantedBy?: string;
  revokedAt?: string;
}

export interface Customer extends BaseEntity {
  type: 'customer';
  companyName: string;
  vatNumber?: string;
  email?: string;
  phone?: string;
  website?: string;
  creditLimit?: number;
  paymentTerms?: string;
  industry?: string;
  customerType?:
  | 'direct_marketer'
  | 'retail'
  | 'franchise'
  | 'cooperative'
  | 'other';
  rating?: 'A' | 'B' | 'C';
  billingAddress: Address;
  locations: string[];
  defaultDeliveryLocationId?: string;
  owner: string;
  contactPersons: string[];

  // Visit Management
  visitFrequencyDays?: number;
  lastVisit?: string; // ISO Date

  // Compliance
  dsgvoConsent?: DsgvoConsent;

  dataRetentionUntil?: string;
  anonymized?: boolean;
  anonymizedAt?: string;
}

@Injectable()
export class CustomerRepository extends BaseRepository<Customer> {
  protected readonly entityType = 'customer';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Customer>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  /**
   * Find customers owned by a specific user (for ADM role)
   */
  async findByOwner(
    ownerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ owner: ownerId }, options);
  }

  /**
   * Search customers by company name
   */
  async searchByCompanyName(
    searchTerm: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector(
      {
        companyName: { $regex: `(?i)${searchTerm}` },
      },
      options,
    );
  }

  /**
   * Find customers by industry
   */
  async findByIndustry(
    industry: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ industry }, options);
  }
}
