import { Module } from '@nestjs/common';

import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { IcsGeneratorService } from './services/ics-generator.service';

@Module({
  controllers: [CalendarController],
  providers: [CalendarService, IcsGeneratorService],
  exports: [CalendarService],
})
export class CalendarModule {}
