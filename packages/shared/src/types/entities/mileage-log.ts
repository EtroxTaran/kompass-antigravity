/**
 * Mileage Log Entity for KOMPASS
 *
 * Tracks GPS-recorded mileage for tour expense calculation
 * Provides accurate distance tracking for tax reporting
 *
 * Validation rules:
 * - tourId: Required
 * - startLocation: Required with GPS coordinates
 * - endLocation: Required with GPS coordinates
 * - startTime: Required
 * - endTime: Required, must be after startTime
 * - distance: >= 0, should match GPS route ±5%
 * - calculatedCost: distance × rate (€0.30/km default)
 *
 * Business Rules:
 * - ML-001: Distance must match GPS route calculation ±5%
 * - ML-002: Cost = distance × rate (€0.30/km Germany standard)
 * - ML-003: Manual override allowed with reason
 * - ML-004: Route stored as GeoJSON for audit trail
 */

import type { BaseEntity } from '../base.entity';
import type { GPSCoordinates } from './tour';

/**
 * Location snapshot for start/end points
 */
export interface LocationSnapshot {
  address: string;
  gps: GPSCoordinates;
  timestamp: Date;
  customerId?: string;
  locationId?: string;
}

/**
 * Vehicle information
 */
export interface VehicleInfo {
  type: string; // e.g., "Car", "Van"
  make?: string;
  model?: string;
  licensePlate?: string;
  fuelType?: string; // e.g., "Diesel", "Petrol", "Electric"
}

/**
 * Mileage log entity
 */
export interface MileageLog extends BaseEntity {
  type: 'mileage_log';

  // ==================== Tour Association ====================

  /** Tour ID this mileage belongs to */
  tourId: string;

  /** User ID of driver */
  userId: string;

  // ==================== Journey Details ====================

  /** Start location with GPS */
  startLocation: LocationSnapshot;

  /** End location with GPS */
  endLocation: LocationSnapshot;

  /** Journey start time */
  startTime: Date;

  /** Journey end time */
  endTime: Date;

  /** Duration in minutes (calculated) */
  duration?: number;

  // ==================== Distance & Route ====================

  /** Distance in kilometers */
  distance: number;

  /** GPS route as GeoJSON LineString */
  routeGeoJSON?: string;

  /** Route waypoints (simplified for display) */
  routeWaypoints?: GPSCoordinates[];

  /** GPS-calculated distance for validation */
  gpsDistance?: number;

  /** Whether distance was manually overridden */
  manualOverride?: boolean;

  /** Reason for manual override */
  overrideReason?: string;

  // ==================== Cost Calculation ====================

  /** Rate per kilometer (€0.30 default for Germany) */
  ratePerKm: number;

  /** Calculated cost in EUR */
  calculatedCost: number;

  /** Currency (default EUR) */
  currency: string;

  // ==================== Vehicle Information ====================

  /** Vehicle used */
  vehicle?: VehicleInfo;

  /** Odometer reading at start (optional) */
  odometerStart?: number;

  /** Odometer reading at end (optional) */
  odometerEnd?: number;

  // ==================== Purpose ====================

  /** Purpose of journey */
  purpose?: string;

  /** Passenger names if applicable */
  passengers?: string[];

  // ==================== Linked Entities ====================

  /** Meeting IDs visited during this journey */
  meetingIds?: string[];

  /** Customer IDs visited */
  customerIds?: string[];

  /** Expense ID if expense was created for this mileage */
  expenseId?: string;

  // ==================== Tracking Metadata ====================

  /** GPS tracking enabled */
  gpsTracking: boolean;

  /** Number of GPS points recorded */
  gpsPointCount?: number;

  /** Tracking accuracy (meters) */
  trackingAccuracy?: number;

  /** Notes */
  notes?: string;
}

/**
 * Type guard for MileageLog
 */
export function isMileageLog(obj: unknown): obj is MileageLog {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '_id' in obj &&
    '_rev' in obj &&
    'type' in obj &&
    (obj as MileageLog).type === 'mileage_log' &&
    'tourId' in obj &&
    'userId' in obj &&
    'startLocation' in obj &&
    'endLocation' in obj &&
    'startTime' in obj &&
    'endTime' in obj &&
    'distance' in obj &&
    'ratePerKm' in obj &&
    'calculatedCost' in obj
  );
}

/**
 * Mileage log creation helper
 */
export function createMileageLog(
  data: Omit<
    MileageLog,
    | '_id'
    | '_rev'
    | 'type'
    | 'createdBy'
    | 'createdAt'
    | 'modifiedBy'
    | 'modifiedAt'
    | 'version'
    | 'duration'
    | 'calculatedCost'
  > & {
    duration?: number;
    calculatedCost?: number;
  },
  userId: string
): Omit<MileageLog, '_rev'> {
  const now = new Date();

  // Calculate duration if not provided
  let duration = data.duration;
  if (!duration) {
    const start = new Date(data.startTime).getTime();
    const end = new Date(data.endTime).getTime();
    duration = Math.round((end - start) / (1000 * 60));
  }

  // Calculate cost
  const calculatedCost =
    data.calculatedCost ?? calculateMileageCost(data.distance, data.ratePerKm);

  const { currency = 'EUR', ...rest } = data;

  return {
    _id: `mileage-log-${crypto.randomUUID()}`,
    type: 'mileage_log',
    currency,
    duration,
    calculatedCost,
    ...rest,
    createdBy: userId,
    createdAt: now,
    modifiedBy: userId,
    modifiedAt: now,
    version: 1,
  };
}

/**
 * Mileage log validation error
 */
export interface MileageLogValidationError {
  field: string;
  message: string;
}

