/**
 * Location Module
 *
 * Manages customer delivery locations
 * Implements nested REST API under Customer resource
 */

import { Module } from '@nestjs/common';

import { LocationController } from './location.controller';
import { LocationRepository } from './location.repository';
import { LocationService } from './location.service';

@Module({
  imports: [
    // TODO: Import SharedModule, CustomerModule when available
  ],
  controllers: [LocationController],
  providers: [
    LocationService,
    LocationRepository,
    {
      provide: 'ILocationRepository',
      useClass: LocationRepository,
    },
    // TODO: Provide ICustomerService when CustomerModule is ready
  ],
  exports: [LocationService],
})
export class LocationModule {}
