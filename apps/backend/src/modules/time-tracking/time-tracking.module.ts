import { Module } from '@nestjs/common';

import { TimeEntryController } from './controllers/time-entry.controller';
import { TimeEntryRepository } from './repositories/time-entry.repository';
import { TimeEntryService } from './services/time-entry.service';

/**
 * Time Tracking Module
 *
 * Provides time tracking functionality for projects including:
 * - Start/stop timer functionality
 * - Manual time entry
 * - Time entry approval workflow
 * - Labor cost calculations
 *
 * @see Phase 1 of Time Tracking Implementation Plan
 */
@Module({
  controllers: [TimeEntryController],
  providers: [
    TimeEntryService,
    TimeEntryRepository,
    {
      provide: 'ITimeEntryRepository',
      useClass: TimeEntryRepository,
    },
  ],
  exports: [TimeEntryService],
})
export class TimeTrackingModule {}
