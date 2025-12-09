import { Module } from '@nestjs/common';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';
import { TourRepository } from './tour.repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TourController],
  providers: [TourService, TourRepository],
  exports: [TourService],
})
export class TourModule {}
