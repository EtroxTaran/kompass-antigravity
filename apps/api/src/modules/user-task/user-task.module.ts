import { Module } from '@nestjs/common';
import { UserTaskController } from './user-task.controller';
import { UserTaskService } from './user-task.service';
import { UserTaskRepository } from './user-task.repository';

@Module({
  controllers: [UserTaskController],
  providers: [UserTaskService, UserTaskRepository],
  exports: [UserTaskService, UserTaskRepository],
})
export class UserTaskModule {}
