import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository } from '../../shared/base.repository';
import { Expense } from '@kompass/shared';
import * as Nano from 'nano';

@Injectable()
export class ExpenseRepository extends BaseRepository<Expense> {
  protected readonly entityType = 'expense';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Expense>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }
}
