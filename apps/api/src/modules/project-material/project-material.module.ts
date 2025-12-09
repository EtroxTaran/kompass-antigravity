import { Module, forwardRef } from '@nestjs/common';
import { ProjectMaterialService } from './project-material.service';
import { ProjectMaterialRepository } from './project-material.repository';
import { OfferModule } from '../offer/offer.module';
import { ProjectMaterialController } from './project-material.controller';

@Module({
    imports: [forwardRef(() => OfferModule)],
    providers: [ProjectMaterialService, ProjectMaterialRepository],
    exports: [ProjectMaterialService],
    controllers: [ProjectMaterialController],
})
export class ProjectMaterialModule { }
