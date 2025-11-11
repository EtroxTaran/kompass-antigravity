/**
 * KOMPASS Shared Package
 * 
 * Shared types, utilities, validation, and constants
 * Used by both backend and frontend
 */

// Types
export type { BaseEntity, ImmutableEntity, ChangeLogEntry, SoftDeletable } from './types/base.entity';
export type { Customer, Address, DSGVOConsent } from './types/entities/customer';
export { isCustomer, createCustomer } from './types/entities/customer';

// Constants
export { UserRole, Permission, EntityType, PERMISSION_MATRIX, hasPermission, getPermissionsForRole, canAccessRecord } from './constants/rbac.constants';

// Utils
export { generateEntityId, generateGoBDNumber, extractUUID, extractEntityType, isValidEntityId, isValidGoBDNumber } from './utils/id-generator';

