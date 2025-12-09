import { Injectable, Inject, Logger } from '@nestjs/common';
import { BaseRepository } from '../../shared/base.repository';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { Protocol } from '@kompass/shared';
import * as Nano from 'nano';

@Injectable()
export class ProtocolRepository extends BaseRepository<Protocol> {
  protected readonly entityType = 'protocol';
  private readonly logger = new Logger(ProtocolRepository.name);

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Protocol>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }
}
