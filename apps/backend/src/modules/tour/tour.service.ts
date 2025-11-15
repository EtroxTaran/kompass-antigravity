/**
 * Tour Service
 *
 * Business logic for Tour management
 *
 * Responsibilities:
 * - Validate tour data and business rules
 * - Check RBAC permissions
 * - Auto-suggest tours for meetings
 * - Calculate tour costs from expenses and mileage
 * - Orchestrate repository calls
 * - Log audit trail
 *
 * Business Rules:
 * - TR-001: Tour can only be completed if all meetings are attended or cancelled
 * - TR-002: actualDistance should match sum of mileage logs ±5%
 * - TR-003: actualCosts should match sum of expenses
 * - TR-004: Only tour owner (ADM) or GF can modify tour
 * - MT-001: Auto-tour suggestion: Same day ±1 day, Region <50km
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';

import type { Tour } from '@kompass/shared/types/entities/tour';
import {
  validateTour,
  isValidTourStatusTransition,
  createTour,
  TourStatus,
} from '@kompass/shared/types/entities/tour';

import type { CreateTourDto } from './dto/create-tour.dto';
import type {
  TourResponseDto,
  TourCostSummaryDto,
} from './dto/tour-response.dto';
import type { UpdateTourDto } from './dto/update-tour.dto';
import { ITourRepository } from './tour.repository';
import type { TourFilters } from './tour.repository';

/**
 * Placeholder User type
 */
interface User {
  id: string;
  role: 'GF' | 'PLAN' | 'ADM' | 'KALK' | 'BUCH';
}

/**
 * Expense Service Interface (placeholder)
 */
interface IExpenseService {
  findByTour(tourId: string): Promise<any[]>;
  calculateTotalCost(tourId: string): Promise<number>;
}

/**
 * Mileage Service Interface (placeholder)
 */
interface IMileageService {
  findByTour(tourId: string): Promise<any[]>;
  calculateTotalDistance(tourId: string): Promise<number>;
  calculateTotalCost(tourId: string): Promise<number>;
}

/**
 * Meeting Service Interface (placeholder)
 */
interface IMeetingService {
  findByTour(tourId: string): Promise<any[]>;
  areAllMeetingsCompleted(tourId: string): Promise<boolean>;
}

/**
 * Audit Service Interface (placeholder)
 */
interface IAuditService {
  log(entry: any): Promise<void>;
}

/**
 * Tour Service
 */
@Injectable()
export class TourService {
  private readonly logger = new Logger(TourService.name);

  constructor(
    @Inject('ITourRepository')
    private readonly tourRepository: ITourRepository,
    @Inject('IExpenseService')
    private readonly expenseService: IExpenseService,
    @Inject('IMileageService')
    private readonly mileageService: IMileageService,
    @Inject('IMeetingService')
    private readonly meetingService: IMeetingService,
    @Inject('IAuditService')
    private readonly auditService: IAuditService
  ) {}

  /**
   * List tours for user with optional filters
   *
   * RBAC: ADM sees own tours, PLAN/GF see all tours
   */
  async findAll(user: User, filters?: TourFilters): Promise<TourResponseDto[]> {
    let tours: Tour[];

    if (user.role === 'ADM') {
      // ADM: Only own tours
      tours = await this.tourRepository.findByUser(user.id, filters);
    } else {
      // PLAN/GF: All tours
      tours = await this.tourRepository.findByStatus(
        filters?.status || TourStatus.PLANNED
      );
      if (filters) {
        // Apply additional filters
        if (filters.startDate || filters.endDate) {
          tours = await this.tourRepository.findByDateRange(
            filters.startDate || new Date(0),
            filters.endDate || new Date(9999, 11, 31)
          );
        }
        if (filters.region) {
          tours = tours.filter((t) => t.region === filters.region);
        }
      }
    }

    return tours.map((tour) => this.mapToResponseDto(tour));
  }

  /**
   * Get tour by ID
   *
   * RBAC: ADM sees own tours, PLAN/GF see all tours
   */
  async findById(id: string, user: User): Promise<TourResponseDto> {
    const tour = await this.tourRepository.findById(id);

    if (!tour) {
      throw new NotFoundException(`Tour ${id} not found`);
    }

    // RBAC check: ADM can only see own tours
    if (user.role === 'ADM' && tour.ownerId !== user.id) {
      throw new ForbiddenException('You can only view your own tours');
    }

    return this.mapToResponseDto(tour);
  }

