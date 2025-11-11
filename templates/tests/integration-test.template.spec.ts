/**
 * Integration Test Template for KOMPASS
 * 
 * Testing: {{ENTITY_NAME}} API endpoints with real database
 * Framework: Jest + Supertest
 * Coverage Target: 70% for API endpoints
 * 
 * Usage: Replace {{ENTITY_NAME}} with your entity name
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import type { {{ENTITY_NAME}} } from '@kompass/shared';

describe('{{ENTITY_NAME}} API (Integration)', () => {
  let app: INestApplication;
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Create test module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply global pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    await app.init();

    // Login and get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'test123',
      })
      .expect(200);

    authToken = loginResponse.body.token;
    testUserId = loginResponse.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/{{ENTITY_NAME_PLURAL_LOWER}}', () => {
    it('should create {{ENTITY_NAME}} with valid data', async () => {
      // Arrange
      const createDto = {
        name: 'Test {{ENTITY_NAME}}',
        // TODO: Add your required fields
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201);

      // Assert
      expect(response.body).toMatchObject({
        id: expect.stringMatching(/^{{ENTITY_NAME_LOWER}}-/),
        name: 'Test {{ENTITY_NAME}}',
        createdBy: testUserId,
      });
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.modifiedAt).toBeDefined();
    });

    it('should return 401 without auth token', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .post('/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}')
        .send({ name: 'Test' })
        .expect(401);
    });

    it('should return 400 with invalid data', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post('/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'A', // Too short (min 2 chars)
        })
        .expect(400);

      // Assert
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('validation');
    });

    it('should return 403 when user lacks CREATE permission', async () => {
      // TODO: Login as user without CREATE permission
      // const limitedUserToken = await getTokenForRole('READ_ONLY_ROLE');
      
      // await request(app.getHttpServer())
      //   .post('/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}')
      //   .set('Authorization', `Bearer ${limitedUserToken}`)
      //   .send({ name: 'Test' })
      //   .expect(403);
    });
  });

  describe('GET /api/v1/{{ENTITY_NAME_PLURAL_LOWER}}', () => {
    it('should return all {{ENTITY_NAME}}s accessible to user', async () => {
      // Arrange - create test data
      const createDto = { name: 'Test {{ENTITY_NAME}} 1' };
      await request(app.getHttpServer())
        .post('/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto);

      // Act
      const response = await request(app.getHttpServer())
        .get('/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Assert
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });

    it('should return empty array when no {{ENTITY_NAME}}s exist', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .get('/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Assert
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/v1/{{ENTITY_NAME_PLURAL_LOWER}}/:id', () => {
    let created{{ENTITY_NAME}}Id: string;

    beforeEach(async () => {
      // Create test {{ENTITY_NAME}}
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test {{ENTITY_NAME}} for GET' });
      
      created{{ENTITY_NAME}}Id = createResponse.body.id;
    });

    it('should return {{ENTITY_NAME}} when found', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .get(`/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}/${created{{ENTITY_NAME}}Id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Assert
      expect(response.body.id).toBe(created{{ENTITY_NAME}}Id);
      expect(response.body.name).toBe('Test {{ENTITY_NAME}} for GET');
    });

    it('should return 404 when {{ENTITY_NAME}} not found', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .get('/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}/{{ENTITY_NAME_LOWER}}-nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /api/v1/{{ENTITY_NAME_PLURAL_LOWER}}/:id', () => {
    let created{{ENTITY_NAME}}Id: string;
    let created{{ENTITY_NAME}}Rev: string;

    beforeEach(async () => {
      // Create test {{ENTITY_NAME}}
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test {{ENTITY_NAME}} for PUT' });
      
      created{{ENTITY_NAME}}Id = createResponse.body.id;
      created{{ENTITY_NAME}}Rev = createResponse.body._rev;
    });

    it('should update {{ENTITY_NAME}} with valid data', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .put(`/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}/${created{{ENTITY_NAME}}Id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
          _rev: created{{ENTITY_NAME}}Rev,
        })
        .expect(200);

      // Assert
      expect(response.body.name).toBe('Updated Name');
      expect(response.body.modifiedBy).toBe(testUserId);
    });

    it('should return 409 on revision mismatch (conflict)', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .put(`/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}/${created{{ENTITY_NAME}}Id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
          _rev: 'wrong-revision',
        })
        .expect(409);
    });
  });

  describe('DELETE /api/v1/{{ENTITY_NAME_PLURAL_LOWER}}/:id', () => {
    let created{{ENTITY_NAME}}Id: string;

    beforeEach(async () => {
      // Create test {{ENTITY_NAME}}
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test {{ENTITY_NAME}} for DELETE' });
      
      created{{ENTITY_NAME}}Id = createResponse.body.id;
    });

    it('should delete {{ENTITY_NAME}} when user has permission', async () => {
      // Act
      await request(app.getHttpServer())
        .delete(`/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}/${created{{ENTITY_NAME}}Id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify deleted (should return 404)
      await request(app.getHttpServer())
        .get(`/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}/${created{{ENTITY_NAME}}Id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent {{ENTITY_NAME}}', async () => {
      // Act & Assert
      await request(app.getHttpServer())
        .delete('/api/v1/{{ENTITY_NAME_PLURAL_LOWER}}/{{ENTITY_NAME_LOWER}}-nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});

