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

export type UserTaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type UserTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface UserTask extends BaseEntity {
  type: 'user_task';
  title: string;
  description?: string;
  status: UserTaskStatus;
  priority: UserTaskPriority;
  dueDate?: string;
  assignedTo: string;
  relatedCustomerId?: string;
  relatedOpportunityId?: string;
  relatedProjectId?: string;
  completedAt?: string;
  completedBy?: string;
}

export interface UserTaskQueryOptions extends QueryOptions {
  status?: UserTaskStatus;
  priority?: UserTaskPriority;
  overdue?: boolean;
  relatedTo?: string;
}

@Injectable()
export class UserTaskRepository extends BaseRepository<UserTask> {
  protected readonly entityType = 'user_task';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<UserTask>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  /**
   * Find tasks assigned to a specific user
   */
  async findByAssignee(
    userId: string,
    options: UserTaskQueryOptions = {},
  ): Promise<PaginatedResult<UserTask>> {
    const selector: Nano.MangoSelector = { assignedTo: userId };

    if (options.status) {
      selector.status = options.status;
    }
    if (options.priority) {
      selector.priority = options.priority;
    }
    if (options.overdue) {
      selector.dueDate = { $lt: new Date().toISOString() };
      selector.status = { $in: ['open', 'in_progress'] };
    }
    if (options.relatedTo) {
      selector.$or = [
        { relatedCustomerId: options.relatedTo },
        { relatedOpportunityId: options.relatedTo },
        { relatedProjectId: options.relatedTo },
      ];
    }

    return this.findBySelector(selector, options);
  }

  /**
   * Find overdue tasks for a user
   */
  async findOverdue(userId?: string): Promise<PaginatedResult<UserTask>> {
    const selector: Nano.MangoSelector = {
      dueDate: { $lt: new Date().toISOString(), $exists: true },
      status: { $in: ['open', 'in_progress'] },
    };

    if (userId) {
      selector.assignedTo = userId;
    }

    return this.findBySelector(selector, { sort: 'dueDate', order: 'asc' });
  }

  /**
   * Find tasks due within N days
   */
  async findDueWithin(
    days: number,
    userId?: string,
  ): Promise<PaginatedResult<UserTask>> {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);

    const selector: Nano.MangoSelector = {
      dueDate: { $gte: now.toISOString(), $lte: future.toISOString() },
      status: { $in: ['open', 'in_progress'] },
    };

    if (userId) {
      selector.assignedTo = userId;
    }

    return this.findBySelector(selector, { sort: 'dueDate', order: 'asc' });
  }

  /**
   * Find tasks related to a customer
   */
  async findByCustomer(
    customerId: string,
    options: QueryOptions = {},
  ): Promise<PaginatedResult<UserTask>> {
    return this.findBySelector({ relatedCustomerId: customerId }, options);
  }

  /**
   * Find tasks related to an opportunity
   */
  async findByOpportunity(
    opportunityId: string,
    options: QueryOptions = {},
  ): Promise<PaginatedResult<UserTask>> {
    return this.findBySelector(
      { relatedOpportunityId: opportunityId },
      options,
    );
  }

  /**
   * Find tasks related to a project
   */
  async findByProject(
    projectId: string,
    options: QueryOptions = {},
  ): Promise<PaginatedResult<UserTask>> {
    return this.findBySelector({ relatedProjectId: projectId }, options);
  }

  /**
   * Find tasks within a date range (for calendar integration)
   */
  async findByDateRange(
    startDate: string,
    endDate: string,
    assignedTo?: string,
  ): Promise<UserTask[]> {
    const selector: Nano.MangoSelector = {
      type: this.entityType,
      dueDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (assignedTo) {
      selector.assignedTo = assignedTo;
    }

    const result = await this.findBySelector(selector, {
      limit: 1000,
      sort: 'dueDate',
      order: 'asc',
    });
    return result.data;
  }
}
