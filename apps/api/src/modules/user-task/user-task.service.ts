import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  UserTaskRepository,
  UserTask,
  UserTaskQueryOptions,
} from './user-task.repository';
import {
  CreateUserTaskDto,
  UpdateUserTaskDto,
  UpdateTaskStatusDto,
} from './dto/user-task.dto';
import { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';

// Valid status transitions for UserTask
const VALID_TRANSITIONS: Record<string, string[]> = {
  open: ['in_progress', 'completed', 'cancelled'],
  in_progress: ['completed', 'cancelled', 'open'],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
};

@Injectable()
export class UserTaskService {
  constructor(private readonly userTaskRepository: UserTaskRepository) {}

  async findAll(userId: string, options: UserTaskQueryOptions = {}) {
    return this.userTaskRepository.findByAssignee(userId, options);
  }

  async findById(id: string, user: AuthenticatedUser): Promise<UserTask> {
    const task = await this.userTaskRepository.findById(id);
    if (!task) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `UserTask with ID '${id}' not found`,
        resourceType: 'UserTask',
        resourceId: id,
      });
    }

    // Check access: users can only see their own tasks, GF can see all
    if (
      task.assignedTo !== user.id &&
      !user.roles.includes('GF') &&
      !user.roles.includes('ADMIN')
    ) {
      throw new ForbiddenException({
        type: 'https://api.kompass.de/errors/forbidden',
        title: 'Forbidden',
        status: 403,
        detail: 'You can only access your own tasks',
        requiredPermission: 'UserTask.READ',
        userRoles: user.roles,
      });
    }

    return task;
  }

  async findMyTasks(
    user: AuthenticatedUser,
    options: UserTaskQueryOptions = {},
  ) {
    return this.userTaskRepository.findByAssignee(user.id, options);
  }

  async findOverdue(user: AuthenticatedUser) {
    // GF can see all overdue tasks, others only their own
    const userId =
      user.roles.includes('GF') || user.roles.includes('ADMIN')
        ? undefined
        : user.id;
    return this.userTaskRepository.findOverdue(userId);
  }

  async create(
    dto: CreateUserTaskDto,
    user: AuthenticatedUser,
  ): Promise<UserTask> {
    // Default assignedTo to current user if not specified
    const assignedTo = dto.assignedTo || user.id;

    // Check if user can assign to others (only GF and PLAN)
    if (assignedTo !== user.id) {
      if (
        !user.roles.includes('GF') &&
        !user.roles.includes('PLAN') &&
        !user.roles.includes('ADMIN')
      ) {
        throw new ForbiddenException({
          type: 'https://api.kompass.de/errors/forbidden',
          title: 'Forbidden',
          status: 403,
          detail:
            'You can only create tasks assigned to yourself. GF/PLAN can assign to others.',
          requiredPermission: 'UserTask.ASSIGN_TO_OTHERS',
          userRoles: user.roles,
        });
      }
    }

    // Validate due date is not in the past
    if (dto.dueDate) {
      const dueDate = new Date(dto.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        throw new BadRequestException({
          type: 'https://api.kompass.de/errors/validation-error',
          title: 'Validation Failed',
          status: 400,
          detail: 'Due date cannot be in the past',
          errors: [
            {
              field: 'dueDate',
              message: 'Due date cannot be in the past',
              value: dto.dueDate,
            },
          ],
        });
      }
    }

    const taskData: Partial<UserTask> = {
      ...dto,
      assignedTo,
    };

    // Set completion data if creating as completed
    if (dto.status === 'completed') {
      taskData.completedAt = new Date().toISOString();
      taskData.completedBy = user.id;
    }

    return this.userTaskRepository.create(taskData, user.id, user.email);
  }

  async update(
    id: string,
    dto: UpdateUserTaskDto,
    user: AuthenticatedUser,
  ): Promise<UserTask> {
    const existing = await this.findById(id, user);

    // Check if task can be edited
    if (existing.status === 'completed' || existing.status === 'cancelled') {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: `Cannot update task with status '${existing.status}'`,
        errors: [
          {
            field: 'status',
            message: `Tasks with status '${existing.status}' cannot be modified`,
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

    const updateData: Partial<UserTask> = { ...dto };

    // Set completion data if marking as completed
    if (
      dto.status === 'completed' &&
      (existing.status as string) !== 'completed'
    ) {
      updateData.completedAt = new Date().toISOString();
      updateData.completedBy = user.id;
    }

    return this.userTaskRepository.update(id, updateData, user.id, user.email);
  }

  async updateStatus(
    id: string,
    dto: UpdateTaskStatusDto,
    user: AuthenticatedUser,
  ): Promise<UserTask> {
    return this.update(id, { status: dto.status }, user);
  }

  async delete(id: string, user: AuthenticatedUser): Promise<void> {
    const task = await this.findById(id, user);

    // Cannot delete completed or cancelled tasks
    if (task.status === 'completed' || task.status === 'cancelled') {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: `Cannot delete task with status '${task.status}'`,
      });
    }

    return this.userTaskRepository.delete(id, user.id, user.email);
  }
}
