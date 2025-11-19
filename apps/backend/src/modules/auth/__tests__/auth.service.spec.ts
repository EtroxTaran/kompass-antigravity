import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import axios, { type AxiosError } from 'axios';

import { UserRole } from '@kompass/shared/constants/rbac.constants';

import { AuthService } from '../auth.service';

import type { LoginDto } from '../dto/login.dto';
import type { RefreshTokenDto } from '../dto/refresh-token.dto';
import type { RegisterDto } from '../dto/register.dto';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.isAxiosError to properly detect AxiosError
Object.defineProperty(axios, 'isAxiosError', {
  value: jest.fn((error: unknown) => {
    return (
      error &&
      typeof error === 'object' &&
      'isAxiosError' in error &&
      (error as any).isAxiosError === true
    );
  }),
  writable: true,
});

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository: any;
  let mockKeycloakAdminService: any;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    // Mock UserRepository
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    // Mock KeycloakAdminService
    mockKeycloakAdminService = {
      createUser: jest.fn(),
    };

    // Mock ConfigService
    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        const config: Record<string, any> = {
          KEYCLOAK_URL: 'http://keycloak:8080',
          KEYCLOAK_REALM: 'kompass',
          KEYCLOAK_CLIENT_ID: 'kompass-api',
          SESSION_TIMEOUT_HOURS: 24,
        };
        return config[key] || defaultValue;
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'SecurePassword123!',
      displayName: 'Test User',
    };

    it('should register a new user successfully', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockKeycloakAdminService.createUser.mockResolvedValue(
        'keycloak-user-123'
      );
      mockUserRepository.create.mockResolvedValue({
        _id: 'user-123',
        email: registerDto.email,
        displayName: registerDto.displayName,
        roles: [UserRole.ADM],
        primaryRole: UserRole.ADM,
        active: true,
      });

      const result = await service.register(registerDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(registerDto.email);
      expect(mockKeycloakAdminService.createUser).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.displayName,
        [UserRole.ADM]
      );
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        _id: 'user-123',
        email: registerDto.email,
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException
      );
      expect(mockKeycloakAdminService.createUser).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if KeycloakAdminService is unavailable', async () => {
      const serviceWithoutKeycloak = new AuthService(
        mockUserRepository,
        null,
        mockConfigService
      );

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        serviceWithoutKeycloak.register(registerDto)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'SecurePassword123!',
    };

    it('should login user successfully', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'access-token-123',
          refresh_token: 'refresh-token-123',
          expires_in: 300,
          refresh_expires_in: 86400,
          token_type: 'Bearer',
          'not-before-policy': 0,
          session_state: 'session-123',
          scope: 'openid profile email',
        },
      };

      mockedAxios.post.mockResolvedValue(mockTokenResponse);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123',
        expiresIn: 300,
        refreshExpiresIn: 86400,
        tokenType: 'Bearer',
      });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/protocol/openid-connect/token'),
        expect.any(URLSearchParams),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const axiosError = new Error('Request failed') as AxiosError;
      axiosError.isAxiosError = true;
      axiosError.response = {
        status: 401,
        data: { error: 'invalid_grant' },
      } as any;

      mockedAxios.post.mockRejectedValue(axiosError);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw BadRequestException for invalid request', async () => {
      const axiosError = new Error('Request failed') as AxiosError;
      axiosError.isAxiosError = true;
      axiosError.response = {
        status: 400,
        data: { error: 'invalid_request' },
      } as any;

      mockedAxios.post.mockRejectedValue(axiosError);

      await expect(service.login(loginDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('refreshToken', () => {
    const refreshTokenDto: RefreshTokenDto = {
      refreshToken: 'refresh-token-123',
    };

    it('should refresh token successfully', async () => {
      const mockTokenResponse = {
        data: {
          access_token: 'new-access-token-123',
          refresh_token: 'new-refresh-token-123',
          expires_in: 300,
          refresh_expires_in: 86400,
          token_type: 'Bearer',
          'not-before-policy': 0,
          session_state: 'session-123',
          scope: 'openid profile email',
        },
      };

      mockedAxios.post.mockResolvedValue(mockTokenResponse);

      const result = await service.refreshToken(refreshTokenDto);

      expect(result).toEqual({
        accessToken: 'new-access-token-123',
        refreshToken: 'new-refresh-token-123',
        expiresIn: 300,
        refreshExpiresIn: 86400,
        tokenType: 'Bearer',
      });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/protocol/openid-connect/token'),
        expect.any(URLSearchParams),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: { error: 'invalid_grant' },
        },
      } as AxiosError;

      mockedAxios.post.mockRejectedValue(axiosError);

      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw BadRequestException for invalid request', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { error: 'invalid_request' },
        },
      } as AxiosError;

      mockedAxios.post.mockRejectedValue(axiosError);

      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('logout', () => {
    it('should logout user successfully', () => {
      service.logout('refresh-token-123');

      // Logout currently just logs the action
      // In the future, it might invalidate tokens
      expect(true).toBe(true); // Placeholder assertion
    });

    it('should handle logout without refresh token', () => {
      service.logout();

      // Should not throw
      expect(true).toBe(true);
    });
  });

  describe('getSessionTimeout', () => {
    it('should return session timeout in hours', () => {
      const timeout = service.getSessionTimeout();

      expect(timeout).toBe(24);
    });
  });
});
