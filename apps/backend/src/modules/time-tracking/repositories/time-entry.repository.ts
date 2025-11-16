import { Injectable } from '@nestjs/common';
// TODO: Install mongoose and @nestjs/mongoose when implementing time tracking
// import { InjectConnection } from '@nestjs/mongoose';
// import { Connection } from 'mongoose';
// Stub Connection type (will be replaced with mongoose Connection when implemented)
type Connection = unknown;
import { v4 as uuidv4 } from 'uuid';

import { TimeEntryStatus } from '@kompass/shared/types/entities/time-entry';

import type {
  ITimeEntryRepository,
  TimeEntryFilters,
} from './time-entry.repository.interface';
import type {
  TimeEntry,
  LaborCostSummary,
  UserLaborCost,
  MonthlyLaborCost,
} from '@kompass/shared/types/entities/time-entry';

// Stub InjectConnection decorator
const InjectConnection =
  () =>
  (_target: unknown, _propertyKey: string, _parameterIndex: number): void => {};

/**
 * Time Entry Repository Implementation
 *
 * Implements data access operations for time entries using CouchDB.
 * Handles CRUD operations, filtering, and aggregations.
 */
@Injectable()
export class TimeEntryRepository implements ITimeEntryRepository {
  private readonly collectionName = 'time_entries';

  // @ts-expect-error - InjectConnection is stubbed until mongoose is installed
  constructor(@InjectConnection() private readonly _connection: Connection) {}

  /**
   * Get CouchDB database instance
   *
   * Note: This is a placeholder. Actual implementation will use CouchDB/Nano client
   */
  private getDb(): never {
    // TODO: Replace with actual CouchDB/Nano client
    // return this.nano.db.use('kompass');
    throw new Error('CouchDB client not yet implemented');
  }

  create(timeEntry: TimeEntry): Promise<TimeEntry> {
    const newEntry: TimeEntry = {
      ...timeEntry,
      _id: timeEntry._id || `time-entry-${uuidv4()}`,
      type: 'time_entry',
      createdAt: new Date(),
      modifiedAt: new Date(),
      version: 1,
    };

    // TODO: Implement CouchDB insert
    // const db = this.getDb();
    // const result = await db.insert(newEntry);
    // return { ...newEntry, _rev: result.rev };

    return Promise.resolve(newEntry);
  }

  findById(_id: string): Promise<TimeEntry | null> {
    try {
      // TODO: Implement CouchDB get
      // const db = this.getDb();
      // const doc = await db.get(id);
      // return doc as TimeEntry;
      return Promise.resolve(null);
    } catch (error: unknown) {
      if (this.isCouchDBError(error) && error.statusCode === 404) {
        return Promise.resolve(null);
      }
      throw error;
    }
  }

  update(timeEntry: TimeEntry): Promise<TimeEntry> {
    const updated: TimeEntry = {
      ...timeEntry,
      modifiedAt: new Date(),
      version: timeEntry.version + 1,
    };

    // TODO: Implement CouchDB update
    // const db = this.getDb();
    // const result = await db.insert(updated);
    // return { ...updated, _rev: result.rev };

    return Promise.resolve(updated);
  }

  async delete(_id: string): Promise<void> {
    // TODO: Implement CouchDB delete
    // const db = this.getDb();
    // const doc = await db.get(id);
    // await db.destroy(id, doc._rev);
  }

  findAll(_filters?: TimeEntryFilters): Promise<TimeEntry[]> {
    // TODO: Implement CouchDB query with filters
    // const db = this.getDb();
    // const selector: any = { type: 'time_entry' };

    // if (filters) {
    //   if (filters.projectId) selector.projectId = filters.projectId;
    //   if (filters.userId) selector.userId = filters.userId;
    //   if (filters.status) selector.status = filters.status;
    //   if (filters.isManualEntry !== undefined) selector.isManualEntry = filters.isManualEntry;
    //   if (filters.startDate) {
    //     selector.startTime = { $gte: filters.startDate.toISOString() };
    //   }
    //   if (filters.endDate) {
    //     selector.startTime = {
    //       ...selector.startTime,
    //       $lte: filters.endDate.toISOString(),
    //     };
    //   }
    // }

    // const result = await db.find({ selector, limit: 1000 });
    // return result.docs as TimeEntry[];

    return Promise.resolve([]);
  }

