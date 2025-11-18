/**
 * Integration Test: Customer API
 *
 * Tests Customer API endpoints with real database
 * Validates CRUD operations, RBAC, pagination, sorting, filtering, and duplicate detection
 */

import type { INestApplication } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { CustomerRating } from '@kompass/shared/types/enums';

import { AppModule } from '../../../apps/backend/src/app.module';

describe('Customer API (Integration)', () => {
  let app: INestApplication;
  let admToken: string;
  let planToken: string;
  let gfToken: string;
  let buchToken: string;
  let admUserId: string;
  let planUserId: string;
  let createdCustomerIds: string[] = [];

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
    admUserId = admResponse.body.user?._id || 'adm-user-id';

    const planResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'plan@example.com', password: 'test123' });
    planToken = planResponse.body.token;
    planUserId = planResponse.body.user?._id || 'plan-user-id';

    const gfResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'gf@example.com', password: 'test123' });
    gfToken = gfResponse.body.token;

    const buchResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'buch@example.com', password: 'test123' });
    buchToken = buchResponse.body.token;
  });

  afterAll(async () => {
    // Cleanup: Delete test customers
    for (const customerId of createdCustomerIds) {
      try {
        await request(app.getHttpServer())
          .delete(`/api/v1/customers/${customerId}`)
          .set('Authorization', `Bearer ${gfToken}`)
          .expect(HttpStatus.NO_CONTENT);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    await app.close();
  });

  describe('POST /api/v1/customers', () => {
    it('should create customer with valid data (ADM)', async () => {
      const newCustomer = {
        companyName: 'Test Hofladen GmbH',
        vatNumber: 'DE123456789',
        billingAddress: {
          street: 'Hauptstraße',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
        phone: '+49-89-1234567',
        email: 'info@test-hofladen.de',
        rating: CustomerRating.B,
        customerType: 'active',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${admToken}`)
        .send(newCustomer)
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        id: expect.stringMatching(/^customer-/),
        companyName: 'Test Hofladen GmbH',
        vatNumber: 'DE123456789',
        rating: CustomerRating.B,
        customerType: 'active',
        owner: admUserId,
      });

      expect(response.body.billingAddress).toMatchObject({
        street: 'Hauptstraße',
        zipCode: '80331',
        city: 'München',
        country: 'Deutschland',
      });

      // ADM should not see creditLimit
      expect(response.body.creditLimit).toBeUndefined();

      createdCustomerIds.push(response.body.id);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/customers')
        .send({ companyName: 'Test' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 400 for validation errors', async () => {
      const invalidCustomer = {
        companyName: 'A', // Too short
        billingAddress: {
          street: 'Test',
          zipCode: '123', // Invalid ZIP
          city: 'München',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${admToken}`)
        .send(invalidCustomer)
        .expect(HttpStatus.BAD_REQUEST);

      // Verify RFC 7807 error format
      expect(response.body).toMatchObject({
        type: expect.stringContaining('validation-error'),
        status: 400,
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'companyName',
            message: expect.stringContaining('2-200 characters'),
          }),
        ]),
      });
    });

    it('should return 409 for duplicate VAT number', async () => {
      const customer1 = {
        companyName: 'First Customer GmbH',
        vatNumber: 'DE999999999',
        billingAddress: {
          street: 'Test',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
        customerType: 'active',
      };

      // Create first customer
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${admToken}`)
        .send(customer1)
        .expect(HttpStatus.CREATED);
      createdCustomerIds.push(createResponse.body.id);

      // Try to create duplicate with same VAT number
      const duplicateCustomer = {
        companyName: 'Second Customer GmbH',
        vatNumber: 'DE999999999', // Same VAT number
        billingAddress: {
          street: 'Test',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
        customerType: 'active',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${admToken}`)
        .send(duplicateCustomer)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.detail).toContain('duplicate');
    });

    it('should return 409 for duplicate company name (fuzzy match)', async () => {
      const customer1 = {
        companyName: 'Müller Hofladen GmbH',
        billingAddress: {
          street: 'Test',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
        customerType: 'active',
      };

      // Create first customer
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${admToken}`)
        .send(customer1)
        .expect(HttpStatus.CREATED);
      createdCustomerIds.push(createResponse.body.id);

      // Try to create duplicate with similar company name (fuzzy match)
      const duplicateCustomer = {
        companyName: 'Mueller Hofladen GmbH', // Similar name (different spelling)
        billingAddress: {
          street: 'Test',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
        customerType: 'active',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${admToken}`)
        .send(duplicateCustomer)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.detail).toContain('duplicate');
    });

    it('should allow PLAN to create customer', async () => {
      const newCustomer = {
        companyName: 'PLAN Created Customer',
        billingAddress: {
          street: 'Test',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
        customerType: 'active',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${planToken}`)
        .send(newCustomer)
        .expect(HttpStatus.CREATED);

      expect(response.body.companyName).toBe('PLAN Created Customer');
      createdCustomerIds.push(response.body.id);
    });
  });

  describe('GET /api/v1/customers', () => {
    it('should return paginated list of customers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/customers?page=1&pageSize=10')
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        data: expect.any(Array),
        pagination: {
          page: 1,
          pageSize: 10,
          total: expect.any(Number),
          totalPages: expect.any(Number),
          hasNextPage: expect.any(Boolean),
          hasPreviousPage: expect.any(Boolean),
        },
      });
    });

    it('should filter by search term', async () => {
      // Create a customer with specific name
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${admToken}`)
        .send({
          companyName: 'Unique Search Test GmbH',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        });
      createdCustomerIds.push(createResponse.body.id);

      const response = await request(app.getHttpServer())
        .get('/api/v1/customers?search=Unique')
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(
        response.body.data.some((c: any) => c.companyName.includes('Unique'))
      ).toBe(true);
    });

    it('should filter by rating', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/customers?rating=${CustomerRating.A}`)
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.OK);

      response.body.data.forEach((customer: any) => {
        expect(customer.rating).toBe(CustomerRating.A);
      });
    });

    it('should filter by customerType', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/customers?customerType=active')
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.OK);

      response.body.data.forEach((customer: any) => {
        expect(customer.customerType).toBe('active');
      });
    });

    it('should filter by vatNumber', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/customers?vatNumber=DE123456789')
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.OK);

      response.body.data.forEach((customer: any) => {
        expect(customer.vatNumber).toBe('DE123456789');
      });
    });

    it('should sort by companyName ascending', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/customers?sortBy=companyName&sortOrder=asc')
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.OK);

      const names = response.body.data.map((c: any) => c.companyName);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });

    it('should sort by createdAt descending', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/customers?sortBy=createdAt&sortOrder=desc')
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.OK);

      const dates = response.body.data.map((c: any) =>
        new Date(c.createdAt).getTime()
      );
      const sortedDates = [...dates].sort((a, b) => b - a);
      expect(dates).toEqual(sortedDates);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/customers')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return only ADM own customers', async () => {
      // ADM creates a customer
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${admToken}`)
        .send({
          companyName: 'ADM Own Customer',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        });
      createdCustomerIds.push(createResponse.body.id);

      // ADM should see their own customer
      const response = await request(app.getHttpServer())
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.OK);

      expect(
        response.body.data.some(
          (c: any) => c.companyName === 'ADM Own Customer'
        )
      ).toBe(true);
    });

    it('should return all customers for PLAN role', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${planToken}`)
        .expect(HttpStatus.OK);

      // PLAN should see all customers (not just own)
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should hide creditLimit from ADM', async () => {
      // Create customer with creditLimit
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${planToken}`)
        .send({
          companyName: 'Customer With Credit',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
          creditLimit: 50000,
        });
      createdCustomerIds.push(createResponse.body.id);

      // ADM should not see creditLimit
      const admResponse = await request(app.getHttpServer())
        .get(`/api/v1/customers/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.OK);

      expect(admResponse.body.creditLimit).toBeUndefined();
    });

    it('should show creditLimit to BUCH role', async () => {
      // Create customer with creditLimit
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${planToken}`)
        .send({
          companyName: 'Customer For BUCH',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
          creditLimit: 75000,
        });
      createdCustomerIds.push(createResponse.body.id);

      // BUCH should see creditLimit
      const buchResponse = await request(app.getHttpServer())
        .get(`/api/v1/customers/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${buchToken}`)
        .expect(HttpStatus.OK);

      expect(buchResponse.body.creditLimit).toBe(75000);
    });
  });

  describe('GET /api/v1/customers/:id', () => {
    let testCustomerId: string;

    beforeEach(async () => {
      // Create a test customer
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${admToken}`)
        .send({
          companyName: 'Test Customer for GET',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        });
      testCustomerId = createResponse.body.id;
      createdCustomerIds.push(testCustomerId);
    });

    it('should return customer by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/customers/${testCustomerId}`)
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: testCustomerId,
        companyName: 'Test Customer for GET',
      });
    });

    it('should return 404 for non-existent customer', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/customers/customer-non-existent')
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/customers/${testCustomerId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 403 for ADM accessing other ADM customer', async () => {
      // Create customer with PLAN (different owner)
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${planToken}`)
        .send({
          companyName: 'PLAN Owned Customer',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        });
      createdCustomerIds.push(createResponse.body.id);

      // ADM should not access PLAN's customer
      await request(app.getHttpServer())
        .get(`/api/v1/customers/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should allow PLAN to access any customer', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/customers/${testCustomerId}`)
        .set('Authorization', `Bearer ${planToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.id).toBe(testCustomerId);
    });
  });

  describe('PUT /api/v1/customers/:id', () => {
    let testCustomerId: string;

    beforeEach(async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${admToken}`)
        .send({
          companyName: 'Test Customer for UPDATE',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        });
      testCustomerId = createResponse.body.id;
      createdCustomerIds.push(testCustomerId);
    });

    it('should update customer with valid data', async () => {
      const updateData = {
        companyName: 'Updated Customer Name',
        phone: '+49-89-9999999',
        rating: CustomerRating.A,
      };

      const response = await request(app.getHttpServer())
        .put(`/api/v1/customers/${testCustomerId}`)
        .set('Authorization', `Bearer ${admToken}`)
        .send(updateData)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: testCustomerId,
        companyName: 'Updated Customer Name',
        phone: '+49-89-9999999',
        rating: CustomerRating.A,
      });
    });

    it('should return 400 for validation errors', async () => {
      const invalidUpdate = {
        companyName: 'A', // Too short
      };

      await request(app.getHttpServer())
        .put(`/api/v1/customers/${testCustomerId}`)
        .set('Authorization', `Bearer ${admToken}`)
        .send(invalidUpdate)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 404 for non-existent customer', async () => {
      await request(app.getHttpServer())
        .put('/api/v1/customers/customer-non-existent')
        .set('Authorization', `Bearer ${admToken}`)
        .send({ companyName: 'Updated' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 403 for ADM updating other ADM customer', async () => {
      // Create customer with PLAN
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${planToken}`)
        .send({
          companyName: 'PLAN Customer',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        });
      createdCustomerIds.push(createResponse.body.id);

      await request(app.getHttpServer())
        .put(`/api/v1/customers/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${admToken}`)
        .send({ companyName: 'Unauthorized Update' })
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should detect duplicate on update', async () => {
      // Create another customer
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${admToken}`)
        .send({
          companyName: 'Existing Customer',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        });
      createdCustomerIds.push(createResponse.body.id);

      // Try to update testCustomer to match existing customer name
      await request(app.getHttpServer())
        .put(`/api/v1/customers/${testCustomerId}`)
        .set('Authorization', `Bearer ${admToken}`)
        .send({ companyName: 'Existing Customer' })
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('DELETE /api/v1/customers/:id', () => {
    let testCustomerId: string;

    beforeEach(async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${admToken}`)
        .send({
          companyName: 'Test Customer for DELETE',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        });
      testCustomerId = createResponse.body.id;
      // Don't add to createdCustomerIds - we'll delete it
    });

    it('should delete customer (GF only)', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/customers/${testCustomerId}`)
        .set('Authorization', `Bearer ${gfToken}`)
        .expect(HttpStatus.NO_CONTENT);

      // Verify customer is deleted
      await request(app.getHttpServer())
        .get(`/api/v1/customers/${testCustomerId}`)
        .set('Authorization', `Bearer ${gfToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 403 for ADM trying to delete', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${admToken}`)
        .send({
          companyName: 'Customer ADM Cannot Delete',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        });
      createdCustomerIds.push(createResponse.body.id);

      await request(app.getHttpServer())
        .delete(`/api/v1/customers/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${admToken}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should return 403 for PLAN trying to delete', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/customers/${testCustomerId}`)
        .set('Authorization', `Bearer ${planToken}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('should return 404 for non-existent customer', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/customers/customer-non-existent')
        .set('Authorization', `Bearer ${gfToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/customers/${testCustomerId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
