/**
 * Contact/ContactPerson Entity for KOMPASS
 * 
 * Represents an individual person associated with a customer
 * Contacts can have decision-making roles and authority levels for business processes
 * 
 * Validation rules from DATA_MODEL_SPECIFICATION.md:
 * - firstName, lastName: 2-50 chars, letters only
 * - email: Valid email format (optional)
 * - phone, mobile: 7-20 chars, international format (optional)
 * - customerId: Must reference existing Customer
 * - decisionMakingRole: Required, valid enum value
 * - authorityLevel: Required, valid level
 * - canApproveOrders: Required boolean
 * - approvalLimitEur: Required if canApproveOrders=true, 0-€10M
 * 
 * Business Rules:
 * - CO-001: Approval limit required if canApproveOrders=true
 * - CO-002: Primary contact locations must be in assignedLocationIds
 * - CO-003: Customer should have at least one decision maker or key influencer (warning)
 */

import type { BaseEntity } from '../base.entity';
import { DecisionMakingRole, FunctionalRole, type AuthorityLevel, type PreferredContactMethod } from '../enums';

/**
 * ContactPerson entity
 */
export interface ContactPerson extends BaseEntity {
  type: 'contact';

  // ==================== Basic Information ====================
  
  /** First name (REQUIRED) */
  firstName: string;

  /** Last name (REQUIRED) */
  lastName: string;

  /** Professional title (e.g., "Dr.", "Prof.") */
  title?: string;

  /** Job position (e.g., "Geschäftsführer", "Einkaufsleiter") */
  position?: string;

  // ==================== Contact Details ====================
  
  /** Email address */
  email?: string;

  /** Phone number */
  phone?: string;

  /** Mobile number */
  mobile?: string;

  // ==================== Relationship ====================
  
  /** Parent customer ID (REQUIRED) */
  customerId: string;

  // ==================== Decision-Making & Authority (NEW) ====================
  
  /** Role in decision-making process (REQUIRED) */
  decisionMakingRole: DecisionMakingRole;

  /** Authority level (REQUIRED) */
  authorityLevel: AuthorityLevel;

  /** Can approve orders/quotes (REQUIRED) */
  canApproveOrders: boolean;

  /** Maximum order value they can approve in EUR (required if canApproveOrders=true) */
  approvalLimitEur?: number;

  // ==================== Role & Responsibilities (NEW) ====================
  
  /** Multiple roles possible (e.g., purchasing + facility) */
  functionalRoles: FunctionalRole[];

  /** Departments they influence (e.g., ["purchasing", "operations", "finance"]) */
  departmentInfluence: string[];

  // ==================== Location Assignment (NEW) ====================
  
  /** Locations this contact is responsible for */
  assignedLocationIds: string[];

  /** Locations where they're the main contact */
  isPrimaryContactForLocations: string[];

  // ==================== Communication Preferences ====================
  
  /** Preferred contact method */
  preferredContactMethod?: PreferredContactMethod;

  /** Preferred language (ISO 639-1 code, default: "de") */
  language?: string;

  // ==================== Notes ====================
  
  /** General notes about contact */
  notes?: string;
}

/**
 * Type guard for ContactPerson
 */
export function isContactPerson(obj: unknown): obj is ContactPerson {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '_id' in obj &&
    '_rev' in obj &&
    'type' in obj &&
    (obj as ContactPerson).type === 'contact' &&
    'firstName' in obj &&
    'lastName' in obj &&
    'customerId' in obj &&
    'decisionMakingRole' in obj &&
    'authorityLevel' in obj &&
    'canApproveOrders' in obj
  );
}

/**
 * Contact creation helper
 */
