/**
 * Location Entity for KOMPASS
 * 
 * Represents a physical location for a customer (e.g., headquarters, branch, warehouse, project site)
 * Each location has its own delivery address and can have assigned contact persons
 * 
 * Validation rules from DATA_MODEL_SPECIFICATION.md:
 * - locationName: 2-100 chars, unique within customer
 * - locationType: Enum of valid location types
 * - deliveryAddress: Valid Address structure (required)
 * - isActive: Boolean (required)
 * - primaryContactPersonId: Must be in contactPersons array if set
 * - customerId: Must reference existing Customer
 * 
 * Business Rules:
 * - LR-001: Location names must be unique per customer
 * - LR-002: Primary contact must be in contactPersons array
 * - At least one location should be active if customer has locations
 */

import type { BaseEntity } from '../base.entity';
import type { Address } from '../common/address';
import { LocationType } from '../enums';

/**
 * Location entity
 */
export interface Location extends BaseEntity {
  type: 'location';

  // ==================== Parent Reference ====================
  
  /** Parent customer ID (REQUIRED) */
  customerId: string;

  // ==================== Location Identity ====================
  
  /** Descriptive name (e.g., "Filiale München", "Hauptstandort") */
  locationName: string;

  /** Type of location */
  locationType: LocationType;

  /** Whether location is currently operational */
  isActive: boolean;

  // ==================== Delivery Address ====================
  
  /** Full delivery address (REQUIRED, separate from billing) */
  deliveryAddress: Address;

  // ==================== GPS Coordinates (NEW for Tour Planning) ====================
  
  /** GPS coordinates for navigation and route planning */
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };

  /** Whether this location is a hotel (for hotel stays) */
  isHotel?: boolean;

  /** Hotel rating (1-5 stars) if this is a hotel */
  hotelRating?: number;

  // ==================== Location-Specific Contacts ====================
  
  /** Main contact at this location (optional) */
  primaryContactPersonId?: string;

  /** Contact IDs assigned to this location */
  contactPersons: string[];

  // ==================== Operational Details ====================
  
  /** Special delivery instructions */
  deliveryNotes?: string;

  /** Operating hours (free text) */
  openingHours?: string;

  /** Parking/access instructions */
  parkingInstructions?: string;
}

/**
 * Type guard for Location
 */
export function isLocation(obj: unknown): obj is Location {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '_id' in obj &&
    '_rev' in obj &&
    'type' in obj &&
    (obj as Location).type === 'location' &&
    'customerId' in obj &&
    'locationName' in obj &&
    'locationType' in obj &&
    'isActive' in obj &&
    'deliveryAddress' in obj
  );
}

/**
 * Location creation helper
 */
export function createLocation(
  data: Omit<
    Location,
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
): Omit<Location, '_rev'> {
  const now = new Date();

  return {
    _id: `location-${crypto.randomUUID()}`,
    type: 'location',
    contactPersons: data.contactPersons || [],
    ...data,
    createdBy: userId,
    createdAt: now,
    modifiedBy: userId,
    modifiedAt: now,
    version: 1,
  };
}

/**
 * Validates location business rules
 */
export interface LocationValidationError {
  field: string;
  message: string;
}

/**
 * Validates location data
 */
export function validateLocation(location: Partial<Location>): LocationValidationError[] {
  const errors: LocationValidationError[] = [];

  // Required fields
  if (!location.customerId) {
    errors.push({ field: 'customerId', message: 'Customer ID is required' });
  }

  if (!location.locationName || location.locationName.length < 2 || location.locationName.length > 100) {
    errors.push({ field: 'locationName', message: 'Location name must be 2-100 characters' });
  }

  if (!location.locationType) {
    errors.push({ field: 'locationType', message: 'Location type is required' });
  }

  if (location.isActive === undefined) {
    errors.push({ field: 'isActive', message: 'Active status is required' });
  }

  if (!location.deliveryAddress) {
    errors.push({ field: 'deliveryAddress', message: 'Delivery address is required' });
  }

  // Business rule: Primary contact must be in contactPersons array
  if (location.primaryContactPersonId && location.contactPersons) {
    if (!location.contactPersons.includes(location.primaryContactPersonId)) {
      errors.push({
        field: 'primaryContactPersonId',
        message: 'Primary contact must be in the list of assigned contact persons',
      });
    }
  }

  return errors;
}

