/**
 * Meeting Service
 *
 * Business logic for Meeting management
 *
 * Responsibilities:
 * - Validate meeting data and business rules
 * - Check RBAC permissions
 * - GPS check-in validation
 * - Tour linkage and auto-suggestion
 * - Meeting outcome tracking
 * - Orchestrate repository calls
 *
 * Business Rules:
 * - MT-001: Auto-tour suggestion: Same day ±1 day, Region <50km
 * - MT-002: GPS check-in requires proximity to location (<100m)
 * - MT-003: Meeting outcome required if attended = true
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';

import type { Location } from '@kompass/shared/types/entities/location';
import type {
  Meeting,
  MeetingOutcome,
} from '@kompass/shared/types/entities/meeting';
import {
  validateMeeting,
  createMeeting,
  MeetingOutcome as MeetingOutcomeEnum,
} from '@kompass/shared/types/entities/meeting';
import type { Tour } from '@kompass/shared/types/entities/tour';

import type { CreateMeetingDto } from './dto/create-meeting.dto';
import { MeetingStatus } from './dto/create-meeting.dto';
import type { MeetingResponseDto } from './dto/meeting-response.dto';
import type { UpdateMeetingDto, CheckInDto } from './dto/update-meeting.dto';
import { IMeetingRepository } from './meeting.repository';
import type { MeetingFilters } from './meeting.repository';

/**
 * Placeholder User type
 */
interface User {
  id: string;
  role: 'GF' | 'PLAN' | 'ADM' | 'KALK' | 'BUCH';
}

/**
 * Location Service Interface (placeholder)
 */
interface ILocationService {
  findById(id: string): Promise<Location | null>;
}

/**
 * Tour Service Interface (placeholder)
 */
interface ITourService {
  suggestToursForMeeting(
    meetingDate: Date,
    locationId: string,
    userId: string
  ): Promise<Tour[]>;
}

/**
 * Audit Log Entry
 */
interface AuditLogEntry {
  entityType: string;
  entityId: string;
  action: string;
  userId: string;
  timestamp: Date;
  changes?: string[];
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
  distanceFromLocation?: number;
  tourId?: string;
  [key: string]: unknown;
}

/**
 * Audit Service Interface (placeholder)
 */
interface IAuditService {
  log(entry: AuditLogEntry): Promise<void>;
}

/**
 * Meeting Service
 */
@Injectable()
export class MeetingService {
  private readonly logger = new Logger(MeetingService.name);
  private readonly GPS_CHECK_IN_DISTANCE_METERS = 100; // 100m radius for check-in

  constructor(
    @Inject('IMeetingRepository')
    private readonly meetingRepository: IMeetingRepository,
    @Inject('ILocationService')
    private readonly locationService: ILocationService,
    @Inject('ITourService')
    private readonly tourService: ITourService,
    @Inject('IAuditService')
    private readonly auditService: IAuditService
  ) {}

  /**
   * List meetings for user with optional filters
   */
  async findAll(
    user: User,
    filters?: MeetingFilters
  ): Promise<MeetingResponseDto[]> {
    let meetings: Meeting[];

    if (user.role === 'ADM') {
      // ADM: Only own meetings
      meetings = await this.meetingRepository.findByUser(user.id, filters);
    } else {
      // PLAN/GF: All meetings (no user filter)
      meetings = await this.meetingRepository.findByUser('', filters);
    }

    return meetings.map((meeting) => this.mapToResponseDto(meeting));
  }

  /**
   * Get meeting by ID
   */
  async findById(id: string, user: User): Promise<MeetingResponseDto> {
    const meeting = await this.meetingRepository.findById(id);

    if (!meeting) {
      throw new NotFoundException(`Meeting ${id} not found`);
    }

    // RBAC check: ADM can only see own meetings
    if (user.role === 'ADM' && meeting.createdBy !== user.id) {
      throw new ForbiddenException('You can only view your own meetings');
    }

    return this.mapToResponseDto(meeting);
  }

