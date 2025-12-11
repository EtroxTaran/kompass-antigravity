import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';
import { TourRepository } from './tour.repository';
import { DatabaseModule } from '../../database/database.module';
import { HaversineProvider } from './providers/haversine.provider';
import { OSRMProvider } from './providers/osrm.provider';
import { GoogleProvider } from './providers/google.provider';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [TourController],
  providers: [
    TourService,
    TourRepository,
    HaversineProvider,
    OSRMProvider,
    GoogleProvider,
    {
      provide: 'ROUTING_PROVIDER',
      useFactory: (
        configService: ConfigService,
        haversineProvider: HaversineProvider,
        osrmProvider: OSRMProvider,
        googleProvider: GoogleProvider,
      ) => {
        const providerName = configService.get<string>('ROUTING_PROVIDER');

        if (
          providerName === 'google' &&
          configService.get('GOOGLE_MAPS_API_KEY')
        ) {
          return googleProvider;
        }

        if (providerName === 'osrm') {
          return osrmProvider;
        }

        // Default
        return haversineProvider;
      },
      inject: [ConfigService, HaversineProvider, OSRMProvider, GoogleProvider],
    },
  ],
  exports: [TourService],
})
export class TourModule {}
