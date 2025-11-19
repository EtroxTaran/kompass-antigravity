import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '../database/database.module';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

/**
 * Health Module
 *
 * Provides health check functionality for monitoring service status.
 */
@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
