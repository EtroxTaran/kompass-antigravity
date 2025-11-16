/**
 * Tour Repository
 *
 * Data access layer for Tour entities
 * Handles CouchDB operations for tours
 *
 * Responsibilities:
 * - CRUD operations for tours
 * - Query tours by user, date range, status
 * - Calculate tour costs from related expenses/mileage
 * - Offline sync support
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { ServerScope as Nano } from 'nano';

import { TourStatus } from '@kompass/shared/types/entities/tour';

import type { Tour } from '@kompass/shared/types/entities/tour';

/**
 * Tour Repository Interface
 */
export interface ITourRepository {
  findById(id: string): Promise<Tour | null>;
  findByUser(userId: string, filters?: TourFilters): Promise<Tour[]>;
  findByDateRange(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<Tour[]>;
  findByStatus(status: Tour['status'], userId?: string): Promise<Tour[]>;
  create(tour: Omit<Tour, '_rev'>): Promise<Tour>;
  update(tour: Tour): Promise<Tour>;
  delete(id: string): Promise<void>;
  findSuggestionsForMeeting(
    meetingDate: Date,
    locationId: string,
    userId: string
  ): Promise<Tour[]>;
}

/**
 * Tour Filters
 */
export interface TourFilters {
  status?: Tour['status'];
  startDate?: Date;
  endDate?: Date;
  region?: string;
}

/**
 * CouchDB Mango Query Selector
 */
interface MangoSelector {
  type: string;
  ownerId?: string;
  status?: Tour['status'];
  region?: string;
  startDate?:
    | string
    | {
        $gte?: string;
      };
  endDate?:
    | string
    | {
        $lte?: string;
      };
}

/**
 * Tour Repository Implementation
 */
@Injectable()
export class TourRepository implements ITourRepository {
  private readonly logger = new Logger(TourRepository.name);

  constructor(@Inject('NANO') private readonly nano: Nano) {}

  /**
   * Find tour by ID
   */
  async findById(id: string): Promise<Tour | null> {
    try {
      const doc = (await this.nano.use('kompass').get(id)) as Tour;
      if (doc.type !== 'tour') {
        return null;
      }
      return doc;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'statusCode' in error &&
        (error as { statusCode: number }).statusCode === 404
      ) {
        return null;
      }
      this.logger.error(`Error finding tour ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find tours by user with optional filters
   */
  async findByUser(userId: string, filters?: TourFilters): Promise<Tour[]> {
    try {
      const selector: MangoSelector = {
        type: 'tour',
        ownerId: userId,
      };

      if (filters?.status) {
        selector.status = filters.status;
      }

      if (filters?.startDate || filters?.endDate) {
        if (filters.startDate) {
          selector.startDate = {
            $gte: filters.startDate.toISOString(),
          };
        }
        if (filters.endDate) {
          selector.endDate = {
            $lte: filters.endDate.toISOString(),
          };
        }
      }

      if (filters?.region) {
        selector.region = filters.region;
      }

      const result = await this.nano.use('kompass').find({
        selector,
        sort: [{ startDate: 'desc' }],
        limit: 1000,
      });

      return result.docs as Tour[];
    } catch (error) {
      this.logger.error(`Error finding tours for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Find tours by date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<Tour[]> {
    try {
      const selector: MangoSelector = {
        type: 'tour',
        startDate: {
          $gte: startDate.toISOString(),
        },
        endDate: {
          $lte: endDate.toISOString(),
        },
      };

      if (userId) {
        selector.ownerId = userId;
      }

      const result = await this.nano.use('kompass').find({
        selector,
        sort: [{ startDate: 'asc' }],
        limit: 1000,
      });

      return result.docs as Tour[];
    } catch (error) {
      this.logger.error(`Error finding tours by date range:`, error);
      throw error;
    }
  }

  /**
   * Find tours by status
   */
  async findByStatus(status: Tour['status'], userId?: string): Promise<Tour[]> {
    try {
      const selector: MangoSelector = {
        type: 'tour',
        status,
      };

      if (userId) {
        selector.ownerId = userId;
      }

      const result = await this.nano.use('kompass').find({
        selector,
        sort: [{ startDate: 'desc' }],
        limit: 1000,
      });

      return result.docs as Tour[];
    } catch (error) {
      this.logger.error(`Error finding tours by status ${status}:`, error);
      throw error;
    }
  }

  /**
   * Create new tour
   */
  async create(tour: Omit<Tour, '_rev'>): Promise<Tour> {
    try {
      const result = await this.nano.use('kompass').insert(tour);
      return {
        ...tour,
        _rev: result.rev,
      };
    } catch (error) {
      this.logger.error(`Error creating tour:`, error);
      throw error;
    }
  }

  /**
   * Update tour
   */
  async update(tour: Tour): Promise<Tour> {
    try {
      const result = await this.nano.use('kompass').insert(tour);
      return {
        ...tour,
        _rev: result.rev,
      };
    } catch (error) {
      this.logger.error(`Error updating tour ${tour._id}:`, error);
      throw error;
    }
  }

  /**
   * Delete tour
   */
  async delete(id: string): Promise<void> {
    try {
      const tour = await this.findById(id);
      if (!tour) {
        throw new Error(`Tour ${id} not found`);
      }
      await this.nano.use('kompass').destroy(id, tour._rev);
    } catch (error) {
      this.logger.error(`Error deleting tour ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find tour suggestions for a meeting
   *
   * Business Rule MT-001: Auto-tour suggestion
   * - Same day ±1 day
   * - Region <50km from meeting location
   */
  async findSuggestionsForMeeting(
    meetingDate: Date,
    _locationId: string,
    userId: string
  ): Promise<Tour[]> {
    try {
      // Calculate date range: meetingDate ±1 day
      const startDate = new Date(meetingDate);
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(meetingDate);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(23, 59, 59, 999);

      // Find tours in date range for this user
      const tours = await this.findByDateRange(startDate, endDate, userId);

      // Filter by status: only planned or active tours
      return tours.filter(
        (tour) =>
          tour.status === TourStatus.PLANNED ||
          tour.status === TourStatus.ACTIVE
      );
    } catch (error) {
      this.logger.error(`Error finding tour suggestions:`, error);
      throw error;
    }
  }
}
