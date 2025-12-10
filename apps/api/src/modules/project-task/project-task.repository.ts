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
import { Comment } from '@kompass/shared';

export type ProjectTaskStatus =
  | 'todo'
  | 'in_progress'
  | 'review'
  | 'done'
  | 'blocked';
export type ProjectTaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type ProjectPhase = 'planning' | 'execution' | 'delivery' | 'closure';

export interface ProjectTask extends BaseEntity {
  type: 'project_task';
  projectId: string;
  title: string;
  description?: string;
  status: ProjectTaskStatus;
  priority: ProjectTaskPriority;
  assignedTo: string;
  dueDate?: string;
  phase?: ProjectPhase;
  milestone?: string;
  completedAt?: string;
  completedBy?: string;
  blockingReason?: string;
  comments?: Comment[];
}

export interface ProjectTaskQueryOptions extends QueryOptions {
  status?: ProjectTaskStatus;
  priority?: ProjectTaskPriority;
  phase?: ProjectPhase;
  assignedTo?: string;
}

@Injectable()
export class ProjectTaskRepository extends BaseRepository<ProjectTask> {
  protected readonly entityType = 'project_task';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<ProjectTask>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  /**
   * Find tasks for a specific project
   */
  async findByProject(
    projectId: string,
    options: ProjectTaskQueryOptions = {},
  ): Promise<PaginatedResult<ProjectTask>> {
    const selector: Nano.MangoSelector = { projectId };

    if (options.status) {
      selector.status = options.status;
    }
    if (options.priority) {
      selector.priority = options.priority;
    }
    if (options.phase) {
      selector.phase = options.phase;
    }
    if (options.assignedTo) {
      selector.assignedTo = options.assignedTo;
    }

    return this.findBySelector(selector, options);
  }

  /**
   * Find tasks assigned to a specific user across all projects
   */
  async findByAssignee(
    userId: string,
    options: ProjectTaskQueryOptions = {},
  ): Promise<PaginatedResult<ProjectTask>> {
    const selector: Nano.MangoSelector = { assignedTo: userId };

    if (options.status) {
      selector.status = options.status;
    }
    if (options.priority) {
      selector.priority = options.priority;
    }

    return this.findBySelector(selector, options);
  }

  /**
   * Find blocked tasks for a project
   */
  async findBlockedByProject(
    projectId: string,
  ): Promise<PaginatedResult<ProjectTask>> {
    return this.findBySelector({ projectId, status: 'blocked' });
  }

  /**
   * Group tasks by phase for a project
   */
  async groupByPhase(
    projectId: string,
  ): Promise<Record<string, ProjectTask[]>> {
    const result = await this.findByProject(projectId, { limit: 1000 });

    const grouped: Record<string, ProjectTask[]> = {
      planning: [],
      execution: [],
      delivery: [],
      closure: [],
      unassigned: [],
    };

    for (const task of result.data) {
      const phase = task.phase || 'unassigned';
      if (!grouped[phase]) {
        grouped[phase] = [];
      }
      grouped[phase].push(task);
    }

    return grouped;
  }

  /**
   * Group tasks by assignee for a project
   */
  async groupByAssignee(
    projectId: string,
  ): Promise<Record<string, ProjectTask[]>> {
    const result = await this.findByProject(projectId, { limit: 1000 });

    const grouped: Record<string, ProjectTask[]> = {};

    for (const task of result.data) {
      const assignee = task.assignedTo;
      if (!grouped[assignee]) {
        grouped[assignee] = [];
      }
      grouped[assignee].push(task);
    }

    return grouped;
  }

  /**
   * Get task statistics for a project
   */
  async getProjectStats(projectId: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    const result = await this.findByProject(projectId, { limit: 1000 });

    const byStatus: Record<string, number> = {
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0,
      blocked: 0,
    };

    const byPriority: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    for (const task of result.data) {
      byStatus[task.status] = (byStatus[task.status] || 0) + 1;
      byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
    }

    return {
      total: result.data.length,
      byStatus,
      byPriority,
    };
  }

  /**
   * Find tasks within a date range (for calendar integration)
   */
  async findByDateRange(
    startDate: string,
    endDate: string,
    assignedTo?: string,
  ): Promise<ProjectTask[]> {
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
