import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import {
  BaseRepository,
  BaseEntity,
  QueryOptions,
  PaginatedResult,
} from '../../shared/base.repository';
import * as Nano from 'nano';

export type OfferStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'superseded';

export interface OfferLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit?: string;
}

export interface Offer extends BaseEntity {
  type: 'offer';
  offerNumber: string;
  opportunityId: string;
  customerId: string;
  contactPersonId?: string;
  offerDate: string;
  validUntil: string;
  status: OfferStatus;
  lineItems: OfferLineItem[];
  subtotalEur: number;
  discountPercent?: number;
  discountEur?: number;
  taxRate: number;
  taxEur: number;
  totalEur: number;
  currency: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  notes?: string;
  pdfUrl?: string;
  sentAt?: string;
  viewedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  supersededBy?: string;
}

export interface OfferQueryOptions extends QueryOptions {
  status?: OfferStatus;
  customerId?: string;
  opportunityId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

@Injectable()
export class OfferRepository extends BaseRepository<Offer> {
  protected readonly entityType = 'offer';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Offer>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  /**
   * Find offers for a specific customer
   */
  async findByCustomer(
    customerId: string,
    options: OfferQueryOptions = {},
  ): Promise<PaginatedResult<Offer>> {
    const selector: Nano.MangoSelector = { customerId };

    if (options.status) {
      selector.status = options.status;
    }

    return this.findBySelector(selector, {
      ...options,
      sort: options.sort || 'offerDate',
      order: options.order || 'desc',
    });
  }

  /**
   * Find offers for a specific opportunity
   */
  async findByOpportunity(
    opportunityId: string,
    options: QueryOptions = {},
  ): Promise<PaginatedResult<Offer>> {
    return this.findBySelector(
      { opportunityId },
      { ...options, sort: 'offerDate', order: 'desc' },
    );
  }

  /**
   * Find offers by status
   */
  async findByStatus(
    status: OfferStatus,
    options: QueryOptions = {},
  ): Promise<PaginatedResult<Offer>> {
    return this.findBySelector({ status }, options);
  }

  /**
   * Find expired offers that need status update
   */
  async findExpiredOffers(): Promise<PaginatedResult<Offer>> {
    const today = new Date().toISOString().split('T')[0];
    return this.findBySelector({
      validUntil: { $lt: today },
      status: { $in: ['sent', 'viewed'] },
    });
  }

  /**
   * Generate next offer number
   */
  async generateOfferNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `A-${year}-`;

    // Find the highest offer number for this year
    const result = await this.db.find({
      selector: {
        type: this.entityType,
        offerNumber: { $regex: `^${prefix}` },
      },
      fields: ['offerNumber'],
      limit: 10000,
    });

    let maxNumber = 0;
    for (const doc of result.docs) {
      const numPart = (doc as any).offerNumber.replace(prefix, '');
      const num = parseInt(numPart, 10);
      if (num > maxNumber) {
        maxNumber = num;
      }
    }

    return `${prefix}${String(maxNumber + 1).padStart(5, '0')}`;
  }
}
