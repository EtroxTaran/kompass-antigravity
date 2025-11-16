/**
 * Expense Repository
 *
 * Data access layer for Expense entities
 * Handles CouchDB operations for expenses
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { ServerScope as Nano } from 'nano';

import type { Expense } from '@kompass/shared/types/entities/expense';

/**
 * Expense Repository Interface
 */
export interface IExpenseRepository {
  findById(id: string): Promise<Expense | null>;
  findByUser(userId: string, filters?: ExpenseFilters): Promise<Expense[]>;
  findByTour(tourId: string): Promise<Expense[]>;
  findByMeeting(meetingId: string): Promise<Expense[]>;
  findByProject(projectId: string): Promise<Expense[]>;
  findByStatus(status: Expense['status'], userId?: string): Promise<Expense[]>;
  findByDateRange(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<Expense[]>;
  create(expense: Omit<Expense, '_rev'>): Promise<Expense>;
  update(expense: Expense): Promise<Expense>;
  delete(id: string): Promise<void>;
}

/**
 * Expense Filters
 */
export interface ExpenseFilters {
  status?: Expense['status'];
  category?: Expense['category'];
  tourId?: string;
  meetingId?: string;
  projectId?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * CouchDB Mango Selector
 * Represents a CouchDB Mango query selector
 */
type CouchDBMangoSelector = {
  type: string;
  [key: string]: unknown;
};

/**
 * Expense Repository Implementation
 */
@Injectable()
export class ExpenseRepository implements IExpenseRepository {
  private readonly logger = new Logger(ExpenseRepository.name);

  constructor(@Inject('NANO') private readonly nano: Nano) {}

  async findById(id: string): Promise<Expense | null> {
    try {
      const doc = (await this.nano.use('kompass').get(id)) as Expense;
      if (doc.type !== 'expense') {
        return null;
      }
      return doc;
    } catch (error: unknown) {
      if (this.isCouchDBError(error) && error.statusCode === 404) {
        return null;
      }
      this.logger.error(`Error finding expense ${id}:`, error);
      throw error;
    }
  }

  /**
   * Type guard for CouchDB errors
   */
  private isCouchDBError(
    error: unknown
  ): error is { statusCode: number; message?: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      typeof (error as { statusCode: unknown }).statusCode === 'number'
    );
  }

  async findByUser(
    userId: string,
    filters?: ExpenseFilters
  ): Promise<Expense[]> {
    try {
      const selector: CouchDBMangoSelector = {
        type: 'expense',
        userId,
      };

      if (filters?.status) {
        selector['status'] = filters.status;
      }

      if (filters?.category) {
        selector['category'] = filters.category;
      }

      if (filters?.tourId) {
        selector.tourId = filters.tourId;
      }

      if (filters?.meetingId) {
        selector.meetingId = filters.meetingId;
      }

      if (filters?.projectId) {
        selector.projectId = filters.projectId;
      }

      if (filters?.startDate || filters?.endDate) {
        selector.expenseDate = {};
        if (filters.startDate) {
          (selector.expenseDate as Record<string, unknown>).$gte =
            filters.startDate.toISOString();
        }
        if (filters.endDate) {
          (selector.expenseDate as Record<string, unknown>).$lte =
            filters.endDate.toISOString();
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.nano.use('kompass').find({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        selector: selector as any, // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        sort: [{ expenseDate: 'desc' }],
        limit: 1000,
      });

      return result.docs as Expense[];
    } catch (error) {
      this.logger.error(`Error finding expenses for user ${userId}:`, error);
      throw error;
    }
  }

  async findByTour(tourId: string): Promise<Expense[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.nano.use('kompass').find({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        selector: {
          type: 'expense',
          tourId,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        sort: [{ expenseDate: 'asc' }],
        limit: 1000,
      });
      return result.docs as Expense[];
    } catch (error) {
      this.logger.error(`Error finding expenses for tour ${tourId}:`, error);
      throw error;
    }
  }

  async findByMeeting(meetingId: string): Promise<Expense[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.nano.use('kompass').find({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        selector: {
          type: 'expense',
          meetingId,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        sort: [{ expenseDate: 'asc' }],
        limit: 1000,
      });
      return result.docs as Expense[];
    } catch (error) {
      this.logger.error(
        `Error finding expenses for meeting ${meetingId}:`,
        error
      );
      throw error;
    }
  }

  async findByProject(projectId: string): Promise<Expense[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.nano.use('kompass').find({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        selector: {
          type: 'expense',
          projectId,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        sort: [{ expenseDate: 'asc' }],
        limit: 1000,
      });
      return result.docs as Expense[];
    } catch (error) {
      this.logger.error(
        `Error finding expenses for project ${projectId}:`,
        error
      );
      throw error;
    }
  }

  async findByStatus(
    status: Expense['status'],
    userId?: string
  ): Promise<Expense[]> {
    try {
      const selector: CouchDBMangoSelector = {
        type: 'expense',
        status,
      };

      if (userId) {
        selector.userId = userId;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.nano.use('kompass').find({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        selector: selector as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        sort: [{ expenseDate: 'desc' }],
        limit: 1000,
      });

      return result.docs as Expense[];
    } catch (error) {
      this.logger.error(`Error finding expenses by status ${status}:`, error);
      throw error;
    }
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<Expense[]> {
    try {
      const selector: CouchDBMangoSelector = {
        type: 'expense',
        expenseDate: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
        },
      };

      if (userId) {
        selector.userId = userId;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.nano.use('kompass').find({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        selector: selector as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        sort: [{ expenseDate: 'asc' }],
        limit: 1000,
      });

      return result.docs as Expense[];
    } catch (error) {
      this.logger.error(`Error finding expenses by date range:`, error);
      throw error;
    }
  }

  async create(expense: Omit<Expense, '_rev'>): Promise<Expense> {
    try {
      const result = await this.nano.use('kompass').insert(expense);
      return {
        ...expense,
        _rev: result.rev,
      };
    } catch (error) {
      this.logger.error(`Error creating expense:`, error);
      throw error;
    }
  }

  async update(expense: Expense): Promise<Expense> {
    try {
      const result = await this.nano.use('kompass').insert(expense);
      return {
        ...expense,
        _rev: result.rev,
      };
    } catch (error) {
      this.logger.error(`Error updating expense ${expense._id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const expense = await this.findById(id);
      if (!expense) {
        throw new Error(`Expense ${id} not found`);
      }
      await this.nano.use('kompass').destroy(id, expense._rev);
    } catch (error) {
      this.logger.error(`Error deleting expense ${id}:`, error);
      throw error;
    }
  }
}
