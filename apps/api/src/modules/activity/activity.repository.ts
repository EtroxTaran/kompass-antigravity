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

export type ActivityType = 'call' | 'email' | 'meeting' | 'visit' | 'note';

export interface Attachment {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface Activity extends BaseEntity {
  type: 'activity';
  activityType: ActivityType;
  customerId: string;
  contactId?: string;
  locationId?: string;
  date: string;
  duration?: number; // Duration in minutes
  subject: string;
  description?: string; // Rich text
  outcome?: string;
  followUpDate?: string;
  followUpNotes?: string;
  attachments?: Attachment[];
  // Voice-to-text placeholder fields for Phase 2
  voiceRecordingUrl?: string;
  voiceTranscript?: string;
}

export interface ActivityQueryOptions extends QueryOptions {
  activityType?: ActivityType;
  customerId?: string;
  contactId?: string;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable()
export class ActivityRepository extends BaseRepository<Activity> {
  protected readonly entityType = 'activity';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Activity>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  /**
   * Find activities for a specific customer
   */
  async findByCustomer(
    customerId: string,
    options: ActivityQueryOptions = {},
  ): Promise<PaginatedResult<Activity>> {
    const selector: Nano.MangoSelector = { customerId };

    if (options.activityType) {
      selector.activityType = options.activityType;
    }
    if (options.dateFrom || options.dateTo) {
      const dateSelector: Record<string, string> = {};
      if (options.dateFrom) {
        dateSelector.$gte = options.dateFrom;
      }
      if (options.dateTo) {
        dateSelector.$lte = options.dateTo;
      }
      selector.date = dateSelector;
    }

    return this.findBySelector(selector, {
      ...options,
      sort: options.sort || 'date',
      order: options.order || 'desc',
    });
  }

  /**
   * Find activities for a specific contact
   */
  async findByContact(
    contactId: string,
    options: ActivityQueryOptions = {},
  ): Promise<PaginatedResult<Activity>> {
    const selector: Nano.MangoSelector = { contactId };

    if (options.activityType) {
      selector.activityType = options.activityType;
    }
    if (options.dateFrom || options.dateTo) {
      const dateSelector: Record<string, string> = {};
      if (options.dateFrom) {
        dateSelector.$gte = options.dateFrom;
      }
      if (options.dateTo) {
        dateSelector.$lte = options.dateTo;
      }
      selector.date = dateSelector;
    }

    return this.findBySelector(selector, {
      ...options,
      sort: options.sort || 'date',
      order: options.order || 'desc',
    });
  }

  /**
   * Find activities by type
   */
  async findByType(
    activityType: ActivityType,
    options: QueryOptions = {},
  ): Promise<PaginatedResult<Activity>> {
    return this.findBySelector(
      { activityType },
      {
        ...options,
        sort: options.sort || 'date',
        order: options.order || 'desc',
      },
    );
  }

  /**
   * Find activities within date range
   */
  async findByDateRange(
    dateFrom: string,
    dateTo: string,
    options: ActivityQueryOptions = {},
  ): Promise<PaginatedResult<Activity>> {
    const selector: Nano.MangoSelector = {
      date: { $gte: dateFrom, $lte: dateTo },
    };

    if (options.activityType) {
      selector.activityType = options.activityType;
    }
    if (options.customerId) {
      selector.customerId = options.customerId;
    }

    return this.findBySelector(selector, {
      ...options,
      sort: options.sort || 'date',
      order: options.order || 'desc',
    });
  }

  /**
   * Find activities with pending follow-ups
   */
  async findPendingFollowUps(
    options: QueryOptions = {},
  ): Promise<PaginatedResult<Activity>> {
    const today = new Date().toISOString().split('T')[0];
    return this.findBySelector(
      {
        followUpDate: { $lte: today, $exists: true },
      },
      { ...options, sort: 'followUpDate', order: 'asc' },
    );
  }

  /**
   * Get recent activities (timeline view)
   */
  async getTimeline(
    customerId?: string,
    limit: number = 50,
  ): Promise<Activity[]> {
    const selector: Nano.MangoSelector = {};
    if (customerId) {
      selector.customerId = customerId;
    }

    const result = await this.findBySelector(selector, {
      limit,
      sort: 'date',
      order: 'desc',
    });
    return result.data;
  }

  async getEntityHistory(entityId: string, limit: number = 50) {
    return this.auditService.getHistory(entityId, limit);
  }
}
