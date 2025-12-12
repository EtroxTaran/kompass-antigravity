import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository } from '../../shared/base.repository';
import { Lead } from '@kompass/shared';
import * as Nano from 'nano';

@Injectable()
export class LeadRepository extends BaseRepository<Lead> {
  protected readonly entityType = 'lead';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Lead>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  async findByOwner(
    ownerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ owner: ownerId }, options);
  }
}
