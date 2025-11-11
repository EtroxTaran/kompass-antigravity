# KOMPASS Test Strategy Document

**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Status:** Draft

## Cross-References

- **Data Model:** `docs/reviews/DATA_MODEL_SPECIFICATION.md` - Entity structures for test fixtures
- **API Specification:** `docs/reviews/API_SPECIFICATION.md` - Endpoints to test
- **RBAC Matrix:** `docs/reviews/RBAC_PERMISSION_MATRIX.md` - Permission scenarios to test
- **Architecture Rules:** `.cursorrules` - Test pyramid (70/20/10), coverage targets

---

## Table of Contents

1. [Test Strategy Overview](#1-test-strategy-overview)
2. [Test Pyramid (70/20/10)](#2-test-pyramid-702010)
3. [Coverage Targets](#3-coverage-targets)
4. [Location Management Tests (NEW)](#4-location-management-tests-new)
5. [Decision Authority Tests (NEW)](#5-decision-authority-tests-new)
6. [Offline Conflict Tests (NEW)](#6-offline-conflict-tests-new)
7. [Test Data Fixtures](#7-test-data-fixtures)
8. [Future Test Scenarios (Placeholders)](#8-future-test-scenarios-placeholders)

---

## 1. Test Strategy Overview

KOMPASS follows a **70/20/10 test pyramid strategy** as defined in `.cursorrules`:
- **70% Unit Tests** - Fast, isolated tests of business logic
- **20% Integration Tests** - API and database integration tests
- **10% E2E Tests** - End-to-end user workflows with Playwright

### Test Philosophy

1. **Test Behavior, Not Implementation** - Focus on what the code does, not how
2. **Fail Fast** - Tests should run quickly and fail immediately on errors
3. **Deterministic** - Tests must produce same results every time
4. **Isolated** - Each test is independent; no shared state
5. **Readable** - Test names clearly describe what is being tested

### Test File Locations

```
apps/backend/src/modules/customer/
  ├── customer.service.ts
  ├── customer.service.spec.ts          ✅ Unit test (colocated)
  ├── customer.controller.ts
  └── customer.controller.spec.ts       ✅ Unit test (colocated)

apps/backend/src/modules/location/
  ├── location.service.ts
  ├── location.service.spec.ts          ✅ Unit test (colocated)
  ├── location.repository.ts
  └── location.repository.spec.ts       ✅ Unit test (colocated)

tests/integration/
  ├── customer/
  │   └── customer-location-api.integration.spec.ts  ✅ Integration test
  └── contact/
      └── contact-decision-api.integration.spec.ts   ✅ Integration test

tests/e2e/
  ├── location/
  │   ├── create-multi-location-customer.spec.ts    ✅ E2E test
  │   └── location-assignment.spec.ts                ✅ E2E test
  └── contact/
      └── decision-authority-workflow.spec.ts        ✅ E2E test
```

---

## 2. Test Pyramid (70/20/10)

### 70% Unit Tests

**Characteristics:**
- Test individual functions, methods, classes in isolation
- Mock all external dependencies (database, HTTP, external services)
- Run in milliseconds
- No database, no network, no file system

**What to Test:**
- Business logic in services
- Validation rules (DTOs, entities)
- Utility functions
- Data transformations
- Permission checks (with mocked user context)

**Example Unit Test:**
```typescript
// location.service.spec.ts
describe('LocationService', () => {
  let service: LocationService;
  let repository: jest.Mocked<ILocationRepository>;

  beforeEach(async () => {
    repository = {
      findById: jest.fn(),
      findByCustomer: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        LocationService,
        { provide: 'ILocationRepository', useValue: repository },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  describe('validateUniqueLocationName', () => {
    it('should throw error when location name already exists for customer', async () => {
      const existingLocation = { 
        _id: 'location-123', 
        locationName: 'Filiale München',
        customerId: 'customer-456'
      };
      repository.findByCustomerAndName.mockResolvedValue(existingLocation);

      await expect(
        service.validateUniqueLocationName('customer-456', 'Filiale München')
      ).rejects.toThrow('Location name already exists for this customer');
    });

    it('should pass when location name is unique for customer', async () => {
      repository.findByCustomerAndName.mockResolvedValue(null);

      await expect(
        service.validateUniqueLocationName('customer-456', 'Filiale Nürnberg')
      ).resolves.not.toThrow();
    });
  });
});
```

### 20% Integration Tests

**Characteristics:**
- Test multiple components working together
- Use real database (test instance)
- Test HTTP endpoints with real request/response
- Run in seconds

**What to Test:**
- API endpoints (request → controller → service → repository → database)
- Database queries and transactions
- DTO validation and transformation
- Authentication and authorization guards

**Example Integration Test:**
```typescript
// customer-location-api.integration.spec.ts
describe('Location API (Integration)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test-adm@example.com', password: 'test123' });
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/customers/:customerId/locations', () => {
    it('should create location with valid data', async () => {
      const newLocation = {
        locationName: 'Filiale Test',
        locationType: 'branch',
        deliveryAddress: {
          street: 'Teststraße',
          streetNumber: '1',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
        isActive: true,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/customers/customer-test-123/locations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newLocation)
        .expect(201);

      expect(response.body).toMatchObject({
        _id: expect.stringMatching(/^location-/),
        locationName: 'Filiale Test',
        locationType: 'branch',
        customerId: 'customer-test-123',
      });
    });

    it('should return 409 when location name already exists', async () => {
      // Create first location
      await request(app.getHttpServer())
        .post('/api/v1/customers/customer-test-123/locations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ locationName: 'Duplicate', locationType: 'branch', /* ... */ });

      // Try to create duplicate
      const response = await request(app.getHttpServer())
        .post('/api/v1/customers/customer-test-123/locations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ locationName: 'Duplicate', locationType: 'branch', /* ... */ })
        .expect(409);

      expect(response.body).toMatchObject({
        type: expect.stringContaining('conflict'),
        status: 409,
      });
    });
  });
});
```

### 10% E2E Tests

**Characteristics:**
- Test complete user workflows in browser
- Use Playwright for browser automation
- Test UI interactions and user experience
- Run in minutes

**What to Test:**
- Critical user journeys
- Multi-step workflows
- Cross-module integration
- Offline scenarios
- UI validation and feedback

---

## 3. Coverage Targets

### Overall Coverage Requirements

| Metric | Target | Enforcement |
|--------|--------|-------------|
| **Overall Coverage** | ≥ 80% | CI pipeline fails if below |
| **Business Logic (Services)** | ≥ 90% | Critical path |
| **React Components** | ≥ 80% | User-facing code |
| **Utilities** | ≥ 85% | Shared code must be reliable |
| **Controllers/Routes** | ≥ 70% | Covered by integration tests |

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './apps/backend/src/modules/*/services/*.ts': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './packages/shared/src/**/*.ts': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
```

### Coverage Exclusions

Do NOT require coverage for:
- Type definitions (`*.types.ts`, `*.interface.ts`)
- Configuration files (`*.config.ts`)
- Migration scripts (`migrations/*.ts`)
- Mock data (`__mocks__/*.ts`, `fixtures/*.ts`)

---

## 4. Location Management Tests (NEW)

### 4.1 Unit Tests - Location Validation

**Test File:** `apps/backend/src/modules/location/location.service.spec.ts`

#### Test Suite: Location Name Validation

```typescript
describe('LocationService - Validation', () => {
  describe('validateLocationName', () => {
    it('should accept valid location name with German characters', () => {
      const validNames = [
        'Filiale München',
        'Lager Nürnberg',
        'Hauptstandort (Zentrale)',
        'Außenlager 2',
      ];
      validNames.forEach(name => {
        expect(() => service.validateLocationName(name)).not.toThrow();
      });
    });

    it('should reject location names that are too short', () => {
      expect(() => service.validateLocationName('M')).toThrow(
        'Location name must be 2-100 characters'
      );
    });

    it('should reject location names with invalid characters', () => {
      const invalidNames = [
        'Location@123',
        'Filiale#München',
        'Test<script>',
      ];
      invalidNames.forEach(name => {
        expect(() => service.validateLocationName(name)).toThrow(
          'Location name can only contain letters, numbers, and basic punctuation'
        );
      });
    });
  });

  describe('validateUniqueLocationName', () => {
    it('should pass when location name is unique for customer', async () => {
      repository.findByCustomerAndName.mockResolvedValue(null);
      await expect(
        service.validateUniqueLocationName('customer-123', 'New Location')
      ).resolves.not.toThrow();
    });

    it('should throw when location name exists for same customer', async () => {
      const existing = { 
        _id: 'location-456',
        customerId: 'customer-123',
        locationName: 'Existing Location'
      };
      repository.findByCustomerAndName.mockResolvedValue(existing);

      await expect(
        service.validateUniqueLocationName('customer-123', 'Existing Location')
      ).rejects.toThrow('Location name already exists for this customer');
    });

    it('should allow same location name for different customers', async () => {
      repository.findByCustomerAndName.mockResolvedValue(null);
      await expect(
        service.validateUniqueLocationName('customer-789', 'Filiale München')
      ).resolves.not.toThrow();
    });
  });
});
```

#### Test Suite: Primary Contact Validation

```typescript
describe('LocationService - Contact Assignment', () => {
  it('should validate primary contact is in contact list', () => {
    const location = {
      primaryContactPersonId: 'contact-111',
      contactPersons: ['contact-222', 'contact-333'],
    };

    expect(() => service.validatePrimaryContact(location)).toThrow(
      'Primary contact must be in the list of assigned contact persons'
    );
  });

  it('should accept when primary contact is in list', () => {
    const location = {
      primaryContactPersonId: 'contact-111',
      contactPersons: ['contact-111', 'contact-222'],
    };

    expect(() => service.validatePrimaryContact(location)).not.toThrow();
  });

  it('should accept when no primary contact is set', () => {
    const location = {
      primaryContactPersonId: undefined,
      contactPersons: ['contact-111'],
    };

    expect(() => service.validatePrimaryContact(location)).not.toThrow();
  });
});
```

### 4.2 Integration Tests - Location CRUD API

**Test File:** `tests/integration/location/location-crud.integration.spec.ts`

#### Test ID: INT-LOC-001: Create Location
```typescript
it('INT-LOC-001: should create location for customer', async () => {
  const customer = await createTestCustomer();
  const location = {
    locationName: 'Filiale Integration Test',
    locationType: 'branch',
    deliveryAddress: testAddress,
    isActive: true,
  };

  const response = await request(app.getHttpServer())
    .post(`/api/v1/customers/${customer._id}/locations`)
    .set('Authorization', `Bearer ${admToken}`)
    .send(location)
    .expect(201);

  expect(response.body).toMatchObject({
    _id: expect.stringMatching(/^location-/),
    customerId: customer._id,
    locationName: 'Filiale Integration Test',
  });
});
```

#### Test ID: INT-LOC-002: List Customer Locations
```typescript
it('INT-LOC-002: should list all locations for customer', async () => {
  const customer = await createTestCustomer();
  await createTestLocation(customer._id, 'Location 1');
  await createTestLocation(customer._id, 'Location 2');

  const response = await request(app.getHttpServer())
    .get(`/api/v1/customers/${customer._id}/locations`)
    .set('Authorization', `Bearer ${admToken}`)
    .expect(200);

  expect(response.body.data).toHaveLength(2);
  expect(response.body.total).toBe(2);
});
```

#### Test ID: INT-LOC-003: Update Location
```typescript
it('INT-LOC-003: should update location details', async () => {
  const location = await createTestLocation('customer-123', 'Old Name');
  
  const updates = {
    locationName: 'Updated Name',
    deliveryNotes: 'New delivery instructions',
  };

  const response = await request(app.getHttpServer())
    .put(`/api/v1/customers/customer-123/locations/${location._id}`)
    .set('Authorization', `Bearer ${admToken}`)
    .send(updates)
    .expect(200);

  expect(response.body.locationName).toBe('Updated Name');
  expect(response.body.version).toBe(location.version + 1);
});
```

#### Test ID: INT-LOC-004: Delete Location
```typescript
it('INT-LOC-004: should delete location not referenced in projects', async () => {
  const location = await createTestLocation('customer-123', 'To Delete');

  await request(app.getHttpServer())
    .delete(`/api/v1/customers/customer-123/locations/${location._id}`)
    .set('Authorization', `Bearer ${planToken}`)
    .expect(204);

  // Verify deletion
  await request(app.getHttpServer())
    .get(`/api/v1/customers/customer-123/locations/${location._id}`)
    .set('Authorization', `Bearer ${planToken}`)
    .expect(404);
});
```

#### Test ID: INT-LOC-005: Prevent Duplicate Location Names
```typescript
it('INT-LOC-005: should return 409 for duplicate location name', async () => {
  const customer = await createTestCustomer();
  await createTestLocation(customer._id, 'Filiale München');

  const duplicate = {
    locationName: 'Filiale München', // Duplicate
    locationType: 'branch',
    deliveryAddress: testAddress,
    isActive: true,
  };

  const response = await request(app.getHttpServer())
    .post(`/api/v1/customers/${customer._id}/locations`)
    .set('Authorization', `Bearer ${admToken}`)
    .send(duplicate)
    .expect(409);

  expect(response.body.detail).toContain('already exists');
});
```

### 4.3 E2E Tests - Multi-Location Customer Workflows

**Test File:** `tests/e2e/location/multi-location-customer.spec.ts`

#### Test ID: E2E-LOC-001: Create Multi-Location Customer
```typescript
test('E2E-LOC-001: Create customer with headquarters + 2 branches', async ({ page }) => {
  // Login as ADM
  await page.goto('/login');
  await page.fill('[name="email"]', 'adm@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Create customer
  await page.goto('/customers/new');
  await page.fill('[name="companyName"]', 'Bäckerei Müller Franchise GmbH');
  await page.fill('[name="billingAddress.street"]', 'Verwaltungsstraße');
  await page.fill('[name="billingAddress.zipCode"]', '80331');
  await page.fill('[name="billingAddress.city"]', 'München');
  await page.click('button:has-text("Save")');

  // Verify customer created
  await expect(page.locator('h1')).toContainText('Bäckerei Müller Franchise GmbH');

  // Navigate to locations tab
  await page.click('[data-testid="tab-locations"]');

  // Create location 1: Headquarters
  await page.click('button:has-text("Add Location")');
  await page.fill('[name="locationName"]', 'Hauptstandort München');
  await page.selectOption('[name="locationType"]', 'headquarter');
  await page.fill('[name="deliveryAddress.street"]', 'Hauptstraße');
  await page.fill('[name="deliveryAddress.zipCode"]', '80337');
  await page.fill('[name="deliveryAddress.city"]', 'München');
  await page.click('button:has-text("Save Location")');

  // Verify location created
  await expect(page.locator('text=Hauptstandort München')).toBeVisible();

  // Create location 2: Branch Nürnberg
  await page.click('button:has-text("Add Location")');
  await page.fill('[name="locationName"]', 'Filiale Nürnberg');
  await page.selectOption('[name="locationType"]', 'branch');
  await page.fill('[name="deliveryAddress.street"]', 'Hauptmarkt');
  await page.fill('[name="deliveryAddress.zipCode"]', '90403');
  await page.fill('[name="deliveryAddress.city"]', 'Nürnberg');
  await page.click('button:has-text("Save Location")');

  // Verify both locations visible
  await expect(page.locator('[data-testid="location-list"]')).toContainText('Hauptstandort München');
  await expect(page.locator('[data-testid="location-list"]')).toContainText('Filiale Nürnberg');
  
  // Verify location count
  const locationCount = await page.locator('[data-testid="location-card"]').count();
  expect(locationCount).toBe(2);
});
```

#### Test ID: E2E-LOC-002: Assign Contacts to Locations
```typescript
test('E2E-LOC-002: Assign different contacts to different locations', async ({ page }) => {
  // Setup: Create customer with 2 locations and 2 contacts
  const customer = await setupMultiLocationCustomer();
  
  await page.goto(`/customers/${customer._id}`);
  await page.click('[data-testid="tab-locations"]');

  // Edit first location
  await page.click('[data-testid="location-card"]:nth-child(1) button:has-text("Edit")');
  
  // Assign contact
  await page.click('[data-testid="add-contact-button"]');
  await page.selectOption('[name="contactPerson"]', 'contact-store-manager-1');
  await page.check('[name="isPrimary"]');
  await page.click('button:has-text("Save Location")');

  // Verify contact assigned
  await expect(
    page.locator('[data-testid="location-card"]:nth-child(1)')
  ).toContainText('Thomas Schmidt (Primary)');

  // Edit second location
  await page.click('[data-testid="location-card"]:nth-child(2) button:has-text("Edit")');
  await page.click('[data-testid="add-contact-button"]');
  await page.selectOption('[name="contactPerson"]', 'contact-store-manager-2');
  await page.check('[name="isPrimary"]');
  await page.click('button:has-text("Save Location")');

  // Verify different contact assigned
  await expect(
    page.locator('[data-testid="location-card"]:nth-child(2)')
  ).toContainText('Anna Meier (Primary)');
});
```

#### Test ID: E2E-LOC-003: Select Delivery Location in Quote
```typescript
test('E2E-LOC-003: Select delivery location when creating quote', async ({ page }) => {
  const customer = await setupMultiLocationCustomer();
  
  // Create new opportunity
  await page.goto('/opportunities/new');
  await page.selectOption('[name="customer"]', customer._id);
  
  // Delivery location dropdown should appear (multi-location customer)
  await expect(page.locator('[name="deliveryLocationId"]')).toBeVisible();
  
  // Select specific location
  await page.selectOption('[name="deliveryLocationId"]', 'location-branch-nuernberg');
  
  // Verify delivery address preview shows correct location
  await expect(page.locator('[data-testid="delivery-address-preview"]')).toContainText('Hauptmarkt 12, 90403 Nürnberg');
  
  // Complete opportunity creation
  await page.fill('[name="title"]', 'New Store Installation');
  await page.fill('[name="estimatedValue"]', '50000');
  await page.click('button:has-text("Create Opportunity")');
  
  // Verify opportunity created with correct location
  await expect(page.locator('[data-testid="opportunity-details"]')).toContainText('Delivery: Filiale Nürnberg');
});
```

---

## 5. Decision Authority Tests (NEW)

### 5.1 Unit Tests - Decision Authority Validation

**Test File:** `apps/backend/src/modules/contact/contact.service.spec.ts`

#### Test Suite: Approval Limit Validation

```typescript
describe('ContactService - Decision Authority', () => {
  describe('validateApprovalLimit', () => {
    it('should require approval limit when canApproveOrders is true', () => {
      const contact = {
        canApproveOrders: true,
        approvalLimitEur: undefined,
      };

      expect(() => service.validateApprovalLimit(contact)).toThrow(
        'Approval limit required when contact can approve orders'
      );
    });

    it('should accept valid approval limit', () => {
      const contact = {
        canApproveOrders: true,
        approvalLimitEur: 50000,
      };

      expect(() => service.validateApprovalLimit(contact)).not.toThrow();
    });

    it('should allow undefined approval limit when cannot approve', () => {
      const contact = {
        canApproveOrders: false,
        approvalLimitEur: undefined,
      };

      expect(() => service.validateApprovalLimit(contact)).not.toThrow();
    });

    it('should reject negative approval limits', () => {
      const contact = {
        canApproveOrders: true,
        approvalLimitEur: -1000,
      };

      expect(() => service.validateApprovalLimit(contact)).toThrow(
        'Approval limit must be positive'
      );
    });
  });

  describe('checkDecisionMakerExists', () => {
    it('should warn when customer has no decision maker', async () => {
      const contacts = [
        { decisionMakingRole: 'operational_contact' },
        { decisionMakingRole: 'informational' },
      ];
      repository.findByCustomer.mockResolvedValue(contacts);

      const warnings = await service.checkDecisionMakerExists('customer-123');

      expect(warnings).toContainEqual(
        expect.objectContaining({
          level: 'warning',
          message: expect.stringContaining('no decision maker'),
        })
      );
    });

    it('should pass when customer has decision maker', async () => {
      const contacts = [
        { decisionMakingRole: 'decision_maker' },
        { decisionMakingRole: 'operational_contact' },
      ];
      repository.findByCustomer.mockResolvedValue(contacts);

      const warnings = await service.checkDecisionMakerExists('customer-123');

      expect(warnings).toHaveLength(0);
    });
  });
});
```

### 5.2 Integration Tests - Decision Authority API

**Test File:** `tests/integration/contact/decision-authority.integration.spec.ts`

#### Test ID: INT-DEC-001: Get Decision Authority
```typescript
it('INT-DEC-001: should retrieve contact decision authority', async () => {
  const contact = await createTestContact({
    decisionMakingRole: 'key_influencer',
    authorityLevel: 'high',
    canApproveOrders: true,
    approvalLimitEur: 50000,
  });

  const response = await request(app.getHttpServer())
    .get(`/api/v1/contacts/${contact._id}/decision-authority`)
    .set('Authorization', `Bearer ${admToken}`)
    .expect(200);

  expect(response.body).toMatchObject({
    contactId: contact._id,
    decisionMakingRole: 'key_influencer',
    authorityLevel: 'high',
    canApproveOrders: true,
    approvalLimitEur: 50000,
  });
});
```

#### Test ID: INT-DEC-002: Update Decision Authority (ADM+)
```typescript
it('INT-DEC-002: should allow PLAN to update decision authority', async () => {
  const contact = await createTestContact();
  
  const updates = {
    decisionMakingRole: 'decision_maker',
    authorityLevel: 'final_authority',
    canApproveOrders: true,
    approvalLimitEur: 100000,
    functionalRoles: ['owner_ceo', 'purchasing_manager'],
  };

  const response = await request(app.getHttpServer())
    .put(`/api/v1/contacts/${contact._id}/decision-authority`)
    .set('Authorization', `Bearer ${planToken}`)
    .send(updates)
    .expect(200);

  expect(response.body.decisionMakingRole).toBe('decision_maker');
  expect(response.body.approvalLimitEur).toBe(100000);
});
```

#### Test ID: INT-DEC-003: Reject ADM Update (Forbidden)
```typescript
it('INT-DEC-003: should forbid ADM from updating decision authority', async () => {
  const contact = await createTestContact();
  
  const updates = {
    decisionMakingRole: 'decision_maker',
    authorityLevel: 'high',
    canApproveOrders: true,
    approvalLimitEur: 50000,
  };

  const response = await request(app.getHttpServer())
    .put(`/api/v1/contacts/${contact._id}/decision-authority`)
    .set('Authorization', `Bearer ${admToken}`)
    .send(updates)
    .expect(403);

  expect(response.body.detail).toContain('Only ADM+ users');
  expect(response.body.requiredPermission).toBe('Contact.UPDATE_DECISION_ROLE');
});
```

#### Test ID: INT-DEC-004: Validate Approval Limit Required
```typescript
it('INT-DEC-004: should reject when approval limit missing', async () => {
  const contact = await createTestContact();
  
  const invalidUpdates = {
    decisionMakingRole: 'key_influencer',
    canApproveOrders: true,
    // Missing approvalLimitEur
  };

  const response = await request(app.getHttpServer())
    .put(`/api/v1/contacts/${contact._id}/decision-authority`)
    .set('Authorization', `Bearer ${planToken}`)
    .send(invalidUpdates)
    .expect(400);

  expect(response.body.errors).toContainEqual(
    expect.objectContaining({
      field: 'approvalLimitEur',
      message: expect.stringContaining('required'),
    })
  );
});
```

### 5.3 E2E Tests - Decision Authority Workflow

**Test File:** `tests/e2e/contact/decision-authority-workflow.spec.ts`

#### Test ID: E2E-DEC-001: Update Contact to Decision Maker
```typescript
test('E2E-DEC-001: Update contact role with €50k approval limit', async ({ page }) => {
  // Login as PLAN user (has UPDATE_DECISION_ROLE permission)
  await page.goto('/login');
  await page.fill('[name="email"]', 'plan@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Navigate to customer contacts
  await page.goto('/customers/customer-test-123');
  await page.click('[data-testid="tab-contacts"]');

  // Edit contact
  await page.click('[data-testid="contact-card"]:first-child button:has-text("Edit")');

  // Update decision-making role
  await page.selectOption('[name="decisionMakingRole"]', 'key_influencer');
  await page.selectOption('[name="authorityLevel"]', 'high');
  await page.check('[name="canApproveOrders"]');
  await page.fill('[name="approvalLimitEur"]', '50000');

  // Add functional roles
  await page.click('[name="functionalRoles"] [value="purchasing_manager"]');
  await page.click('[name="functionalRoles"] [value="operations_manager"]');

  await page.click('button:has-text("Save Contact")');

  // Verify success message
  await expect(page.locator('.toast-success')).toContainText('Contact updated');

  // Verify badge visible
  await expect(
    page.locator('[data-testid="contact-card"]:first-child')
  ).toContainText('Key Influencer');
  
  // Verify approval limit displayed
  await expect(
    page.locator('[data-testid="contact-card"]:first-child')
  ).toContainText('Approves up to €50,000');
});
```

#### Test ID: E2E-DEC-002: Opportunity Warning for Exceeding Authority
```typescript
test('E2E-DEC-002: Warn when opportunity exceeds contact approval authority', async ({ page }) => {
  // Setup: Create customer with contact (€50k approval limit)
  const customer = await setupCustomerWithDecisionMaker(50000);
  
  await page.goto('/opportunities/new');
  
  // Select customer
  await page.selectOption('[name="customer"]', customer._id);
  
  // Select contact with approval limit
  await page.selectOption('[name="primaryContact"]', 'contact-decision-maker');
  
  // Enter opportunity value exceeding approval limit
  await page.fill('[name="estimatedValue"]', '75000');
  
  // Warning should appear
  await expect(page.locator('[data-testid="approval-warning"]')).toBeVisible();
  await expect(page.locator('[data-testid="approval-warning"]')).toContainText(
    'This opportunity (€75,000) exceeds the contact\'s approval limit (€50,000)'
  );
  await expect(page.locator('[data-testid="approval-warning"]')).toContainText(
    'Additional approval may be required'
  );
  
  // User can still create opportunity (warning, not blocker)
  await page.fill('[name="title"]', 'Large Project');
  await page.click('button:has-text("Create Opportunity")');
  
  // Verify opportunity created with warning flag
  await expect(page.locator('[data-testid="opportunity-details"]')).toContainText('Requires higher approval');
});
```

#### Test ID: E2E-DEC-003: Filter Contacts by Decision Maker
```typescript
test('E2E-DEC-003: Filter contacts by decision-making role', async ({ page }) => {
  await page.goto('/contacts');
  
  // Apply decision maker filter
  await page.click('[data-testid="filter-decision-role"]');
  await page.check('[value="decision_maker"]');
  await page.check('[value="key_influencer"]');
  await page.click('button:has-text("Apply Filters")');
  
  // Verify only decision makers shown
  const contactCards = page.locator('[data-testid="contact-card"]');
  const count = await contactCards.count();
  
  for (let i = 0; i < count; i++) {
    const card = contactCards.nth(i);
    await expect(card).toHaveAttribute('data-role', /(decision_maker|key_influencer)/);
  }
  
  // Verify badge visible on all results
  await expect(page.locator('[data-testid="decision-badge"]')).toHaveCount(count);
});
```

---

## 6. Offline Conflict Tests (NEW)

### 6.1 Unit Tests - Conflict Detection

**Test File:** `apps/backend/src/modules/sync/conflict-resolver.service.spec.ts`

#### Test Suite: Location Address Conflicts

```typescript
describe('ConflictResolverService - Location Conflicts', () => {
  describe('detectLocationConflicts', () => {
    it('should detect delivery address change conflict', () => {
      const localDoc = {
        _id: 'location-123',
        _rev: '2-abc',
        deliveryAddress: {
          street: 'Hauptstraße',
          zipCode: '80331',
          city: 'München',
        },
        modifiedAt: new Date('2025-01-28T10:00:00Z'),
      };

      const remoteDoc = {
        _id: 'location-123',
        _rev: '2-def',
        deliveryAddress: {
          street: 'Nebenstraße',
          zipCode: '80331',
          city: 'München',
        },
        modifiedAt: new Date('2025-01-28T10:05:00Z'),
      };

      const conflicts = service.detectConflicts(localDoc, remoteDoc);

      expect(conflicts).toContainEqual({
        field: 'deliveryAddress.street',
        localValue: 'Hauptstraße',
        remoteValue: 'Nebenstraße',
        type: 'field_conflict',
        resolutionStrategy: 'user_decides',
      });
    });

    it('should auto-resolve non-conflicting field updates', () => {
      const localDoc = {
        _id: 'location-123',
        locationName: 'Filiale München', // Local change
        deliveryNotes: 'Old notes',
      };

      const remoteDoc = {
        _id: 'location-123',
        locationName: 'Filiale München Süd',
        deliveryNotes: 'Updated delivery instructions', // Remote change
      };

      const resolution = service.resolveConflicts(localDoc, remoteDoc);

      // Both changes should be merged
      expect(resolution.merged).toEqual({
        _id: 'location-123',
        locationName: 'Filiale München', // Local wins (later timestamp)
        deliveryNotes: 'Updated delivery instructions', // Remote wins
      });
      expect(resolution.needsUserDecision).toBe(false);
    });
  });
});
```

### 6.2 Integration Tests - Offline Sync

**Test File:** `tests/integration/sync/offline-location-sync.integration.spec.ts`

#### Test ID: INT-SYNC-001: Sync Location Changes After Offline
```typescript
it('INT-SYNC-001: should sync location changes made offline', async () => {
  // Setup: Create location online
  const location = await createTestLocation('customer-123', 'Test Location');
  
  // Simulate offline: Update location in local PouchDB
  const localDB = new PouchDB('test-offline-db');
  location.deliveryNotes = 'Updated offline';
  location._queuedForSync = true;
  await localDB.put(location);
  
  // Simulate going back online: Trigger sync
  const response = await request(app.getHttpServer())
    .post('/api/v1/sync/locations')
    .set('Authorization', `Bearer ${admToken}`)
    .send({ changes: [location] })
    .expect(200);
  
  // Verify changes synced
  expect(response.body.synced).toBe(1);
  expect(response.body.conflicts).toBe(0);
  
  // Verify on server
  const serverLocation = await request(app.getHttpServer())
    .get(`/api/v1/customers/customer-123/locations/${location._id}`)
    .set('Authorization', `Bearer ${admToken}`)
    .expect(200);
  
  expect(serverLocation.body.deliveryNotes).toBe('Updated offline');
});
```

#### Test ID: INT-SYNC-002: Detect and Resolve Conflicts
```typescript
it('INT-SYNC-002: should detect conflicts and require user resolution', async () => {
  const location = await createTestLocation('customer-123', 'Test Location');
  
  // User A updates offline
  const localDB = new PouchDB('user-a-db');
  location.deliveryAddress.street = 'Hauptstraße'; // Change 1
  await localDB.put(location);
  
  // User B updates online (faster)
  await request(app.getHttpServer())
    .put(`/api/v1/customers/customer-123/locations/${location._id}`)
    .set('Authorization', `Bearer ${planToken}`)
    .send({ deliveryAddress: { ...location.deliveryAddress, street: 'Nebenstraße' } })
    .expect(200);
  
  // User A syncs (conflict detected)
  const response = await request(app.getHttpServer())
    .post('/api/v1/sync/locations')
    .set('Authorization', `Bearer ${admToken}`)
    .send({ changes: [location] })
    .expect(409); // Conflict response
  
  expect(response.body.conflicts).toHaveLength(1);
  expect(response.body.conflicts[0]).toMatchObject({
    field: 'deliveryAddress.street',
    localValue: 'Hauptstraße',
    remoteValue: 'Nebenstraße',
    requiresUserDecision: true,
  });
});
```

### 6.3 E2E Tests - Offline Conflict Resolution

**Test File:** `tests/e2e/offline/location-conflict-resolution.spec.ts`

#### Test ID: E2E-SYNC-001: Offline Location Address Change Conflict
```typescript
test('E2E-SYNC-001: Resolve location address conflict after offline edit', async ({ page, context }) => {
  // Setup: Create test location
  const customer = await setupTestCustomer();
  const location = await createTestLocation(customer._id, 'Test Location');
  
  // User A opens location for editing
  await page.goto(`/customers/${customer._id}/locations/${location._id}/edit`);
  
  // Simulate going offline
  await context.setOffline(true);
  
  // User A edits delivery address offline
  await page.fill('[name="deliveryAddress.street"]', 'Offline Street Update');
  await page.click('button:has-text("Save")');
  
  // Verify saved locally
  await expect(page.locator('.toast-info')).toContainText('Saved offline');
  
  // Simulate another user updating online (in separate session)
  await updateLocationOnline(location._id, { 
    deliveryAddress: { street: 'Online Street Update' }
  });
  
  // User A goes back online
  await context.setOffline(false);
  
  // Trigger sync
  await page.click('[data-testid="sync-button"]');
  
  // Conflict detected - UI shows resolution dialog
  await expect(page.locator('[data-testid="conflict-dialog"]')).toBeVisible();
  await expect(page.locator('[data-testid="conflict-dialog"]')).toContainText(
    'Conflict detected in deliveryAddress.street'
  );
  
  // Show both versions
  await expect(page.locator('[data-testid="local-value"]')).toContainText('Offline Street Update');
  await expect(page.locator('[data-testid="remote-value"]')).toContainText('Online Street Update');
  
  // User chooses local version
  await page.click('[data-testid="choose-local"]');
  await page.click('button:has-text("Resolve Conflict")');
  
  // Verify conflict resolved
  await expect(page.locator('.toast-success')).toContainText('Conflict resolved');
  
  // Verify final value
  const finalLocation = await page.locator('[data-testid="delivery-address"]');
  await expect(finalLocation).toContainText('Offline Street Update');
});
```

---

## 7. Test Data Fixtures

### 7.1 Customer Fixtures

```typescript
// tests/fixtures/customers.fixture.ts
export const createTestCustomer = (overrides?: Partial<Customer>): Customer => {
  return {
    _id: `customer-${generateId()}`,
    _rev: '1-abc',
    type: 'customer',
    companyName: 'Test GmbH',
    vatNumber: 'DE123456789',
    billingAddress: {
      street: 'Teststraße',
      streetNumber: '1',
      zipCode: '80331',
      city: 'München',
      country: 'Deutschland',
    },
    locations: [],
    owner: 'user-adm-001',
    contactPersons: [],
    createdBy: 'user-adm-001',
    createdAt: new Date(),
    modifiedBy: 'user-adm-001',
    modifiedAt: new Date(),
    version: 1,
    ...overrides,
  };
};

export const createMultiLocationCustomer = (): Customer => {
  const customer = createTestCustomer({
    companyName: 'Multi-Location Franchise GmbH',
    locations: ['location-hq', 'location-branch-1', 'location-branch-2'],
    defaultDeliveryLocationId: 'location-hq',
  });
  return customer;
};
```

### 7.2 Location Fixtures

```typescript
// tests/fixtures/locations.fixture.ts
export const createTestLocation = (
  customerId: string,
  overrides?: Partial<Location>
): Location => {
  return {
    _id: `location-${generateId()}`,
    _rev: '1-def',
    type: 'location',
    customerId,
    locationName: 'Test Location',
    locationType: 'branch',
    isActive: true,
    deliveryAddress: {
      street: 'Delivery Street',
      streetNumber: '10',
      zipCode: '80331',
      city: 'München',
      country: 'Deutschland',
    },
    contactPersons: [],
    createdBy: 'user-adm-001',
    createdAt: new Date(),
    modifiedBy: 'user-adm-001',
    modifiedAt: new Date(),
    version: 1,
    ...overrides,
  };
};

export const testAddress: Address = {
  street: 'Hauptstraße',
  streetNumber: '15',
  zipCode: '80331',
  city: 'München',
  country: 'Deutschland',
};
```

### 7.3 Contact Fixtures

```typescript
// tests/fixtures/contacts.fixture.ts
export const createTestContact = (overrides?: Partial<ContactPerson>): ContactPerson => {
  return {
    _id: `contact-${generateId()}`,
    _rev: '1-ghi',
    type: 'contact',
    firstName: 'Thomas',
    lastName: 'Schmidt',
    position: 'Manager',
    email: 'thomas.schmidt@test.de',
    phone: '+49-89-1234567',
    customerId: 'customer-test-123',
    decisionMakingRole: 'operational_contact',
    authorityLevel: 'low',
    canApproveOrders: false,
    functionalRoles: [],
    departmentInfluence: [],
    assignedLocationIds: [],
    isPrimaryContactForLocations: [],
    createdBy: 'user-adm-001',
    createdAt: new Date(),
    modifiedBy: 'user-adm-001',
    modifiedAt: new Date(),
    version: 1,
    ...overrides,
  };
};

export const createDecisionMakerContact = (approvalLimit: number): ContactPerson => {
  return createTestContact({
    firstName: 'Anna',
    lastName: 'Müller',
    position: 'Geschäftsführerin',
    decisionMakingRole: 'decision_maker',
    authorityLevel: 'final_authority',
    canApproveOrders: true,
    approvalLimitEur: approvalLimit,
    functionalRoles: ['owner_ceo', 'purchasing_manager'],
    departmentInfluence: ['purchasing', 'operations', 'finance'],
  });
};
```

---

## 8. Future Test Scenarios (Placeholders)

### Customer CRUD Tests (TBD)
- Unit: Customer validation (company name, VAT number, email)
- Integration: Customer CRUD API endpoints
- E2E: Create customer workflow, duplicate detection

### Opportunity Workflow Tests (TBD)
- Unit: Opportunity status transitions, probability validation
- Integration: Opportunity API with approval checks
- E2E: Lead → Opportunity → Won workflow with location selection

### Project Management Tests (TBD)
- Unit: Project budget validation, date constraints
- Integration: Project creation with location assignment
- E2E: Opportunity → Project conversion with delivery location

### Full CRM Workflow Tests (TBD)
- E2E: Complete sales cycle (Lead → Customer → Opportunity → Project → Invoice)
- E2E: Multi-user collaboration scenarios
- E2E: Offline-first complete workflows

### Performance Tests (TBD)
- Load: 20 concurrent users performing CRUD operations
- Stress: Database with 5,000 customers, 10,000 locations
- Sync: 100 offline changes syncing simultaneously

---

## Document History

| Version | Date       | Author | Changes |
|---------|------------|--------|---------|
| 1.0     | 2025-01-28 | System | Initial specification: 70/20/10 pyramid, coverage targets, location management tests, decision authority tests, offline conflict tests, test fixtures |

---

**End of TEST_STRATEGY_DOCUMENT.md**

