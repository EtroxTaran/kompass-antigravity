import { useMemo } from 'react';

import {
  Permission,
  hasAnyRolePermission,
  type UserRole,
  EntityType,
} from '@kompass/shared';

import { useAuth } from './useAuth';

/**
 * Auth guard hook result
 */
export interface AuthGuardResult {
  /** Whether user has permission */
  hasPermission: boolean;
  /** Whether permission check is loading */
  isLoading: boolean;
  /** Current user roles */
  roles: UserRole[];
  /** Error message if permission denied */
  error: string | null;
}

/**
 * Hook to check if current user has permission for a route
 *
 * Uses hasAnyRolePermission from RBAC constants (OR logic for multiple roles).
 * Returns permission status and loading state.
 *
 * @param entityType - Entity type to check permission for
 * @param permission - Permission action to check (default: READ)
 * @returns AuthGuardResult with permission status
 *
 * @example
 * ```tsx
 * const { hasPermission, isLoading } = useAuthGuard(EntityType.Customer, Permission.READ);
 * if (!hasPermission) {
 *   return <Navigate to="/unauthorized" />;
 * }
 * ```
 */
export function useAuthGuard(
  entityType: EntityType,
  permission: Permission = Permission.READ
): AuthGuardResult {
  const { user, isLoading: authLoading } = useAuth();

  const result = useMemo<AuthGuardResult>(() => {
    // Loading state: waiting for auth
    if (authLoading) {
      return {
        hasPermission: false,
        isLoading: true,
        roles: [],
        error: null,
      };
    }

    // No user: not authenticated
    if (!user) {
      return {
        hasPermission: false,
        isLoading: false,
        roles: [],
        error: 'User not authenticated',
      };
    }

    // No roles: user has no permissions
    if (!user.roles || user.roles.length === 0) {
      return {
        hasPermission: false,
        isLoading: false,
        roles: [],
        error: 'User has no assigned roles',
      };
    }

    // Check if any role has the required permission
    const hasPermission = hasAnyRolePermission(
      user.roles,
      entityType,
      permission
    );

    return {
      hasPermission,
      isLoading: false,
      roles: user.roles,
      error: hasPermission ? null : 'Insufficient permissions',
    };
  }, [user, authLoading, entityType, permission]);

  return result;
}
