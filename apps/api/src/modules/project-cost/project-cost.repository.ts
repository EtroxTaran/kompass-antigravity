import { Injectable, Inject, Logger } from '@nestjs/common';
import { BaseRepository } from '../../shared/base.repository';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { ProjectCost } from '@kompass/shared';
import * as Nano from 'nano';

@Injectable()
export class ProjectCostRepository extends BaseRepository<ProjectCost> {
  protected readonly entityType = 'project-cost';
  private readonly logger = new Logger(ProjectCostRepository.name);

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<ProjectCost>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }
}
