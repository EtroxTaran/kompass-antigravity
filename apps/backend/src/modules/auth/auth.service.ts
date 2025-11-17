import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { UserRole } from '@kompass/shared/constants/rbac.constants';
import { generateEntityId } from '@kompass/shared/utils/id-generator';

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
 * Auth Service
 *
 * Handles authentication-related business logic:
 * - User registration (public endpoint)
 * - Token management
 * - User authentication
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IKeycloakAdminService')
    private readonly keycloakAdminService: IKeycloakAdminService | null
  ) {}

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
}