export function createContact(
  data: Omit<
    ContactPerson,
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
): Omit<ContactPerson, '_rev'> {
  const now = new Date();

  return {
    _id: `contact-${crypto.randomUUID()}`,
    type: 'contact',
    functionalRoles: data.functionalRoles || [],
    departmentInfluence: data.departmentInfluence || [],
    assignedLocationIds: data.assignedLocationIds || [],
    isPrimaryContactForLocations: data.isPrimaryContactForLocations || [],
    ...data,
    createdBy: userId,
    createdAt: now,
    modifiedBy: userId,
    modifiedAt: now,
    version: 1,
  };
}

/**
 * Contact validation error
 */
export interface ContactValidationError {
  field: string;
  message: string;
}

/**
 * Validates contact data
 */
export function validateContact(contact: Partial<ContactPerson>): ContactValidationError[] {
  const errors: ContactValidationError[] = [];

  // Required fields
  if (!contact.firstName || contact.firstName.length < 2 || contact.firstName.length > 50) {
    errors.push({ field: 'firstName', message: 'First name must be 2-50 characters' });
  }

  if (!contact.lastName || contact.lastName.length < 2 || contact.lastName.length > 50) {
    errors.push({ field: 'lastName', message: 'Last name must be 2-50 characters' });
  }

  if (!contact.customerId) {
    errors.push({ field: 'customerId', message: 'Customer ID is required' });
  }

  if (!contact.decisionMakingRole) {
    errors.push({ field: 'decisionMakingRole', message: 'Decision-making role is required' });
  }

  if (!contact.authorityLevel) {
    errors.push({ field: 'authorityLevel', message: 'Authority level is required' });
  }

  if (contact.canApproveOrders === undefined) {
    errors.push({ field: 'canApproveOrders', message: 'Can approve orders flag is required' });
  }

  // Business rule CO-001: Approval limit required if canApproveOrders=true
  if (contact.canApproveOrders === true) {
    if (!contact.approvalLimitEur || contact.approvalLimitEur <= 0) {
      errors.push({
        field: 'approvalLimitEur',
        message: 'Contacts who can approve orders must have an approval limit > 0',
      });
    }
  }

  // Business rule CO-002: Primary contact locations must be in assignedLocationIds
  if (contact.isPrimaryContactForLocations && contact.assignedLocationIds) {
    for (const primaryLocationId of contact.isPrimaryContactForLocations) {
      if (!contact.assignedLocationIds.includes(primaryLocationId)) {
        errors.push({
          field: 'isPrimaryContactForLocations',
          message: `Contact is primary for location ${primaryLocationId} but not assigned to it`,
        });
      }
    }
  }

  return errors;
}

/**
 * Gets display name for contact
 */
export function getContactDisplayName(contact: ContactPerson): string {
  const parts: string[] = [];
  
  if (contact.title) {
    parts.push(contact.title);
  }
  
  parts.push(contact.firstName);
  parts.push(contact.lastName);
  
  return parts.join(' ');
}

/**
 * Gets authority level display text (German)
 */
export function getAuthorityLevelLabel(level: AuthorityLevel): string {
  switch (level) {
    case 'low':
      return 'Niedrig';
    case 'medium':
      return 'Mittel';
    case 'high':
      return 'Hoch';
    case 'final_authority':
      return 'Letztentscheidung';
    default:
      return level;
  }
}

/**
 * Gets decision-making role display text (German)
 */
export function getDecisionMakingRoleLabel(role: DecisionMakingRole): string {
  switch (role) {
    case DecisionMakingRole.DECISION_MAKER:
      return 'Entscheidungsträger';
    case DecisionMakingRole.KEY_INFLUENCER:
      return 'Schlüsselinfluencer';
    case DecisionMakingRole.RECOMMENDER:
      return 'Empfehler';
    case DecisionMakingRole.GATEKEEPER:
      return 'Gatekeeper';
    case DecisionMakingRole.OPERATIONAL_CONTACT:
      return 'Operativer Kontakt';
    case DecisionMakingRole.INFORMATIONAL:
      return 'Informativ';
    default:
      return role;
  }
}

