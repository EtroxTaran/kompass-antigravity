import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

import { UserRole } from '@kompass/shared/constants/rbac.constants';
import { User } from '@kompass/shared/types/entities/user';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';

import { AssignRolesDto } from './dto/assign-roles.dto';
import { UpdatePrimaryRoleDto } from './dto/update-primary-role.dto';

/**
 * User Roles Management Controller
 *
 * Handles user role assignment, primary role updates, and role revocation.
 * Only GF and ADMIN roles can manage user roles.
 *
 * TODO: Implement user roles service
 * TODO: Add validation that primaryRole is in roles array
 * TODO: Add audit logging for role changes
 * TODO: Add notification system for role changes
 *
 * @see docs/specifications/reviews/API_SPECIFICATION.md#user-role-management-endpoints
 */
@Controller('api/v1/users/:userId/roles')
@ApiTags('User Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
export class UserRolesController {
  // TODO: Inject UserRolesService when created
  // constructor(private readonly userRolesService: UserRolesService) {}

  /**
   * GET /api/v1/users/:userId/roles
   * Retrieve current roles for a user
   *
   * TODO: Implement role retrieval
   */
  @Get()
  @RequirePermission('User', 'READ')
  @ApiOperation({ summary: 'Get user roles' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User roles retrieved' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserRoles(
    @Param('userId') _userId: string,
    @CurrentUser() _user: User
  ): Promise<{ roles: UserRole[]; primaryRole: UserRole }> {
    // TODO: Implement user roles retrieval
    // TODO: Verify requesting user has permission (GF/ADMIN or self)
    throw new Error('Not implemented');
  }

  /**
   * PUT /api/v1/users/:userId/roles
   * Assign multiple roles to a user and set primary role
   *
   * TODO: Implement role assignment with validation
   * TODO: Verify primaryRole is in roles array
   * TODO: Add audit logging
   */
  @Put()
  @RequirePermission('User', 'UPDATE')
  @ApiOperation({ summary: 'Assign roles to user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Roles assigned successfully' })
  @ApiResponse({ status: 400, description: 'Invalid role assignment' })
  @ApiResponse({ status: 403, description: 'Forbidden - GF or ADMIN only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  assignRoles(
    @Param('userId') _userId: string,
    @Body() _dto: AssignRolesDto,
    @CurrentUser() _user: User
  ): Promise<User> {
    // TODO: Verify requesting user is GF or ADMIN
    // TODO: Validate primaryRole is in roles array
    // TODO: Assign roles to user
    // TODO: Log role change in user.roleChangeHistory
    // TODO: Send notification to user about role change
    throw new Error('Not implemented');
  }

  /**
   * DELETE /api/v1/users/:userId/roles/:roleId
   * Revoke a specific role from a user
   *
   * TODO: Implement role revocation
   * TODO: Prevent removing last role
   * TODO: Auto-update primaryRole if removed
   */
  @Delete(':roleId')
  @RequirePermission('User', 'UPDATE')
  @ApiOperation({ summary: 'Revoke role from user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'roleId', description: 'Role to revoke', enum: UserRole })
  @ApiResponse({ status: 200, description: 'Role revoked successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot remove last role or primary role',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - GF or ADMIN only' })
  @ApiResponse({
    status: 404,
    description: 'User not found or role not assigned',
  })
  revokeRole(
    @Param('userId') _userId: string,
    @Param('roleId') _roleId: UserRole,
    @CurrentUser() _user: User
  ): Promise<User> {
    // TODO: Verify requesting user is GF or ADMIN
    // TODO: Verify user has the role to revoke
    // TODO: Prevent removing last role (user must have at least one)
    // TODO: If removing primaryRole, auto-set new primary from remaining roles
    // TODO: Remove role from user.roles array
    // TODO: Log role change in user.roleChangeHistory
    // TODO: Send notification to user about role revocation
    throw new Error('Not implemented');
  }

  /**
   * PUT /api/v1/users/:userId/primary-role
   * Update user's primary role
   *
   * TODO: Implement primary role update
   * TODO: Validate new primary role is in user.roles array
   */
  @Put('../primary-role')
  @RequirePermission('User', 'UPDATE')
  @ApiOperation({ summary: 'Update user primary role' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Primary role updated' })
  @ApiResponse({
    status: 400,
    description: 'Primary role not in assigned roles',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - GF or ADMIN only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updatePrimaryRole(
    @Param('userId') _userId: string,
    @Body() _dto: UpdatePrimaryRoleDto,
    @CurrentUser() _user: User
  ): Promise<User> {
    // TODO: Verify requesting user is GF or ADMIN
    // TODO: Verify new primary role is in user.roles array
    // TODO: Update user.primaryRole
    // TODO: Log role change in user.roleChangeHistory
    // TODO: Send notification to user about primary role change
    throw new Error('Not implemented');
  }
}
