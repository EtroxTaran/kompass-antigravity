import { Module } from '@nestjs/common';
import { SummarizeController } from './summarize.controller';
import { SummarizeService } from './summarize.service';
import { UserTaskModule } from '../user-task/user-task.module';

@Module({
  imports: [UserTaskModule],
  controllers: [SummarizeController],
  providers: [SummarizeService],
})
export class SummarizeModule {}
