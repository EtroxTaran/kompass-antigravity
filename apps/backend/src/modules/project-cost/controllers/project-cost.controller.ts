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
  UnauthorizedException,
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
  CreateProjectCostDto,
  UpdateProjectCostDto,
  ProjectCostStatus,
  ProjectCostType,
} from '@kompass/shared/types/entities/project-cost';
import { User } from '@kompass/shared/types/entities/user';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../auth/guards/rbac.guard';
import { ProjectCostService } from '../services/project-cost.service';

import type { ProjectCostFilters } from '../repositories/project-cost.repository.interface';
import type {
  ProjectCostResponseDto,
  MaterialCostSummary,
} from '@kompass/shared/types/entities/project-cost';

/**
 * Project Cost Controller
 *
 * Handles HTTP endpoints for project cost tracking functionality.
 *
 * @see Phase 1 of Time Tracking Implementation Plan
 */
@Controller('api/v1/project-costs')
@ApiTags('Project Costs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
export class ProjectCostController {
  constructor(private readonly projectCostService: ProjectCostService) {}

  /**
   * Create project cost
   */
  @Post()
  @RequirePermission('ProjectCost', 'CREATE')
  @ApiOperation({ summary: 'Create project cost' })
  @ApiBody({
    schema: {
      type: 'object',
      description: 'CreateProjectCostDto',
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Project cost created',
    schema: {
      type: 'object',
      description: 'ProjectCostResponseDto',
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() dto: CreateProjectCostDto,
    @CurrentUser() user: User
  ): Promise<ProjectCostResponseDto> {
    return this.projectCostService.create(dto, user._id);
  }

  /**
   * Get all project costs with filtering
   */
  @Get()
  @RequirePermission('ProjectCost', 'READ')
  @ApiOperation({ summary: 'Get all project costs' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'costType', required: false, enum: ProjectCostType })
  @ApiQuery({ name: 'status', required: false, enum: ProjectCostStatus })
  @ApiQuery({ name: 'supplierName', required: false })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({
    status: 200,
    description: 'List of project costs',
    schema: {
      type: 'array',
      items: { type: 'object' },
    },
  })
  async findAll(
    @Query('projectId') projectId?: string,
    @Query('costType') costType?: ProjectCostType,
    @Query('status') status?: ProjectCostStatus,
    @Query('supplierName') supplierName?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @CurrentUser() user?: User
  ): Promise<ProjectCostResponseDto[]> {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const filters: ProjectCostFilters = {
      projectId,
      costType,
      status,
      supplierName,
      startDate,
      endDate,
    };
    return this.projectCostService.findAll(filters, user._id);
  }

  /**
   * Get specific project cost by ID
   */
  @Get(':id')
  @RequirePermission('ProjectCost', 'READ')
  @ApiOperation({ summary: 'Get project cost by ID' })
  @ApiParam({ name: 'id', description: 'Project cost ID' })
  @ApiResponse({
    status: 200,
    description: 'Project cost found',
    schema: {
      type: 'object',
      description: 'ProjectCostResponseDto',
    },
  })
  @ApiResponse({ status: 404, description: 'Project cost not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<ProjectCostResponseDto> {
    return this.projectCostService.findById(id, user._id);
  }

  /**
   * Update project cost
   */
  @Patch(':id')
  @RequirePermission('ProjectCost', 'UPDATE')
  @ApiOperation({ summary: 'Update project cost' })
  @ApiParam({ name: 'id', description: 'Project cost ID' })
  @ApiBody({
    schema: {
      type: 'object',
      description: 'UpdateProjectCostDto',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Project cost updated',
    schema: {
      type: 'object',
      description: 'ProjectCostResponseDto',
    },
  })
  @ApiResponse({ status: 404, description: 'Project cost not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectCostDto,
    @CurrentUser() user: User
  ): Promise<ProjectCostResponseDto> {
    return this.projectCostService.update(id, dto, user._id);
  }

  /**
   * Delete project cost
   */
  @Delete(':id')
  @RequirePermission('ProjectCost', 'DELETE')
  @ApiOperation({ summary: 'Delete project cost' })
  @ApiParam({ name: 'id', description: 'Project cost ID' })
  @ApiResponse({ status: 204, description: 'Project cost deleted' })
  @ApiResponse({ status: 404, description: 'Project cost not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<void> {
    await this.projectCostService.delete(id, user._id);
  }

  /**
   * Approve project cost
   */
  @Patch(':id/approve')
  @RequirePermission('ProjectCost', 'APPROVE')
  @ApiOperation({ summary: 'Approve project cost' })
  @ApiParam({ name: 'id', description: 'Project cost ID' })
  @ApiResponse({
    status: 200,
    description: 'Project cost approved',
    schema: {
      type: 'object',
      description: 'ProjectCostResponseDto',
    },
  })
  @ApiResponse({ status: 400, description: 'Cannot approve this cost' })
  async approve(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<ProjectCostResponseDto> {
    return this.projectCostService.approve(id, user._id);
  }

  /**
   * Mark project cost as paid
   */
  @Patch(':id/mark-paid')
  @RequirePermission('ProjectCost', 'UPDATE')
  @ApiOperation({ summary: 'Mark project cost as paid' })
  @ApiParam({ name: 'id', description: 'Project cost ID' })
  @ApiResponse({
    status: 200,
    description: 'Project cost marked as paid',
    schema: {
      type: 'object',
      description: 'ProjectCostResponseDto',
    },
  })
  @ApiResponse({ status: 400, description: 'Cannot mark as paid' })
  async markAsPaid(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<ProjectCostResponseDto> {
    return this.projectCostService.markAsPaid(id, user._id);
  }

  /**
   * Get project costs pending payment
   */
  @Get('pending/payment')
  @RequirePermission('ProjectCost', 'READ')
  @ApiOperation({ summary: 'Get costs pending payment' })
  @ApiResponse({
    status: 200,
    description: 'Pending payment costs',
    schema: {
      type: 'array',
      items: { type: 'object' },
    },
  })
  async getPendingPayments(
    @CurrentUser() user: User
  ): Promise<ProjectCostResponseDto[]> {
    return this.projectCostService.getPendingPayments(user._id);
  }

  /**
   * Get project costs by supplier
   */
  @Get('supplier/:supplierName')
  @RequirePermission('ProjectCost', 'READ')
  @ApiOperation({ summary: 'Get costs by supplier' })
  @ApiParam({ name: 'supplierName', description: 'Supplier name' })
  @ApiResponse({
    status: 200,
    description: 'Supplier costs',
    schema: {
      type: 'array',
      items: { type: 'object' },
    },
  })
  async getBySupplier(
    @Param('supplierName') supplierName: string,
    @CurrentUser() user: User
  ): Promise<ProjectCostResponseDto[]> {
    return this.projectCostService.getBySupplier(supplierName, user._id);
  }
}

/**
 * Project Cost Queries Controller
 *
 * Handles project-specific cost queries (nested under projects)
 */
@Controller('api/v1/projects/:projectId/costs')
@ApiTags('Projects - Costs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
export class ProjectCostQueriesController {
  constructor(private readonly projectCostService: ProjectCostService) {}

  /**
   * Get all costs for a project
   */
  @Get()
  @RequirePermission('ProjectCost', 'READ')
  @ApiOperation({ summary: 'Get project costs' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({
    status: 200,
    description: 'Project costs',
    schema: {
      type: 'array',
      items: { type: 'object' },
    },
  })
  async getProjectCosts(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User
  ): Promise<ProjectCostResponseDto[]> {
    return this.projectCostService.findByProject(projectId, user._id);
  }

  /**
   * Get cost summary for a project
   */
  @Get('summary')
  @RequirePermission('ProjectCost', 'READ')
  @ApiOperation({ summary: 'Get project cost summary' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({
    status: 200,
    description: 'Project cost summary',
    schema: {
      type: 'object',
      description: 'MaterialCostSummary',
    },
  })
  async getCostSummary(
    @Param('projectId') projectId: string,
    @CurrentUser() _user: User
  ): Promise<MaterialCostSummary> {
    return this.projectCostService.calculateProjectMaterialCosts(projectId);
  }
}
