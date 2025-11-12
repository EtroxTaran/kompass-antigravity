import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import {
  TimeEntry,
  TimeEntryStatus,
  CreateTimeEntryDto,
  UpdateTimeEntryDto,
  TimeEntryResponseDto,
  LaborCostSummary,
} from '@kompass/shared/types/entities/time-entry';
import {
  ITimeEntryRepository,
  TimeEntryFilters,
} from '../repositories/time-entry.repository.interface';
import { v4 as uuidv4 } from 'uuid';

/**
 * Time Entry Service
 * 
 * Business logic for time tracking functionality including:
 * - Starting/stopping timers
 * - Manual time entry
 * - Approval workflows
 * - Cost calculations
 */
@Injectable()
export class TimeEntryService {
  constructor(
    @Inject('ITimeEntryRepository')
    private readonly repository: ITimeEntryRepository,
  ) {}

  /**
   * Create a new time entry or start a timer
   */
  async create(
    dto: CreateTimeEntryDto,
    currentUserId: string,
  ): Promise<TimeEntryResponseDto> {
    // Validate that user doesn't have another active timer
    if (!dto.isManualEntry && !dto.endTime) {
      const activeTimer = await this.repository.findActiveByUser(currentUserId);
      if (activeTimer) {
        throw new BadRequestException(
          'You already have an active timer running. Please stop it before starting a new one.',
        );
      }
    }

    // Calculate duration if both start and end times provided
    let durationMinutes = 0;
    if (dto.startTime && dto.endTime) {
      durationMinutes = this.calculateDurationMinutes(
        dto.startTime,
        dto.endTime,
      );
    }

    // Determine initial status
    const status = dto.endTime
      ? TimeEntryStatus.COMPLETED
      : TimeEntryStatus.IN_PROGRESS;

    // Calculate cost if hourly rate provided
    let totalCostEur: number | undefined;
    if (dto.hourlyRateEur && durationMinutes > 0) {
      totalCostEur = (durationMinutes / 60) * dto.hourlyRateEur;
      totalCostEur = Math.round(totalCostEur * 100) / 100;
    }

    const timeEntry: TimeEntry = {
      _id: `time-entry-${uuidv4()}`,
      _rev: '',
      type: 'time_entry',
      projectId: dto.projectId,
      taskId: dto.taskId,
      taskDescription: dto.taskDescription,
      userId: currentUserId,
      startTime: dto.startTime,
      endTime: dto.endTime,
      durationMinutes,
      status,
      isManualEntry: dto.isManualEntry,
      hourlyRateEur: dto.hourlyRateEur,
      totalCostEur,
      createdBy: currentUserId,
      createdAt: new Date(),
      modifiedBy: currentUserId,
      modifiedAt: new Date(),
      version: 1,
    };

    const created = await this.repository.create(timeEntry);
    return this.mapToResponseDto(created);
  }

  /**
   * Stop a running timer
   */
  async stopTimer(
    entryId: string,
    currentUserId: string,
  ): Promise<TimeEntryResponseDto> {
    const entry = await this.repository.findById(entryId);

    if (!entry) {
      throw new NotFoundException(`Time entry ${entryId} not found`);
    }

    // Verify ownership
    if (entry.userId !== currentUserId) {
      throw new ForbiddenException(
        'You can only stop your own time entries',
      );
    }

    // Verify entry is in progress
    if (entry.status !== TimeEntryStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Timer is not running',
      );
    }

    // Stop timer
    const endTime = new Date();
    const durationMinutes = this.calculateDurationMinutes(
      entry.startTime,
      endTime,
    );

    // Calculate cost
    let totalCostEur: number | undefined;
    if (entry.hourlyRateEur) {
      totalCostEur = (durationMinutes / 60) * entry.hourlyRateEur;
      totalCostEur = Math.round(totalCostEur * 100) / 100;
    }

    const updated: TimeEntry = {
      ...entry,
      endTime,
      durationMinutes,
      totalCostEur,
      status: TimeEntryStatus.COMPLETED,
      modifiedBy: currentUserId,
      modifiedAt: new Date(),
    };

