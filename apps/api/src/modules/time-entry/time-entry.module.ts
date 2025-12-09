import { Module } from '@nestjs/common';
import { TimeEntryController } from './time-entry.controller';
import { TimeEntryService } from './time-entry.service';
import { TimeEntryRepository } from './time-entry.repository';

@Module({
  controllers: [TimeEntryController],
  providers: [TimeEntryService, TimeEntryRepository],
  exports: [TimeEntryService, TimeEntryRepository],
})
export class TimeEntryModule {}
