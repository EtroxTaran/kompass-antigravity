import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository, BaseEntity } from '../../shared/base.repository';
import * as Nano from 'nano';
import { Comment } from '@kompass/shared';

export interface Project extends BaseEntity {
  type: 'project';

  projectNumber: string;
  name: string;

  // References
  customerId: string;
  opportunityId?: string;
  offerId?: string;
  description?: string;
  tags?: string[];

  // Status
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';

  // Timeline
  startDate?: string;
  endDate?: string;
  actualEndDate?: string;

  // Personnel
  projectManagerId: string;
  teamMemberIds: string[];

  // Financial
  budget?: number; // Kept for backward compatibility or as manual override base

  // Estimated costs (from offer/BOM)
  estimatedMaterialCost?: number;
  estimatedLaborCost?: number;
  estimatedSubcontractorCost?: number;
  estimatedTotalCost?: number;

  // Actual costs (real-time)
  actualMaterialCost?: number;
  actualLaborCost?: number;
  actualSubcontractorCost?: number;
  actualExpenses?: number;
  actualTotalCost?: number;

  // Analysis
  budgetStatus?: 'OnTrack' | 'Warning' | 'Exceeded';
  comments?: Comment[];
}

@Injectable()
export class ProjectRepository extends BaseRepository<Project> {
  protected readonly entityType = 'project';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Project>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  /**
   * Find projects for a specific customer
   */
  async findByCustomer(
    customerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ customerId }, options);
  }

  /**
   * Find projects by status
   */
  async findByStatus(
    status: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ status }, options);
  }

  /**
   * Find projects by project manager
   */
  async findByProjectManager(
    managerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ projectManagerId: managerId }, options);
  }

  /**
   * Find projects where user is a team member
   */
  async findByTeamMember(
    memberId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector(
      {
        teamMemberIds: { $elemMatch: { $eq: memberId } },
      },
      options,
    );
  }

  /**
   * Search projects by name
   */
  async searchByName(
    searchTerm: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector(
      {
        name: { $regex: `(?i)${searchTerm}` },
      },
      options,
    );
  }

  /**
   * Find project by project number
   */
  async findByProjectNumber(projectNumber: string): Promise<Project | null> {
    const result = await this.findBySelector({ projectNumber }, { limit: 1 });
    return result.data.length > 0 ? result.data[0] : null;
  }

  /**
   * Get next project number sequence
   */
  async getNextProjectNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const result = await this.db.find({
      selector: {
        type: this.entityType,
        projectNumber: { $regex: `^PRJ-${year}-` },
      },
      fields: ['projectNumber'],
      limit: 10000,
    });

    const numbers = result.docs
      .map((doc: any) => {
        const match = doc.projectNumber.match(/PRJ-\d{4}-(\d{5})/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n: number) => !isNaN(n));

    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = (maxNumber + 1).toString().padStart(5, '0');

    return `PRJ-${year}-${nextNumber}`;
  }

  /**
   * Find projects with deadlines within a date range (for calendar integration)
   */
  async findByDeadlineRange(
    startDate: string,
    endDate: string,
  ): Promise<Project[]> {
    const selector: Nano.MangoSelector = {
      type: this.entityType,
      endDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const result = await this.findBySelector(selector, {
      limit: 1000,
      sort: 'endDate',
      order: 'asc',
    });
    return result.data;
  }

  /**
   * Unlink all projects from a customer (set customerId = undefined)
   * Used for cascading customer delete - preserves project data
   */
  async unlinkFromCustomer(
    customerId: string,
    userId: string,
    userEmail?: string,
  ): Promise<number> {
    const result = await this.findByCustomer(customerId, { limit: 1000 });
    let unlinkedCount = 0;

    for (const project of result.data) {
      await this.update(
        project._id,
        { customerId: undefined } as unknown as Partial<Project>,
        userId,
        userEmail,
      );
      unlinkedCount++;
    }

    return unlinkedCount;
  }
}
