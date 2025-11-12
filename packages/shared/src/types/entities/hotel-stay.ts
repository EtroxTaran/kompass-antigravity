/**
 * Hotel Stay Entity for KOMPASS
 * 
 * Represents overnight accommodation during business tours
 * Tracks hotel preferences and costs for expense reporting
 * 
 * Validation rules:
 * - hotelName: 2-200 chars, required
 * - locationId: Must reference existing Location (hotel address)
 * - checkIn: Required, cannot be more than 365 days in past
 * - checkOut: Required, must be after checkIn
 * - pricePerNight: >= 0
 * - rating: 1-5 stars if provided
 * 
 * Business Rules:
 * - HS-001: Check-out must be after check-in
 * - HS-002: Total cost = nights × pricePerNight
 * - HS-003: Hotels are added to "past hotels" list for ADM
 * - HS-004: Only tour owner or GF can modify hotel stays
 */

import type { BaseEntity } from '../base.entity';

/**
 * Hotel stay entity
 */
export interface HotelStay extends BaseEntity {
  type: 'hotel_stay';

  // ==================== Tour Association ====================
  
  /** Tour ID this hotel stay belongs to */
  tourId: string;

  /** User ID of traveler (typically same as tour owner) */
  userId: string;

  // ==================== Hotel Information ====================
  
  /** Hotel name */
  hotelName: string;

  /** Location ID (hotel address) */
  locationId: string;

  /** Hotel chain/brand (e.g., "Marriott", "Ibis") */
  hotelChain?: string;

  /** Hotel website */
  website?: string;

  /** Hotel phone number */
  phone?: string;

  // ==================== Stay Details ====================
  
  /** Check-in date */
  checkIn: Date;

  /** Check-out date */
  checkOut: Date;

  /** Number of nights (calculated) */
  nights?: number;

  /** Room type (e.g., "Single", "Double") */
  roomType?: string;

  // ==================== Costs ====================
  
  /** Price per night in EUR */
  pricePerNight: number;

  /** Total cost in EUR */
  totalCost: number;

  /** Booking reference number */
  bookingReference?: string;

  /** Expense ID if expense was created for this stay */
  expenseId?: string;

  // ==================== Experience Tracking ====================
  
  /** Hotel rating (1-5 stars) */
  rating?: number;

  /** Review notes */
  notes?: string;

  /** Would stay again flag */
  wouldStayAgain?: boolean;

  /** Amenities (e.g., ["WiFi", "Breakfast", "Parking"]) */
  amenities?: string[];

  // ==================== Booking Details ====================
  
  /** How booking was made (e.g., "Booking.com", "Direct", "Phone") */
  bookedVia?: string;

  /** Booking confirmation date */
  bookedAt?: Date;

  /** Cancellation policy reference */
  cancellationPolicy?: string;
}

/**
 * Type guard for HotelStay
 */
export function isHotelStay(obj: unknown): obj is HotelStay {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '_id' in obj &&
    '_rev' in obj &&
    'type' in obj &&
    (obj as HotelStay).type === 'hotel_stay' &&
    'tourId' in obj &&
    'userId' in obj &&
    'hotelName' in obj &&
    'locationId' in obj &&
    'checkIn' in obj &&
    'checkOut' in obj &&
    'pricePerNight' in obj &&
    'totalCost' in obj
  );
}

/**
 * Hotel stay creation helper
 */
