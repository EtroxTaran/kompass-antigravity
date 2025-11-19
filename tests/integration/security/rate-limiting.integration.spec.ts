import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../apps/backend/src/app.module';

describe('Rate Limiting (Integration)', () => {
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

  describe('Global Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      // Make 50 requests (within 100 req/min limit)
      const requests = Array(50)
        .fill(null)
        .map(() => request(app.getHttpServer()).get('/health'));

      const responses = await Promise.all(requests);

      // All should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });

    it('should rate limit after exceeding threshold', async () => {
      // Make 101 requests (exceeds 100 req/min limit)
      const requests = Array(101)
        .fill(null)
        .map(() => request(app.getHttpServer()).get('/health'));

      const responses = await Promise.all(requests);

      // At least one should be rate limited
      const rateLimited = responses.find((r) => r.status === 429);
      expect(rateLimited).toBeDefined();

      if (rateLimited) {
        expect(rateLimited.body).toMatchObject({
          status: 429,
          detail: expect.stringContaining('Too many requests'),
        });
      }
    }, 30000); // 30 second timeout for this test
  });

  describe('Login Endpoint Rate Limiting', () => {
    it('should allow login requests within rate limit', async () => {
      // Make 5 login attempts (within 10 req/min limit)
      const requests = Array(5)
        .fill(null)
        .map(() =>
          request(app.getHttpServer()).post('/api/v1/auth/login').send({
            email: 'test@example.com',
            password: 'InvalidPassword123!',
          })
        );

      const responses = await Promise.all(requests);

      // All should be processed (may fail auth, but not rate limit)
      responses.forEach((response) => {
        expect([200, 401, 400]).toContain(response.status);
        expect(response.status).not.toBe(429);
      });
    });

    it('should rate limit login endpoint after exceeding threshold', async () => {
      // Make 11 login attempts (exceeds 10 req/min limit)
      const requests = Array(11)
        .fill(null)
        .map(() =>
          request(app.getHttpServer()).post('/api/v1/auth/login').send({
            email: 'test@example.com',
            password: 'InvalidPassword123!',
          })
        );

      const responses = await Promise.all(requests);

      // At least one should be rate limited
      const rateLimited = responses.find((r) => r.status === 429);
      expect(rateLimited).toBeDefined();

      if (rateLimited) {
        expect(rateLimited.body).toMatchObject({
          status: 429,
          detail: expect.stringContaining('Too many requests'),
        });
      }
    }, 30000); // 30 second timeout for this test
  });
});