    const result = await this.repository.update(updated);
    return this.mapToResponseDto(result);
  }

  /**
   * Pause a running timer
   * 
   * Note: Pausing is implemented by stopping the current entry
   * and creating a new entry when resumed.
   */
  async pauseTimer(
    entryId: string,
    currentUserId: string,
  ): Promise<TimeEntryResponseDto> {
    // For simplicity, pause is same as stop
    // When user resumes, they start a new timer
    return this.stopTimer(entryId, currentUserId);
  }

  /**
   * Update a time entry
   */
  async update(
    entryId: string,
    dto: UpdateTimeEntryDto,
    currentUserId: string,
  ): Promise<TimeEntryResponseDto> {
    const entry = await this.repository.findById(entryId);

    if (!entry) {
      throw new NotFoundException(`Time entry ${entryId} not found`);
    }

    // Verify ownership or approval permission
    if (entry.userId !== currentUserId) {
      // TODO: Check if user has TimeEntry.UPDATE permission for others
      throw new ForbiddenException(
        'You can only update your own time entries',
      );
    }

    // Cannot update approved entries
    if (entry.status === TimeEntryStatus.APPROVED) {
      throw new ForbiddenException(
        'Cannot update approved time entries',
      );
    }

    // Recalculate duration if times changed
    let durationMinutes = entry.durationMinutes;
    if (dto.startTime || dto.endTime) {
      const startTime = dto.startTime || entry.startTime;
      const endTime = dto.endTime || entry.endTime;
      if (startTime && endTime) {
        durationMinutes = this.calculateDurationMinutes(startTime, endTime);
      }
    }

    // Recalculate cost if duration or rate changed
    let totalCostEur = entry.totalCostEur;
    const hourlyRate = dto.hourlyRateEur || entry.hourlyRateEur;
    if (hourlyRate && durationMinutes > 0) {
      totalCostEur = (durationMinutes / 60) * hourlyRate;
      totalCostEur = Math.round(totalCostEur * 100) / 100;
    }

    const updated: TimeEntry = {
      ...entry,
      ...dto,
      durationMinutes,
      totalCostEur,
      modifiedBy: currentUserId,
      modifiedAt: new Date(),
    };

    const result = await this.repository.update(updated);
    return this.mapToResponseDto(result);
  }

  /**
   * Delete a time entry
   */
  async delete(entryId: string, currentUserId: string): Promise<void> {
    const entry = await this.repository.findById(entryId);

    if (!entry) {
      throw new NotFoundException(`Time entry ${entryId} not found`);
    }

    // Verify ownership
    if (entry.userId !== currentUserId) {
      throw new ForbiddenException(
        'You can only delete your own time entries',
      );
    }

    // Cannot delete approved entries
    if (entry.status === TimeEntryStatus.APPROVED) {
      throw new ForbiddenException(
        'Cannot delete approved time entries',
      );
    }

    await this.repository.delete(entryId);
  }

  /**
   * Find time entry by ID
   */
  async findById(
    entryId: string,
    currentUserId: string,
  ): Promise<TimeEntryResponseDto> {
    const entry = await this.repository.findById(entryId);

    if (!entry) {
      throw new NotFoundException(`Time entry ${entryId} not found`);
    }

    // TODO: Check RBAC permissions
    // For now, users can only see their own entries
    if (entry.userId !== currentUserId) {
      throw new ForbiddenException(
        'You can only view your own time entries',
      );
    }

    return this.mapToResponseDto(entry);
  }

  /**
   * Find all time entries with filters
   */
  async findAll(
    filters: TimeEntryFilters,
    currentUserId: string,
  ): Promise<TimeEntryResponseDto[]> {
    // TODO: Apply RBAC filters based on user role
    // For now, filter to user's own entries
    const userFilters: TimeEntryFilters = {
      ...filters,
      userId: currentUserId,
    };

    const entries = await this.repository.findAll(userFilters);
    return entries.map((entry) => this.mapToResponseDto(entry));
  }

  /**
   * Get user's active timer
   */
  async getActiveTimer(currentUserId: string): Promise<TimeEntryResponseDto | null> {
    const entry = await this.repository.findActiveByUser(currentUserId);
    return entry ? this.mapToResponseDto(entry) : null;
  }

  /**
   * Approve a time entry
   */
  async approve(
    entryId: string,
    currentUserId: string,
  ): Promise<TimeEntryResponseDto> {
    const entry = await this.repository.findById(entryId);

    if (!entry) {
      throw new NotFoundException(`Time entry ${entryId} not found`);
    }

    // TODO: Check if user has approval permission (PLAN or GF role)

    // Only completed entries can be approved
    if (entry.status !== TimeEntryStatus.COMPLETED) {
      throw new BadRequestException(
        'Only completed time entries can be approved',
      );
    }

    const updated: TimeEntry = {
      ...entry,
      status: TimeEntryStatus.APPROVED,
      approvedBy: currentUserId,
      approvedAt: new Date(),
      modifiedBy: currentUserId,
      modifiedAt: new Date(),
    };

    const result = await this.repository.update(updated);

    // TODO: Trigger project cost recalculation

    return this.mapToResponseDto(result);
  }

  /**
   * Reject a time entry
   */
  async reject(
    entryId: string,
    reason: string,
    currentUserId: string,
  ): Promise<TimeEntryResponseDto> {
    const entry = await this.repository.findById(entryId);

    if (!entry) {
      throw new NotFoundException(`Time entry ${entryId} not found`);
    }

    // TODO: Check if user has approval permission

    const updated: TimeEntry = {
      ...entry,
      status: TimeEntryStatus.REJECTED,
      rejectionReason: reason,
      modifiedBy: currentUserId,
      modifiedAt: new Date(),
    };

    const result = await this.repository.update(updated);
    return this.mapToResponseDto(result);
  }

  /**
   * Bulk approve time entries
   */
  async bulkApprove(
    entryIds: string[],
    currentUserId: string,
  ): Promise<{ approvedCount: number }> {
    // TODO: Check if user has approval permission

    const approvedCount = await this.repository.bulkApprove(
      entryIds,
      currentUserId,
    );

    // TODO: Trigger project cost recalculation for affected projects

    return { approvedCount };
  }

  /**
   * Calculate labor costs for a project
   */
  async calculateProjectLaborCosts(
    projectId: string,
  ): Promise<LaborCostSummary> {
    return this.repository.calculateLaborCosts(projectId);
  }

  /**
   * Helper: Calculate duration in minutes between two dates
   */
  private calculateDurationMinutes(startTime: Date, endTime: Date): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    return diffMinutes;
  }

  /**
   * Helper: Map TimeEntry to ResponseDTO
   */
  private mapToResponseDto(entry: TimeEntry): TimeEntryResponseDto {
    // TODO: Populate projectName, userName, approvedByName from respective services
    return {
      ...entry,
      projectName: '', // TODO: Populate
      userName: '', // TODO: Populate
      approvedByName: entry.approvedBy ? '' : undefined, // TODO: Populate
    };
  }
}

