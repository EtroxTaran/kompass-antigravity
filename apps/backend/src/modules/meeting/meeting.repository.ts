/**
 * Meeting Repository
 *
 * Data access layer for Meeting entities
 * Handles CouchDB operations for meetings
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { Nano } from 'nano';

import type { Meeting } from '@kompass/shared/types/entities/meeting';

/**
 * Meeting Repository Interface
 */
export interface IMeetingRepository {
  findById(id: string): Promise<Meeting | null>;
  findByCustomer(customerId: string): Promise<Meeting[]>;
  findByTour(tourId: string): Promise<Meeting[]>;
  findByUser(userId: string, filters?: MeetingFilters): Promise<Meeting[]>;
  findByDateRange(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<Meeting[]>;
  create(meeting: Omit<Meeting, '_rev'>): Promise<Meeting>;
  update(meeting: Meeting): Promise<Meeting>;
  delete(id: string): Promise<void>;
}

/**
 * Meeting Filters
 */
export interface MeetingFilters {
  status?: Meeting['status'];
  meetingType?: Meeting['meetingType'];
  customerId?: string;
  tourId?: string;
}

/**
 * Meeting Repository Implementation
 */
@Injectable()
export class MeetingRepository implements IMeetingRepository {
  private readonly logger = new Logger(MeetingRepository.name);

  constructor(@Inject('NANO') private readonly nano: Nano) {}

  async findById(id: string): Promise<Meeting | null> {
    try {
      const doc = await this.nano.use('kompass').get<Meeting>(id);
      if (doc.type !== 'meeting') {
        return null;
      }
      return doc;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      this.logger.error(`Error finding meeting ${id}:`, error);
      throw error;
    }
  }

  async findByCustomer(customerId: string): Promise<Meeting[]> {
    try {
      const result = await this.nano.use('kompass').find({
        selector: {
          type: 'meeting',
          customerId,
        },
        sort: [{ scheduledAt: 'desc' }],
        limit: 1000,
      });
      return result.docs as Meeting[];
    } catch (error) {
      this.logger.error(
        `Error finding meetings for customer ${customerId}:`,
        error
      );
      throw error;
    }
  }

  async findByTour(tourId: string): Promise<Meeting[]> {
    try {
      const result = await this.nano.use('kompass').find({
        selector: {
          type: 'meeting',
          tourId,
        },
        sort: [{ scheduledAt: 'asc' }],
        limit: 1000,
      });
      return result.docs as Meeting[];
    } catch (error) {
      this.logger.error(`Error finding meetings for tour ${tourId}:`, error);
      throw error;
    }
  }

  async findByUser(
    userId: string,
    filters?: MeetingFilters
  ): Promise<Meeting[]> {
    try {
      const selector: any = {
        type: 'meeting',
        createdBy: userId,
      };

      if (filters?.status) {
        selector.status = filters.status;
      }

      if (filters?.meetingType) {
        selector.meetingType = filters.meetingType;
      }

      if (filters?.customerId) {
        selector.customerId = filters.customerId;
      }

      if (filters?.tourId) {
        selector.tourId = filters.tourId;
      }

      const result = await this.nano.use('kompass').find({
        selector,
        sort: [{ scheduledAt: 'desc' }],
        limit: 1000,
      });

      return result.docs as Meeting[];
    } catch (error) {
      this.logger.error(`Error finding meetings for user ${userId}:`, error);
      throw error;
    }
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<Meeting[]> {
    try {
      const selector: any = {
        type: 'meeting',
        scheduledAt: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
        },
      };

      if (userId) {
        selector.createdBy = userId;
      }

      const result = await this.nano.use('kompass').find({
        selector,
        sort: [{ scheduledAt: 'asc' }],
        limit: 1000,
      });

      return result.docs as Meeting[];
    } catch (error) {
      this.logger.error(`Error finding meetings by date range:`, error);
      throw error;
    }
  }

  async create(meeting: Omit<Meeting, '_rev'>): Promise<Meeting> {
    try {
      const result = await this.nano.use('kompass').insert(meeting);
      return {
        ...meeting,
        _rev: result.rev,
      };
    } catch (error) {
      this.logger.error(`Error creating meeting:`, error);
      throw error;
    }
  }

  async update(meeting: Meeting): Promise<Meeting> {
    try {
      const result = await this.nano.use('kompass').insert(meeting);
      return {
        ...meeting,
        _rev: result.rev,
      };
    } catch (error) {
      this.logger.error(`Error updating meeting ${meeting._id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const meeting = await this.findById(id);
      if (!meeting) {
        throw new Error(`Meeting ${id} not found`);
      }
      await this.nano.use('kompass').destroy(id, meeting._rev);
    } catch (error) {
      this.logger.error(`Error deleting meeting ${id}:`, error);
      throw error;
    }
  }
}
