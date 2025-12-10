import { Module, forwardRef } from '@nestjs/common';
import { ProjectMaterialService } from './project-material.service';
import { ProjectMaterialRepository } from './project-material.repository';
import { OfferModule } from '../offer/offer.module';
import { ProjectModule } from '../project/project.module';
import { ProjectMaterialController } from './project-material.controller';

@Module({
    imports: [forwardRef(() => OfferModule), ProjectModule],
    providers: [ProjectMaterialService, ProjectMaterialRepository],
    exports: [ProjectMaterialService],
    controllers: [ProjectMaterialController],
})
export class ProjectMaterialModule { }
