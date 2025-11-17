/**
 * User Service
 *
 * Business logic for User management
 *
 * Responsibilities:
 * - Validate user data and business rules
 * - Check RBAC permissions (only GF/ADMIN can manage users)
 * - Orchestrate repository calls
 * - Sync with Keycloak (via KeycloakAdminService)
 * - Log audit trail
 *
 * Business Rules:
 * - Only GF and ADMIN roles can manage users
 * - User must have at least one role
 * - Primary role must be in roles array
 * - Email must be unique
 * - Password must meet security requirements (enforced by Keycloak)
 */

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  EntityType,
  hasPermission,
  Permission,
} from '@kompass/shared/constants/rbac.constants';
import { type PaginatedResponse } from '@kompass/shared/types/dtos/paginated-response.dto';
import { generateEntityId } from '@kompass/shared/utils/id-generator';
import {
  calculatePaginationMetadata,
  normalizePaginationOptions,
  normalizeSortOptions,
} from '@kompass/shared/utils/pagination.utils';

import { UserResponseDto } from './dto/user-response.dto';
import { IUserRepository } from './user.repository.interface';

import type { AssignRolesDto } from './dto/assign-roles.dto';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdatePrimaryRoleDto } from './dto/update-primary-role.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type {
  UserFilters,
  UserQueryOptions,
} from './user.repository.interface';
import type { UserRole } from '@kompass/shared/constants/rbac.constants';
import type { User } from '@kompass/shared/types/entities/user';

/**
 * Audit Service Interface (placeholder - will be implemented later)
 */
interface AuditLogEntry {
  entityType: string;
  entityId: string;
  action: string;
  oldValue: Record<string, unknown>;
  newValue: Record<string, unknown>;
  userId: string;
  timestamp: Date;
}

interface IAuditService {
  log(entry: AuditLogEntry): Promise<void>;
}

/**
 * Keycloak Admin Service Interface (will be implemented in Phase 4)
 */
interface IKeycloakAdminService {
  createUser(
    email: string,
    password: string,
    displayName: string,
    roles: UserRole[]
  ): Promise<string>; // Returns Keycloak user ID
  updateUser(
    keycloakUserId: string,
    email?: string,
    displayName?: string
  ): Promise<void>;
  assignRoles(keycloakUserId: string, roles: UserRole[]): Promise<void>;
  setPassword(keycloakUserId: string, password: string): Promise<void>;
  deleteUser(keycloakUserId: string): Promise<void>;
}

