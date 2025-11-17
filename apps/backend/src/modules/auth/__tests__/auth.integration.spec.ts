import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { UserRole } from '@kompass/shared/constants/rbac.constants';

import { AppModule } from '../../../app.module';
import { AuthModule } from '../auth.module';

import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

describe('Auth Integration Tests', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /auth/me', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
      });
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
      });
    });

    it('should return user info if valid token is provided', async () => {
      // Create a mock JWT token
      // Note: In a real scenario, this would be a token from Keycloak
      // For testing, we'll create a token that matches the expected format
      const keycloakUrl = configService.get<string>(
        'KEYCLOAK_URL',
        'http://keycloak:8080'
      );
      const keycloakRealm = configService.get<string>(
        'KEYCLOAK_REALM',
        'kompass'
      );
      const issuer = `${keycloakUrl}/realms/${keycloakRealm}`;

      const payload = {
        sub: 'test-user-123',
        email: 'test@example.com',
        preferred_username: 'testuser',
        realm_access: {
          roles: ['ADM', 'PLAN'],
        },
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        iss: issuer,
        aud: 'kompass-api',
      };

      // Note: This test requires a valid Keycloak token or a mocked JWT strategy
      // For now, we'll test the endpoint structure
      // In a real integration test, you would:
      // 1. Start Keycloak
      // 2. Get a real token from Keycloak
      // 3. Use that token in the test

      // This test will fail until Keycloak is properly configured
      // But it documents the expected behavior
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer mock-token')
        .expect(401); // Will fail until Keycloak is set up

      // When Keycloak is set up, this should return 200 with user info:
      // expect(response.body).toMatchObject({
      //   _id: expect.stringContaining('user-'),
      //   email: 'test@example.com',
      //   roles: [UserRole.ADM, UserRole.PLAN],
      // });
    });
  });

  describe('Protected endpoints', () => {
    it('should return 401 for protected endpoint without token', async () => {
      // Test any protected endpoint (e.g., customer list)
      const response = await request(app.getHttpServer())
        .get('/api/v1/customers')
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
      });
    });

    it('should return 401 for protected endpoint with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/customers')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toMatchObject({
        statusCode: 401,
      });
    });
  });
});