  /**
   * Create new meeting
   */
  async create(dto: CreateMeetingDto, user: User): Promise<MeetingResponseDto> {
    // Map DTO to entity structure for validation
    const meetingData: Partial<Meeting> = {
      title: dto.title,
      description: dto.description,
      scheduledAt: dto.scheduledAt,
      duration: dto.duration,
      meetingType: dto.meetingType,
      customerId: dto.customerId,
      locationId: dto.locationId,
      tourId: dto.tourId,
      attendees: dto.attendees,
      projectId: dto.projectId,
      opportunityId: dto.opportunityId,
      followUpDate: dto.followUpDate,
      attended: false,
    };

    // Validate meeting data
    const validationErrors = validateMeeting(meetingData);

    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Create meeting entity
    const meeting = createMeeting(
      {
        title: dto.title,
        description: dto.description,
        scheduledAt: dto.scheduledAt,
        duration: dto.duration,
        meetingType: dto.meetingType,
        customerId: dto.customerId,
        locationId: dto.locationId,
        tourId: dto.tourId,
        attendees: dto.attendees,
        projectId: dto.projectId,
        opportunityId: dto.opportunityId,
        followUpDate: dto.followUpDate,
        attended: false,
      },
      user.id
    );

    // Save to database
    const created = await this.meetingRepository.create(meeting);

    // Log audit trail
    await this.auditService.log({
      entityType: 'Meeting',
      entityId: created._id,
      action: 'CREATE',
      userId: user.id,
      timestamp: new Date(),
    });

    this.logger.log(`Meeting created: ${created._id} by user ${user.id}`);

    return this.mapToResponseDto(created);
  }

