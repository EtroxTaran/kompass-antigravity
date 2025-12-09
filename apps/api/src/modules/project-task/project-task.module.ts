import { Module, forwardRef } from '@nestjs/common';
import { ProjectTaskController } from './project-task.controller';
import { ProjectTaskService } from './project-task.service';
import { ProjectTaskRepository } from './project-task.repository';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [forwardRef(() => ProjectModule)],
  controllers: [ProjectTaskController],
  providers: [ProjectTaskService, ProjectTaskRepository],
  exports: [ProjectTaskService, ProjectTaskRepository],
})
export class ProjectTaskModule {}
