import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
// Authentication module (must be imported first)
import { AuthModule } from './modules/auth/auth.module';
// Feature modules
import { CalendarModule } from './modules/calendar/calendar.module';
import { CustomerModule } from './modules/customer/customer.module';
// import { ExpenseModule } from './modules/expense/expense.module'; // TODO: Enable when NANO provider is configured
import { LocationModule } from './modules/location/location.module';
// import { MeetingModule } from './modules/meeting/meeting.module'; // TODO: Enable when NANO provider is configured
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

    // Authentication module (must be imported before feature modules)
    AuthModule,

    // Feature modules
    UserModule,
    CustomerModule,
    LocationModule,
    // ExpenseModule, // TODO: Enable when NANO provider is configured
    CalendarModule,
    // MeetingModule, // TODO: Enable when NANO provider is configured
    // TourModule, // TODO: Enable when dependencies are configured
    // TimeTrackingModule, // TODO: Enable when dependencies are configured
    // ProjectCostModule, // TODO: Enable when dependencies are configured
    RoleModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
