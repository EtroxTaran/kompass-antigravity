/**
 * Tour Entity for KOMPASS
 * 
 * Represents a business trip grouping multiple customer visits/meetings
 * Used by ADM (Außendienst) for tour planning and expense tracking
 * 
 * Validation rules:
 * - startDate: Required, cannot be more than 365 days in past
 * - endDate: Required, must be >= startDate (equal dates allowed)
 * - purpose: 2-200 chars
 * - status: Valid enum transitions only
 * - actualDistance: >= 0 if provided
 * - costs: >= 0 if provided
 * 
 * Business Rules:
 * - TR-001: Tour can only be completed if all meetings are attended or cancelled
 * - TR-002: actualDistance should match sum of mileage logs ±5%
 * - TR-003: actualCosts should match sum of expenses
 * - TR-004: Only tour owner (ADM) or GF can modify tour
 */

import type { BaseEntity } from '../base.entity';

/**
 * Tour status enum
 */
export enum TourStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * GPS coordinates structure
 */
export interface GPSCoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Planned route waypoint
 */
export interface RouteWaypoint {
  order: number;
  customerId?: string;
  locationId?: string;
  address: string;
  estimatedArrival?: Date;
  estimatedDuration?: number; // minutes
  gps?: GPSCoordinates;
}

/**
 * Tour entity
 */
export interface Tour extends BaseEntity {
  type: 'tour';

  // ==================== Tour Identity ====================
  
  /** Tour title/name */
  title: string;

  /** Purpose/description of tour */
  purpose?: string;

  /** Region/area covered (e.g., "Bayern Süd", "Norddeutschland") */
  region?: string;

  // ==================== Tour Schedule ====================
  
  /** Tour start date and time */
  startDate: Date;

  /** Tour end date and time */
  endDate: Date;

  /** Current status */
  status: TourStatus;

  // ==================== Ownership ====================
  
  /** User ID of tour owner (typically ADM) */
  ownerId: string;

  // ==================== Route Planning ====================
  
  /** Planned route with waypoints */
  plannedRoute?: RouteWaypoint[];

  /** Estimated total distance in kilometers */
  estimatedDistance?: number;

  /** Actual distance driven in kilometers */
  actualDistance?: number;

  // ==================== Cost Management ====================
  
  /** Estimated total costs in EUR */
  estimatedCosts?: number;

  /** Actual total costs in EUR (sum of expenses + mileage) */
  actualCosts?: number;

  /** Mileage cost (calculated: actualDistance × rate) */
  mileageCost?: number;

  // ==================== Related Data Arrays ====================
  
  /** Meeting IDs associated with this tour */
  meetingIds: string[];

  /** Hotel stay IDs for this tour */
  hotelStayIds: string[];

  /** Expense IDs for this tour */
  expenseIds: string[];

  /** Mileage log IDs for this tour */
  mileageLogIds: string[];

  // ==================== Completion Data ====================
  
  /** When tour was completed */
  completedAt?: Date;

  /** Notes about tour completion */
  completionNotes?: string;

  // ==================== Search Optimization ====================
  
  /** Denormalized text for full-text search */
  searchableText?: string;
}

/**
 * Type guard for Tour
 */
export function isTour(obj: unknown): obj is Tour {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '_id' in obj &&
    '_rev' in obj &&
    'type' in obj &&
    (obj as Tour).type === 'tour' &&
    'title' in obj &&
    'startDate' in obj &&
    'endDate' in obj &&
    'status' in obj &&
    'ownerId' in obj
  );
}

/**
 * Tour creation helper
 */
export function createTour(
  data: Omit<
    Tour,
    | '_id'
    | '_rev'
    | 'type'
    | 'createdBy'
    | 'createdAt'
    | 'modifiedBy'
    | 'modifiedAt'
    | 'version'
    | 'meetingIds'
    | 'hotelStayIds'
    | 'expenseIds'
    | 'mileageLogIds'
  > & {
    meetingIds?: string[];
    hotelStayIds?: string[];
    expenseIds?: string[];
    mileageLogIds?: string[];
  },
  userId: string
): Omit<Tour, '_rev'> {
  const now = new Date();

  return {
    _id: `tour-${crypto.randomUUID()}`,
    type: 'tour',
    meetingIds: data.meetingIds || [],
    hotelStayIds: data.hotelStayIds || [],
    expenseIds: data.expenseIds || [],
    mileageLogIds: data.mileageLogIds || [],
    ...data,
    createdBy: userId,
    createdAt: now,
    modifiedBy: userId,
    modifiedAt: now,
    version: 1,
  };
}

/**
 * Tour validation error
 */
export interface TourValidationError {
  field: string;
  message: string;
}

/**
 * Validates tour data
 */
export function validateTour(tour: Partial<Tour>): TourValidationError[] {
  const errors: TourValidationError[] = [];

  // Required fields
  if (!tour.title || tour.title.length < 2 || tour.title.length > 200) {
    errors.push({ field: 'title', message: 'Tour title must be 2-200 characters' });
  }

  if (!tour.startDate) {
    errors.push({ field: 'startDate', message: 'Start date is required' });
  }

  if (!tour.endDate) {
    errors.push({ field: 'endDate', message: 'End date is required' });
  }

  if (!tour.status) {
    errors.push({ field: 'status', message: 'Tour status is required' });
  }

  if (!tour.ownerId) {
    errors.push({ field: 'ownerId', message: 'Tour owner is required' });
  }

  // Date validation
  if (tour.startDate && tour.endDate) {
    if (new Date(tour.endDate) < new Date(tour.startDate)) {
      errors.push({ field: 'endDate', message: 'End date must be on or after start date' });
    }
  }

  // Start date cannot be more than 365 days in past
  if (tour.startDate) {
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);
    if (new Date(tour.startDate) < oneYearAgo) {
      errors.push({ field: 'startDate', message: 'Start date cannot be more than 365 days in the past' });
    }
  }

  // Distance validation
  if (tour.estimatedDistance !== undefined && tour.estimatedDistance < 0) {
    errors.push({ field: 'estimatedDistance', message: 'Estimated distance cannot be negative' });
  }

  if (tour.actualDistance !== undefined && tour.actualDistance < 0) {
    errors.push({ field: 'actualDistance', message: 'Actual distance cannot be negative' });
  }

  // Cost validation
  if (tour.estimatedCosts !== undefined && tour.estimatedCosts < 0) {
    errors.push({ field: 'estimatedCosts', message: 'Estimated costs cannot be negative' });
  }

  if (tour.actualCosts !== undefined && tour.actualCosts < 0) {
    errors.push({ field: 'actualCosts', message: 'Actual costs cannot be negative' });
  }

  if (tour.mileageCost !== undefined && tour.mileageCost < 0) {
    errors.push({ field: 'mileageCost', message: 'Mileage cost cannot be negative' });
  }

  return errors;
}

/**
 * Validates tour status transition
 */
export function isValidTourStatusTransition(
  currentStatus: TourStatus,
  newStatus: TourStatus
): boolean {
  const validTransitions: Record<TourStatus, TourStatus[]> = {
    [TourStatus.PLANNED]: [TourStatus.ACTIVE, TourStatus.CANCELLED],
    [TourStatus.ACTIVE]: [TourStatus.COMPLETED, TourStatus.CANCELLED],
    [TourStatus.COMPLETED]: [], // Terminal state
    [TourStatus.CANCELLED]: [], // Terminal state
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}

