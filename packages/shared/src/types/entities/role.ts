import { BaseEntity } from './base.entity';
import { UserRole, EntityType, Permission } from '../../constants/rbac.constants';

/**
 * Role configuration stored in CouchDB
 * 
 * @description Represents a configurable role definition. This enables runtime permission
 * configuration without code deployment (Hybrid RBAC Phase 2).
 * 
 * @example
 * ```typescript
 * const planRole: Role = {
 *   _id: 'role-plan',
 *   type: 'role',
 *   roleId: 'PLAN',
 *   name: 'Planungsabteilung',
 *   description: 'Planning/design team responsible for project execution',
 *   permissions: {
 *     Customer: { READ: true, CREATE: false, UPDATE: false, DELETE: false },
 *     Project: { READ: true, CREATE: false, UPDATE: true, DELETE: false },
 *     Task: { READ: true, CREATE: true, UPDATE: true, DELETE: true }
 *   },
 *   active: true,
 *   priority: 50,
 *   createdBy: 'user-admin',
 *   createdAt: new Date(),
 *   modifiedBy: 'user-admin',
 *   modifiedAt: new Date(),
 *   version: 1
 * };
 * ```
 */
export interface Role extends BaseEntity {
  /** Format: "role-{roleId}" (e.g., "role-plan") */
  _id: string;
  
  /** Fixed discriminator */
  type: 'role';
  
  // Role identification
  /** Role identifier matching UserRole enum (e.g., 'PLAN') */
  roleId: UserRole;
  
  /** Display name (e.g., "Planungsabteilung") */
  name: string;
  
  /** Role description and responsibilities */
  description: string;
  
  // Permission configuration
  /** Entity-action permissions */
  permissions: Partial<Record<EntityType, Partial<Record<Permission, boolean>>>>;
  
  // Role status
  /** Is role currently active? */
  active: boolean;
  
  /** Role priority for conflict resolution (1-100) */
  priority: number;
}

/**
 * Permission matrix configuration
 * 
 * @description Represents a versioned snapshot of the complete permission matrix.
 * This allows atomic permission updates and rollback capabilities.
 * 
 * @example
 * ```typescript
 * const matrix: PermissionMatrix = {
 *   _id: 'permission-matrix-v2.0',
 *   type: 'permission_matrix',
 *   version: '2.0',
 *   effectiveDate: new Date('2025-02-01'),
 *   matrix: {
 *     GF: { Customer: { READ: true, CREATE: true, UPDATE: true, DELETE: true } },
 *     PLAN: { Customer: { READ: true, CREATE: false, UPDATE: false, DELETE: false } }
 *   },
 *   previousVersion: 'permission-matrix-v1.0',
 *   changelog: 'Corrected PLAN role permissions',
 *   active: true,
 *   createdBy: 'user-admin',
 *   createdAt: new Date(),
 *   modifiedBy: 'user-admin',
 *   modifiedAt: new Date(),
 *   version: 1
 * };
 * ```
 */
export interface PermissionMatrix extends BaseEntity {
  /** Format: "permission-matrix-{version}" (e.g., "permission-matrix-v2.0") */
  _id: string;
  
  /** Fixed discriminator */
  type: 'permission_matrix';
  
  // Version control
  /** Semantic version (e.g., "2.0", "2.1") */
  version: string;
  
  /** When this matrix becomes/became active */
  effectiveDate: Date;
  
  // Permission data
  /** Complete permission matrix for all roles */
  matrix: Record<UserRole, Partial<Record<EntityType, Partial<Record<Permission, boolean>>>>>;
  
  // Change tracking
  /** ID of previous matrix version */
  previousVersion?: string;
  
  /** Human-readable description of changes */
  changelog: string;
  
  // Status
  /** Is this the active matrix? */
  active: boolean;
}

