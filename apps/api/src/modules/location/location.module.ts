import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationRepository } from './location.repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  exports: [LocationService],
})
export class LocationModule {}