  /**
   * Update meeting
   */
  async update(
    id: string,
    dto: UpdateMeetingDto,
    user: User
  ): Promise<MeetingResponseDto> {
    const meeting = await this.meetingRepository.findById(id);

    if (!meeting) {
      throw new NotFoundException(`Meeting ${id} not found`);
    }

    // RBAC check: ADM can only update own meetings
    if (user.role === 'ADM' && meeting.createdBy !== user.id) {
      throw new ForbiddenException('You can only update your own meetings');
    }

    // Business Rule MT-003: Outcome required if attended = true
    if (dto.attended === true && !dto.outcome) {
      throw new BadRequestException(
        'Meeting outcome is required if meeting was attended'
      );
    }

    // Map DTO fields to entity fields
    const updateData: Partial<Meeting> = {
      ...meeting,
    };

    // Map DTO fields to entity fields
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.scheduledAt !== undefined) updateData.scheduledAt = dto.scheduledAt;
    if (dto.duration !== undefined) updateData.duration = dto.duration;
    if (dto.meetingType !== undefined) updateData.meetingType = dto.meetingType;
    if (dto.attended !== undefined) updateData.attended = dto.attended;
    if (dto.outcome !== undefined) {
      // Map string outcome to MeetingOutcome enum if it matches
      const outcomeValue = dto.outcome.toLowerCase();
      if (
        Object.values(MeetingOutcomeEnum).includes(
          outcomeValue as MeetingOutcome
        )
      ) {
        updateData.outcome = outcomeValue as MeetingOutcome;
      } else {
        // If outcome is a long text, store in notes instead
        updateData.notes = dto.outcome;
      }
    }
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.tourId !== undefined) updateData.tourId = dto.tourId;
    if (dto.followUpDate !== undefined)
      updateData.followUpDate = dto.followUpDate;

    // Update meeting
    const updated: Meeting = {
      ...updateData,
      modifiedBy: user.id,
      modifiedAt: new Date(),
      version: meeting.version + 1,
    } as Meeting;

    // Validate updated meeting
    const validationErrors = validateMeeting(updated);
    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Save to database
    const saved = await this.meetingRepository.update(updated);

    // Log audit trail
    await this.auditService.log({
      entityType: 'Meeting',
      entityId: saved._id,
      action: 'UPDATE',
      changes: Object.keys(dto),
      userId: user.id,
      timestamp: new Date(),
    });

    this.logger.log(`Meeting updated: ${saved._id} by user ${user.id}`);

    return this.mapToResponseDto(saved);
  }

  /**
   * Delete meeting
   */
  async delete(id: string, user: User): Promise<void> {
    const meeting = await this.meetingRepository.findById(id);

    if (!meeting) {
      throw new NotFoundException(`Meeting ${id} not found`);
    }

    // RBAC check: ADM can only delete own meetings
    if (user.role === 'ADM' && meeting.createdBy !== user.id) {
      throw new ForbiddenException('You can only delete your own meetings');
    }

    // Business Rule: Can only delete meetings that haven't been attended
    if (meeting.attended === true) {
      throw new BadRequestException(
        'Cannot delete meetings that have been attended'
      );
    }

    // Delete meeting
    await this.meetingRepository.delete(id);

    // Log audit trail
    await this.auditService.log({
      entityType: 'Meeting',
      entityId: id,
      action: 'DELETE',
      userId: user.id,
      timestamp: new Date(),
    });

    this.logger.log(`Meeting deleted: ${id} by user ${user.id}`);
  }

  /**
   * GPS check-in for meeting
   *
   * Business Rule MT-002: GPS check-in requires proximity to location (<100m)
   */
  async checkIn(
    id: string,
    checkInDto: CheckInDto,
    user: User
  ): Promise<MeetingResponseDto> {
    const meeting = await this.meetingRepository.findById(id);

    if (!meeting) {
      throw new NotFoundException(`Meeting ${id} not found`);
    }

    // RBAC check: Only ADM can check in for own meetings
    if (user.role !== 'ADM' || meeting.createdBy !== user.id) {
      throw new ForbiddenException(
        'Only ADM can check in for their own meetings'
      );
    }

    // Get location GPS coordinates
    const location = await this.locationService.findById(meeting.locationId);
    if (!location || !location.gpsCoordinates) {
      throw new BadRequestException('Location GPS coordinates not available');
    }

    // Calculate distance using Haversine formula
    const distance = this.calculateDistance(
      checkInDto.latitude,
      checkInDto.longitude,
      location.gpsCoordinates.latitude,
      location.gpsCoordinates.longitude
    );

    // Business Rule MT-002: Must be within 100m
    if (distance > this.GPS_CHECK_IN_DISTANCE_METERS) {
      throw new BadRequestException(
        `Too far from location. Distance: ${Math.round(distance)}m (required: <${this.GPS_CHECK_IN_DISTANCE_METERS}m)`
      );
    }

    // Update meeting with check-in
    const updated: Meeting = {
      ...meeting,
      actualStartTime: new Date(),
      checkInGPS: {
        latitude: checkInDto.latitude,
        longitude: checkInDto.longitude,
      },
      attended: true,
      modifiedBy: user.id,
      modifiedAt: new Date(),
      version: meeting.version + 1,
    };

    const saved = await this.meetingRepository.update(updated);

    // Log audit trail
    await this.auditService.log({
      entityType: 'Meeting',
      entityId: saved._id,
      action: 'CHECK_IN',
      userId: user.id,
      gpsCoordinates: {
        latitude: checkInDto.latitude,
        longitude: checkInDto.longitude,
      },
      distanceFromLocation: distance,
      timestamp: new Date(),
    });

    this.logger.log(
      `Meeting check-in: ${saved._id} by user ${user.id} at distance ${Math.round(distance)}m`
    );

    return this.mapToResponseDto(saved);
  }

  /**
   * Update meeting outcome
   */
  async updateOutcome(
    id: string,
    outcome: string,
    notes: string | undefined,
    user: User
  ): Promise<MeetingResponseDto> {
    const meeting = await this.meetingRepository.findById(id);

    if (!meeting) {
      throw new NotFoundException(`Meeting ${id} not found`);
    }

    // RBAC check: ADM can only update own meetings
    if (user.role === 'ADM' && meeting.createdBy !== user.id) {
      throw new ForbiddenException('You can only update your own meetings');
    }

    // Business Rule MT-003: Outcome required if attended
    if (meeting.attended && !outcome) {
      throw new BadRequestException(
        'Meeting outcome is required if meeting was attended'
      );
    }

    // Map string outcome to MeetingOutcome enum if it matches, otherwise store in notes
    let outcomeEnum: MeetingOutcome | undefined;
    const outcomeLower = outcome?.toLowerCase();
    if (
      outcomeLower &&
      Object.values(MeetingOutcomeEnum).includes(outcomeLower as MeetingOutcome)
    ) {
      outcomeEnum = outcomeLower as MeetingOutcome;
    }

    const updated: Meeting = {
      ...meeting,
      outcome: outcomeEnum,
      notes: notes || meeting.notes || (outcomeEnum ? undefined : outcome), // Store text outcome in notes if not enum
      modifiedBy: user.id,
      modifiedAt: new Date(),
      version: meeting.version + 1,
    };

    const saved = await this.meetingRepository.update(updated);

    // Log audit trail
    await this.auditService.log({
      entityType: 'Meeting',
      entityId: saved._id,
      action: 'UPDATE_OUTCOME',
      userId: user.id,
      timestamp: new Date(),
    });

    return this.mapToResponseDto(saved);
  }

  /**
   * Link meeting to tour
   */
  async linkToTour(
    id: string,
    tourId: string,
    user: User
  ): Promise<MeetingResponseDto> {
    const meeting = await this.meetingRepository.findById(id);

    if (!meeting) {
      throw new NotFoundException(`Meeting ${id} not found`);
    }

    // RBAC check: ADM can only link own meetings
    if (user.role === 'ADM' && meeting.createdBy !== user.id) {
      throw new ForbiddenException(
        'You can only link your own meetings to tours'
      );
    }

    const updated: Meeting = {
      ...meeting,
      tourId,
      modifiedBy: user.id,
      modifiedAt: new Date(),
      version: meeting.version + 1,
    };

    const saved = await this.meetingRepository.update(updated);

    // Log audit trail
    await this.auditService.log({
      entityType: 'Meeting',
      entityId: saved._id,
      action: 'LINK_TOUR',
      tourId,
      userId: user.id,
      timestamp: new Date(),
    });

    return this.mapToResponseDto(saved);
  }

  /**
   * Get tour suggestions for meeting
   *
   * Business Rule MT-001: Auto-tour suggestion
   */
  async getTourSuggestions(
    meetingDate: Date,
    locationId: string,
    user: User
  ): Promise<Tour[]> {
    return this.tourService.suggestToursForMeeting(
      meetingDate,
      locationId,
      user.id
    );
  }

  /**
   * Get meetings for tour
   */
  async findByTour(tourId: string, user: User): Promise<MeetingResponseDto[]> {
    const meetings = await this.meetingRepository.findByTour(tourId);
    return meetings.map((meeting) => this.mapToResponseDto(meeting));
  }

  /**
   * Check if all meetings for a tour are completed or cancelled
   * Used by TourService for TR-001 validation
   */
  async areAllMeetingsCompleted(tourId: string): Promise<boolean> {
    const meetings = await this.meetingRepository.findByTour(tourId);
    return meetings.every(
      (meeting) => meeting.attended === true || meeting.outcome === 'cancelled'
    );
  }

  /**
   * Calculate distance between two GPS coordinates (Haversine formula)
   * Returns distance in meters
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Map Meeting entity to MeetingResponseDto
   */
  private mapToResponseDto(meeting: Meeting): MeetingResponseDto {
    // Map entity fields to DTO fields
    // Note: DTO uses different field names for API compatibility
    return {
      id: meeting._id,
      scheduledAt: meeting.scheduledAt,
      durationMinutes: meeting.duration,
      meetingType: meeting.meetingType,
      purpose: meeting.title, // Map title to purpose for API
      customerId: meeting.customerId,
      locationId: meeting.locationId,
      tourId: meeting.tourId,
      contactPersonIds: meeting.attendees || [],
      projectId: meeting.projectId,
      status: this.mapMeetingStatus(meeting), // Derive status from entity state
      outcome: meeting.outcome ? String(meeting.outcome) : undefined, // Convert enum to string
      attended: meeting.attended || false,
      checkInTime: meeting.actualStartTime,
      checkOutTime: meeting.actualEndTime,
      followUpRequired: !!meeting.followUpDate, // Derive from followUpDate
      followUpDate: meeting.followUpDate,
      notes: meeting.notes,
      createdAt: meeting.createdAt,
      modifiedAt: meeting.modifiedAt,
    };
  }

  /**
   * Map Meeting entity state to MeetingStatus enum
   * Derives status from entity fields since entity doesn't have explicit status
   */
  private mapMeetingStatus(meeting: Meeting): MeetingStatus {
    if (meeting.attended === true) {
      return MeetingStatus.COMPLETED;
    }
    if (meeting.outcome === MeetingOutcomeEnum.CANCELLED) {
      return MeetingStatus.CANCELLED;
    }
    if (
      meeting.actualStartTime &&
      new Date(meeting.actualStartTime) > new Date()
    ) {
      return MeetingStatus.RESCHEDULED;
    }
    return MeetingStatus.SCHEDULED;
  }
}
