import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { KeycloakAdminService } from './keycloak-admin.service';
import { UserRolesController } from './user-roles.controller';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

/**
 * User Management Module
 *
 * Handles user profile management and role assignment.
 *
 * @see docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md#user-entity
 * @see docs/specifications/reviews/API_SPECIFICATION.md#user-role-management-endpoints
 */
@Module({
  imports: [ConfigModule],
  controllers: [UserController, UserRolesController],
  providers: [
    UserService,
    UserRepository,
    KeycloakAdminService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IKeycloakAdminService',
      useClass: KeycloakAdminService,
    },
    // TODO: Add AuditService when implemented
    {
      provide: 'IAuditService',
      useValue: null, // Placeholder - will be implemented later
    },
  ],
  exports: [
    UserService,
    // Export providers so other modules can inject them
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IKeycloakAdminService',
      useClass: KeycloakAdminService,
    },
  ],
})
export class UserModule {}
