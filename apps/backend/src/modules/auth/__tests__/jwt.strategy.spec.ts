import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { UserRole } from '@kompass/shared/constants/rbac.constants';

import { JwtStrategy } from '../strategies/jwt.strategy';

import type { User } from '@kompass/shared/types/entities/user';
import type { TestingModule } from '@nestjs/testing';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string, defaultValue?: string) => {
        const config: Record<string, string> = {
          KEYCLOAK_URL: 'http://keycloak:8080',
          KEYCLOAK_REALM: 'kompass',
          KEYCLOAK_CLIENT_ID: 'kompass-api',
        };
        return config[key] || defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get(ConfigService);
  });

  describe('validate', () => {
    it('should return user object with roles from token', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        preferred_username: 'testuser',
        realm_access: {
          roles: ['ADM', 'PLAN'],
        },
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'http://keycloak:8080/realms/kompass',
        aud: 'kompass-api',
      };

      const user = await strategy.validate(payload);

      expect(user).toBeDefined();
      expect(user._id).toBe('user-user-123');
      expect(user.email).toBe('test@example.com');
      expect(user.displayName).toBe('testuser');
      expect(user.roles).toEqual([UserRole.ADM, UserRole.PLAN]);
      expect(user.primaryRole).toBe(UserRole.ADM);
      expect(user.type).toBe('user');
      expect(user.active).toBe(true);
    });

    it('should extract roles from resource_access if available', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        preferred_username: 'testuser',
        resource_access: {
          'kompass-api': {
            roles: ['GF', 'BUCH'],
          },
        },
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'http://keycloak:8080/realms/kompass',
        aud: 'kompass-api',
      };

      const user = await strategy.validate(payload);

      expect(user.roles).toEqual([UserRole.GF, UserRole.BUCH]);
      expect(user.primaryRole).toBe(UserRole.GF);
    });

    it('should throw UnauthorizedException if sub is missing', async () => {
      const payload = {
        email: 'test@example.com',
        realm_access: {
          roles: ['ADM'],
        },
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'http://keycloak:8080/realms/kompass',
        aud: 'kompass-api',
      };

      await expect(strategy.validate(payload as any)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if email is missing', async () => {
      const payload = {
        sub: 'user-123',
        realm_access: {
          roles: ['ADM'],
        },
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'http://keycloak:8080/realms/kompass',
        aud: 'kompass-api',
      };

      await expect(strategy.validate(payload as any)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if user has no roles', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        preferred_username: 'testuser',
        realm_access: {
          roles: ['INVALID_ROLE'],
        },
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'http://keycloak:8080/realms/kompass',
        aud: 'kompass-api',
      };

      await expect(strategy.validate(payload as any)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should map role names case-insensitively', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        preferred_username: 'testuser',
        realm_access: {
          roles: ['adm', 'plan'], // lowercase
        },
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'http://keycloak:8080/realms/kompass',
        aud: 'kompass-api',
      };

      const user = await strategy.validate(payload);

      expect(user.roles).toEqual([UserRole.ADM, UserRole.PLAN]);
    });

    it('should use preferred_username as displayName if available', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        preferred_username: 'John Doe',
        realm_access: {
          roles: ['ADM'],
        },
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'http://keycloak:8080/realms/kompass',
        aud: 'kompass-api',
      };

      const user = await strategy.validate(payload);

      expect(user.displayName).toBe('John Doe');
    });

    it('should use email as displayName if preferred_username is not available', async () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        realm_access: {
          roles: ['ADM'],
        },
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: 'http://keycloak:8080/realms/kompass',
        aud: 'kompass-api',
      };

      const user = await strategy.validate(payload);

      expect(user.displayName).toBe('test@example.com');
    });
  });
});
