import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  EntityType,
  Permission,
  UserRole,
} from '@kompass/shared/constants/rbac.constants';
import { User } from '@kompass/shared/types/entities/user';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';

import { AssignRolesDto } from './dto/assign-roles.dto';
import { UpdatePrimaryRoleDto } from './dto/update-primary-role.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

/**
 * User Roles Management Controller
 *
 * Handles user role assignment, primary role updates, and role revocation.
 * Only GF and ADMIN roles can manage user roles.
 *
 * Uses nested routes: /api/v1/users/:userId/roles
 *
 * @see docs/specifications/reviews/API_SPECIFICATION.md#user-role-management-endpoints
 */
@Controller('api/v1/users/:userId/roles')
@ApiTags('User Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
export class UserRolesController {
  constructor(private readonly userService: UserService) {}

  /**
   * GET /api/v1/users/:userId/roles
   * Retrieve current roles for a user
   */
  @Get()
  @RequirePermission(EntityType.User, Permission.READ)
  @ApiOperation({ summary: 'Get user roles' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User roles retrieved',
    schema: {
      type: 'object',
      properties: {
        roles: {
          type: 'array',
          items: { enum: Object.values(UserRole) },
        },
        primaryRole: { enum: Object.values(UserRole) },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async getUserRoles(
    @Param('userId') userId: string,
    @CurrentUser() user: User
  ): Promise<{ roles: UserRole[]; primaryRole: UserRole }> {
    const userEntity = await this.userService.findById(userId, user);
    return {
      roles: userEntity.roles,
      primaryRole: userEntity.primaryRole,
    };
  }

  /**
   * PUT /api/v1/users/:userId/roles
   * Assign multiple roles to a user and set primary role
   */
  @Put()
  @RequirePermission(EntityType.User, Permission.UPDATE)
  @ApiOperation({ summary: 'Assign roles to user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Roles assigned successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid role assignment' })
  @ApiResponse({ status: 403, description: 'Forbidden - GF or ADMIN only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async assignRoles(
    @Param('userId') userId: string,
    @Body() dto: AssignRolesDto,
    @CurrentUser() user: User
  ): Promise<UserResponseDto> {
    return this.userService.assignRoles(userId, dto, user);
  }

  /**
   * DELETE /api/v1/users/:userId/roles/:roleId
   * Revoke a specific role from a user
   */
  @Delete(':roleId')
  @RequirePermission(EntityType.User, Permission.UPDATE)
  @ApiOperation({ summary: 'Revoke role from user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'roleId', description: 'Role to revoke', enum: UserRole })
  @ApiResponse({
    status: 200,
    description: 'Role revoked successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot remove last role',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - GF or ADMIN only' })
  @ApiResponse({
    status: 404,
    description: 'User not found or role not assigned',
  })
  async revokeRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: UserRole,
    @CurrentUser() user: User
  ): Promise<UserResponseDto> {
    return this.userService.revokeRole(userId, roleId, user);
  }

  /**
   * PUT /api/v1/users/:userId/primary-role
   * Update user's primary role
   */
  @Put('../primary-role')
  @RequirePermission(EntityType.User, Permission.UPDATE)
  @ApiOperation({ summary: 'Update user primary role' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Primary role updated',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Primary role not in assigned roles',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - GF or ADMIN only' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updatePrimaryRole(
    @Param('userId') userId: string,
    @Body() dto: UpdatePrimaryRoleDto,
    @CurrentUser() user: User
  ): Promise<UserResponseDto> {
    return this.userService.updatePrimaryRole(userId, dto, user);
  }
}
