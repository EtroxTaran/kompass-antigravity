import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';

/**
 * Role Management Module
 * 
 * Handles database-driven role configuration and permission matrix management.
 * 
 * TODO: Implement database-driven RBAC configuration
 * TODO: Add permission matrix versioning and activation
 * TODO: Implement role assignment audit logging
 * 
 * @see docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md
 * @see docs/specifications/reviews/API_SPECIFICATION.md#role-configuration-endpoints
 */
@Module({
  controllers: [RoleController],
  providers: [
    RoleService,
    RoleRepository,
    {
      provide: 'IRoleRepository',
      useClass: RoleRepository,
    },
  ],
  exports: [RoleService],
})
export class RoleModule {}

