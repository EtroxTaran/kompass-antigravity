import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { User } from '@kompass/shared/types/entities/user';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * Authentication Controller
 *
 * Provides endpoints for authentication-related operations.
 * Some endpoints are public (registration), others require authentication.
 */
@Controller('api/v1/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   *
   * Public endpoint - no authentication required.
   * Creates user in Keycloak and CouchDB with default ADM role.
   *
   * @param dto Registration data
   * @returns Created user (without sensitive information)
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: 'user-abc123' },
        type: { type: 'string', example: 'user' },
        email: { type: 'string', example: 'user@example.com' },
        displayName: { type: 'string', example: 'Max Mustermann' },
        roles: {
          type: 'array',
          items: { type: 'string' },
          example: ['ADM'],
        },
        primaryRole: { type: 'string', example: 'ADM' },
        active: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or registration failed',
  })
  @ApiResponse({
    status: 409,
    description: 'User with email already exists',
  })
  async register(@Body() dto: RegisterDto): Promise<Omit<User, 'password'>> {
    const user = await this.authService.register(dto);
    // Return user without sensitive fields
    const { password: _, ...userResponse } = user as User & {
      password?: string;
    };
    return userResponse;
  }

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
