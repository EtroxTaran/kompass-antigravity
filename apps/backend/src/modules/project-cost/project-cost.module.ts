import { Module } from '@nestjs/common';
import { ProjectCostController } from './controllers/project-cost.controller';
import { ProjectCostService } from './services/project-cost.service';
import { ProjectCostRepository } from './repositories/project-cost.repository';

/**
 * Project Cost Module
 * 
 * Provides project cost tracking functionality including:
 * - Material costs
 * - Contractor costs
 * - External service costs
 * - Equipment rental
 * - Invoice management
 * - Payment tracking
 * 
 * @see Phase 1 of Time Tracking Implementation Plan
 */
@Module({
  controllers: [ProjectCostController],
  providers: [
    ProjectCostService,
    ProjectCostRepository,
    {
      provide: 'IProjectCostRepository',
      useClass: ProjectCostRepository,
    },
  ],
  exports: [ProjectCostService],
})
export class ProjectCostModule {}

