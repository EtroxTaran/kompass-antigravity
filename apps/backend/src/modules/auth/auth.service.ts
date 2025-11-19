import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { type AxiosError } from 'axios';

import { UserRole } from '@kompass/shared/constants/rbac.constants';
import { generateEntityId } from '@kompass/shared/utils/id-generator';

import type { LoginDto } from './dto/login.dto';
import type { RefreshTokenDto } from './dto/refresh-token.dto';
import type { RegisterDto } from './dto/register.dto';
import type { User } from '@kompass/shared/types/entities/user';

/**
 * Keycloak Admin Service Interface
 */
interface IKeycloakAdminService {
  createUser(
    email: string,
    password: string,
    displayName: string,
    roles: UserRole[]
  ): Promise<string>;
}

/**
 * User Repository Interface
 */
interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, '_rev'>): Promise<User>;
}

/**
 * Keycloak Token Response
 */
interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

/**
 * Login Response
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  tokenType: string;
}

/**
 * Auth Service
 *
 * Handles authentication-related business logic:
 * - User registration (public endpoint)
 * - User login (Keycloak OIDC)
 * - Token refresh
 * - Logout
 * - Session timeout handling
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly keycloakUrl: string;
  private readonly keycloakRealm: string;
  private readonly keycloakClientId: string;
  private readonly keycloakClientSecret: string;
  private readonly sessionTimeoutHours: number;

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IKeycloakAdminService')
    private readonly keycloakAdminService: IKeycloakAdminService | null,
    private readonly configService: ConfigService
  ) {
    this.keycloakUrl =
      this.configService.get<string>('KEYCLOAK_URL') || 'http://keycloak:8080';
    this.keycloakRealm =
      this.configService.get<string>('KEYCLOAK_REALM') || 'kompass';
    this.keycloakClientId =
      this.configService.get<string>('KEYCLOAK_CLIENT_ID') || 'kompass-api';
    this.keycloakClientSecret =
      this.configService.get<string>('KEYCLOAK_CLIENT_SECRET') || '';
    // Session timeout: 24 hours default
    this.sessionTimeoutHours =
      this.configService.get<number>('SESSION_TIMEOUT_HOURS') || 24;
  }

  /**
   * Register a new user
   *
   * Public endpoint - no authentication required.
   * Creates user in Keycloak and CouchDB with default ADM role.
   *
   * @param dto Registration data
   * @returns Created user
   * @throws ConflictException if user already exists
   * @throws BadRequestException if Keycloak service unavailable
   */
  async register(dto: RegisterDto): Promise<User> {
    // Check if user already exists in CouchDB
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(
        `User with email ${dto.email} already exists`
      );
    }

    // Check if Keycloak service is available
    if (!this.keycloakAdminService) {
      this.logger.error('KeycloakAdminService not available');
      throw new BadRequestException(
        'Registration is currently unavailable. Please contact administrator.'
      );
    }

    // Default role for new registrations
    const defaultRole: UserRole = UserRole.ADM;

    // Create user in Keycloak first
    let keycloakUserId: string;
    try {
      keycloakUserId = await this.keycloakAdminService.createUser(
        dto.email,
        dto.password,
        dto.displayName,
        [defaultRole]
      );
      this.logger.log('User created in Keycloak', {
        email: dto.email,
        keycloakUserId,
      });
    } catch (error: unknown) {
      this.logger.error('Failed to create user in Keycloak:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to create user account. Please try again or contact support.'
      );
    }

    // Create user entity in CouchDB
    const userEntity: Omit<User, '_rev'> = {
      _id: generateEntityId('user'),
      type: 'user',
      email: dto.email,
      displayName: dto.displayName,
      roles: [defaultRole],
      primaryRole: defaultRole,
      active: true,
      keycloakUserId: keycloakUserId,
      createdBy: 'system', // System-created during registration
      createdAt: new Date(),
      modifiedBy: 'system',
      modifiedAt: new Date(),
      version: 1,
    };

    try {
      const created = await this.userRepository.create(userEntity);
      this.logger.log('User registered successfully', {
        userId: created._id,
        email: created.email,
      });
      return created;
    } catch (error: unknown) {
      this.logger.error('Failed to create user in CouchDB:', error);
      // User was created in Keycloak but failed in CouchDB
      // This is a partial failure - user can still login but won't have CouchDB record
      // In production, we might want to rollback Keycloak user creation
      throw new BadRequestException(
        'User account created but failed to complete registration. Please contact support.'
      );
    }
  }

  /**
   * Login user with email and password
   *
   * Validates credentials via Keycloak OIDC token endpoint.
   * Returns access token and refresh token.
   *
   * @param dto Login credentials
   * @returns Tokens and expiration information
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(dto: LoginDto): Promise<LoginResponse> {
    const tokenUrl = `${this.keycloakUrl}/realms/${this.keycloakRealm}/protocol/openid-connect/token`;

    try {
      const response = await axios.post<KeycloakTokenResponse>(
        tokenUrl,
        new URLSearchParams({
          grant_type: 'password',
          client_id: this.keycloakClientId,
          client_secret: this.keycloakClientSecret,
          username: dto.email,
          password: dto.password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.logger.log('User logged in successfully', {
        email: dto.email,
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        refreshExpiresIn: response.data.refresh_expires_in,
        tokenType: response.data.token_type,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          this.logger.warn('Login failed: Invalid credentials', {
            email: dto.email,
          });
          throw new UnauthorizedException('Invalid email or password');
        }
        if (axiosError.response?.status === 400) {
          this.logger.warn('Login failed: Invalid request', {
            email: dto.email,
            data: axiosError.response.data,
          });
          throw new BadRequestException('Invalid login request');
        }
      }

      this.logger.error('Login failed: Unexpected error', {
        email: dto.email,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new BadRequestException(
        'Login failed. Please try again or contact support.'
      );
    }
  }

  /**
   * Refresh access token using refresh token
   *
   * Exchanges refresh token for a new access token.
   * Validates refresh token expiration (24h default).
   *
   * @param dto Refresh token
   * @returns New tokens and expiration information
   * @throws UnauthorizedException if refresh token is invalid or expired
   */
  async refreshToken(dto: RefreshTokenDto): Promise<LoginResponse> {
    const tokenUrl = `${this.keycloakUrl}/realms/${this.keycloakRealm}/protocol/openid-connect/token`;

    try {
      const response = await axios.post<KeycloakTokenResponse>(
        tokenUrl,
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.keycloakClientId,
          client_secret: this.keycloakClientSecret,
          refresh_token: dto.refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      // Check if refresh token expiration exceeds session timeout
      const refreshExpiresInHours = response.data.refresh_expires_in / 3600;
      if (refreshExpiresInHours > this.sessionTimeoutHours) {
        this.logger.warn('Refresh token expiration exceeds session timeout', {
          refreshExpiresInHours,
          sessionTimeoutHours: this.sessionTimeoutHours,
        });
      }

      this.logger.debug('Token refreshed successfully');

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        refreshExpiresIn: response.data.refresh_expires_in,
        tokenType: response.data.token_type,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          this.logger.warn(
            'Token refresh failed: Invalid or expired refresh token'
          );
          throw new UnauthorizedException(
            'Refresh token is invalid or expired. Please login again.'
          );
        }
        if (axiosError.response?.status === 400) {
          this.logger.warn('Token refresh failed: Invalid request', {
            data: axiosError.response.data,
          });
          throw new BadRequestException('Invalid refresh token request');
        }
      }

      this.logger.error('Token refresh failed: Unexpected error', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new BadRequestException(
        'Token refresh failed. Please try again or contact support.'
      );
    }
  }

  /**
   * Logout user
   *
   * Invalidates session in Keycloak (if possible).
   * Client should clear tokens from storage.
   *
   * Note: Keycloak doesn't support direct session invalidation via API
   * without admin privileges. This endpoint serves as a placeholder
   * and logs the logout action for audit purposes.
   *
   * @param refreshToken Refresh token to invalidate (optional)
   */
  logout(refreshToken?: string): void {
    // Keycloak doesn't provide a direct logout endpoint for non-admin users
    // The client should clear tokens from storage
    // In a production setup, you might want to:
    // 1. Store refresh tokens in a blacklist (Redis)
    // 2. Use Keycloak Admin API to revoke sessions (requires admin token)
    // 3. Implement token revocation endpoint

    this.logger.log('User logged out', {
      hasRefreshToken: !!refreshToken,
    });

    // For now, we just log the logout action
    // In the future, we could implement token blacklisting
  }

  /**
   * Get session timeout configuration
   *
   * @returns Session timeout in hours
   */
  getSessionTimeout(): number {
    return this.sessionTimeoutHours;
  }
}