export function createHotelStay(
  data: Omit<
    HotelStay,
    | '_id'
    | '_rev'
    | 'type'
    | 'createdBy'
    | 'createdAt'
    | 'modifiedBy'
    | 'modifiedAt'
    | 'version'
    | 'nights'
  > & {
    nights?: number;
  },
  userId: string
): Omit<HotelStay, '_rev'> {
  const now = new Date();

  // Calculate nights if not provided
  let nights = data.nights;
  if (!nights) {
    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return {
    _id: `hotel-stay-${crypto.randomUUID()}`,
    type: 'hotel_stay',
    nights,
    ...data,
    createdBy: userId,
    createdAt: now,
    modifiedBy: userId,
    modifiedAt: now,
    version: 1,
  };
}

/**
 * Hotel stay validation error
 */
export interface HotelStayValidationError {
  field: string;
  message: string;
}

/**
 * Validates hotel stay data
 */
export function validateHotelStay(hotelStay: Partial<HotelStay>): HotelStayValidationError[] {
  const errors: HotelStayValidationError[] = [];

  // Required fields
  if (!hotelStay.tourId) {
    errors.push({ field: 'tourId', message: 'Tour ID is required' });
  }

  if (!hotelStay.userId) {
    errors.push({ field: 'userId', message: 'User ID is required' });
  }

  if (!hotelStay.hotelName || hotelStay.hotelName.length < 2 || hotelStay.hotelName.length > 200) {
    errors.push({ field: 'hotelName', message: 'Hotel name must be 2-200 characters' });
  }

  if (!hotelStay.locationId) {
    errors.push({ field: 'locationId', message: 'Location ID is required' });
  }

  if (!hotelStay.checkIn) {
    errors.push({ field: 'checkIn', message: 'Check-in date is required' });
  }

  if (!hotelStay.checkOut) {
    errors.push({ field: 'checkOut', message: 'Check-out date is required' });
  }

  if (hotelStay.pricePerNight === undefined) {
    errors.push({ field: 'pricePerNight', message: 'Price per night is required' });
  }

  if (hotelStay.totalCost === undefined) {
    errors.push({ field: 'totalCost', message: 'Total cost is required' });
  }

  // Date validation
  if (hotelStay.checkIn && hotelStay.checkOut) {
    if (new Date(hotelStay.checkOut) <= new Date(hotelStay.checkIn)) {
      errors.push({ field: 'checkOut', message: 'Check-out date must be after check-in date' });
    }
  }

  // Check-in cannot be more than 365 days in past
  if (hotelStay.checkIn) {
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);
    if (new Date(hotelStay.checkIn) < oneYearAgo) {
      errors.push({ 
        field: 'checkIn', 
        message: 'Check-in date cannot be more than 365 days in the past' 
      });
    }
  }

  // Price validation
  if (hotelStay.pricePerNight !== undefined && hotelStay.pricePerNight < 0) {
    errors.push({ field: 'pricePerNight', message: 'Price per night cannot be negative' });
  }

  if (hotelStay.totalCost !== undefined && hotelStay.totalCost < 0) {
    errors.push({ field: 'totalCost', message: 'Total cost cannot be negative' });
  }

  // Rating validation
  if (hotelStay.rating !== undefined) {
    if (hotelStay.rating < 1 || hotelStay.rating > 5) {
      errors.push({ field: 'rating', message: 'Rating must be between 1 and 5 stars' });
    }
  }

  // Business rule HS-002: Validate total cost matches calculation
  if (
    hotelStay.pricePerNight !== undefined &&
    hotelStay.totalCost !== undefined &&
    hotelStay.checkIn &&
    hotelStay.checkOut
  ) {
    const checkInDate = new Date(hotelStay.checkIn);
    const checkOutDate = new Date(hotelStay.checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const expectedTotal = nights * hotelStay.pricePerNight;
    const tolerance = 0.01; // 1 cent tolerance

    if (Math.abs(hotelStay.totalCost - expectedTotal) > tolerance) {
      errors.push({
        field: 'totalCost',
        message: `Total cost (€${hotelStay.totalCost}) does not match calculated cost (${nights} nights × €${hotelStay.pricePerNight} = €${expectedTotal})`,
      });
    }
  }

  return errors;
}

/**
 * Calculates number of nights
 */
export function calculateNights(checkIn: Date, checkOut: Date): number {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates total cost
 */
export function calculateTotalCost(pricePerNight: number, nights: number): number {
  return Math.round(pricePerNight * nights * 100) / 100; // Round to 2 decimals
}

