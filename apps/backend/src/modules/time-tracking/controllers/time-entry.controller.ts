import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

import {
  CreateTimeEntryDto,
  UpdateTimeEntryDto,
  TimeEntryStatus,
  LaborCostSummary,
} from '@kompass/shared/types/entities/time-entry';
import { User } from '@kompass/shared/types/entities/user';

import { TimeEntryService } from '../services/time-entry.service';

import type { TimeEntryFilters } from '../repositories/time-entry.repository.interface';
import type { TimeEntryResponseDto } from '@kompass/shared/types/entities/time-entry';

// TODO: Import actual decorators and guards when auth module is fully implemented
// import { CurrentUser } from '../../auth/decorators/current-user.decorator';
// import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { RbacGuard } from '../../auth/guards/rbac.guard';

// Stub decorators and guards for now
const JwtAuthGuard = class {};
const RbacGuard = class {};
const RequirePermission =
  (_entity: string, _action: string) =>
  (
    _target: unknown,
    _propertyKey: string,
    _descriptor: PropertyDescriptor
  ): void => {};
const CurrentUser =
  () =>
  (_target: unknown, _propertyKey: string, _parameterIndex: number): void => {};

/**
 * Time Entry Controller
 *
 * Handles HTTP endpoints for time tracking functionality.
 *
 * @see Phase 1.2 of Time Tracking Implementation Plan
 */