  /**
   * Create new tour
   *
   * RBAC: ADM, PLAN, GF can create tours
   */
  async create(dto: CreateTourDto, user: User): Promise<TourResponseDto> {
    // Validate DTO
    const validationErrors = validateTour({
      title: dto.title,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: dto.status,
      ownerId: user.id,
      purpose: dto.purpose,
      region: dto.region,
      estimatedDistance: dto.estimatedDistance,
      estimatedCosts: dto.estimatedCosts,
      plannedRoute: dto.plannedRoute,
    });

    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Create tour entity
    const tour = createTour(
      {
        title: dto.title,
        purpose: dto.purpose,
        region: dto.region,
        startDate: dto.startDate,
        endDate: dto.endDate,
        status: dto.status,
        ownerId: user.id,
        plannedRoute: dto.plannedRoute,
        estimatedDistance: dto.estimatedDistance,
        estimatedCosts: dto.estimatedCosts,
        meetingIds: [],
        hotelStayIds: [],
        expenseIds: [],
        mileageLogIds: [],
      },
      user.id
    );

    // Save to database
    const created = await this.tourRepository.create(tour);

    // Log audit trail
    await this.auditService.log({
      entityType: 'Tour',
      entityId: created._id,
      action: 'CREATE',
      userId: user.id,
      timestamp: new Date(),
    });

    this.logger.log(`Tour created: ${created._id} by user ${user.id}`);

    return this.mapToResponseDto(created);
  }

  /**
   * Update tour
   *
   * RBAC: ADM can update own tours, PLAN/GF can update all tours
   * Business Rule TR-004: Only tour owner or GF can modify
   */
  async update(
    id: string,
    dto: UpdateTourDto,
    user: User
  ): Promise<TourResponseDto> {
    const tour = await this.tourRepository.findById(id);

    if (!tour) {
      throw new NotFoundException(`Tour ${id} not found`);
    }

    // RBAC check: ADM can only update own tours
    if (user.role === 'ADM' && tour.ownerId !== user.id) {
      throw new ForbiddenException('You can only update your own tours');
    }

    // Business Rule TR-004: Only owner or GF can modify
    if (tour.ownerId !== user.id && user.role !== 'GF') {
      throw new ForbiddenException(
        'Only tour owner or Geschäftsführer can modify tours'
      );
    }

    // Validate status transition if status is being changed
    if (dto.status && dto.status !== tour.status) {
      if (!isValidTourStatusTransition(tour.status, dto.status)) {
        throw new BadRequestException(
          `Invalid status transition from ${tour.status} to ${dto.status}`
        );
      }
    }

    // Update tour
    const updated: Tour = {
      ...tour,
      ...dto,
      modifiedBy: user.id,
      modifiedAt: new Date(),
      version: tour.version + 1,
    };

    // Validate updated tour
    const validationErrors = validateTour(updated);
    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Save to database
    const saved = await this.tourRepository.update(updated);

    // Log audit trail
    await this.auditService.log({
      entityType: 'Tour',
      entityId: saved._id,
      action: 'UPDATE',
      changes: Object.keys(dto),
      userId: user.id,
      timestamp: new Date(),
    });

    this.logger.log(`Tour updated: ${saved._id} by user ${user.id}`);

    return this.mapToResponseDto(saved);
  }

  /**
   * Delete tour
   *
   * RBAC: ADM can delete own planned tours, PLAN/GF can delete all tours
   * Business Rule: Can only delete if status is 'planned' and no expenses linked
   */
  async delete(id: string, user: User): Promise<void> {
    const tour = await this.tourRepository.findById(id);

    if (!tour) {
      throw new NotFoundException(`Tour ${id} not found`);
    }

    // RBAC check: ADM can only delete own tours
    if (user.role === 'ADM' && tour.ownerId !== user.id) {
      throw new ForbiddenException('You can only delete your own tours');
    }

    // Business Rule: Can only delete planned tours
    if (tour.status !== TourStatus.PLANNED) {
      throw new BadRequestException('Can only delete planned tours');
    }

    // Business Rule: Cannot delete if expenses are linked
    if (tour.expenseIds.length > 0) {
      throw new BadRequestException(
        'Cannot delete tour: Expenses are linked. Remove expenses first.'
      );
    }

    // Delete tour
    await this.tourRepository.delete(id);

    // Log audit trail
    await this.auditService.log({
      entityType: 'Tour',
      entityId: id,
      action: 'DELETE',
      userId: user.id,
      timestamp: new Date(),
    });

    this.logger.log(`Tour deleted: ${id} by user ${user.id}`);
  }

