/**
 * Meeting/Appointment Entity for KOMPASS
 * 
 * Represents a scheduled customer visit/meeting
 * Linked to tours for travel planning and expense tracking
 * 
 * Validation rules:
 * - scheduledAt: Required, future date (or within last 7 days for retroactive)
 * - duration: 15-480 minutes
 * - meetingType: Valid enum value
 * - customerId: Must reference existing Customer
 * - locationId: Must reference existing Location
 * - outcome: Required if attended = true
 * 
 * Business Rules:
 * - MT-001: Auto-suggest tours when creating meeting (same day ±1, region <50km)
 * - MT-002: Meeting can only be marked attended if scheduledAt is in past
 * - MT-003: Check-in requires GPS within 500m of location
 * - MT-004: Meeting outcome must be provided within 24h of meeting
 */

import type { BaseEntity } from '../base.entity';
import type { GPSCoordinates } from './tour';

/**
 * Meeting type enum
 */
export enum MeetingType {
  FIRST_VISIT = 'first_visit',
  FOLLOW_UP = 'follow_up',
  PRESENTATION = 'presentation',
  NEGOTIATION = 'negotiation',
  CLOSING = 'closing',
  PROJECT_REVIEW = 'project_review',
  OTHER = 'other',
}

/**
 * Meeting outcome enum
 */
export enum MeetingOutcome {
  SUCCESSFUL = 'successful',
  NEEDS_FOLLOW_UP = 'needs_follow_up',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

/**
 * Meeting entity
 */
export interface Meeting extends BaseEntity {
  type: 'meeting';

  // ==================== Meeting Identity ====================
  
  /** Meeting title/subject */
  title: string;

  /** Meeting description */
  description?: string;

  // ==================== Schedule ====================
  
  /** Scheduled date and time */
  scheduledAt: Date;

  /** Meeting duration in minutes */
  duration: number;

  /** Type of meeting */
  meetingType: MeetingType;

  // ==================== Location & Participants ====================
  
  /** Customer ID (REQUIRED) */
  customerId: string;

  /** Location ID where meeting takes place (REQUIRED) */
  locationId: string;

  /** Contact person IDs attending from customer side */
  attendees?: string[];

  // ==================== Tour Association ====================
  
  /** Tour ID this meeting belongs to (optional, can be auto-assigned) */
  tourId?: string;

  // ==================== Project/Opportunity Linkage ====================
  
  /** Related opportunity ID */
  opportunityId?: string;

  /** Related project ID */
  projectId?: string;

  // ==================== Meeting Execution ====================
  
  /** Whether meeting was attended */
  attended?: boolean;

  /** Actual start time (check-in) */
  actualStartTime?: Date;

  /** Actual end time (check-out) */
  actualEndTime?: Date;

  /** GPS coordinates at check-in (validates proximity to location) */
  checkInGPS?: GPSCoordinates;

  // ==================== Meeting Outcome ====================
  
  /** Meeting outcome */
  outcome?: MeetingOutcome;

  /** Meeting notes (markdown supported) */
  notes?: string;

  /** Action items from meeting */
  actionItems?: string[];

  /** Next steps agreed upon */
  nextSteps?: string;

  /** Follow-up date if needed */
  followUpDate?: Date;

  // ==================== Preparation ====================
  
  /** Agenda items */
  agenda?: string[];

  /** Preparation notes */
  preparationNotes?: string;

  // ==================== Reminders ====================
  
  /** Reminder sent flag */
  reminderSent?: boolean;

  /** When reminder was sent */
  reminderSentAt?: Date;
}

/**
 * Type guard for Meeting
 */
export function isMeeting(obj: unknown): obj is Meeting {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '_id' in obj &&
    '_rev' in obj &&
    'type' in obj &&
    (obj as Meeting).type === 'meeting' &&
    'title' in obj &&
    'scheduledAt' in obj &&
    'duration' in obj &&
    'meetingType' in obj &&
    'customerId' in obj &&
    'locationId' in obj
  );
}

/**
 * Meeting creation helper
 */
