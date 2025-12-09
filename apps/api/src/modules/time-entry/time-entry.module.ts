import { Module } from '@nestjs/common';
import { TimeEntryController } from './time-entry.controller';
import { TimeEntryService } from './time-entry.service';
import { TimeEntryRepository } from './time-entry.repository';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [ProjectModule],
  controllers: [TimeEntryController],
  providers: [TimeEntryService, TimeEntryRepository],
  exports: [TimeEntryService],
})
export class TimeEntryModule { }
