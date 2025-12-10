import { Module } from '@nestjs/common';
import { OpportunityController } from './opportunity.controller';
import { OpportunityService } from './opportunity.service';
import { OpportunityRepository } from './opportunity.repository';
import { ProjectModule } from '../project/project.module';
import { OfferModule } from '../offer/offer.module';
import { ProjectMaterialModule } from '../project-material/project-material.module';

@Module({
  imports: [ProjectModule, OfferModule, ProjectMaterialModule],
  controllers: [OpportunityController],
  providers: [OpportunityService, OpportunityRepository],
  exports: [OpportunityService, OpportunityRepository],
})
export class OpportunityModule {}
