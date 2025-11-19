import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../apps/backend/src/app.module';

describe('Auth Flow (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 400 for invalid request body', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid-email',
          password: 'short',
        })
        .expect(400);

      expect(response.body).toMatchObject({
        type: expect.stringContaining('validation-error'),
        status: 400,
        errors: expect.any(Array),
      });
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body).toMatchObject({
        type: expect.stringContaining('unauthorized'),
        status: 401,
        detail: expect.stringContaining('Invalid email or password'),
      });
    });

    it('should return RFC 7807 format for errors', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('instance');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should return 400 for invalid request body', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken: '',
        })
        .expect(400);

      expect(response.body).toMatchObject({
        type: expect.stringContaining('validation-error'),
        status: 400,
      });
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken: 'invalid-refresh-token',
        })
        .expect(401);

      expect(response.body).toMatchObject({
        type: expect.stringContaining('unauthorized'),
        status: 401,
        detail: expect.stringContaining('Refresh token is invalid'),
      });
    });

    it('should return RFC 7807 format for errors', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken: 'invalid-token',
        })
        .expect(401);

      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('instance');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .expect(401);
    });

    // Note: Full login/logout flow test would require:
    // 1. Valid Keycloak user
    // 2. Successful login to get token
    // 3. Use token for logout
    // This is better suited for E2E tests with actual Keycloak instance
  });
});