@Controller('api/v1/time-entries')
@ApiTags('Time Tracking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
export class TimeEntryController {
  constructor(private readonly timeEntryService: TimeEntryService) {}

  /**
   * Create time entry or start timer
   */
  @Post()
  @RequirePermission('TimeEntry', 'CREATE')
  @ApiOperation({ summary: 'Create time entry or start timer' })
  @ApiBody({
    schema: {
      type: 'object',
      description: 'CreateTimeEntryDto',
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Time entry created',
    schema: {
      type: 'object',
      description: 'TimeEntryResponseDto',
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() dto: CreateTimeEntryDto,
    @CurrentUser() user: User
  ): Promise<TimeEntryResponseDto> {
    return this.timeEntryService.create(dto, user.id);
  }

  /**
   * Get all time entries with filtering
   */
  @Get()
  @RequirePermission('TimeEntry', 'READ')
  @ApiOperation({ summary: 'Get all time entries' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: TimeEntryStatus })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({
    status: 200,
    description: 'List of time entries',
    schema: {
      type: 'array',
      items: { type: 'object' },
    },
  })
  async findAll(
    @Query('projectId') projectId?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: TimeEntryStatus,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @CurrentUser() user?: User
  ): Promise<TimeEntryResponseDto[]> {
    const filters: TimeEntryFilters = {
      projectId,
      userId,
      status,
      startDate,
      endDate,
    };
    return this.timeEntryService.findAll(
      filters,
      user?.id ?? '',
      user?.role ?? 'ADM'
    );
  }

  /**
   * Get specific time entry by ID
   */
  @Get(':id')
  @RequirePermission('TimeEntry', 'READ')
  @ApiOperation({ summary: 'Get time entry by ID' })
  @ApiParam({ name: 'id', description: 'Time entry ID' })
  @ApiResponse({
    status: 200,
    description: 'Time entry found',
    schema: {
      type: 'object',
      description: 'TimeEntryResponseDto',
    },
  })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<TimeEntryResponseDto> {
    return this.timeEntryService.findById(id, user.id);
  }

  /**
   * Update time entry
   */
  @Patch(':id')
  @RequirePermission('TimeEntry', 'UPDATE')
  @ApiOperation({ summary: 'Update time entry' })
  @ApiParam({ name: 'id', description: 'Time entry ID' })
  @ApiBody({
    schema: {
      type: 'object',
      description: 'UpdateTimeEntryDto',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Time entry updated',
    schema: {
      type: 'object',
      description: 'TimeEntryResponseDto',
    },
  })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTimeEntryDto,
    @CurrentUser() user: User
  ): Promise<TimeEntryResponseDto> {
    return this.timeEntryService.update(id, dto, user.id);
  }

  /**
   * Delete time entry
   */
  @Delete(':id')
  @RequirePermission('TimeEntry', 'DELETE')
  @ApiOperation({ summary: 'Delete time entry' })
  @ApiParam({ name: 'id', description: 'Time entry ID' })
  @ApiResponse({ status: 204, description: 'Time entry deleted' })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<void> {
    await this.timeEntryService.delete(id, user.id);
  }

  /**
   * Stop running timer
   */
  @Patch(':id/stop')
  @RequirePermission('TimeEntry', 'UPDATE')
  @ApiOperation({ summary: 'Stop running timer' })
  @ApiParam({ name: 'id', description: 'Time entry ID' })
  @ApiResponse({
    status: 200,
    description: 'Timer stopped',
    schema: {
      type: 'object',
      description: 'TimeEntryResponseDto',
    },
  })
  @ApiResponse({ status: 400, description: 'Timer not running' })
  async stopTimer(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<TimeEntryResponseDto> {
    return this.timeEntryService.stopTimer(id, user.id);
  }

  /**
   * Pause running timer
   */
  @Patch(':id/pause')
  @RequirePermission('TimeEntry', 'UPDATE')
  @ApiOperation({ summary: 'Pause running timer' })
  @ApiParam({ name: 'id', description: 'Time entry ID' })
  @ApiResponse({
    status: 200,
    description: 'Timer paused',
    schema: {
      type: 'object',
      description: 'TimeEntryResponseDto',
    },
  })
  async pauseTimer(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<TimeEntryResponseDto> {
    return this.timeEntryService.pauseTimer(id, user.id);
  }

  /**
   * Resume paused timer (creates new entry)
   */
  @Post('resume')
  @RequirePermission('TimeEntry', 'CREATE')
  @ApiOperation({ summary: 'Resume timer (creates new entry)' })
  @ApiBody({
    schema: {
      type: 'object',
      description: 'CreateTimeEntryDto',
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Timer resumed',
    schema: {
      type: 'object',
      description: 'TimeEntryResponseDto',
    },
  })
  async resumeTimer(
    @Body() dto: CreateTimeEntryDto,
    @CurrentUser() user: User
  ): Promise<TimeEntryResponseDto> {
    return this.timeEntryService.create(dto, user.id);
  }

  /**
   * Approve time entry
   */
  @Patch(':id/approve')
  @RequirePermission('TimeEntry', 'APPROVE')
  @ApiOperation({ summary: 'Approve time entry' })
  @ApiParam({ name: 'id', description: 'Time entry ID' })
  @ApiResponse({
    status: 200,
    description: 'Time entry approved',
    schema: {
      type: 'object',
      description: 'TimeEntryResponseDto',
    },
  })
  @ApiResponse({ status: 400, description: 'Cannot approve this entry' })
  async approve(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<TimeEntryResponseDto> {
    return this.timeEntryService.approve(id, user.id);
  }

  /**
   * Reject time entry
   */
  @Patch(':id/reject')
  @RequirePermission('TimeEntry', 'APPROVE')
  @ApiOperation({ summary: 'Reject time entry' })
  @ApiParam({ name: 'id', description: 'Time entry ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string', description: 'Rejection reason' },
      },
      required: ['reason'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Time entry rejected',
    schema: {
      type: 'object',
      description: 'TimeEntryResponseDto',
    },
  })
  async reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: User
  ): Promise<TimeEntryResponseDto> {
    return this.timeEntryService.reject(id, reason, user.id);
  }

  /**
   * Bulk approve time entries
   */
  @Post('bulk-approve')
  @RequirePermission('TimeEntry', 'APPROVE')
  @ApiOperation({ summary: 'Bulk approve time entries' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        entryIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of time entry IDs to approve',
        },
      },
      required: ['entryIds'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Time entries approved',
    schema: {
      type: 'object',
      properties: {
        approvedCount: { type: 'number' },
      },
    },
  })
  async bulkApprove(
    @Body('entryIds') entryIds: string[],
    @CurrentUser() user: User
  ): Promise<{ approvedCount: number }> {
    return this.timeEntryService.bulkApprove(entryIds, user.id);
  }

  /**
   * Get user's active timer
   */
  @Get('active/current')
  @RequirePermission('TimeEntry', 'READ')
  @ApiOperation({ summary: 'Get current user active timer' })
  @ApiResponse({
    status: 200,
    description: 'Active timer found',
    schema: {
      type: 'object',
      description: 'TimeEntryResponseDto',
    },
  })
  @ApiResponse({ status: 204, description: 'No active timer' })
  async getActiveTimer(
    @CurrentUser() user: User
  ): Promise<TimeEntryResponseDto | null> {
    return this.timeEntryService.getActiveTimer(user.id);
  }

  /**
   * Get my timesheets
   */
  @Get('my-timesheets/list')
  @RequirePermission('TimeEntry', 'READ')
  @ApiOperation({ summary: 'Get current user timesheets' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({
    status: 200,
    description: 'User timesheets',
    schema: {
      type: 'array',
      items: { type: 'object' },
    },
  })
  async getMyTimesheets(
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @CurrentUser() user?: User
  ): Promise<TimeEntryResponseDto[]> {
    if (!user) {
      throw new Error('User is required');
    }
    const filters: TimeEntryFilters = {
      userId: user.id,
      startDate,
      endDate,
    };
    return this.timeEntryService.findAll(filters, user.id, user.role);
  }

  /**
   * Get team timesheets (for managers)
   */
  @Get('team/list')
  @RequirePermission('TimeEntry', 'READ')
  @ApiOperation({ summary: 'Get team timesheets' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: TimeEntryStatus })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({
    status: 200,
    description: 'Team timesheets',
    schema: {
      type: 'array',
      items: { type: 'object' },
    },
  })
  async getTeamTimesheets(
    @Query('projectId') projectId?: string,
    @Query('status') status?: TimeEntryStatus,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @CurrentUser() user?: User
  ): Promise<TimeEntryResponseDto[]> {
    if (!user) {
      throw new Error('User is required');
    }
    // RBAC filters applied in service (PLAN/GF/BUCH can see all team entries)
    const filters: TimeEntryFilters = {
      projectId,
      status,
      startDate,
      endDate,
    };
    return this.timeEntryService.findAll(filters, user.id, user.role);
  }
}
