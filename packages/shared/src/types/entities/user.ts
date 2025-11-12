import { BaseEntity } from './base.entity';
import { UserRole } from '../../constants/rbac.constants';

/**
 * Role change history entry for audit trail
 */
export interface RoleChangeEntry {
  /** When role was changed */
  timestamp: Date;
  
  /** User ID who made the change */
  changedBy: string;
  
  /** What changed */
  action: 'ASSIGN' | 'REVOKE' | 'PRIMARY_CHANGED';
  
  /** Which role was affected */
  role: UserRole;
  
  /** Why the change was made (required) */
  reason: string;
}

/**
 * User entity with multiple roles support
 * 
 * @description Represents a system user with authentication credentials and role assignments.
 * Users can have multiple roles to accommodate real-world business scenarios.
 * 
 * @example
 * ```typescript
 * const user: User = {
 *   _id: 'user-abc123',
 *   type: 'user',
 *   email: 'michael.schmidt@example.com',
 *   displayName: 'Michael Schmidt',
 *   roles: ['ADM', 'PLAN'],
 *   primaryRole: 'ADM',
 *   active: true,
 *   createdBy: 'system',
 *   createdAt: new Date(),
 *   modifiedBy: 'system',
 *   modifiedAt: new Date(),
 *   version: 1
 * };
 * ```
 */
export interface User extends BaseEntity {
  /** Format: "user-{uuid}" */
  _id: string;
  
  /** Fixed discriminator */
  type: 'user';
  
  // Identity
  /** Unique email address (login username) */
  email: string;
  
  /** Full name for UI display */
  displayName: string;
  
  // Role Management (Multiple Roles Support)
  /** Array of assigned roles (e.g., ['ADM', 'PLAN']) */
  roles: UserRole[];
  
  /** Default role for UI context (must be in roles[]) */
  primaryRole: UserRole;
  
  // Authentication
  /** Account active status */
  active: boolean;
  
  /** Last successful login timestamp */
  lastLoginAt?: Date;
  
  /** Last password change timestamp */
  passwordChangedAt?: Date;
  
  // Profile
  /** Profile picture URL */
  avatarUrl?: string;
  
  /** Contact phone */
  phoneNumber?: string;
  
  /** Department/division */
  department?: string;
  
  // Preferences
  /** UI language (default: 'de') */
  language?: 'de' | 'en';
  
  /** User timezone (default: 'Europe/Berlin') */
  timezone?: string;
  
  // RBAC metadata (audit)
  /** User ID who assigned current roles */
  rolesAssignedBy?: string;
  
  /** When current roles were assigned */
  rolesAssignedAt?: Date;
  
  /** History of role assignments/revocations */
  roleChangeHistory?: RoleChangeEntry[];
}

