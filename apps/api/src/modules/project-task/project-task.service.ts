import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ProjectTaskRepository,
  ProjectTask,
  ProjectTaskQueryOptions,
} from './project-task.repository';
import {
  CreateProjectTaskDto,
  UpdateProjectTaskDto,
  UpdateProjectTaskStatusDto,
} from './dto/project-task.dto';
import { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import { ProjectRepository } from '../project/project.repository';

// Valid status transitions for ProjectTask
const VALID_TRANSITIONS: Record<string, string[]> = {
  todo: ['in_progress', 'blocked', 'done'],
  in_progress: ['review', 'blocked', 'todo', 'done'],
  review: ['done', 'in_progress', 'blocked'],
  done: [], // Terminal state
  blocked: ['todo', 'in_progress'],
};

@Injectable()
export class ProjectTaskService {
  constructor(
    private readonly projectTaskRepository: ProjectTaskRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async findByProject(
    projectId: string,
    options: ProjectTaskQueryOptions = {},
  ) {
    // Verify project exists
    await this.verifyProjectExists(projectId);
    return this.projectTaskRepository.findByProject(projectId, options);
  }

  async findById(
    projectId: string,
    taskId: string,
    user: AuthenticatedUser,
  ): Promise<ProjectTask> {
    const task = await this.projectTaskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `ProjectTask with ID '${taskId}' not found`,
        resourceType: 'ProjectTask',
        resourceId: taskId,
      });
    }

    // Verify task belongs to the specified project
    if (task.projectId !== projectId) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `ProjectTask '${taskId}' not found in project '${projectId}'`,
      });
    }

    return task;
  }

  async findByAssignee(
    user: AuthenticatedUser,
    options: ProjectTaskQueryOptions = {},
  ) {
    return this.projectTaskRepository.findByAssignee(user.id, options);
  }

  async groupByPhase(projectId: string) {
    await this.verifyProjectExists(projectId);
    return this.projectTaskRepository.groupByPhase(projectId);
  }

  async groupByAssignee(projectId: string) {
    await this.verifyProjectExists(projectId);
    return this.projectTaskRepository.groupByAssignee(projectId);
  }

  async getProjectStats(projectId: string) {
    await this.verifyProjectExists(projectId);
    return this.projectTaskRepository.getProjectStats(projectId);
  }

  async create(
    projectId: string,
    dto: CreateProjectTaskDto,
    user: AuthenticatedUser,
  ): Promise<ProjectTask> {
    // Verify project exists
    await this.verifyProjectExists(projectId);

    // Validate blocking reason if status is blocked
    if (
      dto.status === 'blocked' &&
      (!dto.blockingReason || dto.blockingReason.length < 10)
    ) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Blocking reason is required when task status is blocked',
        errors: [
          {
            field: 'blockingReason',
            message:
              'Blocking reason is required (min 10 characters) when status is blocked',
          },
        ],
      });
    }

    const taskData: Partial<ProjectTask> = {
      ...dto,
      projectId,
    };

    // Set completion data if creating as done
    if (dto.status === 'done') {
      taskData.completedAt = new Date().toISOString();
      taskData.completedBy = user.id;
    }

    return this.projectTaskRepository.create(taskData, user.id, user.email);
  }

  async update(
    projectId: string,
    taskId: string,
    dto: UpdateProjectTaskDto,
    user: AuthenticatedUser,
  ): Promise<ProjectTask> {
    const existing = await this.findById(projectId, taskId, user);

    // Check if task can be edited (done tasks are terminal)
    if (existing.status === 'done') {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Cannot update completed task',
        errors: [
          {
            field: 'status',
            message: "Tasks with status 'done' cannot be modified",
          },
        ],
      });
    }

    // Validate status transition if changing status
    if (dto.status && dto.status !== existing.status) {
      if (!VALID_TRANSITIONS[existing.status].includes(dto.status)) {
        throw new BadRequestException({
          type: 'https://api.kompass.de/errors/validation-error',
          title: 'Validation Failed',
          status: 400,
          detail: `Cannot transition from '${existing.status}' to '${dto.status}'`,
          errors: [
            {
              field: 'status',
              message: `Valid transitions from '${existing.status}': ${VALID_TRANSITIONS[existing.status].join(', ') || 'none'}`,
            },
          ],
        });
      }
    }

    // Validate blocking reason if status is or becomes blocked
    const newStatus = dto.status || existing.status;
    if (newStatus === 'blocked') {
      const blockingReason = dto.blockingReason || existing.blockingReason;
      if (!blockingReason || blockingReason.length < 10) {
        throw new BadRequestException({
          type: 'https://api.kompass.de/errors/validation-error',
          title: 'Validation Failed',
          status: 400,
          detail: 'Blocking reason is required when task status is blocked',
          errors: [
            {
              field: 'blockingReason',
              message:
                'Blocking reason is required (min 10 characters) when status is blocked',
            },
          ],
        });
      }
    }

    const updateData: Partial<ProjectTask> = { ...dto };

    // Set completion data if marking as done
    if (dto.status === 'done' && (existing.status as string) !== 'done') {
      updateData.completedAt = new Date().toISOString();
      updateData.completedBy = user.id;
    }

    // Clear blocking reason if status is no longer blocked
    if (
      dto.status &&
      dto.status !== 'blocked' &&
      existing.status === 'blocked'
    ) {
      updateData.blockingReason = undefined;
    }

    return this.projectTaskRepository.update(
      taskId,
      updateData,
      user.id,
      user.email,
    );
  }

  async updateStatus(
    projectId: string,
    taskId: string,
    dto: UpdateProjectTaskStatusDto,
    user: AuthenticatedUser,
  ): Promise<ProjectTask> {
    const updateDto: UpdateProjectTaskDto = {
      status: dto.status,
      blockingReason: dto.blockingReason,
    };
    return this.update(projectId, taskId, updateDto, user);
  }

  async delete(
    projectId: string,
    taskId: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    const task = await this.findById(projectId, taskId, user);

    // Cannot delete done tasks
    if (task.status === 'done') {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Cannot delete completed task',
      });
    }

    return this.projectTaskRepository.delete(taskId, user.id, user.email);
  }

  private async verifyProjectExists(projectId: string): Promise<void> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Project with ID '${projectId}' not found`,
        resourceType: 'Project',
        resourceId: projectId,
      });
    }
  }
}
