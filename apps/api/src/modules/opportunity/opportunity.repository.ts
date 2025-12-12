import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository, BaseEntity } from '../../shared/base.repository';
import * as Nano from 'nano';
import { Comment } from '@kompass/shared';

export interface Opportunity extends BaseEntity {
  type: 'opportunity';

  // Core Info
  title: string;
  customerId: string;
  contactPersonId?: string;

  // Pipeline
  stage:
    | 'lead'
    | 'qualified'
    | 'analysis'
    | 'proposal'
    | 'negotiation'
    | 'closed_won'
    | 'closed_lost';
  probability: number;
  expectedValue: number;
  currency: string;

  expectedCloseDate?: string;

  // Details
  description?: string;
  nextStep?: string;

  // Lost reason
  lostReason?: string;
  lostReasonDetails?: string;

  // Assignment
  owner: string;

  // Approval tracking
  requiresHigherApproval?: boolean;

  comments?: Comment[];
}

@Injectable()
export class OpportunityRepository extends BaseRepository<Opportunity> {
  protected readonly entityType = 'opportunity';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Opportunity>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  /**
   * Find opportunities for a specific customer
   */
  async findByCustomer(
    customerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ customerId }, options);
  }

  /**
   * Find opportunities by pipeline stage
   */
  async findByStage(
    stage: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ stage }, options);
  }

  /**
   * Find opportunities owned by a specific user
   */
  async findByOwner(
    ownerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ owner: ownerId }, options);
  }

  /**
   * Search opportunities by title
   */
  async searchByTitle(
    searchTerm: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector(
      {
        title: { $regex: `(?i)${searchTerm}` },
      },
      options,
    );
  }

  /**
   * Find open opportunities (not closed)
   */
  async findOpen(options: { page?: number; limit?: number } = {}) {
    return this.findBySelector(
      {
        stage: { $nin: ['closed_won', 'closed_lost'] },
      },
      options,
    );
  }

  /**
   * Find opportunities with expected close dates within a range (for calendar integration)
   */
  async findByCloseDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Opportunity[]> {
    const selector: Nano.MangoSelector = {
      type: this.entityType,
      expectedCloseDate: {
        $gte: startDate,
        $lte: endDate,
      },
      stage: { $nin: ['closed_won', 'closed_lost'] },
    };

    const result = await this.findBySelector(selector, {
      limit: 1000,
      sort: 'expectedCloseDate',
      order: 'asc',
    });
    return result.data;
  }
}
