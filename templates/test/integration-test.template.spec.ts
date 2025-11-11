/**
 * TEMPLATE: Integration Test (Supertest)
 * 
 * Usage: Copy this template for API integration tests
 * Replace {{EntityName}} with your entity name
 * 
 * CRITICAL REQUIREMENTS:
 * 1. Integration tests test API + Database together
 * 2. Use real database (test database)
 * 3. Clean database before/after tests
 * 4. Test authentication and authorization
 * 5. Verify HTTP status codes and response structure
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('{{EntityName}} API (Integration)', () => {
  let app: INestApplication;
  let authToken: string;
  let testUserId: string;

  // ============================================================================
  // SETUP & TEARDOWN
  // ============================================================================

  beforeAll(async () => {
    // Create app
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply global pipes (same as production)
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    await app.init();

    // Get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'test-adm@example.com',
        password: 'test123',
      })
      .expect(200);

    authToken = loginResponse.body.token;
    testUserId = loginResponse.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean test data before each test
    await cleanTestData();
  });

  // ============================================================================
  // CREATE TESTS
  // ============================================================================

  describe('POST /api/v1/{{entity-names}}', () => {
    const validCreate{{EntityName}}Data = {
      exampleField: 'Test {{EntityName}}',
      email: 'test@example.com',
      phone: '+49-89-1234567',
    };

    it('should create {{entityName}} with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/{{entity-names}}')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validCreate{{EntityName}}Data)
        .expect(201);

      // Verify response structure
      expect(response.body).toMatchObject({
        id: expect.stringMatching(/^{{entityName}}-/),
        exampleField: 'Test {{EntityName}}',
        email: 'test@example.com',
        createdBy: testUserId,
        createdAt: expect.any(String),
      });
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        exampleField: 'A', // Too short (min 2 chars)
        email: 'invalid-email', // Invalid format
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/{{entity-names}}')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      // Verify error structure (RFC 7807 Problem Details)
      expect(response.body).toMatchObject({
        type: expect.any(String),
        title: 'Validation Failed',
        status: 400,
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'exampleField',
            message: expect.stringContaining('2'),
          }),
        ]),
      });
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/{{entity-names}}')
        .send(validCreate{{EntityName}}Data)
        .expect(401);
    });

    it('should return 403 when user lacks CREATE permission', async () => {
      // Login as user without permission
      const restrictedLoginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'readonly@example.com',
          password: 'test123',
        });

      const restrictedToken = restrictedLoginResponse.body.token;

      await request(app.getHttpServer())
        .post('/api/v1/{{entity-names}}')
        .set('Authorization', `Bearer ${restrictedToken}`)
        .send(validCreate{{EntityName}}Data)
        .expect(403);
    });
  });

  // ============================================================================
  // READ TESTS
  // ============================================================================

  describe('GET /api/v1/{{entity-names}}', () => {
    beforeEach(async () => {
      // Seed test data
      await seedTest{{EntityName}}s(5);
    });

    it('should return list of {{entityName}}s', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/{{entity-names}}')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        total: expect.any(Number),
        offset: 0,
        limit: 50,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.stringMatching(/^{{entityName}}-/),
            exampleField: expect.any(String),
          }),
        ]),
      });
    });

    it('should support pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/{{entity-names}}?limit=2&offset=0')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(0);
    });

    it('should support search filter', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/{{entity-names}}?search=Test')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
      response.body.data.forEach((item: any) => {
        expect(item.exampleField).toMatch(/Test/i);
      });
    });

    it('should meet performance target (<500ms for search)', async () => {
      const startTime = Date.now();
      
      await request(app.getHttpServer())
        .get('/api/v1/{{entity-names}}?search=München')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(500); // NFR requirement
    });
  });

  describe('GET /api/v1/{{entity-names}}/:id', () => {
    let test{{EntityName}}Id: string;

    beforeEach(async () => {
      const created = await createTest{{EntityName}}({
        exampleField: 'Test {{EntityName}}',
      });
      test{{EntityName}}Id = created.id;
    });

    it('should return {{entityName}} by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/{{entity-names}}/${test{{EntityName}}Id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: test{{EntityName}}Id,
        exampleField: 'Test {{EntityName}}',
      });
    });

    it('should return 404 for non-existent {{entityName}}', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/{{entity-names}}/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  // ============================================================================
  // UPDATE TESTS
  // ============================================================================

  describe('PUT /api/v1/{{entity-names}}/:id', () => {
    let test{{EntityName}}Id: string;

    beforeEach(async () => {
      const created = await createTest{{EntityName}}({
        exampleField: 'Original Value',
      });
      test{{EntityName}}Id = created.id;
    });

    it('should update {{entityName}}', async () => {
      const updateData = {
        exampleField: 'Updated Value',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/v1/{{entity-names}}/${test{{EntityName}}Id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.exampleField).toBe('Updated Value');
      expect(response.body.modifiedBy).toBe(testUserId);
    });

    it('should return 404 for non-existent {{entityName}}', async () => {
      await request(app.getHttpServer())
        .put('/api/v1/{{entity-names}}/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ exampleField: 'Test' })
        .expect(404);
    });
  });

  // ============================================================================
  // DELETE TESTS
  // ============================================================================

  describe('DELETE /api/v1/{{entity-names}}/:id', () => {
    let test{{EntityName}}Id: string;

    beforeEach(async () => {
      const created = await createTest{{EntityName}}({
        exampleField: 'To Be Deleted',
      });
      test{{EntityName}}Id = created.id;
    });

    it('should delete {{entityName}}', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/{{entity-names}}/${test{{EntityName}}Id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify {{entityName}} deleted
      await request(app.getHttpServer())
        .get(`/api/v1/{{entity-names}}/${test{{EntityName}}Id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Clean test data from database
 */
async function cleanTestData() {
  // Implementation: Delete all test {{entityName}}s
  // Use database connection to clean up
}

/**
 * Seed test {{entityName}}s
 */
async function seedTest{{EntityName}}s(count: number) {
  // Implementation: Create test {{entityName}}s in database
}

/**
 * Create test {{entityName}} via API
 */
async function createTest{{EntityName}}(data: any) {
  // Implementation: Call API to create test {{entityName}}
  // Return created {{entityName}} with ID
  return { id: '{{entityName}}-test-123', ...data };
}

