import { SetMetadata } from '@nestjs/common';
import { EntityType, Permission } from '@kompass/shared/constants/rbac.constants';

/**
 * Metadata key for permission requirements
 */
export const PERMISSION_KEY = 'required_permission';

/**
 * Decorator to specify required permission for an endpoint
 * 
 * Usage:
 * ```typescript
 * @RequirePermission('Customer', 'READ')
 * async findOne(@Param('id') id: string) {
 *   // Endpoint implementation
 * }
 * ```
 * 
 * @param entity - Entity type to check permission for
 * @param action - Permission action required
 * @returns Method decorator
 * 
 * @see RbacGuard - Guard that enforces these permissions
 * @see docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md
 */
export const RequirePermission = (entity: EntityType | string, action: Permission | string) =>
  SetMetadata(PERMISSION_KEY, { entity, action });

