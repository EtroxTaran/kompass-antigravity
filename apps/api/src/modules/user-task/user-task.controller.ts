import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserTaskService } from './user-task.service';
import {
  CreateUserTaskDto,
  UpdateUserTaskDto,
  UpdateTaskStatusDto,
} from './dto/user-task.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import type { UserTaskStatus, UserTaskPriority } from './user-task.repository';

@Controller('api/v1')
@UseGuards(JwtAuthGuard, RbacGuard)
export class UserTaskController {
  constructor(private readonly userTaskService: UserTaskService) {}

  /**
   * GET /api/v1/tasks/user
   * List all tasks for the current user (simplified endpoint)
   */
  @Get('tasks/user')
  @Permissions({ entity: 'UserTask', action: 'READ' })
  async findMyTasks(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: UserTaskStatus,
    @Query('priority') priority?: UserTaskPriority,
    @Query('overdue') overdue?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.userTaskService.findMyTasks(user, {
      status,
      priority,
      overdue: overdue === 'true',
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  /**
   * GET /api/v1/users/:userId/tasks
   * List all tasks assigned to a specific user
   */
  @Get('users/:userId/tasks')
  @Permissions({ entity: 'UserTask', action: 'READ' })
  async findByUser(
    @Param('userId') userId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: UserTaskStatus,
    @Query('priority') priority?: UserTaskPriority,
    @Query('overdue') overdue?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.userTaskService.findAll(userId, {
      status,
      priority,
      overdue: overdue === 'true',
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  /**
   * GET /api/v1/users/:userId/tasks/:id
   * Get a specific task by ID
   */
  @Get('users/:userId/tasks/:id')
  @Permissions({ entity: 'UserTask', action: 'READ' })
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.userTaskService.findById(id, user);
  }

  /**
   * GET /api/v1/tasks/user/:id
   * Simplified task access endpoint
   */
  @Get('tasks/user/:id')
  @Permissions({ entity: 'UserTask', action: 'READ' })
  async findTaskById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.userTaskService.findById(id, user);
  }

  /**
   * POST /api/v1/tasks/user
   * Create a new user task
   */
  @Post('tasks/user')
  @Permissions({ entity: 'UserTask', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateUserTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.userTaskService.create(dto, user);
  }

  /**
   * POST /api/v1/users/:userId/tasks
   * Create a task assigned to a specific user
   */
  @Post('users/:userId/tasks')
  @Permissions({ entity: 'UserTask', action: 'CREATE' })
  @HttpCode(HttpStatus.CREATED)
  async createForUser(
    @Param('userId') userId: string,
    @Body() dto: CreateUserTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    // Override assignedTo with the path parameter
    return this.userTaskService.create({ ...dto, assignedTo: userId }, user);
  }

  /**
   * PUT /api/v1/tasks/user/:id
   * Update a user task
   */
  @Put('tasks/user/:id')
  @Permissions({ entity: 'UserTask', action: 'UPDATE' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.userTaskService.update(id, dto, user);
  }

  /**
   * PUT /api/v1/users/:userId/tasks/:id
   * Update a user task (nested route)
   */
  @Put('users/:userId/tasks/:id')
  @Permissions({ entity: 'UserTask', action: 'UPDATE' })
  async updateNested(
    @Param('id') id: string,
    @Body() dto: UpdateUserTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.userTaskService.update(id, dto, user);
  }

  /**
   * PATCH /api/v1/tasks/user/:id/status
   * Update task status only
   */
  @Patch('tasks/user/:id/status')
  @Permissions({ entity: 'UserTask', action: 'UPDATE' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.userTaskService.updateStatus(id, dto, user);
  }

  /**
   * DELETE /api/v1/tasks/user/:id
   * Delete a user task
   */
  @Delete('tasks/user/:id')
  @Permissions({ entity: 'UserTask', action: 'DELETE' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.userTaskService.delete(id, user);
  }

  /**
   * DELETE /api/v1/users/:userId/tasks/:id
   * Delete a user task (nested route)
   */
  @Delete('users/:userId/tasks/:id')
  @Permissions({ entity: 'UserTask', action: 'DELETE' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNested(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.userTaskService.delete(id, user);
  }

  /**
   * GET /api/v1/tasks/overdue
   * Get overdue tasks for current user (or all if GF)
   */
  @Get('tasks/overdue')
  @Permissions({ entity: 'UserTask', action: 'READ' })
  async findOverdue(@CurrentUser() user: AuthenticatedUser) {
    return this.userTaskService.findOverdue(user);
  }
}
