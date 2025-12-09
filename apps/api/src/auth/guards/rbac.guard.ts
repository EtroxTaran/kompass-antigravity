import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSIONS_KEY,
  PermissionRequirement,
} from '../decorators/permissions.decorator';
import { AuthenticatedUser } from '../strategies/jwt.strategy';

// Permission matrix per role (from docs/specifications/rbac-permissions.md)
const PERMISSION_MATRIX: Record<
  string,
  Record<string, Record<string, boolean>>
> = {
  GF: {
    Customer: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Contact: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Location: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Opportunity: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Project: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Invoice: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Material: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Supplier: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    TimeEntry: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    User: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    UserTask: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    ProjectTask: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Activity: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Offer: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Contract: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
  },
  ADMIN: {
    Customer: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Contact: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Location: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Opportunity: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Project: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Invoice: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Material: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Supplier: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    TimeEntry: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    User: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    UserTask: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    ProjectTask: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Activity: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Offer: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Contract: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
  },
  ADM: {
    Customer: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Contact: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Location: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Opportunity: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Project: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Invoice: { CREATE: false, READ: false, UPDATE: false, DELETE: false },
    Material: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Supplier: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    TimeEntry: { CREATE: false, READ: false, UPDATE: false, DELETE: false },
    User: { CREATE: false, READ: false, UPDATE: false, DELETE: false },
    UserTask: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    ProjectTask: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Activity: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Offer: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Contract: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
  },
  INNEN: {
    Customer: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Contact: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Location: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Opportunity: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Project: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Invoice: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Material: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Supplier: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    TimeEntry: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    User: { CREATE: false, READ: false, UPDATE: false, DELETE: false },
    UserTask: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    ProjectTask: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Activity: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Offer: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Contract: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
  },
  PLAN: {
    Customer: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Contact: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Location: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Opportunity: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Project: { CREATE: false, READ: true, UPDATE: true, DELETE: false },
    Invoice: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Material: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Supplier: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    TimeEntry: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    User: { CREATE: false, READ: false, UPDATE: false, DELETE: false },
    UserTask: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    ProjectTask: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    Activity: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Offer: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Contract: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
  },
  BUCH: {
    Customer: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Contact: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Location: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Opportunity: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Project: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Invoice: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Material: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Supplier: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    TimeEntry: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    User: { CREATE: false, READ: false, UPDATE: false, DELETE: false },
    UserTask: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    ProjectTask: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Activity: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Offer: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Contract: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
  },
  KALK: {
    Customer: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Contact: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Location: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Opportunity: { CREATE: false, READ: true, UPDATE: true, DELETE: false },
    Project: { CREATE: false, READ: true, UPDATE: true, DELETE: false },
    Invoice: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Material: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Supplier: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    TimeEntry: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    User: { CREATE: false, READ: false, UPDATE: false, DELETE: false },
    UserTask: { CREATE: true, READ: true, UPDATE: true, DELETE: true },
    ProjectTask: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Activity: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
    Offer: { CREATE: true, READ: true, UPDATE: true, DELETE: false },
    Contract: { CREATE: false, READ: true, UPDATE: false, DELETE: false },
  },
};

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionRequirement[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if any of the user's roles has the required permission
    for (const permission of requiredPermissions) {
      const hasPermission = this.checkPermission(
        user.roles,
        permission.entity,
        permission.action,
      );
      if (!hasPermission) {
        throw new ForbiddenException({
          type: 'https://api.kompass.de/errors/forbidden',
          title: 'Forbidden',
          status: 403,
          detail: `You do not have permission to ${permission.action} ${permission.entity}`,
          requiredPermission: `${permission.entity}.${permission.action}`,
          userRoles: user.roles,
        });
      }
    }

    return true;
  }

  private checkPermission(
    userRoles: string[],
    entity: string,
    action: string,
  ): boolean {
    for (const role of userRoles) {
      const rolePermissions = PERMISSION_MATRIX[role];
      if (rolePermissions?.[entity]?.[action]) {
        return true;
      }
    }
    return false;
  }
}
