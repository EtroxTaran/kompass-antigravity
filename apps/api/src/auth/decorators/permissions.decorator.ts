import { SetMetadata } from '@nestjs/common';

export interface PermissionRequirement {
  entity: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
}

export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator to require specific permissions for a route.
 * @example @Permissions({ entity: 'Customer', action: 'CREATE' })
 */
export const Permissions = (...permissions: PermissionRequirement[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
