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
import { ProjectTaskService } from './project-task.service';
import {
  CreateProjectTaskDto,
  UpdateProjectTaskDto,
  UpdateProjectTaskStatusDto,
} from './dto/project-task.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/strategies/jwt.strategy';
import type {
  ProjectTaskStatus,
  ProjectTaskPriority,
  ProjectPhase,
} from './project-task.repository';

@Controller('api/v1/projects/:projectId/tasks')
@UseGuards(JwtAuthGuard, RbacGuard)
export class ProjectTaskController {
  constructor(private readonly projectTaskService: ProjectTaskService) {}

  /**
   * GET /api/v1/projects/:projectId/tasks
   * List all tasks for a project
   */
  @Get()
  @Permissions(
    { entity: 'ProjectTask', action: 'READ' },
    { entity: 'Project', action: 'READ' },
  )
  async findByProject(
    @Param('projectId') projectId: string,
    @Query('status') status?: ProjectTaskStatus,
    @Query('priority') priority?: ProjectTaskPriority,
    @Query('phase') phase?: ProjectPhase,
    @Query('assignedTo') assignedTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.projectTaskService.findByProject(projectId, {
      status,
      priority,
      phase,
      assignedTo,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      sort: sort || 'priority',
      order: order || 'desc',
    });
  }

  /**
   * GET /api/v1/projects/:projectId/tasks/by-phase
   * Get tasks grouped by phase
   */
  @Get('by-phase')
  @Permissions(
    { entity: 'ProjectTask', action: 'READ' },
    { entity: 'Project', action: 'READ' },
  )
  async groupByPhase(@Param('projectId') projectId: string) {
    const tasksByPhase = await this.projectTaskService.groupByPhase(projectId);
    return {
      projectId,
      tasksByPhase,
      total: Object.values(tasksByPhase).flat().length,
    };
  }

  /**
   * GET /api/v1/projects/:projectId/tasks/by-assignee
   * Get tasks grouped by assignee
   */
  @Get('by-assignee')
  @Permissions(
    { entity: 'ProjectTask', action: 'READ' },
    { entity: 'Project', action: 'READ' },
  )
  async groupByAssignee(@Param('projectId') projectId: string) {
    const tasksByAssignee =
      await this.projectTaskService.groupByAssignee(projectId);
    return {
      projectId,
      tasksByAssignee,
      total: Object.values(tasksByAssignee).flat().length,
    };
  }

  /**
   * GET /api/v1/projects/:projectId/tasks/stats
   * Get task statistics for a project
   */
  @Get('stats')
  @Permissions(
    { entity: 'ProjectTask', action: 'READ' },
    { entity: 'Project', action: 'READ' },
  )
  async getStats(@Param('projectId') projectId: string) {
    return this.projectTaskService.getProjectStats(projectId);
  }

  /**
   * GET /api/v1/projects/:projectId/tasks/:taskId
   * Get a specific task
   */
  @Get(':taskId')
  @Permissions(
    { entity: 'ProjectTask', action: 'READ' },
    { entity: 'Project', action: 'READ' },
  )
  async findById(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectTaskService.findById(projectId, taskId, user);
  }

  /**
   * POST /api/v1/projects/:projectId/tasks
   * Create a new task for a project
   */
  @Post()
  @Permissions(
    { entity: 'ProjectTask', action: 'CREATE' },
    { entity: 'Project', action: 'READ' },
  )
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateProjectTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectTaskService.create(projectId, dto, user);
  }

  /**
   * PUT /api/v1/projects/:projectId/tasks/:taskId
   * Update a task
   */
  @Put(':taskId')
  @Permissions(
    { entity: 'ProjectTask', action: 'UPDATE' },
    { entity: 'Project', action: 'READ' },
  )
  async update(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateProjectTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectTaskService.update(projectId, taskId, dto, user);
  }

  /**
   * PATCH /api/v1/projects/:projectId/tasks/:taskId/status
   * Update task status only
   */
  @Patch(':taskId/status')
  @Permissions(
    { entity: 'ProjectTask', action: 'UPDATE' },
    { entity: 'Project', action: 'READ' },
  )
  async updateStatus(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateProjectTaskStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectTaskService.updateStatus(projectId, taskId, dto, user);
  }

  /**
   * DELETE /api/v1/projects/:projectId/tasks/:taskId
   * Delete a task
   */
  @Delete(':taskId')
  @Permissions(
    { entity: 'ProjectTask', action: 'DELETE' },
    { entity: 'Project', action: 'READ' },
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.projectTaskService.delete(projectId, taskId, user);
  }
}
