import { Injectable, Inject, Logger } from '@nestjs/common';
import { BaseRepository } from '../../shared/base.repository';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { SupplierInvoice } from './supplier-invoice.entity';
import * as Nano from 'nano';

@Injectable()
export class SupplierInvoiceRepository extends BaseRepository<SupplierInvoice> {
  protected readonly entityType = 'supplier-invoice';
  private readonly logger = new Logger(SupplierInvoiceRepository.name);

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<SupplierInvoice>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }
}
