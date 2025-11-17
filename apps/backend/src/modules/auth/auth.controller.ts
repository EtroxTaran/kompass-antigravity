import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

import type { User } from '@kompass/shared/types/entities/user';

/**
 * Authentication Controller
 *
 * Provides endpoints for authentication-related operations.
 */
@Controller('auth')
@ApiTags('Authentication')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AuthController {
  /**
   * Get current user information
   *
   * Returns the authenticated user's information extracted from the JWT token.
   * Useful for frontend to get user details and roles.
   *
   * @param user - Current authenticated user (from JWT token)
   * @returns User object with roles and profile information
   */
  @Get('me')
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'Current user information',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: 'user-abc123' },
        type: { type: 'string', example: 'user' },
        email: { type: 'string', example: 'user@example.com' },
        displayName: { type: 'string', example: 'John Doe' },
        roles: {
          type: 'array',
          items: { type: 'string' },
          example: ['ADM', 'PLAN'],
        },
        primaryRole: { type: 'string', example: 'ADM' },
        active: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  getCurrentUser(@CurrentUser() user: User): User {
    return user;
  }
}
