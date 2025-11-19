import { BadRequestException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { UserRole } from '@kompass/shared/constants/rbac.constants';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

import type { RegisterDto } from '../dto/register.dto';
import type { User } from '@kompass/shared/types/entities/user';
import type { TestingModule } from '@nestjs/testing';

/**
 * Mock User Repository
 */
const mockUserRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

/**
 * Mock Keycloak Admin Service
 */
const mockKeycloakAdminService = {
  createUser: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string, defaultValue?: string) => {
        const config: Record<string, string> = {
          KEYCLOAK_URL: 'http://keycloak:8080',
          KEYCLOAK_REALM: 'kompass',
          KEYCLOAK_CLIENT_ID: 'kompass-api',
          KEYCLOAK_CLIENT_SECRET: 'secret',
        };
        return config[key] || defaultValue;
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: 'IKeycloakAdminService',
          useValue: mockKeycloakAdminService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validRegisterDto: RegisterDto = {
      email: 'test@example.com',
      displayName: 'Test User',
      password: 'SecurePassword123!',
    };

    const mockCreatedUser: User = {
      _id: 'user-123',
      _rev: '1-abc',
      type: 'user',
      email: 'test@example.com',
      displayName: 'Test User',
      roles: [UserRole.ADM],
      primaryRole: UserRole.ADM,
      active: true,
      keycloakUserId: 'keycloak-user-123',
      createdBy: 'system',
      createdAt: new Date(),
      modifiedBy: 'system',
      modifiedAt: new Date(),
      version: 1,
    };

    it('should register a new user successfully', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockKeycloakAdminService.createUser.mockResolvedValue(
        'keycloak-user-123'
      );
      mockUserRepository.create.mockResolvedValue(mockCreatedUser);

      // Act
      const result = await controller.register(validRegisterDto);

      // Assert
      expect(result).toMatchObject({
        _id: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        roles: [UserRole.ADM],
        primaryRole: UserRole.ADM,
        active: true,
      });
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
      expect(mockKeycloakAdminService.createUser).toHaveBeenCalledWith(
        'test@example.com',
        'SecurePassword123!',
        'Test User',
        [UserRole.ADM]
      );
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(mockCreatedUser);

      // Act & Assert
      await expect(controller.register(validRegisterDto)).rejects.toThrow(
        ConflictException
      );
      await expect(controller.register(validRegisterDto)).rejects.toThrow(
        'User with email test@example.com already exists'
      );
      expect(mockKeycloakAdminService.createUser).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if Keycloak service is unavailable', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);
      const testMockConfigService = {
        get: jest.fn((key: string, defaultValue?: string) => {
          const config: Record<string, string> = {
            KEYCLOAK_URL: 'http://keycloak:8080',
            KEYCLOAK_REALM: 'kompass',
            KEYCLOAK_CLIENT_ID: 'kompass-api',
            KEYCLOAK_CLIENT_SECRET: 'secret',
          };
          return config[key] || defaultValue;
        }),
      } as any;

      const authServiceWithoutKeycloak = new AuthService(
        mockUserRepository as any,
        null, // No Keycloak service
        testMockConfigService
      );
      const controllerWithoutKeycloak = new AuthController(
        authServiceWithoutKeycloak
      );

      // Act & Assert
      await expect(
        controllerWithoutKeycloak.register(validRegisterDto)
      ).rejects.toThrow(BadRequestException);
      await expect(
        controllerWithoutKeycloak.register(validRegisterDto)
      ).rejects.toThrow('Registration is currently unavailable');
    });

    it('should throw BadRequestException if Keycloak user creation fails', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockKeycloakAdminService.createUser.mockRejectedValue(
        new Error('Keycloak error')
      );

      // Act & Assert
      await expect(controller.register(validRegisterDto)).rejects.toThrow(
        BadRequestException
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should not include password in response', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockKeycloakAdminService.createUser.mockResolvedValue(
        'keycloak-user-123'
      );
      mockUserRepository.create.mockResolvedValue(mockCreatedUser);

      // Act
      const result = await controller.register(validRegisterDto);

      // Assert
      expect(result).not.toHaveProperty('password');
      expect((result as any).password).toBeUndefined();
    });
  });

  describe('getCurrentUser', () => {
    const mockUser: User = {
      _id: 'user-123',
      _rev: '1-abc',
      type: 'user',
      email: 'test@example.com',
      displayName: 'Test User',
      roles: [UserRole.ADM],
      primaryRole: UserRole.ADM,
      active: true,
      createdBy: 'system',
      createdAt: new Date(),
      modifiedBy: 'system',
      modifiedAt: new Date(),
      version: 1,
    };

    it('should return current user', () => {
      // Act
      const result = controller.getCurrentUser(mockUser);

      // Assert
      expect(result).toEqual(mockUser);
    });
  });
});
