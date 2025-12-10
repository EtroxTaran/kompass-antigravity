import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository } from '../../shared/base.repository';
import * as Nano from 'nano';
import { ProjectSubcontractor } from '@kompass/shared';

@Injectable()
export class ProjectSubcontractorRepository extends BaseRepository<ProjectSubcontractor> {
  protected readonly entityType = 'project_subcontractor';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<ProjectSubcontractor>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  async findByProject(
    projectId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ projectId }, options);
  }

  async findBySupplier(
    supplierId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ supplierId }, options);
  }
}
