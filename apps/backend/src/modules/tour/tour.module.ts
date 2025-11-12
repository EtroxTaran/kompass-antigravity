import { Module } from '@nestjs/common';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';
import { TourRepository } from './tour.repository';

/**
 * Tour Module
 * 
 * Provides tour planning and management functionality:
 * - CRUD operations for tours
 * - Auto-suggestion of tours based on meetings
 * - Cost calculation (expenses + mileage)
 * - Route optimization integration
 * - RBAC enforcement
 * - Offline sync support
 * 
 * Phase 2 (Q3 2025)
 */
@Module({
  controllers: [TourController],
  providers: [
    TourService,
    TourRepository,
    {
      provide: 'ITourRepository',
      useClass: TourRepository,
    },
  ],
  exports: [TourService],
})
export class TourModule {}

