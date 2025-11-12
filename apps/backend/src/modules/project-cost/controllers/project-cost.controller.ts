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
import { ProjectCostService } from '../services/project-cost.service';
import {
  CreateProjectCostDto,
  UpdateProjectCostDto,
  ProjectCostResponseDto,
  ProjectCostStatus,
  ProjectCostType,
  MaterialCostSummary,
} from '@kompass/shared/types/entities/project-cost';
import { ProjectCostFilters } from '../repositories/project-cost.repository.interface';

// Placeholder decorators - replace with actual implementations
const JwtAuthGuard = () => UseGuards();
const RbacGuard = () => UseGuards();
const RequirePermission = (entity: string, permission: string) => () => {};
const CurrentUser = () => () => {};

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
  @ApiBody({ type: CreateProjectCostDto })
  @ApiResponse({
    status: 201,
    description: 'Project cost created',
    type: ProjectCostResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() dto: CreateProjectCostDto,
    @CurrentUser() user: any,
  ): Promise<ProjectCostResponseDto> {
    return this.projectCostService.create(dto, user.id);
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
    type: [ProjectCostResponseDto],
  })
  async findAll(
    @Query('projectId') projectId?: string,
    @Query('costType') costType?: ProjectCostType,
    @Query('status') status?: ProjectCostStatus,
    @Query('supplierName') supplierName?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @CurrentUser() user?: any,
  ): Promise<ProjectCostResponseDto[]> {
    const filters: ProjectCostFilters = {
      projectId,
      costType,
      status,
      supplierName,
      startDate,
      endDate,
    };
    return this.projectCostService.findAll(filters, user.id);
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
    type: ProjectCostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Project cost not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<ProjectCostResponseDto> {
    return this.projectCostService.findById(id, user.id);
  }

  /**
   * Update project cost
   */
  @Patch(':id')
  @RequirePermission('ProjectCost', 'UPDATE')
  @ApiOperation({ summary: 'Update project cost' })
  @ApiParam({ name: 'id', description: 'Project cost ID' })
  @ApiBody({ type: UpdateProjectCostDto })
  @ApiResponse({
    status: 200,
    description: 'Project cost updated',
    type: ProjectCostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Project cost not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectCostDto,
    @CurrentUser() user: any,
  ): Promise<ProjectCostResponseDto> {
    return this.projectCostService.update(id, dto, user.id);
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
  async delete(@Param('id') id: string, @CurrentUser() user: any): Promise<void> {
    await this.projectCostService.delete(id, user.id);
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
    type: ProjectCostResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Cannot approve this cost' })
  async approve(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<ProjectCostResponseDto> {
    return this.projectCostService.approve(id, user.id);
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
    type: ProjectCostResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Cannot mark as paid' })
  async markAsPaid(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<ProjectCostResponseDto> {
    return this.projectCostService.markAsPaid(id, user.id);
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
    type: [ProjectCostResponseDto],
  })
  async getPendingPayments(@CurrentUser() user: any): Promise<ProjectCostResponseDto[]> {
    return this.projectCostService.getPendingPayments(user.id);
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
    type: [ProjectCostResponseDto],
  })
  async getBySupplier(
    @Param('supplierName') supplierName: string,
    @CurrentUser() user: any,
  ): Promise<ProjectCostResponseDto[]> {
    return this.projectCostService.getBySupplier(supplierName, user.id);
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
    type: [ProjectCostResponseDto],
  })
  async getProjectCosts(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
  ): Promise<ProjectCostResponseDto[]> {
    return this.projectCostService.findByProject(projectId, user.id);
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
    type: MaterialCostSummary,
  })
  async getCostSummary(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
  ): Promise<MaterialCostSummary> {
    return this.projectCostService.calculateProjectMaterialCosts(projectId);
  }
}

