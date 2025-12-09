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
import { OfferLineItem } from '../offer/offer.repository';

export type ContractStatus =
  | 'draft'
  | 'signed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Contract extends BaseEntity {
  type: 'contract';
  contractNumber: string;
  offerId: string;
  customerId: string;
  contactPersonId?: string;
  projectId?: string;
  contractDate: string;
  startDate?: string;
  endDate?: string;
  status: ContractStatus;
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
  signedAt?: string;
  signedBy?: string;
  // GoBD compliance fields
  immutableAt?: string;
  immutableHash?: string;
  finalized: boolean;
}

export interface ContractQueryOptions extends QueryOptions {
  status?: ContractStatus;
  customerId?: string;
  offerId?: string;
}

@Injectable()
export class ContractRepository extends BaseRepository<Contract> {
  protected readonly entityType = 'contract';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Contract>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  /**
   * Find contracts for a specific customer
   */
  async findByCustomer(
    customerId: string,
    options: ContractQueryOptions = {},
  ): Promise<PaginatedResult<Contract>> {
    const selector: Nano.MangoSelector = { customerId };

    if (options.status) {
      selector.status = options.status;
    }

    return this.findBySelector(selector, {
      ...options,
      sort: options.sort || 'contractDate',
      order: options.order || 'desc',
    });
  }

  /**
   * Find contract by offer ID
   */
  async findByOffer(offerId: string): Promise<Contract | null> {
    const result = await this.findBySelector({ offerId }, { limit: 1 });
    return result.data[0] || null;
  }

  /**
   * Find contracts by status
   */
  async findByStatus(
    status: ContractStatus,
    options: QueryOptions = {},
  ): Promise<PaginatedResult<Contract>> {
    return this.findBySelector({ status }, options);
  }

  /**
   * Find active contracts (signed or in_progress)
   */
  async findActive(
    options: QueryOptions = {},
  ): Promise<PaginatedResult<Contract>> {
    return this.findBySelector(
      { status: { $in: ['signed', 'in_progress'] } },
      options,
    );
  }

  /**
   * Generate next contract number
   */
  async generateContractNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `AB-${year}-`; // AB = Auftragsbestätigung

    const result = await this.db.find({
      selector: {
        type: this.entityType,
        contractNumber: { $regex: `^${prefix}` },
      },
      fields: ['contractNumber'],
      limit: 10000,
    });

    let maxNumber = 0;
    for (const doc of result.docs) {
      const numPart = (doc as any).contractNumber.replace(prefix, '');
      const num = parseInt(numPart, 10);
      if (num > maxNumber) {
        maxNumber = num;
      }
    }

    return `${prefix}${String(maxNumber + 1).padStart(5, '0')}`;
  }

  /**
   * Mark contract as immutable (GoBD compliance)
   */
  async markImmutable(
    id: string,
    userId: string,
    userEmail?: string,
  ): Promise<Contract> {
    const contract = await this.findById(id);
    if (!contract) {
      throw new Error(`Contract not found: ${id}`);
    }

    // Create hash of immutable data
    const dataToHash = JSON.stringify({
      contractNumber: contract.contractNumber,
      customerId: contract.customerId,
      lineItems: contract.lineItems,
      totalEur: contract.totalEur,
      contractDate: contract.contractDate,
    });
    const hash = Buffer.from(dataToHash).toString('base64').slice(0, 64);

    return this.update(
      id,
      {
        finalized: true,
        immutableAt: new Date().toISOString(),
        immutableHash: hash,
      } as Partial<Contract>,
      userId,
      userEmail,
    );
  }
}
