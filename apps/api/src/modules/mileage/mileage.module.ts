import { Module } from '@nestjs/common';
import { MileageService } from './mileage.service';
import { MileageController } from './mileage.controller';
import { MileageRepository } from './mileage.repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MileageController],
  providers: [MileageService, MileageRepository],
  exports: [MileageService],
})
export class MileageModule {}
