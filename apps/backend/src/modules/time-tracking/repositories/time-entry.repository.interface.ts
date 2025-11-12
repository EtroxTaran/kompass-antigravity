import {
  TimeEntry,
  TimeEntryStatus,
  LaborCostSummary,
} from '@kompass/shared/types/entities/time-entry';

/**
 * Time Entry Repository Interface
 * 
 * Defines data access operations for time entries.
 * Follows repository pattern for clean architecture.
 */
export interface ITimeEntryRepository {
  /**
   * Create a new time entry
   */
  create(timeEntry: TimeEntry): Promise<TimeEntry>;

  /**
   * Find time entry by ID
   */
  findById(id: string): Promise<TimeEntry | null>;

  /**
   * Update time entry
   */
  update(timeEntry: TimeEntry): Promise<TimeEntry>;

  /**
   * Delete time entry
   */
  delete(id: string): Promise<void>;

  /**
   * Find all time entries with optional filtering
   */
  findAll(filters?: TimeEntryFilters): Promise<TimeEntry[]>;

  /**
   * Find time entries by project ID
   */
  findByProject(projectId: string): Promise<TimeEntry[]>;

  /**
   * Find time entries by user ID
   */
  findByUser(userId: string): Promise<TimeEntry[]>;

  /**
   * Find active time entry for a user (timer running)
   */
  findActiveByUser(userId: string): Promise<TimeEntry | null>;

  /**
   * Find time entries by status
   */
  findByStatus(status: TimeEntryStatus): Promise<TimeEntry[]>;

  /**
   * Calculate labor cost summary for a project
   */
  calculateLaborCosts(projectId: string): Promise<LaborCostSummary>;

  /**
   * Bulk approve time entries
   */
  bulkApprove(entryIds: string[], approvedBy: string): Promise<number>;

  /**
   * Get time entries pending approval
   */
  findPendingApproval(): Promise<TimeEntry[]>;
}

/**
 * Time Entry Filters
 * 
 * Optional filters for querying time entries.
 */
export interface TimeEntryFilters {
  projectId?: string;
  userId?: string;
  status?: TimeEntryStatus;
  startDate?: Date;
  endDate?: Date;
  isManualEntry?: boolean;
}

