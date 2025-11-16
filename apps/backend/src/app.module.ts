import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Feature modules
import { CalendarModule } from './modules/calendar/calendar.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { LocationModule } from './modules/location/location.module';
import { MeetingModule } from './modules/meeting/meeting.module';
import { ProjectCostModule } from './modules/project-cost/project-cost.module';
import { RoleModule } from './modules/role/role.module';
import { TimeTrackingModule } from './modules/time-tracking/time-tracking.module';
import { TourModule } from './modules/tour/tour.module';
import { UserModule } from './modules/user/user.module';

/**
 * Root Application Module
 *
 * Imports all feature modules and configures global settings.
 */
@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Feature modules
    UserModule,
    CustomerModule,
    LocationModule,
    ExpenseModule,
    CalendarModule,
    MeetingModule,
    TourModule,
    TimeTrackingModule,
    ProjectCostModule,
    RoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
