import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@kompass/shared/types/entities/user';
import { EntityType, Permission, hasAnyRolePermission } from '@kompass/shared/constants/rbac.constants';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';

/**
 * RBAC Guard
 * 
 * Enforces role-based access control using the hybrid RBAC architecture.
 * Checks if ANY of the user's roles have the required permission (OR logic).
 * 
 * TODO: Integrate with RoleService to fetch runtime permission matrix from CouchDB
 * TODO: Add caching layer for permission matrix lookups
 * TODO: Add permission check logging for audit trail
 * TODO: Add support for resource-level permission checks (ownership)
 * 
 * @see docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md
 */
@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    // TODO: Inject RoleService when available
    // private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required permission from decorator
    const requiredPermission = this.reflector.getAllAndOverride<{
      entity: EntityType;
      action: Permission;
    }>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    // If no permission required, allow access
    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User | undefined = request.user;

    // User must be authenticated
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // User must have at least one role
    if (!user.roles || user.roles.length === 0) {
      throw new ForbiddenException('User has no assigned roles');
    }

    // TODO: Fetch runtime permission matrix from CouchDB via RoleService
    // TODO: If no active runtime matrix, fall back to static PERMISSION_MATRIX
    // For now, use static permission matrix from rbac.constants.ts

    // Check if ANY of the user's roles grant the required permission (OR logic)
    const hasPermission = hasAnyRolePermission(
      user.roles,
      requiredPermission.entity,
      requiredPermission.action
    );

    if (!hasPermission) {
      // TODO: Log permission denial for audit trail
      throw new ForbiddenException(
        `Insufficient permissions: You do not have ${requiredPermission.action} permission for ${requiredPermission.entity}`
      );
    }

    // TODO: Add resource-level permission check (ownership)
    // Example: if entity is Customer and action is UPDATE, verify user owns the customer
    // This requires injecting the service to fetch the resource and check ownership

    return true;
  }
}

