import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { IcsGeneratorService } from './services/ics-generator.service';
import { UserTaskModule } from '../user-task/user-task.module';
import { ProjectTaskModule } from '../project-task/project-task.module';
import { ProjectModule } from '../project/project.module';
import { OpportunityModule } from '../opportunity/opportunity.module';

@Module({
  imports: [
    UserTaskModule,
    ProjectTaskModule,
    ProjectModule,
    OpportunityModule,
  ],
  controllers: [CalendarController],
  providers: [CalendarService, IcsGeneratorService],
  exports: [CalendarService],
})
export class CalendarModule {}
