import { Module } from '@nestjs/common';
import { ProjectSubcontractorController } from './project-subcontractor.controller';
import { ProjectSubcontractorService } from './project-subcontractor.service';
import { ProjectSubcontractorRepository } from './project-subcontractor.repository';
// Import dependencies
import { ProjectModule } from '../project/project.module';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
    imports: [ProjectModule, SupplierModule],
    controllers: [ProjectSubcontractorController],
    providers: [ProjectSubcontractorService, ProjectSubcontractorRepository],
    exports: [ProjectSubcontractorService],
})
export class ProjectSubcontractorModule { }
