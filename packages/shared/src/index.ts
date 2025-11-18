/**
 * KOMPASS Shared Package
 *
 * Shared types, utilities, validation, and constants
 * Used by both backend and frontend
 */

// Types
export type {
  BaseEntity,
  ImmutableEntity,
  ChangeLogEntry,
  SoftDeletable,
} from './types/base.entity';
export type { Address } from './types/common/address';
export {
  isValidAddress,
  createDefaultAddress,
  formatAddress,
  formatAddressMultiLine,
} from './types/common/address';
// Export entities (includes Customer, Location, Contact, Role, etc.)
// Using export * instead of export type * to include both types and functions
export * from './types/entities';
// Export enums as values
export * from './types/enums';

// Constants
export {
  UserRole,
  Permission,
  EntityType,
  PERMISSION_MATRIX,
  hasPermission,
  getPermissionsForRole,
  canAccessRecord,
  hasAnyRolePermission,
  hasAllRolesPermission,
  getPermissionsForRoles,
  canAccessRecordWithRoles,
} from './constants/rbac.constants';

// Utils
export {
  generateEntityId,
  generateGoBDNumber,
  extractUUID,
  extractEntityType,
  isValidEntityId,
  isValidGoBDNumber,
} from './utils/id-generator';
export {
  type PaginationOptions,
  type SortOptions,
  calculatePaginationMetadata,
  normalizePaginationOptions,
  validateSortField,
  normalizeSortOptions,
} from './utils/pagination.utils';

// DTOs
export type {
  PaginationMetadata,
  PaginatedResponse,
} from './types/dtos/paginated-response.dto';

// Validation
export {
  customerFormSchema,
  addressSchema,
  type CustomerFormValues,
} from './validation/customer.validation';
