import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository, BaseEntity } from '../../shared/base.repository';
import * as Nano from 'nano';

export interface TimeEntry extends BaseEntity {
  type: 'time_entry';

  projectId: string;
  taskId?: string;
  userId: string;

  startTime: string;
  endTime?: string;
  durationMinutes: number;

  description: string;

  isBillable: boolean;
}

@Injectable()
export class TimeEntryRepository extends BaseRepository<TimeEntry> {
  protected readonly entityType = 'time_entry';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<TimeEntry>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  async findByProject(
    projectId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ projectId }, options);
  }

  async findByUser(
    userId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ userId }, options);
  }

  async findByTask(
    taskId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ taskId }, options);
  }

  async findBillable(
    projectId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ projectId, isBillable: true }, options);
  }

  async findByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector(
      {
        userId,
        startTime: { $gte: startDate, $lte: endDate },
      },
      options,
    );
  }
}