export function createMeeting(
  data: Omit<
    Meeting,
    | '_id'
    | '_rev'
    | 'type'
    | 'createdBy'
    | 'createdAt'
    | 'modifiedBy'
    | 'modifiedAt'
    | 'version'
  >,
  userId: string
): Omit<Meeting, '_rev'> {
  const now = new Date();

  return {
    _id: `meeting-${crypto.randomUUID()}`,
    type: 'meeting',
    ...data,
    createdBy: userId,
    createdAt: now,
    modifiedBy: userId,
    modifiedAt: now,
    version: 1,
  };
}

/**
 * Meeting validation error
 */
export interface MeetingValidationError {
  field: string;
  message: string;
}

/**
 * Validates meeting data
 */
export function validateMeeting(meeting: Partial<Meeting>): MeetingValidationError[] {
  const errors: MeetingValidationError[] = [];

  // Required fields
  if (!meeting.title || meeting.title.length < 2 || meeting.title.length > 200) {
    errors.push({ field: 'title', message: 'Meeting title must be 2-200 characters' });
  }

  if (!meeting.scheduledAt) {
    errors.push({ field: 'scheduledAt', message: 'Scheduled date is required' });
  }

  if (!meeting.duration) {
    errors.push({ field: 'duration', message: 'Duration is required' });
  }

  if (!meeting.meetingType) {
    errors.push({ field: 'meetingType', message: 'Meeting type is required' });
  }

  if (!meeting.customerId) {
    errors.push({ field: 'customerId', message: 'Customer ID is required' });
  }

  if (!meeting.locationId) {
    errors.push({ field: 'locationId', message: 'Location ID is required' });
  }

  // Duration validation
  if (meeting.duration !== undefined) {
    if (meeting.duration < 15) {
      errors.push({ field: 'duration', message: 'Duration must be at least 15 minutes' });
    }
    if (meeting.duration > 480) {
      errors.push({ field: 'duration', message: 'Duration cannot exceed 480 minutes (8 hours)' });
    }
  }

  // Scheduled date validation
  if (meeting.scheduledAt && !meeting._id) {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (new Date(meeting.scheduledAt) < sevenDaysAgo) {
      errors.push({ 
        field: 'scheduledAt', 
        message: 'Scheduled date cannot be more than 7 days in the past' 
      });
    }
  }

  // Business rule MT-002: Can only mark attended if meeting is in past
  if (meeting.attended === true && meeting.scheduledAt) {
    if (new Date(meeting.scheduledAt) > new Date()) {
      errors.push({
        field: 'attended',
        message: 'Cannot mark meeting as attended if scheduled date is in the future',
      });
    }
  }

  // Business rule: Outcome required if attended
  if (meeting.attended === true && !meeting.outcome) {
    errors.push({
      field: 'outcome',
      message: 'Meeting outcome is required when meeting is marked as attended',
    });
  }

  // Actual times validation
  if (meeting.actualStartTime && meeting.actualEndTime) {
    if (new Date(meeting.actualEndTime) <= new Date(meeting.actualStartTime)) {
      errors.push({
        field: 'actualEndTime',
        message: 'Actual end time must be after actual start time',
      });
    }
  }

  return errors;
}

/**
 * Calculates actual meeting duration in minutes
 */
export function calculateActualDuration(meeting: Meeting): number | null {
  if (!meeting.actualStartTime || !meeting.actualEndTime) {
    return null;
  }

  const start = new Date(meeting.actualStartTime).getTime();
  const end = new Date(meeting.actualEndTime).getTime();
  return Math.round((end - start) / (1000 * 60));
}

/**
 * Validates GPS proximity to location (within 500m)
 */
export function isGPSWithinProximity(
  checkInGPS: GPSCoordinates,
  locationGPS: GPSCoordinates,
  maxDistanceMeters: number = 500
): boolean {
  // Haversine formula for distance calculation
  const R = 6371e3; // Earth radius in meters
  const φ1 = (checkInGPS.latitude * Math.PI) / 180;
  const φ2 = (locationGPS.latitude * Math.PI) / 180;
  const Δφ = ((locationGPS.latitude - checkInGPS.latitude) * Math.PI) / 180;
  const Δλ = ((locationGPS.longitude - checkInGPS.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters

  return distance <= maxDistanceMeters;
}

