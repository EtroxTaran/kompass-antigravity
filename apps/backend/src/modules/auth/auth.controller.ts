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
import { Throttle } from '@nestjs/throttler';

import { User } from '@kompass/shared/types/entities/user';

import { AuthService, type LoginResponse } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
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

  /**
   * Login user
   *
   * Authenticates user with email and password via Keycloak.
   * Returns JWT access token and refresh token.
   *
   * Rate limited to 10 requests per minute to prevent brute force attacks.
   *
   * @param dto Login credentials
   * @returns Access token, refresh token, and expiration information
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        expiresIn: { type: 'number', example: 300 },
        refreshExpiresIn: { type: 'number', example: 86400 },
        tokenType: { type: 'string', example: 'Bearer' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many login attempts',
  })
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  /**
   * Refresh access token
   *
   * Exchanges refresh token for a new access token.
   * Used to maintain user session without requiring re-authentication.
   *
   * @param dto Refresh token
   * @returns New access token, refresh token, and expiration information
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        expiresIn: { type: 'number', example: 300 },
        refreshExpiresIn: { type: 'number', example: 86400 },
        tokenType: { type: 'string', example: 'Bearer' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
  })
  async refresh(@Body() dto: RefreshTokenDto): Promise<LoginResponse> {
    return this.authService.refreshToken(dto);
  }

  /**
   * Logout user
   *
   * Invalidates user session.
   * Client should clear tokens from storage after calling this endpoint.
   *
   * @param dto Refresh token (optional, for future token blacklisting)
   */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          description: 'Refresh token to invalidate (optional)',
        },
      },
    },
    required: false,
  })
  @ApiResponse({
    status: 204,
    description: 'Logout successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async logout(@Body() dto?: { refreshToken?: string }): Promise<void> {
    return this.authService.logout(dto?.refreshToken);
  }
}