/**
 * User Service
 */
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IKeycloakAdminService')
    private readonly keycloakAdminService: IKeycloakAdminService | null,
    @Inject('IAuditService')
    private readonly auditService: IAuditService | null
  ) {}

  /**
   * Create a new user
   *
   * RBAC: Only GF and ADMIN can create users
   * Business rules: Email uniqueness, role validation
   */
  async create(dto: CreateUserDto, user: User): Promise<UserResponseDto> {
    // Check entity-level permission
    if (!hasPermission(user.primaryRole, EntityType.User, Permission.CREATE)) {
      throw new ForbiddenException(
        'You do not have permission to create users'
      );
    }

    // Validate primary role is in roles array
    if (!dto.roles.includes(dto.primaryRole)) {
      throw new BadRequestException(
        'Primary role must be included in roles array'
      );
    }

    // Check email uniqueness
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(
        `User with email ${dto.email} already exists`
      );
    }

    // Create user in Keycloak first (if service available)
    let keycloakUserId: string | undefined;
    if (this.keycloakAdminService) {
      try {
        keycloakUserId = await this.keycloakAdminService.createUser(
          dto.email,
          dto.password,
          dto.displayName,
          dto.roles
        );
        this.logger.log('User created in Keycloak', {
          email: dto.email,
          keycloakUserId,
        });
      } catch (error) {
        this.logger.error('Failed to create user in Keycloak:', error);
        throw new BadRequestException(
          'Failed to create user in Keycloak. Please check Keycloak configuration.'
        );
      }
    }

    // Create user entity in CouchDB
    const userEntity: Omit<User, '_rev'> = {
      _id: generateEntityId('user'),
      type: 'user',
      email: dto.email,
      displayName: dto.displayName,
      phoneNumber: dto.phoneNumber,
      roles: dto.roles,
      primaryRole: dto.primaryRole,
      active: dto.active ?? true,
      keycloakUserId: keycloakUserId,
      createdBy: user._id,
      createdAt: new Date(),
      modifiedBy: user._id,
      modifiedAt: new Date(),
      version: 1,
    };

    const created = await this.userRepository.create(userEntity);

    // Log audit trail
    if (this.auditService) {
      await this.auditService.log({
        entityType: 'User',
        entityId: created._id,
        action: 'CREATE',
        oldValue: {},
        newValue: {
          email: created.email,
          displayName: created.displayName,
          roles: created.roles,
        },
        userId: user._id,
        timestamp: new Date(),
      });
    }

    this.logger.log('User created', {
      userId: created._id,
      email: created.email,
      createdBy: user._id,
    });

    return this.mapToResponseDto(created);
  }

  /**
   * Find all users (with RBAC filtering, pagination, and sorting)
   *
   * RBAC: Only GF and ADMIN can view users
   *
   * @param user Current user (for RBAC checks)
   * @param filters Optional filters
   * @param page Optional page number (1-based, default: 1)
   * @param pageSize Optional page size (default: 20, max: 100)
   * @param sortBy Optional sort field (default: 'displayName')
   * @param sortOrder Optional sort order (default: 'asc')
   * @returns Paginated response with users and pagination metadata
   */
  async findAll(
    user: User,
    filters?: UserFilters,
    page?: number,
    pageSize?: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<PaginatedResponse<UserResponseDto>> {
    // Check entity-level permission
    if (!hasPermission(user.primaryRole, EntityType.User, Permission.READ)) {
      throw new ForbiddenException('You do not have permission to view users');
    }

    // Normalize pagination options
    const pagination = normalizePaginationOptions(page, pageSize);

    // Normalize sort options
    const allowedSortFields = [
      'displayName',
      'email',
      'createdAt',
      'modifiedAt',
      'primaryRole',
    ] as const;
    const sort = normalizeSortOptions(
      sortBy,
      sortOrder,
      allowedSortFields,
      'displayName',
      'asc'
    );

    // Build query options
    const queryOptions: UserQueryOptions = {
      filters,
      pagination,
      sort,
    };

    // Get users and total count
    const users = await this.userRepository.findAll(queryOptions);
    const total = await this.userRepository.count(filters);

    // Map to response DTOs
    const data = users.map((u) => this.mapToResponseDto(u));

    // Calculate pagination metadata
    const paginationMetadata = calculatePaginationMetadata(
      total,
      pagination.page,
      pagination.pageSize
    );

    return {
      data,
      pagination: paginationMetadata,
    };
  }

  /**
   * Find user by ID (with RBAC check)
   *
   * RBAC: Only GF and ADMIN can view users
   */
  async findById(id: string, user: User): Promise<UserResponseDto> {
    // Check entity-level permission
    if (!hasPermission(user.primaryRole, EntityType.User, Permission.READ)) {
      throw new ForbiddenException('You do not have permission to view users');
    }

    const userEntity = await this.userRepository.findById(id);

    if (!userEntity) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.mapToResponseDto(userEntity);
  }

  /**
   * Update user (with RBAC check and validation)
   *
   * RBAC: Only GF and ADMIN can update users
   */
  async update(
    id: string,
    dto: UpdateUserDto,
    user: User
  ): Promise<UserResponseDto> {
    // Check entity-level permission
    if (!hasPermission(user.primaryRole, EntityType.User, Permission.UPDATE)) {
      throw new ForbiddenException(
        'You do not have permission to update users'
      );
    }

    const existing = await this.userRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`User ${id} not found`);
    }

    // Check email uniqueness if email is being changed
    if (dto.email && dto.email !== existing.email) {
      const emailExists = await this.userRepository.findByEmail(dto.email);
      if (emailExists) {
        throw new ConflictException(
          `User with email ${dto.email} already exists`
        );
      }
    }

    // Update user in Keycloak (if service available)
    if (this.keycloakAdminService && existing.keycloakUserId) {
      try {
        await this.keycloakAdminService.updateUser(
          existing.keycloakUserId,
          dto.email,
          dto.displayName
        );
        this.logger.log('User updated in Keycloak', {
          userId: id,
          keycloakUserId: existing.keycloakUserId,
        });
      } catch (error) {
        this.logger.error('Failed to update user in Keycloak:', error);
        // Continue with CouchDB update even if Keycloak update fails
      }
    }

    // Prepare updates
    const updates: Partial<User> = {
      ...(dto.email && { email: dto.email }),
      ...(dto.displayName && { displayName: dto.displayName }),
      ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
      ...(dto.active !== undefined && { active: dto.active }),
      modifiedBy: user._id,
      modifiedAt: new Date(),
      version: existing.version + 1,
      _rev: existing._rev,
    };

    // Merge with existing user
    const updatedUser: User = {
      ...existing,
      ...updates,
    };

    // Update in repository
    const updated = await this.userRepository.update(updatedUser);

    // Log audit trail
    if (this.auditService) {
      await this.auditService.log({
        entityType: 'User',
        entityId: updated._id,
        action: 'UPDATE',
        oldValue: {
          email: existing.email,
          displayName: existing.displayName,
          active: existing.active,
        },
        newValue: {
          email: updated.email,
          displayName: updated.displayName,
          active: updated.active,
        },
        userId: user._id,
        timestamp: new Date(),
      });
    }

    this.logger.log('User updated', {
      userId: updated._id,
      updatedBy: user._id,
    });

    return this.mapToResponseDto(updated);
  }

  /**
   * Delete user (with RBAC check)
   *
   * RBAC: Only GF can delete users
   */
  async delete(id: string, user: User): Promise<void> {
    // Check entity-level permission
    if (!hasPermission(user.primaryRole, EntityType.User, Permission.DELETE)) {
      throw new ForbiddenException(
        'You do not have permission to delete users'
      );
    }

    const userEntity = await this.userRepository.findById(id);

    if (!userEntity) {
      throw new NotFoundException(`User ${id} not found`);
    }

    // Prevent self-deletion
    if (userEntity._id === user._id) {
      throw new BadRequestException('You cannot delete your own account');
    }

    // Delete user from Keycloak (if service available)
    if (this.keycloakAdminService && userEntity.keycloakUserId) {
      try {
        await this.keycloakAdminService.deleteUser(userEntity.keycloakUserId);
        this.logger.log('User deleted from Keycloak', {
          userId: id,
          keycloakUserId: userEntity.keycloakUserId,
        });
      } catch (error) {
        this.logger.error('Failed to delete user from Keycloak:', error);
        // Continue with CouchDB soft delete even if Keycloak delete fails
      }
    }

    // Soft delete in repository (sets active=false)
    await this.userRepository.delete(id);

    // Log audit trail
    if (this.auditService) {
      await this.auditService.log({
        entityType: 'User',
        entityId: id,
        action: 'DELETE',
        oldValue: {
          email: userEntity.email,
          displayName: userEntity.displayName,
        },
        newValue: {},
        userId: user._id,
        timestamp: new Date(),
      });
    }

    this.logger.log('User deleted', {
      userId: id,
      deletedBy: user._id,
    });
  }

  /**
   * Assign roles to user
   *
   * RBAC: Only GF and ADMIN can assign roles
   */
  async assignRoles(
    id: string,
    dto: AssignRolesDto,
    user: User
  ): Promise<UserResponseDto> {
    // Check entity-level permission
    if (!hasPermission(user.primaryRole, EntityType.User, Permission.UPDATE)) {
      throw new ForbiddenException(
        'You do not have permission to assign roles'
      );
    }

    const existing = await this.userRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`User ${id} not found`);
    }

    // Validate primary role is in roles array
    if (!dto.roles.includes(dto.primaryRole)) {
      throw new BadRequestException(
        'Primary role must be included in roles array'
      );
    }

    // Update roles in Keycloak (if service available)
    if (this.keycloakAdminService && existing.keycloakUserId) {
      try {
        await this.keycloakAdminService.assignRoles(
          existing.keycloakUserId,
          dto.roles
        );
        this.logger.log('Roles assigned in Keycloak', {
          userId: id,
          roles: dto.roles,
        });
      } catch (error) {
        this.logger.error('Failed to assign roles in Keycloak:', error);
        throw new BadRequestException(
          'Failed to assign roles in Keycloak. Please check Keycloak configuration.'
        );
      }
    }

    // Update user entity
    const updatedUser: User = {
      ...existing,
      roles: dto.roles,
      primaryRole: dto.primaryRole,
      modifiedBy: user._id,
      modifiedAt: new Date(),
      version: existing.version + 1,
      rolesAssignedBy: user._id,
      rolesAssignedAt: new Date(),
      roleChangeHistory: [
        ...(existing.roleChangeHistory || []),
        {
          timestamp: new Date(),
          changedBy: user._id,
          action: 'ASSIGN',
          role: dto.primaryRole,
          reason: dto.reason || `Roles assigned by ${user.displayName}`,
        },
      ],
    };

    const updated = await this.userRepository.update(updatedUser);

    // Log audit trail
    if (this.auditService) {
      await this.auditService.log({
        entityType: 'User',
        entityId: updated._id,
        action: 'ASSIGN_ROLES',
        oldValue: {
          roles: existing.roles,
          primaryRole: existing.primaryRole,
        },
        newValue: {
          roles: updated.roles,
          primaryRole: updated.primaryRole,
        },
        userId: user._id,
        timestamp: new Date(),
      });
    }

    this.logger.log('Roles assigned', {
      userId: updated._id,
      roles: dto.roles,
      primaryRole: dto.primaryRole,
      assignedBy: user._id,
    });

    return this.mapToResponseDto(updated);
  }

  /**
   * Revoke a role from user
   *
   * RBAC: Only GF and ADMIN can revoke roles
   * Business rules: Cannot remove last role, auto-update primary if removed
   */
  async revokeRole(
    id: string,
    roleToRevoke: UserRole,
    user: User
  ): Promise<UserResponseDto> {
    // Check entity-level permission
    if (!hasPermission(user.primaryRole, EntityType.User, Permission.UPDATE)) {
      throw new ForbiddenException(
        'You do not have permission to revoke roles'
      );
    }

    const existing = await this.userRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`User ${id} not found`);
    }

    // Check if user has the role to revoke
    if (!existing.roles.includes(roleToRevoke)) {
      throw new NotFoundException(
        `User does not have role ${roleToRevoke} assigned`
      );
    }

    // Prevent removing last role
    if (existing.roles.length === 1) {
      throw new BadRequestException(
        'Cannot remove last role. User must have at least one role.'
      );
    }

    // Remove role from array
    const updatedRoles = existing.roles.filter((r) => r !== roleToRevoke);

    // If removing primary role, set new primary from remaining roles
    let newPrimaryRole = existing.primaryRole;
    if (existing.primaryRole === roleToRevoke) {
      const fallbackRole = updatedRoles[0] ?? existing.roles[0];
      if (!fallbackRole) {
        throw new BadRequestException(
          'Cannot revoke the last role. User must have at least one role.'
        );
      }
      newPrimaryRole = fallbackRole;
      this.logger.log('Primary role removed, auto-setting new primary', {
        userId: id,
        oldPrimary: roleToRevoke,
        newPrimary: newPrimaryRole,
      });
    }

    // Update roles in Keycloak (if service available)
    if (this.keycloakAdminService && existing.keycloakUserId) {
      try {
        await this.keycloakAdminService.assignRoles(
          existing.keycloakUserId,
          updatedRoles
        );
        this.logger.log('Roles updated in Keycloak', {
          userId: id,
          roles: updatedRoles,
        });
      } catch (error) {
        this.logger.error('Failed to update roles in Keycloak:', error);
        throw new BadRequestException(
          'Failed to update roles in Keycloak. Please check Keycloak configuration.'
        );
      }
    }

    // Update user entity
    const updatedUser: User = {
      ...existing,
      roles: updatedRoles,
      primaryRole: newPrimaryRole,
      modifiedBy: user._id,
      modifiedAt: new Date(),
      version: existing.version + 1,
      roleChangeHistory: [
        ...(existing.roleChangeHistory || []),
        {
          timestamp: new Date(),
          changedBy: user._id,
          action: 'REVOKE',
          role: roleToRevoke,
          reason: `Role revoked by ${user.displayName}`,
        },
      ],
    };

    const updated = await this.userRepository.update(updatedUser);

    // Log audit trail
    if (this.auditService) {
      await this.auditService.log({
        entityType: 'User',
        entityId: updated._id,
        action: 'REVOKE_ROLE',
        oldValue: {
          roles: existing.roles,
          primaryRole: existing.primaryRole,
        },
        newValue: {
          roles: updated.roles,
          primaryRole: updated.primaryRole,
        },
        userId: user._id,
        timestamp: new Date(),
      });
    }

    this.logger.log('Role revoked', {
      userId: updated._id,
      revokedRole: roleToRevoke,
      remainingRoles: updatedRoles,
      newPrimaryRole,
      revokedBy: user._id,
    });

    return this.mapToResponseDto(updated);
  }

  /**
   * Update user's primary role
   *
   * RBAC: Only GF and ADMIN can update primary role
   */
  async updatePrimaryRole(
    id: string,
    dto: UpdatePrimaryRoleDto,
    user: User
  ): Promise<UserResponseDto> {
    // Check entity-level permission
    if (!hasPermission(user.primaryRole, EntityType.User, Permission.UPDATE)) {
      throw new ForbiddenException(
        'You do not have permission to update primary role'
      );
    }

    const existing = await this.userRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`User ${id} not found`);
    }

    // Validate primary role is in user's roles array
    if (!existing.roles.includes(dto.primaryRole)) {
      throw new BadRequestException(
        `Primary role ${dto.primaryRole} must be in user's roles array`
      );
    }

    // Update user entity
    const updatedUser: User = {
      ...existing,
      primaryRole: dto.primaryRole,
      modifiedBy: user._id,
      modifiedAt: new Date(),
      version: existing.version + 1,
      roleChangeHistory: [
        ...(existing.roleChangeHistory || []),
        {
          timestamp: new Date(),
          changedBy: user._id,
          action: 'PRIMARY_CHANGED',
          role: dto.primaryRole,
          reason: dto.reason || `Primary role changed by ${user.displayName}`,
        },
      ],
    };

    const updated = await this.userRepository.update(updatedUser);

    // Log audit trail
    if (this.auditService) {
      await this.auditService.log({
        entityType: 'User',
        entityId: updated._id,
        action: 'UPDATE_PRIMARY_ROLE',
        oldValue: {
          primaryRole: existing.primaryRole,
        },
        newValue: {
          primaryRole: updated.primaryRole,
        },
        userId: user._id,
        timestamp: new Date(),
      });
    }

    this.logger.log('Primary role updated', {
      userId: updated._id,
      oldPrimaryRole: existing.primaryRole,
      newPrimaryRole: dto.primaryRole,
      updatedBy: user._id,
    });

    return this.mapToResponseDto(updated);
  }

  /**
   * Map User entity to UserResponseDto
   */
  private mapToResponseDto(user: User): UserResponseDto {
    const dto = new UserResponseDto();

    dto._id = user._id;
    dto.type = user.type;
    dto.email = user.email;
    dto.displayName = user.displayName;
    dto.phoneNumber = user.phoneNumber;
    dto.roles = user.roles;
    dto.primaryRole = user.primaryRole;
    dto.active = user.active;
    dto.createdBy = user.createdBy;
    dto.createdAt = user.createdAt;
    dto.modifiedBy = user.modifiedBy;
    dto.modifiedAt = user.modifiedAt;
    dto.version = user.version;

    return dto;
  }
}