/**
 * Validates mileage log data
 */
export function validateMileageLog(
  log: Partial<MileageLog>
): MileageLogValidationError[] {
  const errors: MileageLogValidationError[] = [];

  // Required fields
  if (!log.tourId) {
    errors.push({ field: 'tourId', message: 'Tour ID is required' });
  }

  if (!log.userId) {
    errors.push({ field: 'userId', message: 'User ID is required' });
  }

  if (!log.startLocation) {
    errors.push({
      field: 'startLocation',
      message: 'Start location is required',
    });
  }

  if (!log.endLocation) {
    errors.push({ field: 'endLocation', message: 'End location is required' });
  }

  if (!log.startTime) {
    errors.push({ field: 'startTime', message: 'Start time is required' });
  }

  if (!log.endTime) {
    errors.push({ field: 'endTime', message: 'End time is required' });
  }

  if (log.distance === undefined) {
    errors.push({ field: 'distance', message: 'Distance is required' });
  }

  if (log.ratePerKm === undefined) {
    errors.push({ field: 'ratePerKm', message: 'Rate per km is required' });
  }

  // Time validation
  if (log.startTime && log.endTime) {
    if (new Date(log.endTime) <= new Date(log.startTime)) {
      errors.push({
        field: 'endTime',
        message: 'End time must be after start time',
      });
    }
  }

  // Distance validation
  if (log.distance !== undefined && log.distance < 0) {
    errors.push({ field: 'distance', message: 'Distance cannot be negative' });
  }

  if (log.distance !== undefined && log.distance > 2000) {
    errors.push({
      field: 'distance',
      message: 'Distance exceeds 2000 km. Please verify this is correct.',
    });
  }

  // Rate validation
  if (log.ratePerKm !== undefined && log.ratePerKm < 0) {
    errors.push({
      field: 'ratePerKm',
      message: 'Rate per km cannot be negative',
    });
  }

  if (log.ratePerKm !== undefined && log.ratePerKm > 1) {
    errors.push({
      field: 'ratePerKm',
      message:
        'Rate per km exceeds €1.00. Standard rate is €0.30. Please verify.',
    });
  }

  // Business rule ML-001: Distance should match GPS route ±5%
  // Skip this validation if manual override is applied (GF has approved the override)
  if (
    log.distance !== undefined &&
    log.gpsDistance !== undefined &&
    log.manualOverride !== true
  ) {
    const tolerance = 0.05; // 5%
    const minDistance = log.gpsDistance * (1 - tolerance);
    const maxDistance = log.gpsDistance * (1 + tolerance);

    if (log.distance < minDistance || log.distance > maxDistance) {
      errors.push({
        field: 'distance',
        message: `Distance (${log.distance}km) differs from GPS route (${log.gpsDistance}km) by more than 5%. Please verify or provide override reason.`,
      });
    }
  }

  // Manual override requires reason
  if (log.manualOverride === true && !log.overrideReason) {
    errors.push({
      field: 'overrideReason',
      message: 'Override reason is required when manually adjusting distance',
    });
  }

  // Cost calculation validation
  if (
    log.distance !== undefined &&
    log.ratePerKm !== undefined &&
    log.calculatedCost !== undefined
  ) {
    const expectedCost = calculateMileageCost(log.distance, log.ratePerKm);
    const tolerance = 0.01; // 1 cent

    if (Math.abs(log.calculatedCost - expectedCost) > tolerance) {
      errors.push({
        field: 'calculatedCost',
        message: `Calculated cost (€${log.calculatedCost}) does not match expected cost (${log.distance}km × €${log.ratePerKm} = €${expectedCost})`,
      });
    }
  }

  // Odometer validation
  if (log.odometerStart !== undefined && log.odometerEnd !== undefined) {
    if (log.odometerEnd <= log.odometerStart) {
      errors.push({
        field: 'odometerEnd',
        message: 'Odometer end reading must be greater than start reading',
      });
    }

    // Validate odometer distance matches log distance
    const odometerDistance = log.odometerEnd - log.odometerStart;
    if (log.distance !== undefined) {
      const tolerance = 0.05; // 5%
      const minDistance = odometerDistance * (1 - tolerance);
      const maxDistance = odometerDistance * (1 + tolerance);

      if (log.distance < minDistance || log.distance > maxDistance) {
        errors.push({
          field: 'distance',
          message: `Distance (${log.distance}km) differs from odometer reading (${odometerDistance}km) by more than 5%`,
        });
      }
    }
  }

  return errors;
}

/**
 * Calculates mileage cost
 */
export function calculateMileageCost(
  distance: number,
  ratePerKm: number = 0.3
): number {
  return Math.round(distance * ratePerKm * 100) / 100; // Round to 2 decimals
}

/**
 * Calculates distance between two GPS coordinates using Haversine formula
 */
export function calculateGPSDistance(
  from: GPSCoordinates,
  to: GPSCoordinates
): number {
  const R = 6371; // Earth radius in kilometers
  const φ1 = (from.latitude * Math.PI) / 180;
  const φ2 = (to.latitude * Math.PI) / 180;
  const Δφ = ((to.latitude - from.latitude) * Math.PI) / 180;
  const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  return Math.round(distance * 100) / 100; // Round to 2 decimals
}

/**
 * Validates GPS route distance matches claimed distance
 */
export function validateGPSRouteDistance(
  claimedDistance: number,
  gpsDistance: number,
  tolerance: number = 0.05
): boolean {
  const minDistance = gpsDistance * (1 - tolerance);
  const maxDistance = gpsDistance * (1 + tolerance);
  return claimedDistance >= minDistance && claimedDistance <= maxDistance;
}
