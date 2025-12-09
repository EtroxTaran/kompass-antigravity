import { Module } from '@nestjs/common';
import { ProjectCostService } from './project-cost.service';
import { ProjectCostController } from './project-cost.controller';
import { ProjectCostRepository } from './project-cost.repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectCostController],
  providers: [ProjectCostService, ProjectCostRepository],
  exports: [ProjectCostService],
})
export class ProjectCostModule {}
