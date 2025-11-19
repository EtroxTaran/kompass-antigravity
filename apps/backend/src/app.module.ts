import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
// Authentication module (must be imported first)
import { AuthModule } from './modules/auth/auth.module';
// Database module (provides NANO CouchDB client)
// Feature modules
import { CalendarModule } from './modules/calendar/calendar.module';
import { CustomerModule } from './modules/customer/customer.module';
import { DatabaseModule } from './modules/database/database.module';
// import { ExpenseModule } from './modules/expense/expense.module'; // TODO: Enable when NANO provider is configured
// import { MeetingModule } from './modules/meeting/meeting.module'; // TODO: Enable when NANO provider is configured
import { HealthModule } from './modules/health/health.module';
import { LocationModule } from './modules/location/location.module';
import { RoleModule } from './modules/role/role.module';
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

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Database module (provides NANO CouchDB client - Global)
    DatabaseModule,

    // Health check module
    HealthModule,

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
  providers: [
    // Global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
