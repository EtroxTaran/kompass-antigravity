import { Injectable, Inject, Logger } from '@nestjs/common';
import { BaseRepository } from '../../shared/base.repository';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { PurchaseOrder } from '@kompass/shared';
import * as Nano from 'nano';

@Injectable()
export class PurchaseOrderRepository extends BaseRepository<PurchaseOrder> {
  protected readonly entityType = 'purchase-order';
  private readonly logger = new Logger(PurchaseOrderRepository.name);

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<PurchaseOrder>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }
}