  async findByProject(projectId: string): Promise<TimeEntry[]> {
    return this.findAll({ projectId });
  }

  async findByUser(userId: string): Promise<TimeEntry[]> {
    return this.findAll({ userId });
  }

  findActiveByUser(_userId: string): Promise<TimeEntry | null> {
    // TODO: Implement CouchDB query for active timer
    // const db = this.getDb();
    // const result = await db.find({
    //   selector: {
    //     type: 'time_entry',
    //     userId,
    //     status: TimeEntryStatus.IN_PROGRESS,
    //     endTime: null,
    //   },
    //   limit: 1,
    // });

    // return result.docs.length > 0 ? (result.docs[0] as TimeEntry) : null;

    return Promise.resolve(null);
  }

  async findByStatus(status: TimeEntryStatus): Promise<TimeEntry[]> {
    return this.findAll({ status });
  }

  async calculateLaborCosts(projectId: string): Promise<LaborCostSummary> {
    // Get all approved time entries for project
    const entries = await this.findAll({
      projectId,
      status: TimeEntryStatus.APPROVED,
    });

    // Calculate totals
    const totalHours = entries.reduce(
      (sum, entry) => sum + entry.durationMinutes / 60,
      0
    );
    const totalCostEur = entries.reduce(
      (sum, entry) => sum + (entry.totalCostEur || 0),
      0
    );

    // Group by user
    const userCosts = new Map<string, UserLaborCost>();
    entries.forEach((entry) => {
      const existing = userCosts.get(entry.userId) || {
        userId: entry.userId,
        userName: '', // TODO: Populate from user service
        totalHours: 0,
        averageHourlyRateEur: 0,
        totalCostEur: 0,
        entryCount: 0,
      };

      existing.totalHours += entry.durationMinutes / 60;
      existing.totalCostEur += entry.totalCostEur || 0;
      existing.entryCount += 1;
      existing.averageHourlyRateEur =
        existing.totalCostEur / existing.totalHours;

      userCosts.set(entry.userId, existing);
    });

    // Group by month
    const monthlyCosts = new Map<string, MonthlyLaborCost>();
    entries.forEach((entry) => {
      const date = new Date(entry.startTime);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const existing = monthlyCosts.get(key) || {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        totalHours: 0,
        totalCostEur: 0,
        entryCount: 0,
      };

      existing.totalHours += entry.durationMinutes / 60;
      existing.totalCostEur += entry.totalCostEur || 0;
      existing.entryCount += 1;

      monthlyCosts.set(key, existing);
    });

    return {
      projectId,
      totalHours: Math.round(totalHours * 100) / 100,
      totalCostEur: Math.round(totalCostEur * 100) / 100,
      byUser: Array.from(userCosts.values()),
      byMonth: Array.from(monthlyCosts.values()).sort(
        (a, b) => a.year - b.year || a.month - b.month
      ),
    };
  }

  async bulkApprove(entryIds: string[], approvedBy: string): Promise<number> {
    let approvedCount = 0;

    for (const entryId of entryIds) {
      const entry = await this.findById(entryId);
      if (entry && entry.status === TimeEntryStatus.COMPLETED) {
        entry.status = TimeEntryStatus.APPROVED;
        entry.approvedBy = approvedBy;
        entry.approvedAt = new Date();
        await this.update(entry);
        approvedCount++;
      }
    }

    return approvedCount;
  }

  async findPendingApproval(): Promise<TimeEntry[]> {
    return this.findAll({ status: TimeEntryStatus.COMPLETED });
  }

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
}
