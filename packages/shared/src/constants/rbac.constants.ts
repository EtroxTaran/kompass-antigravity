/**
 * RBAC Constants for KOMPASS
 * 
 * Defines roles, permissions, and access control rules
 * Based on: docs/reviews/RBAC_PERMISSION_MATRIX.md
 */

/**
 * User roles in the system
 */
export enum UserRole {
  /** Außendienst - Field Sales Representatives */
  ADM = 'ADM',
  
  /** Innendienst - Inside Sales & Quoting */
  INNEN = 'INNEN',
  
  /** Planungsabteilung - Project Planning & Execution */
  PLAN = 'PLAN',
  
  /** Buchhaltung - Accounting & Invoicing */
  BUCH = 'BUCH',
  
  /** Geschäftsführer - Executive Management */
  GF = 'GF',
  
  /** System Administrator */
  ADMIN = 'ADMIN',
}

/**
 * Permission actions
 */
export enum Permission {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  EXPORT = 'EXPORT',
}

/**
 * Entity types for permission checks
 */
export enum EntityType {
  Customer = 'Customer',
  Contact = 'Contact',
  Location = 'Location',
  Opportunity = 'Opportunity',
  Offer = 'Offer',
  Project = 'Project',
  Task = 'Task',
  Invoice = 'Invoice',
  Payment = 'Payment',
  Protocol = 'Protocol',
  Document = 'Document',
  User = 'User',
}

/**
 * Permission matrix
 * 
 * Structure: permissions[Role][EntityType][Permission] = boolean
 */
export const PERMISSION_MATRIX: Record<
  UserRole,
  Partial<Record<EntityType, Partial<Record<Permission, boolean>>>>
> = {
  [UserRole.ADM]: {
    [EntityType.Customer]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,   // Own customers only
      [Permission.UPDATE]: true,  // Own customers only
      [Permission.DELETE]: false,
    },
    [EntityType.Contact]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,
      [Permission.UPDATE]: true,
      [Permission.DELETE]: true,
    },
    [EntityType.Opportunity]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,   // Own opportunities only
      [Permission.UPDATE]: true,  // Own opportunities only
      [Permission.DELETE]: false,
    },
    [EntityType.Protocol]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,
      [Permission.UPDATE]: true,  // Within 24 hours only
      [Permission.DELETE]: false,
    },
  },

  [UserRole.INNEN]: {
    [EntityType.Customer]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,   // All customers
      [Permission.UPDATE]: true,  // All customers
      [Permission.DELETE]: false,
    },
    [EntityType.Opportunity]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,
      [Permission.UPDATE]: true,
      [Permission.DELETE]: false,
    },
    [EntityType.Offer]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,
      [Permission.UPDATE]: true,  // Draft only
      [Permission.DELETE]: false,
      [Permission.APPROVE]: false, // Requires GF for >€50k
    },
    [EntityType.Project]: {
      [Permission.CREATE]: false,
      [Permission.READ]: true,
      [Permission.UPDATE]: false,
      [Permission.DELETE]: false,
    },
  },

  [UserRole.PLAN]: {
    [EntityType.Project]: {
      [Permission.CREATE]: false, // Created from opportunities
      [Permission.READ]: true,   // All projects
      [Permission.UPDATE]: true,  // Assigned projects only
      [Permission.DELETE]: false,
    },
    [EntityType.Task]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,
      [Permission.UPDATE]: true,
      [Permission.DELETE]: true,
    },
    [EntityType.Customer]: {
      [Permission.CREATE]: false,
      [Permission.READ]: true,  // Related to projects only
      [Permission.UPDATE]: false,
      [Permission.DELETE]: false,
    },
  },

  [UserRole.BUCH]: {
    [EntityType.Invoice]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,
      [Permission.UPDATE]: true,  // Draft only, immutable after finalization
      [Permission.DELETE]: false,
      [Permission.APPROVE]: true, // Can finalize invoices
    },
    [EntityType.Payment]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,
      [Permission.UPDATE]: false, // Payments are immutable
      [Permission.DELETE]: false,
    },
    [EntityType.Customer]: {
      [Permission.CREATE]: false,
      [Permission.READ]: true,  // Financial data access
      [Permission.UPDATE]: true,  // Financial fields only
      [Permission.DELETE]: false,
    },
  },

  [UserRole.GF]: {
    // GF has full access to everything
    [EntityType.Customer]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,
      [Permission.UPDATE]: true,
      [Permission.DELETE]: true,
      [Permission.APPROVE]: true,
      [Permission.EXPORT]: true,
    },
    [EntityType.Opportunity]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,
      [Permission.UPDATE]: true,
      [Permission.DELETE]: true,
      [Permission.APPROVE]: true,
      [Permission.EXPORT]: true,
    },
    [EntityType.Project]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,
      [Permission.UPDATE]: true,
      [Permission.DELETE]: true,
      [Permission.APPROVE]: true,
      [Permission.EXPORT]: true,
    },
    [EntityType.Invoice]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,
      [Permission.UPDATE]: true,  // Can correct finalized invoices
      [Permission.DELETE]: true,
      [Permission.APPROVE]: true,
      [Permission.EXPORT]: true,
    },
  },

  [UserRole.ADMIN]: {
    // ADMIN has full access to everything including users
    [EntityType.User]: {
      [Permission.CREATE]: true,
      [Permission.READ]: true,
      [Permission.UPDATE]: true,
      [Permission.DELETE]: true,
    },
    // ... plus all other entity permissions
  },
};

/**
 * Check if a role has a specific permission for an entity
 */
export function hasPermission(
  role: UserRole,
  entity: EntityType,
  action: Permission
): boolean {
  const rolePermissions = PERMISSION_MATRIX[role];
  if (!rolePermissions) return false;

  const entityPermissions = rolePermissions[entity];
  if (!entityPermissions) return false;

  return entityPermissions[action] === true;
}

/**
 * Get all permissions for a role
 */
export function getPermissionsForRole(
  role: UserRole
): Partial<Record<EntityType, Partial<Record<Permission, boolean>>>> {
  return PERMISSION_MATRIX[role] || {};
}

/**
 * Check if role can access record (ownership check)
 */
export function canAccessRecord(
  role: UserRole,
  entityType: EntityType,
  record: { owner?: string },
  userId: string
): boolean {
  // GF and ADMIN can access all records
  if ([UserRole.GF, UserRole.ADMIN].includes(role)) {
    return true;
  }

  // ADM can only access their own customers and opportunities
  if (role === UserRole.ADM) {
    if ([EntityType.Customer, EntityType.Opportunity].includes(entityType)) {
      return record.owner === userId;
    }
  }

  // Default: allow if has permission
  return hasPermission(role, entityType, Permission.READ);
}