  /**
   * Complete tour
   *
   * Business Rule TR-001: Tour can only be completed if all meetings are attended or cancelled
   */
  async complete(
    id: string,
    completionNotes: string,
    user: User
  ): Promise<TourResponseDto> {
    const tour = await this.tourRepository.findById(id);

    if (!tour) {
      throw new NotFoundException(`Tour ${id} not found`);
    }

    // RBAC check: ADM can only complete own tours
    if (user.role === 'ADM' && tour.ownerId !== user.id) {
      throw new ForbiddenException('You can only complete your own tours');
    }

    // Business Rule TR-001: All meetings must be completed or cancelled
    const allMeetingsCompleted =
      await this.meetingService.areAllMeetingsCompleted(id);
    if (!allMeetingsCompleted) {
      throw new BadRequestException(
        'Cannot complete tour: Not all meetings are completed or cancelled'
      );
    }

    // Calculate actual costs and distance
    const actualCosts = await this.expenseService.calculateTotalCost(id);
    const mileageCost = await this.mileageService.calculateTotalCost(id);
    const actualDistance = await this.mileageService.calculateTotalDistance(id);

    // Update tour
    const updated: Tour = {
      ...tour,
      status: TourStatus.COMPLETED,
      actualCosts: actualCosts + mileageCost,
      mileageCost,
      actualDistance,
      completedAt: new Date(),
      completionNotes,
      modifiedBy: user.id,
      modifiedAt: new Date(),
      version: tour.version + 1,
    };

    const saved = await this.tourRepository.update(updated);

    // Log audit trail
    await this.auditService.log({
      entityType: 'Tour',
      entityId: saved._id,
      action: 'COMPLETE',
      userId: user.id,
      timestamp: new Date(),
    });

    this.logger.log(`Tour completed: ${saved._id} by user ${user.id}`);

    return this.mapToResponseDto(saved);
  }

  /**
   * Get tour cost summary
   *
   * Calculates costs from expenses and mileage logs
   */
  async getCostSummary(id: string, user: User): Promise<TourCostSummaryDto> {
    const tour = await this.tourRepository.findById(id);

    if (!tour) {
      throw new NotFoundException(`Tour ${id} not found`);
    }

    // RBAC check: ADM can only see own tours
    if (user.role === 'ADM' && tour.ownerId !== user.id) {
      throw new ForbiddenException('You can only view your own tours');
    }

    // Get expenses and mileage
    const expenses = await this.expenseService.findByTour(id);
    const _mileageLogs = await this.mileageService.findByTour(id);

    // Calculate costs
    const mileageCost = await this.mileageService.calculateTotalCost(id);
    const otherExpenses = expenses
      .filter((e) => e.category !== 'mileage')
      .reduce((sum, e) => sum + e.amount, 0);
    const hotelCosts = expenses
      .filter((e) => e.category === 'hotel')
      .reduce((sum, e) => sum + e.amount, 0);

    // Build breakdown by category
    const breakdown: Record<string, number> = {
      mileage: mileageCost,
      hotel: hotelCosts,
    };

    expenses.forEach((expense) => {
      if (expense.category !== 'mileage' && expense.category !== 'hotel') {
        breakdown[expense.category] =
          (breakdown[expense.category] || 0) + expense.amount;
      }
    });

    const actualCosts = mileageCost + otherExpenses + hotelCosts;

    return {
      tourId: tour._id,
      estimatedCosts: tour.estimatedCosts || 0,
      actualCosts,
      mileageCost,
      hotelCosts,
      otherExpenses,
      breakdown,
    };
  }

  /**
   * Suggest tours for a meeting
   *
   * Business Rule MT-001: Auto-tour suggestion
   * - Same day ±1 day
   * - Region <50km from meeting location
   */
  async suggestToursForMeeting(
    meetingDate: Date,
    locationId: string,
    userId: string
  ): Promise<TourResponseDto[]> {
    const suggestions = await this.tourRepository.findSuggestionsForMeeting(
      meetingDate,
      locationId,
      userId
    );

    // TODO: Filter by distance <50km (requires Location service to get GPS coordinates)
    // For now, return all suggestions in date range

    return suggestions.map((tour) => this.mapToResponseDto(tour));
  }

  /**
   * Map Tour entity to TourResponseDto
   */
  private mapToResponseDto(tour: Tour): TourResponseDto {
    return {
      id: tour._id,
      title: tour.title,
      purpose: tour.purpose,
      region: tour.region,
      startDate: tour.startDate,
      endDate: tour.endDate,
      status: tour.status,
      ownerId: tour.ownerId,
      plannedRoute: tour.plannedRoute,
      estimatedDistance: tour.estimatedDistance,
      actualDistance: tour.actualDistance,
      estimatedCosts: tour.estimatedCosts,
      actualCosts: tour.actualCosts,
      mileageCost: tour.mileageCost,
      meetingIds: tour.meetingIds,
      hotelStayIds: tour.hotelStayIds,
      expenseIds: tour.expenseIds,
      mileageLogIds: tour.mileageLogIds,
      completedAt: tour.completedAt,
      completionNotes: tour.completionNotes,
      createdAt: tour.createdAt,
      modifiedAt: tour.modifiedAt,
    };
  }
}
