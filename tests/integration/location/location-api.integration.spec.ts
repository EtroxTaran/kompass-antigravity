/**
 * Integration Test: Location API
 *
 * Tests Location API endpoints with real database
 * Validates CRUD operations, RBAC, and business rules
 */

import type { INestApplication } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { LocationType } from '@kompass/shared/types/enums';

import { AppModule } from '../../../apps/backend/src/app.module';

describe('Location API (Integration)', () => {
  let app: INestApplication;
  let admToken: string;
  let _planToken: string; // Reserved for future PLAN role tests
  let gfToken: string;
  let customerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get auth tokens for different roles
    const admResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'adm@example.com', password: 'test123' });
    admToken = admResponse.body.token;

    const planResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'plan@example.com', password: 'test123' });
    _planToken = planResponse.body.token;

    const gfResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'gf@example.com', password: 'test123' });
    gfToken = gfResponse.body.token;

    // Create test customer owned by ADM user
    const customerResponse = await request(app.getHttpServer())
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${admToken}`)
      .send({
        companyName: 'Test Customer for Locations',
        billingAddress: {
          street: 'Teststraße',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
      });
    customerId = customerResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/customers/:customerId/locations', () => {
    it('should create location with valid data', async () => {
      const newLocation = {
        locationName: 'Filiale München Süd',
        locationType: LocationType.BRANCH,
        deliveryAddress: {
          street: 'Lindwurmstraße',
          streetNumber: '85',
          zipCode: '80337',
          city: 'München',
          country: 'Deutschland',
        },
        isActive: true,
        deliveryNotes: 'Hintereingang nutzen',
      };

      const response = await request(app.getHttpServer())
        .post(`/api/v1/customers/${customerId}/locations`)
        .set('Authorization', `Bearer ${admToken}`)
        .send(newLocation)
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        _id: expect.stringMatching(/^location-/),
        customerId: customerId,
        locationName: 'Filiale München Süd',
        locationType: LocationType.BRANCH,
        isActive: true,
      });
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/customers/${customerId}/locations`)
        .send({ locationName: 'Test' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 400 for validation errors', async () => {
      const invalidLocation = {
        locationName: 'A', // Too short
        locationType: 'invalid-type',
      };

      await request(app.getHttpServer())
        .post(`/api/v1/customers/${customerId}/locations`)
        .set('Authorization', `Bearer ${admToken}`)
        .send(invalidLocation)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 409 for duplicate location name', async () => {
      const location = {
        locationName: 'Hauptstandort',
        locationType: LocationType.HEADQUARTER,
        deliveryAddress: {
          street: 'Test',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
        isActive: true,
      };

      // Create first location
      await request(app.getHttpServer())
        .post(`/api/v1/customers/${customerId}/locations`)
        .set('Authorization', `Bearer ${admToken}`)
        .send(location)
        .expect(HttpStatus.CREATED);

      // Try to create duplicate
      const response = await request(app.getHttpServer())
        .post(`/api/v1/customers/${customerId}/locations`)
        .set('Authorization', `Bearer ${admToken}`)
        .send(location)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.detail).toContain('bereits vorhanden');
    });
  });

  describe('GET /api/v1/customers/:customerId/locations', () => {
    it('should return all locations for customer', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/customers/${customerId}/locations`)
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter by locationType', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/customers/${customerId}/locations?locationType=branch`)
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((loc: any) => {
        expect(loc.locationType).toBe(LocationType.BRANCH);
      });
    });

    it('should filter by isActive', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/customers/${customerId}/locations?isActive=true`)
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((loc: any) => {
        expect(loc.isActive).toBe(true);
      });
    });
  });

  describe('DELETE /api/v1/customers/:customerId/locations/:locationId', () => {
    it('should prevent ADM from deleting location', async () => {
      // ADM creates location
      const createResponse = await request(app.getHttpServer())
        .post(`/api/v1/customers/${customerId}/locations`)
        .set('Authorization', `Bearer ${admToken}`)
        .send({
          locationName: 'To Delete',
          locationType: LocationType.BRANCH,
          deliveryAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          isActive: true,
        });

      const locationId = createResponse.body._id;

      // ADM tries to delete (should fail)
      await request(app.getHttpServer())
        .delete(`/api/v1/customers/${customerId}/locations/${locationId}`)
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should allow GF to delete location', async () => {
      // Create location
      const createResponse = await request(app.getHttpServer())
        .post(`/api/v1/customers/${customerId}/locations`)
        .set('Authorization', `Bearer ${gfToken}`)
        .send({
          locationName: 'GF Can Delete',
          locationType: LocationType.BRANCH,
          deliveryAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          isActive: true,
        });

      const locationId = createResponse.body._id;

      // GF deletes (should succeed)
      await request(app.getHttpServer())
        .delete(`/api/v1/customers/${customerId}/locations/${locationId}`)
        .set('Authorization', `Bearer ${gfToken}`)
        .expect(HttpStatus.NO_CONTENT);
    });
  });
});
