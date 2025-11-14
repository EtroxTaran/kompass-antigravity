import type { BaseEntity } from '../base.entity';

/**
 * TimeEntry Entity
 *
 * Represents a time tracking entry for a team member working on a project task.
 * Supports both timer-based tracking and manual entry.
 *
 * @see Phase 1.1 of Time Tracking Implementation Plan
 */
export interface TimeEntry extends BaseEntity {
  _id: string; // Format: "time-entry-{uuid}"
  type: 'time_entry'; // Fixed discriminator

  // Project & Task references
  projectId: string; // Parent project (REQUIRED)
  taskId?: string; // Optional task within project
  taskDescription: string; // What was done (REQUIRED, 10-500 chars)

  // Time tracking
  userId: string; // Team member who worked (REQUIRED)
  startTime: Date; // When work started (ISO 8601)
  endTime?: Date; // When work ended (null = in progress)
  durationMinutes: number; // Calculated: (endTime - startTime) in minutes

  // Status
  status: TimeEntryStatus; // Current status of time entry
  isManualEntry: boolean; // true = manual entry, false = timer-based

  // Cost calculation
  hourlyRateEur?: number; // Rate at time of entry (cached from user profile)
  totalCostEur?: number; // Calculated: (durationMinutes / 60) × hourlyRateEur

  // Approval workflow
  approvedBy?: string; // User ID who approved
  approvedAt?: Date; // When approved
  rejectionReason?: string; // If rejected, why

  // Offline sync
  syncedToTimeCard?: boolean; // For future TimeCard integration
  timeCardEntryId?: string; // TimeCard reference if synced
}

/**
 * Time Entry Status
 *
 * Tracks the lifecycle of a time entry through approval workflow.
 */
export enum TimeEntryStatus {
  IN_PROGRESS = 'in_progress', // Timer running or manual entry not completed
  COMPLETED = 'completed', // Timer stopped, ready for approval
  APPROVED = 'approved', // Approved by manager (included in cost calculations)
  REJECTED = 'rejected', // Rejected by manager
}

/**
 * Labor Cost Summary
 *
 * Aggregated labor costs for a project based on approved time entries.
 */
export interface LaborCostSummary {
  projectId: string;
  totalHours: number; // Sum of approved time entries in hours
  totalCostEur: number; // Sum of all labor costs
  byUser: UserLaborCost[]; // Breakdown by team member
  byMonth: MonthlyLaborCost[]; // Breakdown by month
}

/**
 * User Labor Cost
 *
 * Labor cost breakdown for a specific user on a project.
 */
export interface UserLaborCost {
  userId: string;
  userName: string;
  totalHours: number;
  averageHourlyRateEur: number;
  totalCostEur: number;
  entryCount: number;
}

/**
 * Monthly Labor Cost
 *
 * Labor cost breakdown by month for trend analysis.
 */
export interface MonthlyLaborCost {
  year: number;
  month: number; // 1-12
  totalHours: number;
  totalCostEur: number;
  entryCount: number;
}

/**
 * Create Time Entry DTO
 *
 * Data transfer object for creating a new time entry.
 */
export interface CreateTimeEntryDto {
  projectId: string;
  taskId?: string;
  taskDescription: string;
  startTime: Date;
  endTime?: Date; // Optional for starting timer
  isManualEntry: boolean;
  hourlyRateEur?: number; // Optional, defaults to user's current rate
}

/**
 * Update Time Entry DTO
 *
 * Data transfer object for updating an existing time entry.
 */
export interface UpdateTimeEntryDto {
  taskDescription?: string;
  startTime?: Date;
  endTime?: Date;
  isManualEntry?: boolean;
  hourlyRateEur?: number;
}

/**
 * Time Entry Response DTO
 *
 * Data transfer object for time entry API responses.
 */
export interface TimeEntryResponseDto extends TimeEntry {
  projectName: string; // Populated from project
  userName: string; // Populated from user
  approvedByName?: string; // Populated from approver user
}
