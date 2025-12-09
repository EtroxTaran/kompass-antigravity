import { Module, forwardRef } from '@nestjs/common';
import { ProjectMaterialService } from './project-material.service';
import { ProjectMaterialRepository } from './project-material.repository';
import { OfferModule } from '../offer/offer.module';

@Module({
    imports: [forwardRef(() => OfferModule)],
    providers: [ProjectMaterialService, ProjectMaterialRepository],
    exports: [ProjectMaterialService],
})
export class ProjectMaterialModule { }
