import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { ExpenseRepository } from './expense.repository';
import { MileageRepository } from './mileage.repository';
import { DatabaseModule } from '../../database/database.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [DatabaseModule, ProjectModule],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseRepository, MileageRepository],
  exports: [ExpenseService],
})
export class ExpenseModule {}
