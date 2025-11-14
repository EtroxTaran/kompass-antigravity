/**
 * Customer Entity for KOMPASS
 *
 * Represents a business customer (B2B focus)
 *
 * Validation rules from DATA_MODEL_SPECIFICATION.md:
 * - companyName: 2-200 chars, letters/numbers/basic punctuation
 * - vatNumber: DE\d{9} format (optional)
 * - email: Valid email format (optional)
 * - phone: International format, 7-20 chars (optional)
 * - creditLimit: 0 - €1,000,000 (optional, BUCH/GF only)
 * - owner: Must reference existing User with role ADM
 */

import type { BaseEntity } from '../base.entity';
import type { Address } from '../common/address';
import type {
  CustomerType,
  CustomerBusinessType,
  type CustomerRating,
} from '../enums';

/**
 * DSGVO consent structure
 */
export interface DSGVOConsent {
  marketing: boolean;
  aiProcessing: boolean;
  dataSharing: boolean;
  grantedAt?: Date;
  grantedBy?: string; // User who recorded consent
  revokedAt?: Date;
}

/**
 * Customer entity
 */
export interface Customer extends BaseEntity {
  type: 'customer';

  // ==================== Basic Information ====================

  /** Company name (2-200 chars) */
  companyName: string;

  /** Legal entity name if different from company name */
  legalName?: string;

  /** Auto-generated or custom short name for display */
  displayName?: string;

  /** German VAT number (format: DE123456789) */
  vatNumber?: string;

  /** Company registration number (Handelsregister) */
  registrationNumber?: string;

  // ==================== Address & Locations (UPDATED) ====================

  /** Primary billing address (REQUIRED) */
  billingAddress: Address;

  /** Array of Location IDs (1:n relationship, NEW) */
  locations: string[];

  /** Default location for deliveries (must exist in locations array, NEW) */
  defaultDeliveryLocationId?: string;

  // ==================== Contact Information ====================

  /** Phone number (international format) */
  phone?: string;

  /** Company email */
  email?: string;

  /** Company website */
  website?: string;

  // ==================== Financial Data (RBAC Restricted) ====================

  /** Credit limit in EUR (Buchhaltung/GF only) */
  creditLimit?: number;

  /** Payment terms in days (e.g., 30, 14) */
  paymentTerms?: number;

  /** Current account balance in EUR (Buchhaltung/GF only) */
  accountBalance?: number;

  /** Lifetime revenue (calculated, GF only) */
  totalRevenue?: number;

  /** Average profit margin % (calculated, GF only) */
  profitMargin?: number;

  // ==================== Relationship Management ====================

  /** User ID of assigned ADM (owner) */
  owner: string;

  /** User ID of Innendienst contact */
  accountManager?: string;

  /** Array of Contact IDs */
  contactPersons: string[];

  /** Date of first business */
  customerSince?: Date;

  /** Customer tier (A=Strategic, B=Standard, C=Small) */
  rating?: CustomerRating;

  /** Customer lifecycle status */
  customerType: CustomerType;

  /** Customer business type (NEW) */
  customerBusinessType?: CustomerBusinessType;

  // ==================== Tour Planning (NEW) ====================

  /** Date of last visit by ADM (for tour planning) */
  lastVisitDate?: Date;

  /** Recommended visit frequency in days */
  visitFrequencyDays?: number;

  /** Preferred visit time (e.g., "morning", "afternoon") */
  preferredVisitTime?: string;

  // ==================== Business Intelligence ====================

  /** Industry/sector */
  industry?: string;

  /** Number of employees at customer company */
  employeeCount?: number;

  /** Customer's annual revenue (for targeting) */
  annualRevenue?: number;

  // ==================== Tags & Notes ====================

  /** Flexible tags (e.g., ["VIP", "Referral"]) */
  tags?: string[];

  /** General notes (markdown supported) */
  notes?: string;

  /** Internal notes (hidden from customer portal) */
  internalNotes?: string;

  // ==================== DSGVO Compliance ====================

  /** DSGVO consent tracking */
  dsgvoConsent?: DSGVOConsent;

  /** Auto-deletion date (data retention) */
  dataRetentionUntil?: Date;

  /** True if customer data has been anonymized */
  anonymized?: boolean;

  /** When anonymization occurred */
  anonymizedAt?: Date;

  // ==================== Search Optimization ====================

  /** Denormalized text for full-text search (MeiliSearch) */
  searchableText?: string;
}

/**
 * Type guard for Customer
 */
export function isCustomer(obj: unknown): obj is Customer {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '_id' in obj &&
    '_rev' in obj &&
    'type' in obj &&
    (obj as Customer).type === 'customer' &&
    'companyName' in obj &&
    'billingAddress' in obj &&
    'locations' in obj &&
    'contactPersons' in obj
  );
}

/**
 * Customer creation helper
 */
export function createCustomer(
  data: Omit<
    Customer,
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
): Omit<Customer, '_rev'> {
  const now = new Date();

  const { locations = [], contactPersons = [], ...rest } = data;

  return {
    _id: `customer-${crypto.randomUUID()}`,
    type: 'customer',
    locations,
    contactPersons,
    ...rest,
    createdBy: userId,
    createdAt: now,
    modifiedBy: userId,
    modifiedAt: now,
    version: 1,
  };
}

/**
 * Customer validation error
 */
export interface CustomerValidationError {
  field: string;
  message: string;
}

/**
 * Validates customer data
 */
export function validateCustomer(
  customer: Partial<Customer>
): CustomerValidationError[] {
  const errors: CustomerValidationError[] = [];

  // Required fields
  if (
    !customer.companyName ||
    customer.companyName.length < 2 ||
    customer.companyName.length > 200
  ) {
    errors.push({
      field: 'companyName',
      message: 'Company name must be 2-200 characters',
    });
  }

  if (!customer.billingAddress) {
    errors.push({
      field: 'billingAddress',
      message: 'Billing address is required',
    });
  }

  if (!customer.owner) {
    errors.push({ field: 'owner', message: 'Owner (ADM user) is required' });
  }

  // Business rule CR-001: Default delivery location must be in locations array
  if (customer.defaultDeliveryLocationId && customer.locations) {
    if (!customer.locations.includes(customer.defaultDeliveryLocationId)) {
      errors.push({
        field: 'defaultDeliveryLocationId',
        message:
          "Default delivery location must be one of the customer's locations",
      });
    }
  }

  return errors;
}
