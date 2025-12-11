import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import {
  BaseRepository,
  QueryOptions,
  PaginatedResult,
} from '../../shared/base.repository';
import { Notification } from './entities/notification.entity';
import * as Nano from 'nano';

@Injectable()
export class NotificationRepository extends BaseRepository<Notification> {
  protected readonly entityType = 'notification';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Notification>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  async findByRecipient(
    recipientId: string,
    options: QueryOptions = {},
  ): Promise<PaginatedResult<Notification>> {
    const selector: Nano.MangoSelector = { recipientId };

    // Default sort by date desc if not provided
    const sort = options.sort || 'createdAt';
    const order = options.order || 'desc';

    return this.findBySelector(selector, { ...options, sort, order });
  }

  async countUnread(recipientId: string): Promise<number> {
    const selector: Nano.MangoSelector = {
      recipientId,
      isRead: false,
    };

    // Efficiency: We just need the count, not the docs.
    // CouchDB doesn't have a direct "count" without MapReduce or Mango limits.
    // For MVP, finding with limit 1000 and counting length inside implementation
    // or using BaseRepo logic (which does fetch).
    // BaseRepository doesn't expose raw find for count easily without overhead.
    // We'll use findBySelector with fields: ['_id'] to minimize bandwidth.

    // Note: BaseRepository.findBySelector returns PaginatedResult with `total`.
    // We can rely on that if the selector matches correctly.
    const result = await this.findBySelector(selector, { limit: 1 });
    return result.total;
  }
}
