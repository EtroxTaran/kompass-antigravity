import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository, BaseEntity } from '../../shared/base.repository';
import * as Nano from 'nano';

export interface ProjectMaterialRequirement extends BaseEntity {
    type: 'project-material-requirement';
    projectId: string;
    materialId?: string; // Optional link to material catalog
    description: string;
    quantity: number;
    unit: string;
    status: 'planned' | 'ordered' | 'delivered';
    sourceOfferId?: string; // Track origin
}

@Injectable()
export class ProjectMaterialRepository extends BaseRepository<ProjectMaterialRequirement> {
    protected readonly entityType = 'project-material-requirement';

    constructor(
        @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<ProjectMaterialRequirement>,
        auditService: AuditService,
    ) {
        super(db, auditService);
    }

    async findByProject(projectId: string): Promise<ProjectMaterialRequirement[]> {
        const result = await this.findBySelector({ projectId }, { limit: 1000 });
        return result.data;
    }
}
