/**
 * Tour Controller
 *
 * Handles HTTP requests for Tour management
 *
 * All endpoints require:
 * - JwtAuthGuard: User must be authenticated
 * - RbacGuard: User must have required permissions
 *
 * Permissions:
 * - Tour.READ: GF, PLAN, ADM (own), BUCH
 * - Tour.CREATE: GF, PLAN, ADM
 * - Tour.UPDATE: GF, PLAN, ADM (own)
 * - Tour.DELETE: GF, PLAN, ADM (own, planned only)
 * - Tour.COMPLETE: GF, PLAN, ADM (own)
 * - Tour.VIEW_COSTS: GF, PLAN, ADM (own), BUCH
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

import { TourStatus } from '@kompass/shared/types/entities/tour';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';

import { CreateTourDto } from './dto/create-tour.dto';
import { TourResponseDto, TourCostSummaryDto } from './dto/tour-response.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { TourService } from './tour.service';

import type { User } from '@kompass/shared/types/entities/user';

import type { TourFilters } from './tour.repository';

/**
 * Tour Controller
 */
@Controller('api/v1/tours')
@ApiTags('Tours')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
export class TourController {
  constructor(private readonly tourService: TourService) {}

  /**
   * List tours for user
   */
  @Get()
  @RequirePermission('Tour', 'READ')
  @ApiOperation({
    summary: 'List user tours',
    description:
      'Returns tours for the current user. ADM sees own tours, PLAN/GF see all tours.',
  })
  @ApiQuery({
    name: 'status',
    enum: TourStatus,
    required: false,
    description: 'Filter by tour status',
  })
  @ApiQuery({
    name: 'startDate',
    type: String,
    required: false,
    description: 'Filter tours starting from this date (ISO 8601)',
  })
  @ApiQuery({
    name: 'endDate',
    type: String,
    required: false,
    description: 'Filter tours ending before this date (ISO 8601)',
  })
  @ApiQuery({
    name: 'region',
    type: String,
    required: false,
    description: 'Filter by region',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tours',
    type: [TourResponseDto],
  })
  async findAll(
    @Query('status') status?: TourStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('region') region?: string,
    @CurrentUser() user?: User
  ): Promise<TourResponseDto[]> {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const filters: TourFilters = {};
    if (status) filters.status = status;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (region) filters.region = region;

    return this.tourService.findAll(user, filters);
  }

  /**
   * Create new tour
   */
  @Post()
  @RequirePermission('Tour', 'CREATE')
  @ApiOperation({
    summary: 'Create new tour',
    description: 'Creates a new tour. ADM, PLAN, and GF can create tours.',
  })
  @ApiBody({ type: CreateTourDto })
  @ApiResponse({
    status: 201,
    description: 'Tour created',
    type: TourResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async create(
    @Body() dto: CreateTourDto,
    @CurrentUser() user: User
  ): Promise<TourResponseDto> {
    return this.tourService.create(dto, user);
  }

  /**
   * Get tour by ID
   */
  @Get(':tourId')
  @RequirePermission('Tour', 'READ')
  @ApiOperation({
    summary: 'Get tour details',
    description: 'Returns tour details. ADM can only view own tours.',
  })
  @ApiParam({
    name: 'tourId',
    description: 'Tour ID',
    example: 'tour-550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tour found',
    type: TourResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tour not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async findOne(
    @Param('tourId') tourId: string,
    @CurrentUser() user: User
  ): Promise<TourResponseDto> {
    return this.tourService.findById(tourId, user);
  }

  /**
   * Update tour
   */
  @Put(':tourId')
  @RequirePermission('Tour', 'UPDATE')
  @ApiOperation({
    summary: 'Update tour',
    description: 'Updates tour information. ADM can only update own tours.',
  })
  @ApiParam({
    name: 'tourId',
    description: 'Tour ID',
  })
  @ApiBody({ type: UpdateTourDto })
  @ApiResponse({
    status: 200,
    description: 'Tour updated',
    type: TourResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid status transition',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async update(
    @Param('tourId') tourId: string,
    @Body() dto: UpdateTourDto,
    @CurrentUser() user: User
  ): Promise<TourResponseDto> {
    return this.tourService.update(tourId, dto, user);
  }

  /**
   * Delete tour
   */
  @Delete(':tourId')
  @RequirePermission('Tour', 'DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete tour',
    description:
      'Deletes a tour. Can only delete planned tours without linked expenses.',
  })
  @ApiParam({
    name: 'tourId',
    description: 'Tour ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Tour deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete tour (not planned or has expenses)',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async delete(
    @Param('tourId') tourId: string,
    @CurrentUser() user: User
  ): Promise<void> {
    return this.tourService.delete(tourId, user);
  }

  /**
   * Complete tour
   */
  @Post(':tourId/complete')
  @RequirePermission('Tour', 'COMPLETE')
  @ApiOperation({
    summary: 'Mark tour as completed',
    description:
      'Marks tour as completed. All meetings must be completed or cancelled. Calculates actual costs and distance.',
  })
  @ApiParam({
    name: 'tourId',
    description: 'Tour ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        completionNotes: {
          type: 'string',
          description: 'Notes about tour completion',
          example: 'Alle Termine erfolgreich abgeschlossen',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tour completed',
    type: TourResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot complete tour (not all meetings completed)',
  })
  async complete(
    @Param('tourId') tourId: string,
    @Body('completionNotes') completionNotes: string,
    @CurrentUser() user: User
  ): Promise<TourResponseDto> {
    return this.tourService.complete(tourId, completionNotes || '', user);
  }

  /**
   * Get tour cost summary
   */
  @Get(':tourId/cost-summary')
  @RequirePermission('Tour', 'VIEW_COSTS')
  @ApiOperation({
    summary: 'Get tour cost breakdown',
    description:
      'Returns detailed cost breakdown including expenses, mileage, and hotel costs.',
  })
  @ApiParam({
    name: 'tourId',
    description: 'Tour ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Cost summary',
    type: TourCostSummaryDto,
  })
  async getCostSummary(
    @Param('tourId') tourId: string,
    @CurrentUser() user: User
  ): Promise<TourCostSummaryDto> {
    return this.tourService.getCostSummary(tourId, user);
  }
}
