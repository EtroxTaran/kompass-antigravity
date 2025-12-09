import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository, BaseEntity } from '../../shared/base.repository';
import * as Nano from 'nano';

export interface Expense extends BaseEntity {
  type: 'expense';

  // Core Info
  description: string;
  amount: number;
  currency: string;
  date: string; // ISO date
  category: 'travel' | 'meal' | 'accommodation' | 'material' | 'other';

  // Links
  userId: string;
  projectId?: string;
  customerId?: string;

  // Receipt
  receiptUrl?: string; // URL to stored receipt image/pdf

  // Status
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'reimbursed';
  rejectionReason?: string;
}

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
