import { Injectable, Inject, Logger } from '@nestjs/common';
import { BaseRepository } from '../../shared/base.repository';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { Delivery } from './delivery.entity';
import * as Nano from 'nano';

@Injectable()
export class DeliveryRepository extends BaseRepository<Delivery> {
  protected readonly entityType = 'delivery';
  private readonly logger = new Logger(DeliveryRepository.name);

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Delivery>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }
}
