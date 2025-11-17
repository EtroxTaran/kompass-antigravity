import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Permission } from '@kompass/shared';

import { useAuth } from '../../hooks/useAuth';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { auditService } from '../../services/audit.service';

import type { EntityType } from '@kompass/shared';

/**
 * Role Guard Props
 */
interface RoleGuardProps {
  /** Children to render if user has permission */
  children: React.ReactElement;
  /** Entity type required for access */
  entityType: EntityType;
  /** Permission action required (default: READ) */
  permission?: Permission;
  /** Fallback route if unauthorized (default: /unauthorized) */
  fallbackRoute?: string;
}

/**
 * Role Guard Component
 *
 * Wraps routes requiring specific RBAC permissions.
 * Checks user's roles against required entity type and permission.
 * Redirects to unauthorized page if access denied.
 * Logs unauthorized access attempts to audit service.
 *
 * @example
 * ```tsx
 * <Route
 *   path="/customers"
 *   element={
 *     <RoleGuard entityType={EntityType.Customer} permission={Permission.READ}>
 *       <CustomerPage />
 *     </RoleGuard>
 *   }
 * />
 * ```
 */
export function RoleGuard({
  children,
  entityType,
  permission = Permission.READ,
  fallbackRoute = '/unauthorized',
}: RoleGuardProps): React.ReactElement {
  const location = useLocation();
  const { user } = useAuth();
  const { hasPermission, isLoading, error } = useAuthGuard(
    entityType,
    permission
  );

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Log unauthorized access attempt
  if (!hasPermission && user) {
    void auditService.logUnauthorizedAccess({
      userId: user._id,
      route: location.pathname,
      timestamp: new Date(),
      reason: error || 'Insufficient permissions',
      roles: user.roles,
    });
  }

  // Redirect if no permission
  if (!hasPermission) {
    return (
      <Navigate
        to={fallbackRoute}
        state={{ from: location, reason: error }}
        replace
      />
    );
  }

  // User has permission, render children
  return children;
}
