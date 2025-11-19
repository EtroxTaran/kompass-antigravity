import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../../apps/backend/src/app.module';

describe('Health Check (Integration)', () => {
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

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: expect.stringMatching(/^(ok|degraded|down)$/),
        database: expect.stringMatching(/^(connected|disconnected)$/),
        keycloak: expect.stringMatching(/^(reachable|unreachable)$/),
        timestamp: expect.any(String),
      });
    });

    it('should return valid ISO timestamp', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.getTime()).not.toBeNaN();
    });

    it('should be accessible without authentication', async () => {
      await request(app.getHttpServer()).get('/health').expect(200);
    });
  });
});
