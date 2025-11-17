/**
 * User Controller
 *
 * HTTP endpoints for User management
 *
 * All endpoints require authentication and RBAC permissions.
 * Only GF and ADMIN roles can manage users.
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  EntityType,
  Permission,
} from '@kompass/shared/constants/rbac.constants';
import { type PaginatedResponse } from '@kompass/shared/types/dtos/paginated-response.dto';
import { User } from '@kompass/shared/types/entities/user';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';

import { AssignRolesDto } from './dto/assign-roles.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePrimaryRoleDto } from './dto/update-primary-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

import type { UserFilters } from './user.repository.interface';
import type { UserRole } from '@kompass/shared/constants/rbac.constants';

/**
 * User Controller
 */
@Controller('api/v1/users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user
   *
   * RBAC: Only GF and ADMIN can create users
   */
  @Post()
  @RequirePermission(EntityType.User, Permission.CREATE)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or business rule violation',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - user with email already exists',
  })
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: User
  ): Promise<UserResponseDto> {
    return this.userService.create(dto, user);
  }

  /**
   * Get all users
   *
   * RBAC: Only GF and ADMIN can view users
   */
  @Get()
  @RequirePermission(EntityType.User, Permission.READ)
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Filter by email (exact match)',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filter by role',
    enum: ['ADM', 'INNEN', 'PLAN', 'KALK', 'BUCH', 'GF', 'ADMIN'],
  })
  @ApiQuery({
    name: 'active',
    required: false,
    description: 'Filter by active status',
    type: Boolean,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by display name or email (partial match)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-based)',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 20, max: 100)',
    example: 20,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['displayName', 'email', 'createdAt', 'modifiedAt', 'primaryRole'],
    description: 'Field to sort by (default: displayName)',
    example: 'displayName',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort direction (default: asc)',
    example: 'asc',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/UserResponseDto' },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            pageSize: { type: 'number', example: 20 },
            total: { type: 'number', example: 50 },
            totalPages: { type: 'number', example: 3 },
            hasNextPage: { type: 'boolean', example: true },
            hasPreviousPage: { type: 'boolean', example: false },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async findAll(
    @Query('email') email?: string,
    @Query('role') role?: string,
    @Query('active') active?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @CurrentUser() user?: User
  ): Promise<PaginatedResponse<UserResponseDto>> {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const filters: UserFilters = {
      ...(email && { email }),
      ...(role && { role: role as UserRole }),
      ...(active !== undefined && { active: active === 'true' }),
      ...(search && { search }),
    };

    // Parse and validate pagination parameters
    const pageNumber = page ? Math.max(1, Number(page)) : undefined;
    const pageSizeNumber = pageSize
      ? Math.min(100, Math.max(1, Number(pageSize)))
      : undefined;

    // Call service with pagination and sorting
    return this.userService.findAll(
      user,
      filters,
      pageNumber,
      pageSizeNumber,
      sortBy,
      sortOrder
    );
  }

  /**
   * Get user by ID
   *
   * RBAC: Only GF and ADMIN can view users
   */
  @Get(':id')
  @RequirePermission(EntityType.User, Permission.READ)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<UserResponseDto> {
    return this.userService.findById(id, user);
  }

  /**
   * Update user
   *
   * RBAC: Only GF and ADMIN can update users
   */
  @Put(':id')
  @RequirePermission(EntityType.User, Permission.UPDATE)
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - user with email already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: User
  ): Promise<UserResponseDto> {
    return this.userService.update(id, dto, user);
  }

  /**
   * Delete user (soft delete)
   *
   * RBAC: Only GF can delete users
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(EntityType.User, Permission.DELETE)
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - cannot delete own account',
  })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<void> {
    return this.userService.delete(id, user);
  }

  /**
   * Assign roles to user
   *
   * RBAC: Only GF and ADMIN can assign roles
   */
  @Put(':id/roles')
  @RequirePermission(EntityType.User, Permission.UPDATE)
  @ApiOperation({ summary: 'Assign roles to user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Roles assigned successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error - primary role must be in roles array',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async assignRoles(
    @Param('id') id: string,
    @Body() dto: AssignRolesDto,
    @CurrentUser() user: User
  ): Promise<UserResponseDto> {
    return this.userService.assignRoles(id, dto, user);
  }

  /**
   * Update user's primary role
   *
   * RBAC: Only GF and ADMIN can update primary role
   */
  @Put(':id/primary-role')
  @RequirePermission(EntityType.User, Permission.UPDATE)
  @ApiOperation({ summary: 'Update user primary role' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Primary role updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error - primary role must be in roles array',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async updatePrimaryRole(
    @Param('id') id: string,
    @Body() dto: UpdatePrimaryRoleDto,
    @CurrentUser() user: User
  ): Promise<UserResponseDto> {
    return this.userService.updatePrimaryRole(id, dto, user);
  }
}
