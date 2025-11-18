/**
 * E2E Test: Customer CRUD Operations
 *
 * Tests the complete flow of customer CRUD operations via API
 * Validates authentication, RBAC permissions, and error handling
 */

import { test, expect } from '@playwright/test';

test.describe('Customer Management - CRUD Operations', () => {
  let apiBaseUrl: string;
  let admToken: string;
  let planToken: string;
  let gfToken: string;
  let createdCustomerIds: string[] = [];

  test.beforeAll(async ({ request: apiRequest }) => {
    // Get API base URL from environment or use default
    apiBaseUrl = process.env.API_URL || 'http://localhost:3000';

    // Login as ADM user
    const admResponse = await apiRequest.post(`${apiBaseUrl}/auth/login`, {
      data: {
        email: 'adm@example.com',
        password: 'test123',
      },
    });
    expect(admResponse.ok()).toBeTruthy();
    const admBody = await admResponse.json();
    admToken = admBody.token;

    // Login as PLAN user
    const planResponse = await apiRequest.post(`${apiBaseUrl}/auth/login`, {
      data: {
        email: 'plan@example.com',
        password: 'test123',
      },
    });
    expect(planResponse.ok()).toBeTruthy();
    const planBody = await planResponse.json();
    planToken = planBody.token;

    // Login as GF user
    const gfResponse = await apiRequest.post(`${apiBaseUrl}/auth/login`, {
      data: {
        email: 'gf@example.com',
        password: 'test123',
      },
    });
    expect(gfResponse.ok()).toBeTruthy();
    const gfBody = await gfResponse.json();
    gfToken = gfBody.token;
  });

  test.afterAll(async ({ request: apiRequest }) => {
    // Cleanup: Delete test customers
    for (const customerId of createdCustomerIds) {
      try {
        await apiRequest.delete(
          `${apiBaseUrl}/api/v1/customers/${customerId}`,
          {
            headers: {
              Authorization: `Bearer ${gfToken}`,
            },
          }
        );
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  test('should create customer successfully', async ({ request }) => {
    const newCustomer = {
      companyName: 'E2E Test Customer GmbH',
      vatNumber: 'DE111111111',
      billingAddress: {
        street: 'E2E Teststraße',
        zipCode: '80331',
        city: 'München',
        country: 'Deutschland',
      },
      phone: '+49-89-1111111',
      email: 'e2e@test-customer.de',
      rating: 'B',
      customerType: 'active',
    };

    const response = await request.post(`${apiBaseUrl}/api/v1/customers`, {
      headers: {
        Authorization: `Bearer ${admToken}`,
        'Content-Type': 'application/json',
      },
      data: newCustomer,
    });

    expect(response.ok()).toBeTruthy();
    const customer = await response.json();

    expect(customer).toMatchObject({
      id: expect.stringMatching(/^customer-/),
      companyName: 'E2E Test Customer GmbH',
      vatNumber: 'DE111111111',
      rating: 'B',
      customerType: 'active',
    });

    createdCustomerIds.push(customer.id);
  });

  test('should reject customer creation without authentication', async ({
    request,
  }) => {
    const response = await request.post(`${apiBaseUrl}/api/v1/customers`, {
      data: {
        companyName: 'Unauthorized Customer',
        billingAddress: {
          street: 'Test',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
        customerType: 'active',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('should reject customer creation with invalid data', async ({
    request,
  }) => {
    const response = await request.post(`${apiBaseUrl}/api/v1/customers`, {
      headers: {
        Authorization: `Bearer ${admToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        companyName: 'A', // Too short
        billingAddress: {
          street: 'Test',
          zipCode: '123', // Invalid ZIP
          city: 'München',
        },
        customerType: 'active',
      },
    });

    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error.status).toBe(400);
    expect(error.errors).toBeDefined();
  });

  test('should list customers with pagination', async ({ request }) => {
    const response = await request.get(
      `${apiBaseUrl}/api/v1/customers?page=1&pageSize=10`,
      {
        headers: {
          Authorization: `Bearer ${admToken}`,
        },
      }
    );

    expect(response.ok()).toBeTruthy();
    const result = await response.json();

    expect(result).toMatchObject({
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

  test('should get customer by ID', async ({ request }) => {
    // Create a customer first
    const createResponse = await request.post(
      `${apiBaseUrl}/api/v1/customers`,
      {
        headers: {
          Authorization: `Bearer ${admToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          companyName: 'Customer for GET Test',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        },
      }
    );

    expect(createResponse.ok()).toBeTruthy();
    const createdCustomer = await createResponse.json();
    createdCustomerIds.push(createdCustomer.id);

    // Get the customer
    const getResponse = await request.get(
      `${apiBaseUrl}/api/v1/customers/${createdCustomer.id}`,
      {
        headers: {
          Authorization: `Bearer ${admToken}`,
        },
      }
    );

    expect(getResponse.ok()).toBeTruthy();
    const customer = await getResponse.json();

    expect(customer).toMatchObject({
      id: createdCustomer.id,
      companyName: 'Customer for GET Test',
    });
  });

  test('should return 404 for non-existent customer', async ({ request }) => {
    const response = await request.get(
      `${apiBaseUrl}/api/v1/customers/customer-non-existent`,
      {
        headers: {
          Authorization: `Bearer ${admToken}`,
        },
      }
    );

    expect(response.status()).toBe(404);
  });

  test('should update customer successfully', async ({ request }) => {
    // Create a customer first
    const createResponse = await request.post(
      `${apiBaseUrl}/api/v1/customers`,
      {
        headers: {
          Authorization: `Bearer ${admToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          companyName: 'Customer for UPDATE Test',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        },
      }
    );

    expect(createResponse.ok()).toBeTruthy();
    const createdCustomer = await createResponse.json();
    createdCustomerIds.push(createdCustomer.id);

    // Update the customer
    const updateResponse = await request.put(
      `${apiBaseUrl}/api/v1/customers/${createdCustomer.id}`,
      {
        headers: {
          Authorization: `Bearer ${admToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          companyName: 'Updated Customer Name',
          phone: '+49-89-9999999',
          rating: 'A',
        },
      }
    );

    expect(updateResponse.ok()).toBeTruthy();
    const updatedCustomer = await updateResponse.json();

    expect(updatedCustomer).toMatchObject({
      id: createdCustomer.id,
      companyName: 'Updated Customer Name',
      phone: '+49-89-9999999',
      rating: 'A',
    });
  });

  test('should prevent ADM from accessing other ADM customer', async ({
    request,
  }) => {
    // Create customer with PLAN (different owner)
    const createResponse = await request.post(
      `${apiBaseUrl}/api/v1/customers`,
      {
        headers: {
          Authorization: `Bearer ${planToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          companyName: 'PLAN Owned Customer',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        },
      }
    );

    expect(createResponse.ok()).toBeTruthy();
    const createdCustomer = await createResponse.json();
    createdCustomerIds.push(createdCustomer.id);

    // ADM should not access PLAN's customer
    const getResponse = await request.get(
      `${apiBaseUrl}/api/v1/customers/${createdCustomer.id}`,
      {
        headers: {
          Authorization: `Bearer ${admToken}`,
        },
      }
    );

    expect(getResponse.status()).toBe(403);
  });

  test('should allow PLAN to access all customers', async ({ request }) => {
    // Create customer with ADM
    const createResponse = await request.post(
      `${apiBaseUrl}/api/v1/customers`,
      {
        headers: {
          Authorization: `Bearer ${admToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          companyName: 'ADM Customer for PLAN Access',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        },
      }
    );

    expect(createResponse.ok()).toBeTruthy();
    const createdCustomer = await createResponse.json();
    createdCustomerIds.push(createdCustomer.id);

    // PLAN should access ADM's customer
    const getResponse = await request.get(
      `${apiBaseUrl}/api/v1/customers/${createdCustomer.id}`,
      {
        headers: {
          Authorization: `Bearer ${planToken}`,
        },
      }
    );

    expect(getResponse.ok()).toBeTruthy();
    const customer = await getResponse.json();
    expect(customer.id).toBe(createdCustomer.id);
  });

  test('should delete customer (GF only)', async ({ request }) => {
    // Create a customer first
    const createResponse = await request.post(
      `${apiBaseUrl}/api/v1/customers`,
      {
        headers: {
          Authorization: `Bearer ${admToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          companyName: 'Customer for DELETE Test',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        },
      }
    );

    expect(createResponse.ok()).toBeTruthy();
    const createdCustomer = await createResponse.json();

    // GF should delete the customer
    const deleteResponse = await request.delete(
      `${apiBaseUrl}/api/v1/customers/${createdCustomer.id}`,
      {
        headers: {
          Authorization: `Bearer ${gfToken}`,
        },
      }
    );

    expect(deleteResponse.status()).toBe(204);

    // Verify customer is deleted
    const getResponse = await request.get(
      `${apiBaseUrl}/api/v1/customers/${createdCustomer.id}`,
      {
        headers: {
          Authorization: `Bearer ${gfToken}`,
        },
      }
    );

    expect(getResponse.status()).toBe(404);
  });

  test('should prevent ADM from deleting customer', async ({ request }) => {
    // Create a customer
    const createResponse = await request.post(
      `${apiBaseUrl}/api/v1/customers`,
      {
        headers: {
          Authorization: `Bearer ${admToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          companyName: 'Customer ADM Cannot Delete',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        },
      }
    );

    expect(createResponse.ok()).toBeTruthy();
    const createdCustomer = await createResponse.json();
    createdCustomerIds.push(createdCustomer.id);

    // ADM should not delete
    const deleteResponse = await request.delete(
      `${apiBaseUrl}/api/v1/customers/${createdCustomer.id}`,
      {
        headers: {
          Authorization: `Bearer ${admToken}`,
        },
      }
    );

    expect(deleteResponse.status()).toBe(403);
  });

  test('should detect duplicate VAT number', async ({ request }) => {
    // Create first customer
    const createResponse1 = await request.post(
      `${apiBaseUrl}/api/v1/customers`,
      {
        headers: {
          Authorization: `Bearer ${admToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          companyName: 'First Customer',
          vatNumber: 'DE222222222',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        },
      }
    );

    expect(createResponse1.ok()).toBeTruthy();
    const customer1 = await createResponse1.json();
    createdCustomerIds.push(customer1.id);

    // Try to create duplicate with same VAT number
    const createResponse2 = await request.post(
      `${apiBaseUrl}/api/v1/customers`,
      {
        headers: {
          Authorization: `Bearer ${admToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          companyName: 'Second Customer',
          vatNumber: 'DE222222222', // Same VAT number
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
        },
      }
    );

    expect(createResponse2.status()).toBe(409);
    const error = await createResponse2.json();
    expect(error.status).toBe(409);
    expect(error.detail).toContain('duplicate');
  });
});
