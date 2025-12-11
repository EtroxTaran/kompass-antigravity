import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository, BaseEntity } from '../../shared/base.repository';
import * as Nano from 'nano';

export interface Contact extends BaseEntity {
  type: 'contact';

  // Basic information
  firstName: string;
  lastName: string;
  title?: string;
  position?: string;

  // Contact details
  email?: string;
  phone?: string;
  mobile?: string;

  // Relationship
  customerId: string;

  // Decision-Making
  decisionMakingRole:
    | 'decision_maker'
    | 'key_influencer'
    | 'recommender'
    | 'gatekeeper'
    | 'operational_contact'
    | 'informational';
  authorityLevel: 'low' | 'medium' | 'high' | 'final_authority';
  canApproveOrders: boolean;
  approvalLimitEur?: number;

  // Location Assignment
  assignedLocationIds: string[];
  isPrimaryContactForLocations: string[];

  // Preferences
  preferredContactMethod?: 'email' | 'phone' | 'mobile';
  language?: string;
}

@Injectable()
export class ContactRepository extends BaseRepository<Contact> {
  protected readonly entityType = 'contact';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Contact>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  /**
   * Find contacts for a specific customer
   */
  async findByCustomer(
    customerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ customerId }, options);
  }

  /**
   * Search contacts by email
   */
  async findByEmail(
    email: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector(
      {
        email: { $regex: `(?i)${email}` },
      },
      options,
    );
  }

  /**
   * Find contacts by decision-making role
   */
  async findByDecisionRole(
    role: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ decisionMakingRole: role }, options);
  }

  /**
   * Delete all contacts for a specific customer (cascade delete)
   */
  async deleteByCustomer(
    customerId: string,
    userId: string,
    userEmail?: string,
  ): Promise<number> {
    const result = await this.findByCustomer(customerId, { limit: 1000 });
    let deletedCount = 0;

    for (const contact of result.data) {
      await this.delete(contact._id, userId, userEmail);
      deletedCount++;
    }

    return deletedCount;
  }
}
