# Test Strategy

**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Status:** ✅ Finalized

## Cross-References

- **Data Model:** `docs/specifications/data-model.md` - Entity structures for test fixtures
- **API Specification:** `docs/specifications/api-specification.md` - Endpoints to test
- **RBAC Matrix:** `docs/specifications/rbac-permissions.md` - Permission scenarios to test
- **Architecture Rules:** `.cursor/rules/*.mdc` - Test pyramid (70/20/10), coverage targets

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
9. [Calendar & Resource Management Tests (NEW)](#9-calendar--resource-management-tests-new)

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
describe("LocationService", () => {
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
        { provide: "ILocationRepository", useValue: repository },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  describe("validateUniqueLocationName", () => {
    it("should throw error when location name already exists for customer", async () => {
      const existingLocation = {
        _id: "location-123",
        locationName: "Filiale München",
        customerId: "customer-456",
      };
      repository.findByCustomerAndName.mockResolvedValue(existingLocation);

      await expect(
        service.validateUniqueLocationName("customer-456", "Filiale München"),
      ).rejects.toThrow("Location name already exists for this customer");
    });

    it("should pass when location name is unique for customer", async () => {
      repository.findByCustomerAndName.mockResolvedValue(null);

      await expect(
        service.validateUniqueLocationName("customer-456", "Filiale Nürnberg"),
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
describe("Location API (Integration)", () => {
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
      .post("/auth/login")
      .send({ email: "test-adm@example.com", password: "test123" });
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /api/v1/customers/:customerId/locations", () => {
    it("should create location with valid data", async () => {
      const newLocation = {
        locationName: "Filiale Test",
        locationType: "branch",
        deliveryAddress: {
          street: "Teststraße",
          streetNumber: "1",
          zipCode: "80331",
          city: "München",
          country: "Deutschland",
        },
        isActive: true,
      };

      const response = await request(app.getHttpServer())
        .post("/api/v1/customers/customer-test-123/locations")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newLocation)
        .expect(201);

      expect(response.body).toMatchObject({
        _id: expect.stringMatching(/^location-/),
        locationName: "Filiale Test",
        locationType: "branch",
        customerId: "customer-test-123",
      });
    });

    it("should return 409 when location name already exists", async () => {
      // Create first location
      await request(app.getHttpServer())
        .post("/api/v1/customers/customer-test-123/locations")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ locationName: "Duplicate", locationType: "branch" /* ... */ });

      // Try to create duplicate
      const response = await request(app.getHttpServer())
        .post("/api/v1/customers/customer-test-123/locations")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ locationName: "Duplicate", locationType: "branch" /* ... */ })
        .expect(409);

      expect(response.body).toMatchObject({
        type: expect.stringContaining("conflict"),
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

| Metric                        | Target | Enforcement                  |
| ----------------------------- | ------ | ---------------------------- |
| **Overall Coverage**          | ≥ 80%  | CI pipeline fails if below   |
| **Business Logic (Services)** | ≥ 90%  | Critical path                |
| **React Components**          | ≥ 80%  | User-facing code             |
| **Utilities**                 | ≥ 85%  | Shared code must be reliable |
| **Controllers/Routes**        | ≥ 70%  | Covered by integration tests |

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
    "./apps/backend/src/modules/*/services/*.ts": {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    "./packages/shared/src/**/*.ts": {
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
describe("LocationService - Validation", () => {
  describe("validateLocationName", () => {
    it("should accept valid location name with German characters", () => {
      const validNames = [
        "Filiale München",
        "Lager Nürnberg",
        "Hauptstandort (Zentrale)",
        "Außenlager 2",
      ];
      validNames.forEach((name) => {
        expect(() => service.validateLocationName(name)).not.toThrow();
      });
    });

    it("should reject location names that are too short", () => {
      expect(() => service.validateLocationName("M")).toThrow(
        "Location name must be 2-100 characters",
      );
    });

    it("should reject location names with invalid characters", () => {
      const invalidNames = ["Location@123", "Filiale#München", "Test<script>"];
      invalidNames.forEach((name) => {
        expect(() => service.validateLocationName(name)).toThrow(
          "Location name can only contain letters, numbers, and basic punctuation",
        );
      });
    });
  });

  describe("validateUniqueLocationName", () => {
    it("should pass when location name is unique for customer", async () => {
      repository.findByCustomerAndName.mockResolvedValue(null);
      await expect(
        service.validateUniqueLocationName("customer-123", "New Location"),
      ).resolves.not.toThrow();
    });

    it("should throw when location name exists for same customer", async () => {
      const existing = {
        _id: "location-456",
        customerId: "customer-123",
        locationName: "Existing Location",
      };
      repository.findByCustomerAndName.mockResolvedValue(existing);

      await expect(
        service.validateUniqueLocationName("customer-123", "Existing Location"),
      ).rejects.toThrow("Location name already exists for this customer");
    });

    it("should allow same location name for different customers", async () => {
      repository.findByCustomerAndName.mockResolvedValue(null);
      await expect(
        service.validateUniqueLocationName("customer-789", "Filiale München"),
      ).resolves.not.toThrow();
    });
  });
});
```

#### Test Suite: Primary Contact Validation

```typescript
describe("LocationService - Contact Assignment", () => {
  it("should validate primary contact is in contact list", () => {
    const location = {
      primaryContactPersonId: "contact-111",
      contactPersons: ["contact-222", "contact-333"],
    };

    expect(() => service.validatePrimaryContact(location)).toThrow(
      "Primary contact must be in the list of assigned contact persons",
    );
  });

  it("should accept when primary contact is in list", () => {
    const location = {
      primaryContactPersonId: "contact-111",
      contactPersons: ["contact-111", "contact-222"],
    };

    expect(() => service.validatePrimaryContact(location)).not.toThrow();
  });

  it("should accept when no primary contact is set", () => {
    const location = {
      primaryContactPersonId: undefined,
      contactPersons: ["contact-111"],
    };

    expect(() => service.validatePrimaryContact(location)).not.toThrow();
  });
});
```

### 4.2 Integration Tests - Location CRUD API

**Test File:** `tests/integration/location/location-crud.integration.spec.ts`

#### Test ID: INT-LOC-001: Create Location

```typescript
it("INT-LOC-001: should create location for customer", async () => {
  const customer = await createTestCustomer();
  const location = {
    locationName: "Filiale Integration Test",
    locationType: "branch",
    deliveryAddress: testAddress,
    isActive: true,
  };

  const response = await request(app.getHttpServer())
    .post(`/api/v1/customers/${customer._id}/locations`)
    .set("Authorization", `Bearer ${admToken}`)
    .send(location)
    .expect(201);

  expect(response.body).toMatchObject({
    _id: expect.stringMatching(/^location-/),
    customerId: customer._id,
    locationName: "Filiale Integration Test",
  });
});
```

#### Test ID: INT-LOC-002: List Customer Locations

```typescript
it("INT-LOC-002: should list all locations for customer", async () => {
  const customer = await createTestCustomer();
  await createTestLocation(customer._id, "Location 1");
  await createTestLocation(customer._id, "Location 2");

  const response = await request(app.getHttpServer())
    .get(`/api/v1/customers/${customer._id}/locations`)
    .set("Authorization", `Bearer ${admToken}`)
    .expect(200);

  expect(response.body.data).toHaveLength(2);
  expect(response.body.total).toBe(2);
});
```

#### Test ID: INT-LOC-003: Update Location

```typescript
it("INT-LOC-003: should update location details", async () => {
  const location = await createTestLocation("customer-123", "Old Name");

  const updates = {
    locationName: "Updated Name",
    deliveryNotes: "New delivery instructions",
  };

  const response = await request(app.getHttpServer())
    .put(`/api/v1/customers/customer-123/locations/${location._id}`)
    .set("Authorization", `Bearer ${admToken}`)
    .send(updates)
    .expect(200);

  expect(response.body.locationName).toBe("Updated Name");
  expect(response.body.version).toBe(location.version + 1);
});
```

#### Test ID: INT-LOC-004: Delete Location

```typescript
it("INT-LOC-004: should delete location not referenced in projects", async () => {
  const location = await createTestLocation("customer-123", "To Delete");

  await request(app.getHttpServer())
    .delete(`/api/v1/customers/customer-123/locations/${location._id}`)
    .set("Authorization", `Bearer ${planToken}`)
    .expect(204);

  // Verify deletion
  await request(app.getHttpServer())
    .get(`/api/v1/customers/customer-123/locations/${location._id}`)
    .set("Authorization", `Bearer ${planToken}`)
    .expect(404);
});
```

#### Test ID: INT-LOC-005: Prevent Duplicate Location Names

```typescript
it("INT-LOC-005: should return 409 for duplicate location name", async () => {
  const customer = await createTestCustomer();
  await createTestLocation(customer._id, "Filiale München");

  const duplicate = {
    locationName: "Filiale München", // Duplicate
    locationType: "branch",
    deliveryAddress: testAddress,
    isActive: true,
  };

  const response = await request(app.getHttpServer())
    .post(`/api/v1/customers/${customer._id}/locations`)
    .set("Authorization", `Bearer ${admToken}`)
    .send(duplicate)
    .expect(409);

  expect(response.body.detail).toContain("already exists");
});
```

### 4.3 E2E Tests - Multi-Location Customer Workflows

**Test File:** `tests/e2e/location/multi-location-customer.spec.ts`

#### Test ID: E2E-LOC-001: Create Multi-Location Customer

```typescript
test("E2E-LOC-001: Create customer with headquarters + 2 branches", async ({
  page,
}) => {
  // Login as ADM
  await page.goto("/login");
  await page.fill('[name="email"]', "adm@example.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');

  // Create customer
  await page.goto("/customers/new");
  await page.fill('[name="companyName"]', "Bäckerei Müller Franchise GmbH");
  await page.fill('[name="billingAddress.street"]', "Verwaltungsstraße");
  await page.fill('[name="billingAddress.zipCode"]', "80331");
  await page.fill('[name="billingAddress.city"]', "München");
  await page.click('button:has-text("Save")');

  // Verify customer created
  await expect(page.locator("h1")).toContainText(
    "Bäckerei Müller Franchise GmbH",
  );

  // Navigate to locations tab
  await page.click('[data-testid="tab-locations"]');

  // Create location 1: Headquarters
  await page.click('button:has-text("Add Location")');
  await page.fill('[name="locationName"]', "Hauptstandort München");
  await page.selectOption('[name="locationType"]', "headquarter");
  await page.fill('[name="deliveryAddress.street"]', "Hauptstraße");
  await page.fill('[name="deliveryAddress.zipCode"]', "80337");
  await page.fill('[name="deliveryAddress.city"]', "München");
  await page.click('button:has-text("Save Location")');

  // Verify location created
  await expect(page.locator("text=Hauptstandort München")).toBeVisible();

  // Create location 2: Branch Nürnberg
  await page.click('button:has-text("Add Location")');
  await page.fill('[name="locationName"]', "Filiale Nürnberg");
  await page.selectOption('[name="locationType"]', "branch");
  await page.fill('[name="deliveryAddress.street"]', "Hauptmarkt");
  await page.fill('[name="deliveryAddress.zipCode"]', "90403");
  await page.fill('[name="deliveryAddress.city"]', "Nürnberg");
  await page.click('button:has-text("Save Location")');

  // Verify both locations visible
  await expect(page.locator('[data-testid="location-list"]')).toContainText(
    "Hauptstandort München",
  );
  await expect(page.locator('[data-testid="location-list"]')).toContainText(
    "Filiale Nürnberg",
  );

  // Verify location count
  const locationCount = await page
    .locator('[data-testid="location-card"]')
    .count();
  expect(locationCount).toBe(2);
});
```

#### Test ID: E2E-LOC-002: Assign Contacts to Locations

```typescript
test("E2E-LOC-002: Assign different contacts to different locations", async ({
  page,
}) => {
  // Setup: Create customer with 2 locations and 2 contacts
  const customer = await setupMultiLocationCustomer();

  await page.goto(`/customers/${customer._id}`);
  await page.click('[data-testid="tab-locations"]');

  // Edit first location
  await page.click(
    '[data-testid="location-card"]:nth-child(1) button:has-text("Edit")',
  );

  // Assign contact
  await page.click('[data-testid="add-contact-button"]');
  await page.selectOption('[name="contactPerson"]', "contact-store-manager-1");
  await page.check('[name="isPrimary"]');
  await page.click('button:has-text("Save Location")');

  // Verify contact assigned
  await expect(
    page.locator('[data-testid="location-card"]:nth-child(1)'),
  ).toContainText("Thomas Schmidt (Primary)");

  // Edit second location
  await page.click(
    '[data-testid="location-card"]:nth-child(2) button:has-text("Edit")',
  );
  await page.click('[data-testid="add-contact-button"]');
  await page.selectOption('[name="contactPerson"]', "contact-store-manager-2");
  await page.check('[name="isPrimary"]');
  await page.click('button:has-text("Save Location")');

  // Verify different contact assigned
  await expect(
    page.locator('[data-testid="location-card"]:nth-child(2)'),
  ).toContainText("Anna Meier (Primary)");
});
```

#### Test ID: E2E-LOC-003: Select Delivery Location in Quote

```typescript
test("E2E-LOC-003: Select delivery location when creating quote", async ({
  page,
}) => {
  const customer = await setupMultiLocationCustomer();

  // Create new opportunity
  await page.goto("/opportunities/new");
  await page.selectOption('[name="customer"]', customer._id);

  // Delivery location dropdown should appear (multi-location customer)
  await expect(page.locator('[name="deliveryLocationId"]')).toBeVisible();

  // Select specific location
  await page.selectOption(
    '[name="deliveryLocationId"]',
    "location-branch-nuernberg",
  );

  // Verify delivery address preview shows correct location
  await expect(
    page.locator('[data-testid="delivery-address-preview"]'),
  ).toContainText("Hauptmarkt 12, 90403 Nürnberg");

  // Complete opportunity creation
  await page.fill('[name="title"]', "New Store Installation");
  await page.fill('[name="estimatedValue"]', "50000");
  await page.click('button:has-text("Create Opportunity")');

  // Verify opportunity created with correct location
  await expect(
    page.locator('[data-testid="opportunity-details"]'),
  ).toContainText("Delivery: Filiale Nürnberg");
});
```

---

## 5. Decision Authority Tests (NEW)

### 5.1 Unit Tests - Decision Authority Validation

**Test File:** `apps/backend/src/modules/contact/contact.service.spec.ts`

#### Test Suite: Approval Limit Validation

```typescript
describe("ContactService - Decision Authority", () => {
  describe("validateApprovalLimit", () => {
    it("should require approval limit when canApproveOrders is true", () => {
      const contact = {
        canApproveOrders: true,
        approvalLimitEur: undefined,
      };

      expect(() => service.validateApprovalLimit(contact)).toThrow(
        "Approval limit required when contact can approve orders",
      );
    });

    it("should accept valid approval limit", () => {
      const contact = {
        canApproveOrders: true,
        approvalLimitEur: 50000,
      };

      expect(() => service.validateApprovalLimit(contact)).not.toThrow();
    });

    it("should allow undefined approval limit when cannot approve", () => {
      const contact = {
        canApproveOrders: false,
        approvalLimitEur: undefined,
      };

      expect(() => service.validateApprovalLimit(contact)).not.toThrow();
    });

    it("should reject negative approval limits", () => {
      const contact = {
        canApproveOrders: true,
        approvalLimitEur: -1000,
      };

      expect(() => service.validateApprovalLimit(contact)).toThrow(
        "Approval limit must be positive",
      );
    });
  });

  describe("checkDecisionMakerExists", () => {
    it("should warn when customer has no decision maker", async () => {
      const contacts = [
        { decisionMakingRole: "operational_contact" },
        { decisionMakingRole: "informational" },
      ];
      repository.findByCustomer.mockResolvedValue(contacts);

      const warnings = await service.checkDecisionMakerExists("customer-123");

      expect(warnings).toContainEqual(
        expect.objectContaining({
          level: "warning",
          message: expect.stringContaining("no decision maker"),
        }),
      );
    });

    it("should pass when customer has decision maker", async () => {
      const contacts = [
        { decisionMakingRole: "decision_maker" },
        { decisionMakingRole: "operational_contact" },
      ];
      repository.findByCustomer.mockResolvedValue(contacts);

      const warnings = await service.checkDecisionMakerExists("customer-123");

      expect(warnings).toHaveLength(0);
    });
  });
});
```

### 5.2 Integration Tests - Decision Authority API

**Test File:** `tests/integration/contact/decision-authority.integration.spec.ts`

#### Test ID: INT-DEC-001: Get Decision Authority

```typescript
it("INT-DEC-001: should retrieve contact decision authority", async () => {
  const contact = await createTestContact({
    decisionMakingRole: "key_influencer",
    authorityLevel: "high",
    canApproveOrders: true,
    approvalLimitEur: 50000,
  });

  const response = await request(app.getHttpServer())
    .get(`/api/v1/contacts/${contact._id}/decision-authority`)
    .set("Authorization", `Bearer ${admToken}`)
    .expect(200);

  expect(response.body).toMatchObject({
    contactId: contact._id,
    decisionMakingRole: "key_influencer",
    authorityLevel: "high",
    canApproveOrders: true,
    approvalLimitEur: 50000,
  });
});
```

#### Test ID: INT-DEC-002: Update Decision Authority (ADM+)

```typescript
it("INT-DEC-002: should allow PLAN to update decision authority", async () => {
  const contact = await createTestContact();

  const updates = {
    decisionMakingRole: "decision_maker",
    authorityLevel: "final_authority",
    canApproveOrders: true,
    approvalLimitEur: 100000,
    functionalRoles: ["owner_ceo", "purchasing_manager"],
  };

  const response = await request(app.getHttpServer())
    .put(`/api/v1/contacts/${contact._id}/decision-authority`)
    .set("Authorization", `Bearer ${planToken}`)
    .send(updates)
    .expect(200);

  expect(response.body.decisionMakingRole).toBe("decision_maker");
  expect(response.body.approvalLimitEur).toBe(100000);
});
```

#### Test ID: INT-DEC-003: Reject ADM Update (Forbidden)

```typescript
it("INT-DEC-003: should forbid ADM from updating decision authority", async () => {
  const contact = await createTestContact();

  const updates = {
    decisionMakingRole: "decision_maker",
    authorityLevel: "high",
    canApproveOrders: true,
    approvalLimitEur: 50000,
  };

  const response = await request(app.getHttpServer())
    .put(`/api/v1/contacts/${contact._id}/decision-authority`)
    .set("Authorization", `Bearer ${admToken}`)
    .send(updates)
    .expect(403);

  expect(response.body.detail).toContain("Only ADM+ users");
  expect(response.body.requiredPermission).toBe("Contact.UPDATE_DECISION_ROLE");
});
```

#### Test ID: INT-DEC-004: Validate Approval Limit Required

```typescript
it("INT-DEC-004: should reject when approval limit missing", async () => {
  const contact = await createTestContact();

  const invalidUpdates = {
    decisionMakingRole: "key_influencer",
    canApproveOrders: true,
    // Missing approvalLimitEur
  };

  const response = await request(app.getHttpServer())
    .put(`/api/v1/contacts/${contact._id}/decision-authority`)
    .set("Authorization", `Bearer ${planToken}`)
    .send(invalidUpdates)
    .expect(400);

  expect(response.body.errors).toContainEqual(
    expect.objectContaining({
      field: "approvalLimitEur",
      message: expect.stringContaining("required"),
    }),
  );
});
```

### 5.3 E2E Tests - Decision Authority Workflow

**Test File:** `tests/e2e/contact/decision-authority-workflow.spec.ts`

#### Test ID: E2E-DEC-001: Update Contact to Decision Maker

```typescript
test("E2E-DEC-001: Update contact role with €50k approval limit", async ({
  page,
}) => {
  // Login as PLAN user (has UPDATE_DECISION_ROLE permission)
  await page.goto("/login");
  await page.fill('[name="email"]', "plan@example.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');

  // Navigate to customer contacts
  await page.goto("/customers/customer-test-123");
  await page.click('[data-testid="tab-contacts"]');

  // Edit contact
  await page.click(
    '[data-testid="contact-card"]:first-child button:has-text("Edit")',
  );

  // Update decision-making role
  await page.selectOption('[name="decisionMakingRole"]', "key_influencer");
  await page.selectOption('[name="authorityLevel"]', "high");
  await page.check('[name="canApproveOrders"]');
  await page.fill('[name="approvalLimitEur"]', "50000");

  // Add functional roles
  await page.click('[name="functionalRoles"] [value="purchasing_manager"]');
  await page.click('[name="functionalRoles"] [value="operations_manager"]');

  await page.click('button:has-text("Save Contact")');

  // Verify success message
  await expect(page.locator(".toast-success")).toContainText("Contact updated");

  // Verify badge visible
  await expect(
    page.locator('[data-testid="contact-card"]:first-child'),
  ).toContainText("Key Influencer");

  // Verify approval limit displayed
  await expect(
    page.locator('[data-testid="contact-card"]:first-child'),
  ).toContainText("Approves up to €50,000");
});
```

#### Test ID: E2E-DEC-002: Opportunity Warning for Exceeding Authority

```typescript
test("E2E-DEC-002: Warn when opportunity exceeds contact approval authority", async ({
  page,
}) => {
  // Setup: Create customer with contact (€50k approval limit)
  const customer = await setupCustomerWithDecisionMaker(50000);

  await page.goto("/opportunities/new");

  // Select customer
  await page.selectOption('[name="customer"]', customer._id);

  // Select contact with approval limit
  await page.selectOption('[name="primaryContact"]', "contact-decision-maker");

  // Enter opportunity value exceeding approval limit
  await page.fill('[name="estimatedValue"]', "75000");

  // Warning should appear
  await expect(page.locator('[data-testid="approval-warning"]')).toBeVisible();
  await expect(page.locator('[data-testid="approval-warning"]')).toContainText(
    "This opportunity (€75,000) exceeds the contact's approval limit (€50,000)",
  );
  await expect(page.locator('[data-testid="approval-warning"]')).toContainText(
    "Additional approval may be required",
  );

  // User can still create opportunity (warning, not blocker)
  await page.fill('[name="title"]', "Large Project");
  await page.click('button:has-text("Create Opportunity")');

  // Verify opportunity created with warning flag
  await expect(
    page.locator('[data-testid="opportunity-details"]'),
  ).toContainText("Requires higher approval");
});
```

#### Test ID: E2E-DEC-003: Filter Contacts by Decision Maker

```typescript
test("E2E-DEC-003: Filter contacts by decision-making role", async ({
  page,
}) => {
  await page.goto("/contacts");

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
    await expect(card).toHaveAttribute(
      "data-role",
      /(decision_maker|key_influencer)/,
    );
  }

  // Verify badge visible on all results
  await expect(page.locator('[data-testid="decision-badge"]')).toHaveCount(
    count,
  );
});
```

---

## 6. Offline Conflict Tests (NEW)

### 6.1 Unit Tests - Conflict Detection

**Test File:** `apps/backend/src/modules/sync/conflict-resolver.service.spec.ts`

#### Test Suite: Location Address Conflicts

```typescript
describe("ConflictResolverService - Location Conflicts", () => {
  describe("detectLocationConflicts", () => {
    it("should detect delivery address change conflict", () => {
      const localDoc = {
        _id: "location-123",
        _rev: "2-abc",
        deliveryAddress: {
          street: "Hauptstraße",
          zipCode: "80331",
          city: "München",
        },
        modifiedAt: new Date("2025-01-28T10:00:00Z"),
      };

      const remoteDoc = {
        _id: "location-123",
        _rev: "2-def",
        deliveryAddress: {
          street: "Nebenstraße",
          zipCode: "80331",
          city: "München",
        },
        modifiedAt: new Date("2025-01-28T10:05:00Z"),
      };

      const conflicts = service.detectConflicts(localDoc, remoteDoc);

      expect(conflicts).toContainEqual({
        field: "deliveryAddress.street",
        localValue: "Hauptstraße",
        remoteValue: "Nebenstraße",
        type: "field_conflict",
        resolutionStrategy: "user_decides",
      });
    });

    it("should auto-resolve non-conflicting field updates", () => {
      const localDoc = {
        _id: "location-123",
        locationName: "Filiale München", // Local change
        deliveryNotes: "Old notes",
      };

      const remoteDoc = {
        _id: "location-123",
        locationName: "Filiale München Süd",
        deliveryNotes: "Updated delivery instructions", // Remote change
      };

      const resolution = service.resolveConflicts(localDoc, remoteDoc);

      // Both changes should be merged
      expect(resolution.merged).toEqual({
        _id: "location-123",
        locationName: "Filiale München", // Local wins (later timestamp)
        deliveryNotes: "Updated delivery instructions", // Remote wins
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
it("INT-SYNC-001: should sync location changes made offline", async () => {
  // Setup: Create location online
  const location = await createTestLocation("customer-123", "Test Location");

  // Simulate offline: Update location in local PouchDB
  const localDB = new PouchDB("test-offline-db");
  location.deliveryNotes = "Updated offline";
  location._queuedForSync = true;
  await localDB.put(location);

  // Simulate going back online: Trigger sync
  const response = await request(app.getHttpServer())
    .post("/api/v1/sync/locations")
    .set("Authorization", `Bearer ${admToken}`)
    .send({ changes: [location] })
    .expect(200);

  // Verify changes synced
  expect(response.body.synced).toBe(1);
  expect(response.body.conflicts).toBe(0);

  // Verify on server
  const serverLocation = await request(app.getHttpServer())
    .get(`/api/v1/customers/customer-123/locations/${location._id}`)
    .set("Authorization", `Bearer ${admToken}`)
    .expect(200);

  expect(serverLocation.body.deliveryNotes).toBe("Updated offline");
});
```

#### Test ID: INT-SYNC-002: Detect and Resolve Conflicts

```typescript
it("INT-SYNC-002: should detect conflicts and require user resolution", async () => {
  const location = await createTestLocation("customer-123", "Test Location");

  // User A updates offline
  const localDB = new PouchDB("user-a-db");
  location.deliveryAddress.street = "Hauptstraße"; // Change 1
  await localDB.put(location);

  // User B updates online (faster)
  await request(app.getHttpServer())
    .put(`/api/v1/customers/customer-123/locations/${location._id}`)
    .set("Authorization", `Bearer ${planToken}`)
    .send({
      deliveryAddress: { ...location.deliveryAddress, street: "Nebenstraße" },
    })
    .expect(200);

  // User A syncs (conflict detected)
  const response = await request(app.getHttpServer())
    .post("/api/v1/sync/locations")
    .set("Authorization", `Bearer ${admToken}`)
    .send({ changes: [location] })
    .expect(409); // Conflict response

  expect(response.body.conflicts).toHaveLength(1);
  expect(response.body.conflicts[0]).toMatchObject({
    field: "deliveryAddress.street",
    localValue: "Hauptstraße",
    remoteValue: "Nebenstraße",
    requiresUserDecision: true,
  });
});
```

### 6.3 E2E Tests - Offline Conflict Resolution

**Test File:** `tests/e2e/offline/location-conflict-resolution.spec.ts`

#### Test ID: E2E-SYNC-001: Offline Location Address Change Conflict

```typescript
test("E2E-SYNC-001: Resolve location address conflict after offline edit", async ({
  page,
  context,
}) => {
  // Setup: Create test location
  const customer = await setupTestCustomer();
  const location = await createTestLocation(customer._id, "Test Location");

  // User A opens location for editing
  await page.goto(`/customers/${customer._id}/locations/${location._id}/edit`);

  // Simulate going offline
  await context.setOffline(true);

  // User A edits delivery address offline
  await page.fill('[name="deliveryAddress.street"]', "Offline Street Update");
  await page.click('button:has-text("Save")');

  // Verify saved locally
  await expect(page.locator(".toast-info")).toContainText("Saved offline");

  // Simulate another user updating online (in separate session)
  await updateLocationOnline(location._id, {
    deliveryAddress: { street: "Online Street Update" },
  });

  // User A goes back online
  await context.setOffline(false);

  // Trigger sync
  await page.click('[data-testid="sync-button"]');

  // Conflict detected - UI shows resolution dialog
  await expect(page.locator('[data-testid="conflict-dialog"]')).toBeVisible();
  await expect(page.locator('[data-testid="conflict-dialog"]')).toContainText(
    "Conflict detected in deliveryAddress.street",
  );

  // Show both versions
  await expect(page.locator('[data-testid="local-value"]')).toContainText(
    "Offline Street Update",
  );
  await expect(page.locator('[data-testid="remote-value"]')).toContainText(
    "Online Street Update",
  );

  // User chooses local version
  await page.click('[data-testid="choose-local"]');
  await page.click('button:has-text("Resolve Conflict")');

  // Verify conflict resolved
  await expect(page.locator(".toast-success")).toContainText(
    "Conflict resolved",
  );

  // Verify final value
  const finalLocation = await page.locator('[data-testid="delivery-address"]');
  await expect(finalLocation).toContainText("Offline Street Update");
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
    _rev: "1-abc",
    type: "customer",
    companyName: "Test GmbH",
    vatNumber: "DE123456789",
    billingAddress: {
      street: "Teststraße",
      streetNumber: "1",
      zipCode: "80331",
      city: "München",
      country: "Deutschland",
    },
    locations: [],
    owner: "user-adm-001",
    contactPersons: [],
    createdBy: "user-adm-001",
    createdAt: new Date(),
    modifiedBy: "user-adm-001",
    modifiedAt: new Date(),
    version: 1,
    ...overrides,
  };
};

export const createMultiLocationCustomer = (): Customer => {
  const customer = createTestCustomer({
    companyName: "Multi-Location Franchise GmbH",
    locations: ["location-hq", "location-branch-1", "location-branch-2"],
    defaultDeliveryLocationId: "location-hq",
  });
  return customer;
};
```

### 7.2 Location Fixtures

```typescript
// tests/fixtures/locations.fixture.ts
export const createTestLocation = (
  customerId: string,
  overrides?: Partial<Location>,
): Location => {
  return {
    _id: `location-${generateId()}`,
    _rev: "1-def",
    type: "location",
    customerId,
    locationName: "Test Location",
    locationType: "branch",
    isActive: true,
    deliveryAddress: {
      street: "Delivery Street",
      streetNumber: "10",
      zipCode: "80331",
      city: "München",
      country: "Deutschland",
    },
    contactPersons: [],
    createdBy: "user-adm-001",
    createdAt: new Date(),
    modifiedBy: "user-adm-001",
    modifiedAt: new Date(),
    version: 1,
    ...overrides,
  };
};

export const testAddress: Address = {
  street: "Hauptstraße",
  streetNumber: "15",
  zipCode: "80331",
  city: "München",
  country: "Deutschland",
};
```

### 7.3 Contact Fixtures

```typescript
// tests/fixtures/contacts.fixture.ts
export const createTestContact = (
  overrides?: Partial<ContactPerson>,
): ContactPerson => {
  return {
    _id: `contact-${generateId()}`,
    _rev: "1-ghi",
    type: "contact",
    firstName: "Thomas",
    lastName: "Schmidt",
    position: "Manager",
    email: "thomas.schmidt@test.de",
    phone: "+49-89-1234567",
    customerId: "customer-test-123",
    decisionMakingRole: "operational_contact",
    authorityLevel: "low",
    canApproveOrders: false,
    functionalRoles: [],
    departmentInfluence: [],
    assignedLocationIds: [],
    isPrimaryContactForLocations: [],
    createdBy: "user-adm-001",
    createdAt: new Date(),
    modifiedBy: "user-adm-001",
    modifiedAt: new Date(),
    version: 1,
    ...overrides,
  };
};

export const createDecisionMakerContact = (
  approvalLimit: number,
): ContactPerson => {
  return createTestContact({
    firstName: "Anna",
    lastName: "Müller",
    position: "Geschäftsführerin",
    decisionMakingRole: "decision_maker",
    authorityLevel: "final_authority",
    canApproveOrders: true,
    approvalLimitEur: approvalLimit,
    functionalRoles: ["owner_ceo", "purchasing_manager"],
    departmentInfluence: ["purchasing", "operations", "finance"],
  });
};
```

---

## 9. Calendar & Resource Management Tests (NEW)

**Related:**

- Data Model: CalendarEvent interface, User.workingHours, User.availability
- API: `/api/v1/calendar/*` endpoints
- UI/UX: `ui-ux/02-core-components/calendar-view.md`, `ui-ux/08-specialized/calendar-export.md`

---

### 9.1 Unit Tests - Calendar Event Aggregation (70%)

**File:** `apps/backend/src/modules/calendar/calendar.service.spec.ts`

#### Test Suite: Event Aggregation from Multiple Sources

```typescript
describe("CalendarService - Event Aggregation", () => {
  let service: CalendarService;
  let userTaskRepo: jest.Mocked<IUserTaskRepository>;
  let projectTaskRepo: jest.Mocked<IProjectTaskRepository>;
  let projectRepo: jest.Mocked<IProjectRepository>;
  let opportunityRepo: jest.Mocked<IOpportunityRepository>;

  beforeEach(() => {
    // Mock repositories
  });

  it("should aggregate events from all sources", async () => {
    const startDate = new Date("2025-02-01");
    const endDate = new Date("2025-02-28");

    const mockUserTasks = [
      /* ... */
    ];
    const mockProjectTasks = [
      /* ... */
    ];
    const mockProjects = [
      /* ... */
    ];
    const mockOpportunities = [
      /* ... */
    ];

    userTaskRepo.findByDateRange.mockResolvedValue(mockUserTasks);
    projectTaskRepo.findByDateRange.mockResolvedValue(mockProjectTasks);
    projectRepo.findByDateRange.mockResolvedValue(mockProjects);
    opportunityRepo.findByDateRange.mockResolvedValue(mockOpportunities);

    const events = await service.getEvents(startDate, endDate, mockUser);

    expect(events.length).toBe(
      mockUserTasks.length +
        mockProjectTasks.length +
        mockProjects.length +
        mockOpportunities.length,
    );
    expect(userTaskRepo.findByDateRange).toHaveBeenCalledWith(
      startDate,
      endDate,
    );
  });

  it("should apply RBAC filtering - ADM sees only own events", async () => {
    const admUser = createMockUser({ role: "ADM", id: "user-123" });
    const events = await service.getEvents(startDate, endDate, admUser);

    // Verify only events owned by or assigned to ADM
    events.forEach((event) => {
      expect(
        event.createdBy === "user-123" || event.assignedTo === "user-123",
      ).toBeTruthy();
    });
  });

  it("should assign correct colors based on event type", () => {
    const userTaskEvent = { type: "USER_TASK", priority: "NORMAL" };
    const color = service.assignEventColor(userTaskEvent);
    expect(color).toBe("#10b981"); // Green for user tasks
  });

  it("should override color for urgent/critical priority", () => {
    const urgentTask = { type: "USER_TASK", priority: "URGENT" };
    const color = service.assignEventColor(urgentTask);
    expect(color).toBe("#f59e0b"); // Orange for urgent
  });

  it("should respect maximum date range of 90 days", async () => {
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-04-15"); // > 90 days

    await expect(
      service.getEvents(startDate, endDate, mockUser),
    ).rejects.toThrow("Date range cannot exceed 90 days");
  });

  it("should limit event density to 1000 events", async () => {
    // Mock 1500 events
    userTaskRepo.findByDateRange.mockResolvedValue(Array(1500).fill(mockTask));

    const events = await service.getEvents(startDate, endDate, mockUser);

    expect(events.length).toBe(1000);
  });
});
```

---

### 9.2 Unit Tests - ICS Export Generation (70%)

**File:** `apps/backend/src/modules/calendar/services/ics-generator.service.spec.ts`

#### Test Suite: RFC 5545 Compliance

```typescript
describe("IcsGeneratorService", () => {
  let service: IcsGeneratorService;

  it("should generate RFC 5545 compliant ICS file", () => {
    const events = [
      {
        id: "task-1",
        title: "Complete project proposal",
        startDate: new Date("2025-02-15T09:00:00Z"),
        endDate: new Date("2025-02-15T17:00:00Z"),
        type: "USER_TASK",
        location: "Office",
      },
    ];

    const ics = service.generateICS(events);

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("PRODID:-//KOMPASS//Calendar Export//EN");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("UID:task-1");
    expect(ics).toContain("SUMMARY:Complete project proposal");
    expect(ics).toContain("DTSTART:20250215T090000Z");
    expect(ics).toContain("DTEND:20250215T170000Z");
    expect(ics).toContain("LOCATION:Office");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("should escape special characters in ICS fields", () => {
    const events = [
      {
        title: "Meeting: Q1 Review, Budget Discussion",
        description: "Discuss Q1 results;\nReview budget allocations",
      },
    ];

    const ics = service.generateICS(events);

    expect(ics).toContain("SUMMARY:Meeting: Q1 Review\\, Budget Discussion");
    expect(ics).toContain(
      "DESCRIPTION:Discuss Q1 results\\;\\nReview budget allocations",
    );
  });

  it("should handle German characters in UTF-8", () => {
    const events = [
      {
        title: "Kundenbesuch bei Hofladen Müller",
        location: "München",
      },
    ];

    const ics = service.generateICS(events);

    expect(ics).toContain("Kundenbesuch bei Hofladen Müller");
    expect(ics).toContain("München");
  });

  it("should handle all-day events", () => {
    const events = [
      {
        title: "Company Holiday",
        startDate: new Date("2025-12-25"),
        allDay: true,
      },
    ];

    const ics = service.generateICS(events);

    expect(ics).toContain("DTSTART;VALUE=DATE:20251225");
    expect(ics).not.toContain("DTEND");
  });
});
```

---

### 9.3 Integration Tests - Calendar API (20%)

**File:** `tests/integration/calendar/calendar-api.integration.spec.ts`

#### Test Suite: Calendar API Endpoints

```typescript
describe("Calendar API (Integration)", () => {
  let app: INestApplication;
  let authToken: string;
  let admUser: User;

  beforeAll(async () => {
    // Setup NestJS app and seed database
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login and get token
    const loginResponse = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "adm@kompass.de", password: "test123" });
    authToken = loginResponse.body.token;
    admUser = loginResponse.body.user;
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /api/v1/calendar/events", () => {
    it("should return events for date range", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/calendar/events")
        .query({ startDate: "2025-02-01", endDate: "2025-02-28" })
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("events");
      expect(Array.isArray(response.body.events)).toBeTruthy();
      expect(response.body).toHaveProperty("totalCount");
    });

    it("should filter events by type", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/calendar/events")
        .query({
          startDate: "2025-02-01",
          endDate: "2025-02-28",
          eventTypes: "USER_TASK,PROJECT_TASK",
        })
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      response.body.events.forEach((event) => {
        expect(["USER_TASK", "PROJECT_TASK"]).toContain(event.type);
      });
    });

    it("should filter events by status", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/calendar/events")
        .query({
          startDate: "2025-02-01",
          endDate: "2025-02-28",
          status: "TODO,IN_PROGRESS",
        })
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      response.body.events.forEach((event) => {
        expect(["TODO", "IN_PROGRESS"]).toContain(event.status);
      });
    });

    it("should return 401 without auth token", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/calendar/events")
        .query({ startDate: "2025-02-01", endDate: "2025-02-28" })
        .expect(401);
    });

    it("should return 400 for date range > 90 days", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/calendar/events")
        .query({ startDate: "2025-01-01", endDate: "2025-04-15" })
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);
    });
  });

  describe("GET /api/v1/calendar/export/ics", () => {
    it("should export events as ICS file", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/calendar/export/ics")
        .query({ startDate: "2025-02-01", endDate: "2025-02-28" })
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers["content-type"]).toBe(
        "text/calendar; charset=utf-8",
      );
      expect(response.headers["content-disposition"]).toContain(
        "attachment; filename=",
      );
      expect(response.text).toContain("BEGIN:VCALENDAR");
      expect(response.text).toContain("END:VCALENDAR");
    });
  });
});
```

---

### 9.4 E2E Tests - Calendar Workflow (10%)

**File:** `tests/e2e/calendar/calendar-workflow.spec.ts`

#### Test Suite: Complete Calendar Workflow

```typescript
import { test, expect } from "@playwright/test";

test.describe("Calendar View & Export Workflow", () => {
  test.beforeEach(async ({ page }) => {
    // Login as ADM user
    await page.goto("/login");
    await page.fill('[name="email"]', "adm@kompass.de");
    await page.fill('[name="password"]', "test123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/dashboard");
  });

  test("should navigate to calendar view", async ({ page }) => {
    await page.click('a[href="/calendar"]');
    await expect(page).toHaveURL("/calendar");
    await expect(page.locator("h1")).toContainText("Calendar");
  });

  test("should display month view by default", async ({ page }) => {
    await page.goto("/calendar");

    // Month view should be active
    await expect(page.locator('[data-view="month"]')).toHaveClass(/active/);

    // Calendar grid should be visible
    await expect(page.locator(".calendar-grid")).toBeVisible();

    // Days of week should be displayed
    await expect(page.locator(".calendar-day-header")).toHaveCount(7);
  });

  test("should switch between views (month/week/day/agenda)", async ({
    page,
  }) => {
    await page.goto("/calendar");

    // Switch to week view
    await page.click('[data-view="week"]');
    await expect(page.locator('[data-view="week"]')).toHaveClass(/active/);

    // Switch to day view
    await page.click('[data-view="day"]');
    await expect(page.locator('[data-view="day"]')).toHaveClass(/active/);

    // Switch to agenda view
    await page.click('[data-view="agenda"]');
    await expect(page.locator('[data-view="agenda"]')).toHaveClass(/active/);
  });

  test("should display events on calendar", async ({ page }) => {
    await page.goto("/calendar");

    // Wait for events to load
    await page.waitForSelector(".calendar-event");

    // Should have at least one event
    const eventCount = await page.locator(".calendar-event").count();
    expect(eventCount).toBeGreaterThan(0);

    // Click on an event
    await page.locator(".calendar-event").first().click();

    // Event details should appear
    await expect(page.locator(".event-details-dialog")).toBeVisible();
  });

  test("should filter events by type", async ({ page }) => {
    await page.goto("/calendar");

    // Open filter menu
    await page.click('[data-testid="calendar-filter"]');

    // Uncheck all event types except USER_TASK
    await page.uncheck('[name="eventType-PROJECT_TASK"]');
    await page.uncheck('[name="eventType-PROJECT_DEADLINE"]');
    await page.uncheck('[name="eventType-OPPORTUNITY_CLOSE"]');

    await page.click('button:has-text("Apply Filters")');

    // All visible events should be USER_TASK
    const events = page.locator(".calendar-event");
    const count = await events.count();

    for (let i = 0; i < count; i++) {
      const eventClass = await events.nth(i).getAttribute("data-event-type");
      expect(eventClass).toBe("USER_TASK");
    }
  });

  test("should export calendar to ICS", async ({ page }) => {
    await page.goto("/calendar");

    // Click export button
    await page.click('[data-testid="calendar-export"]');

    // Export dialog should open
    await expect(page.locator(".export-dialog")).toBeVisible();

    // Select date range
    await page.fill('[name="exportStartDate"]', "2025-02-01");
    await page.fill('[name="exportEndDate"]', "2025-02-28");

    // Select event types
    await page.check('[name="exportEventType-USER_TASK"]');
    await page.check('[name="exportEventType-PROJECT_TASK"]');

    // Preview event count should update
    await expect(
      page.locator('[data-testid="export-event-count"]'),
    ).toContainText(/\d+ events/);

    // Start download
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.click('button:has-text("Download ICS")'),
    ]);

    // Verify download
    expect(download.suggestedFilename()).toMatch(/calendar-.*\.ics$/);
  });

  test("should navigate dates with prev/next buttons", async ({ page }) => {
    await page.goto("/calendar");

    // Get current month
    const currentMonth = await page
      .locator(".calendar-month-title")
      .textContent();

    // Click next month
    await page.click('[data-testid="calendar-next"]');

    // Month should have changed
    const nextMonth = await page.locator(".calendar-month-title").textContent();
    expect(nextMonth).not.toBe(currentMonth);

    // Click previous month
    await page.click('[data-testid="calendar-prev"]');

    // Should be back to original month
    const backMonth = await page.locator(".calendar-month-title").textContent();
    expect(backMonth).toBe(currentMonth);
  });

  test("should handle mobile view correctly", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/calendar");

    // Mobile calendar should render
    await expect(page.locator(".calendar-mobile")).toBeVisible();

    // View switcher should be bottom navigation
    await expect(page.locator(".bottom-nav")).toBeVisible();

    // Swipe to next month (simulate)
    const calendar = page.locator(".calendar-mobile");
    await calendar.hover();
    await page.mouse.down();
    await page.mouse.move(-200, 0); // Swipe left
    await page.mouse.up();

    // Month should have changed
    // (Verify month title changed)
  });
});
```

---

### 9.5 Unit Tests - Working Hours & Availability (70%)

**File:** `apps/backend/src/modules/availability/availability.service.spec.ts`

#### Test Suite: Working Hours Calculation

```typescript
describe("AvailabilityService - Working Hours", () => {
  let service: AvailabilityService;

  it("should calculate daily working hours", () => {
    const dayHours: DayWorkingHours = {
      isWorkday: true,
      startTime: "09:00",
      endTime: "17:00",
      breakDuration: 60, // 1 hour
    };

    const hours = service.calculateDailyHours(dayHours);
    expect(hours).toBe(7); // 8 hours - 1 hour break
  });

  it("should calculate weekly working hours", () => {
    const schedule: WorkingHoursSchedule = {
      enabled: true,
      timezone: "Europe/Berlin",
      days: {
        monday: {
          isWorkday: true,
          startTime: "09:00",
          endTime: "17:00",
          breakDuration: 60,
        },
        tuesday: {
          isWorkday: true,
          startTime: "09:00",
          endTime: "17:00",
          breakDuration: 60,
        },
        wednesday: { isWorkday: true, startTime: "09:00", endTime: "13:00" }, // Half day
        thursday: {
          isWorkday: true,
          startTime: "09:00",
          endTime: "17:00",
          breakDuration: 60,
        },
        friday: {
          isWorkday: true,
          startTime: "09:00",
          endTime: "17:00",
          breakDuration: 60,
        },
        saturday: { isWorkday: false },
        sunday: { isWorkday: false },
      },
    };

    const weeklyHours = service.calculateWeeklyHours(schedule);
    expect(weeklyHours).toBe(32); // 4 full days (7h each) + 1 half day (4h)
  });

  it("should exclude vacation days from capacity", () => {
    const user: User = {
      workingHours: {
        vacationDays: [
          {
            startDate: new Date("2025-02-10"),
            endDate: new Date("2025-02-14"),
            reason: "Annual Leave",
          },
        ],
      },
    };

    const capacity = service.calculateCapacity(
      user,
      new Date("2025-02-01"),
      new Date("2025-02-28"),
    );

    // Verify vacation days are excluded
    expect(capacity.totalDays).toBe(28);
    expect(capacity.workingDays).toBe(15); // Excluding weekends and 5 vacation days
  });

  it("should validate time range (endTime > startTime)", () => {
    const invalidDay: DayWorkingHours = {
      isWorkday: true,
      startTime: "17:00",
      endTime: "09:00", // Invalid: end before start
    };

    expect(() => service.validateWorkingHours(invalidDay)).toThrow(
      "End time must be after start time",
    );
  });
});
```

---

### 9.6 Performance Tests - Calendar (TBD)

#### Test Scenarios

- **Event Aggregation Performance:**
  - Measure P50, P95, P99 for 30-day, 60-day, 90-day ranges
  - Test with 10, 100, 500, 1000 events
  - Verify < 1.5s for 90-day range

- **ICS Export Performance:**
  - Measure export time for 100, 500, 1000 events
  - Verify < 3s for 500 events

- **Concurrent Calendar Requests:**
  - 10 concurrent users requesting calendar events
  - Verify no degradation beyond P95 targets

---

### 9.7 Test Fixtures - Calendar Events

```typescript
// Test fixture: Calendar events
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "task-1",
    type: "USER_TASK",
    title: "Complete project proposal",
    startDate: new Date("2025-02-15T09:00:00Z"),
    endDate: new Date("2025-02-15T17:00:00Z"),
    status: "TODO",
    priority: "HIGH",
    color: "#10b981",
    createdBy: "user-adm-1",
    assignedTo: "user-adm-1",
    sourceEntityType: "UserTask",
    sourceEntityId: "task-1",
    deepLink: "/tasks/task-1",
  },
  {
    id: "project-1",
    type: "PROJECT_DEADLINE",
    title: "Project Deadline: Website Relaunch",
    startDate: new Date("2025-02-28"),
    allDay: true,
    status: "IN_PROGRESS",
    priority: "CRITICAL",
    color: "#ef4444",
    createdBy: "user-plan-1",
    sourceEntityType: "Project",
    sourceEntityId: "project-1",
    deepLink: "/projects/project-1",
  },
];

// Test fixture: Working hours schedule
export const mockWorkingHoursSchedule: WorkingHoursSchedule = {
  enabled: true,
  timezone: "Europe/Berlin",
  days: {
    monday: {
      isWorkday: true,
      startTime: "09:00",
      endTime: "17:00",
      breakDuration: 60,
    },
    tuesday: {
      isWorkday: true,
      startTime: "09:00",
      endTime: "17:00",
      breakDuration: 60,
    },
    wednesday: {
      isWorkday: true,
      startTime: "09:00",
      endTime: "17:00",
      breakDuration: 60,
    },
    thursday: {
      isWorkday: true,
      startTime: "09:00",
      endTime: "17:00",
      breakDuration: 60,
    },
    friday: { isWorkday: true, startTime: "09:00", endTime: "13:00" }, // Half day Friday
    saturday: { isWorkday: false },
    sunday: { isWorkday: false },
  },
  vacationDays: [
    {
      startDate: new Date("2025-12-23"),
      endDate: new Date("2025-12-31"),
      reason: "Christmas Holiday",
    },
  ],
  publicHolidays: [
    new Date("2025-01-01"), // New Year
    new Date("2025-05-01"), // Labor Day
    new Date("2025-12-25"), // Christmas
    new Date("2025-12-26"), // Boxing Day
  ],
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

## 10. Time Tracking Tests (NEW - Phase 1 MVP)

**Added:** 2025-01-28  
**Status:** Planned  
**Coverage Target:** 85% (business-critical functionality)

### 10.1 TimeEntry Unit Tests (70%)

**Test File:** `apps/backend/src/modules/time-tracking/services/time-entry.service.spec.ts`

#### Timer Start Tests

```typescript
describe("TimeEntryService - Timer Start", () => {
  it("should start timer with status IN_PROGRESS", async () => {
    // Given: User with PLAN role
    // When: Start timer for assigned project
    // Then: Time entry created with status IN_PROGRESS, endTime = null
  });

  it("should prevent starting second timer if one already running", async () => {
    // Given: User already has active timer
    // When: Try to start another timer
    // Then: Throw ConflictException with message "You already have an active timer"
  });

  it("should cache hourly rate from user profile", async () => {
    // Given: User with hourlyRate = €85/hour
    // When: Start timer
    // Then: TimeEntry.hourlyRateEur = 85.00 (cached)
  });
});
```

#### Timer Stop Tests

```typescript
describe("TimeEntryService - Timer Stop", () => {
  it("should calculate duration and cost when stopping timer", async () => {
    // Given: Timer started at 09:00, stopped at 12:30 (3.5 hours)
    // When: Stop timer
    // Then: durationMinutes = 210, totalCostEur = 262.50 (3.5 × 75.00)
  });

  it("should update status to COMPLETED when stopping timer", async () => {
    // Given: Timer with status IN_PROGRESS
    // When: Stop timer
    // Then: status = COMPLETED
  });

  it("should throw error if endTime < startTime", async () => {
    // Given: startTime = 2025-01-28T12:00, endTime = 2025-01-28T09:00
    // When: Stop timer
    // Then: Throw ValidationException "endTime must be after startTime"
  });
});
```

#### Manual Entry Tests

```typescript
describe("TimeEntryService - Manual Entry", () => {
  it("should create manual entry with COMPLETED status", async () => {
    // Given: User creates manual entry with start/end times
    // When: Create time entry
    // Then: isManualEntry = true, status = COMPLETED
  });

  it("should calculate duration for manual entry", async () => {
    // Given: startTime = 09:00, endTime = 17:00 (8 hours, 1 hour break)
    // When: Create manual entry with 7 hours
    // Then: durationMinutes = 420, totalCostEur = 525.00
  });
});
```

#### Approval Workflow Tests

```typescript
describe("TimeEntryService - Approval", () => {
  it("should approve time entry and set approvedBy", async () => {
    // Given: TimeEntry with status COMPLETED
    // When: PLAN manager approves
    // Then: status = APPROVED, approvedBy set, approvedAt set
  });

  it("should reject time entry with reason", async () => {
    // Given: TimeEntry with status COMPLETED
    // When: Manager rejects with reason
    // Then: status = REJECTED, rejectionReason set
  });

  it("should allow re-submission after rejection", async () => {
    // Given: TimeEntry with status REJECTED
    // When: User updates and re-submits
    // Then: status = COMPLETED (ready for re-approval)
  });

  it("should prevent user from approving own time entry", async () => {
    // Given: PLAN user's own time entry
    // When: Try to approve own entry
    // Then: Throw ForbiddenException "Cannot approve own time entries"
  });
});
```

#### Bulk Approval Tests

```typescript
describe("TimeEntryService - Bulk Approval", () => {
  it("should approve multiple entries from same project", async () => {
    // Given: 5 time entries from same project, all COMPLETED
    // When: Bulk approve
    // Then: All 5 entries status = APPROVED
  });

  it("should reject bulk approval if entries from different projects", async () => {
    // Given: Mix of entries from project A and project B
    // When: Try bulk approve
    // Then: Throw ValidationException "All entries must be from same project"
  });
});
```

#### Labor Cost Calculation Tests

```typescript
describe("TimeEntryService - Cost Calculations", () => {
  it("should calculate labor cost summary for project", async () => {
    // Given: Project with 10 approved time entries, 2 users
    // When: Calculate labor costs
    // Then: totalHours sum correct, totalCostEur correct, breakdown by user
  });

  it("should only include APPROVED entries in cost summary", async () => {
    // Given: Project with 5 approved, 3 completed, 2 rejected entries
    // When: Calculate labor costs
    // Then: Only 5 approved entries included in total
  });

  it("should calculate monthly breakdown", async () => {
    // Given: Time entries across Jan, Feb, Mar
    // When: Calculate labor costs
    // Then: byMonth array has correct sums for each month
  });
});
```

### 10.2 TimeEntry Integration Tests (20%)

**Test File:** `tests/integration/time-tracking/time-entry-api.integration.spec.ts`

```typescript
describe("TimeEntry API Integration", () => {
  it("POST /api/v1/time-entries - should create and start timer", async () => {
    // Given: Authenticated PLAN user
    // When: POST with projectId, taskDescription
    // Then: 201 Created, timer running, status = IN_PROGRESS
  });

  it("POST /api/v1/time-entries/:id/stop - should stop timer and calculate cost", async () => {
    // Given: Running timer (3 hours elapsed)
    // When: POST /time-entries/:id/stop
    // Then: 200 OK, durationMinutes = 180, totalCostEur calculated
  });

  it("POST /api/v1/time-entries/bulk-approve - should approve multiple entries", async () => {
    // Given: 3 COMPLETED entries from same project
    // When: POST /bulk-approve with entry IDs
    // Then: 200 OK, all entries status = APPROVED
  });

  it("GET /api/v1/projects/:projectId/labor-costs - should return cost summary", async () => {
    // Given: Project with 15 approved time entries
    // When: GET /projects/project-abc/labor-costs
    // Then: 200 OK, totalHours and totalCostEur correct
  });

  it("should enforce RBAC: PLAN cannot approve own entries", async () => {
    // Given: PLAN user's own time entry
    // When: POST /time-entries/:id/approve
    // Then: 403 Forbidden
  });
});
```

### 10.3 TimeEntry E2E Tests (10%)

**Test File:** `tests/e2e/time-tracking/timer-workflow.spec.ts`

```typescript
test("Complete Timer Workflow", async ({ page }) => {
  // 1. Login as PLAN user
  // 2. Navigate to project detail page
  // 3. Click "Zeit erfassen" button
  // 4. Verify timer started (stopwatch running in UI)
  // 5. Enter task description
  // 6. Wait 3 seconds
  // 7. Click "Stoppen" button
  // 8. Verify time entry created with correct duration
  // 9. Verify cost calculated correctly
  // 10. Navigate to time entries list
  // 11. Verify entry appears with status "Abgeschlossen"
});

test("Manual Time Entry Workflow", async ({ page }) => {
  // 1. Login as PLAN user
  // 2. Navigate to project → "Zeiterfassung" tab
  // 3. Click "Manuelle Eingabe"
  // 4. Fill in: startTime, endTime, taskDescription
  // 5. Click "Speichern"
  // 6. Verify entry created with COMPLETED status
  // 7. Verify duration and cost calculated
});

test("Approval Workflow as Manager", async ({ page }) => {
  // 1. Login as GF user
  // 2. Navigate to "Zeiteinträge freigeben"
  // 3. See pending approvals list
  // 4. Select multiple entries
  // 5. Click "Alle genehmigen"
  // 6. Verify entries marked as APPROVED
  // 7. Verify notification shown to original user
});
```

---

## 11. Project Cost Management Tests (NEW - Phase 1 MVP)

**Added:** 2025-01-28  
**Status:** Planned  
**Coverage Target:** 85% (business-critical functionality)

### 11.1 ProjectCost Unit Tests (70%)

**Test File:** `apps/backend/src/modules/project-cost/services/project-cost.service.spec.ts`

#### Cost Creation Tests

```typescript
describe("ProjectCostService - Creation", () => {
  it("should calculate totalCostEur from quantity × unitPrice", async () => {
    // Given: quantity = 50, unitPriceEur = 45.00
    // When: Create project cost
    // Then: totalCostEur = 2250.00
  });

  it("should calculate tax amount with default 19% rate", async () => {
    // Given: totalCostEur = 2250.00, taxRate = 0.19 (default)
    // When: Create project cost
    // Then: taxAmountEur = 427.50, totalWithTaxEur = 2677.50
  });

  it("should support custom tax rates (7%, 0%)", async () => {
    // Given: taxRate = 0.07 (reduced VAT)
    // When: Create project cost
    // Then: taxAmountEur calculated with 7%
  });

  it("should validate cost type enum", async () => {
    // Given: costType = "invalid"
    // When: Create project cost
    // Then: Throw ValidationException "Invalid cost type"
  });
});
```

#### Status Lifecycle Tests

```typescript
describe("ProjectCostService - Status Transitions", () => {
  it("should allow PLANNED → ORDERED transition", async () => {
    // Given: Cost with status PLANNED
    // When: Update status to ORDERED
    // Then: Status updated, audit log entry created
  });

  it("should allow direct PLANNED → PAID for small purchases", async () => {
    // Given: Cost with status PLANNED, amount < €100
    // When: Update status to PAID
    // Then: Status updated (valid shortcut for petty cash)
  });

  it("should prevent PAID → INVOICED backward transition", async () => {
    // Given: Cost with status PAID
    // When: Try to update status to INVOICED
    // Then: Throw ValidationException "Invalid status transition"
  });

  it("should make PAID costs immutable (GoBD)", async () => {
    // Given: Cost with status PAID
    // When: Try to update quantity or unitPrice
    // Then: Throw ForbiddenException "Cannot edit paid costs"
  });
});
```

#### Approval Workflow Tests

```typescript
describe("ProjectCostService - Approval", () => {
  it("should allow PLAN to approve cost < €500", async () => {
    // Given: PLAN user, cost = €450
    // When: Approve cost
    // Then: Approved, approvedBy = PLAN user ID
  });

  it("should require GF approval for cost >= €500", async () => {
    // Given: PLAN user, cost = €1200
    // When: Try to approve cost
    // Then: Throw ForbiddenException "Costs >= €500 require GF approval"
  });

  it("should allow GF to approve any cost amount", async () => {
    // Given: GF user, cost = €5000
    // When: Approve cost
    // Then: Approved, approvedBy = GF user ID
  });
});
```

#### Invoice Upload Tests

```typescript
describe("ProjectCostService - Invoice Management", () => {
  it("should require invoice PDF when status = INVOICED", async () => {
    // Given: Cost with no invoicePdfUrl
    // When: Update status to INVOICED
    // Then: Throw ValidationException "Invoice PDF required"
  });

  it("should validate invoice amount matches cost ±€1", async () => {
    // Given: totalWithTaxEur = 2677.50, invoice shows 2678.00
    // When: Upload invoice and mark INVOICED
    // Then: Warning "Invoice amount differs by €0.50" (within tolerance)
  });

  it("should reject invoice if amount differs by > €1", async () => {
    // Given: totalWithTaxEur = 2677.50, invoice shows 2700.00
    // When: Upload invoice
    // Then: Throw ValidationException "Invoice amount mismatch (€22.50 difference)"
  });
});
```

#### Material Cost Summary Tests

```typescript
describe("ProjectCostService - Cost Summary", () => {
  it("should calculate total cost by type", async () => {
    // Given: Project with 5 material costs, 3 contractor costs
    // When: Calculate material costs
    // Then: byCostType array has correct sums for each type
  });

  it("should calculate pending payment amount", async () => {
    // Given: Project with 10 costs: 7 PAID, 3 INVOICED
    // When: Calculate material costs
    // Then: pendingPaymentEur = sum of 3 INVOICED costs
  });

  it("should calculate cost summary by status", async () => {
    // Given: Project with costs in various statuses
    // When: Calculate material costs
    // Then: byStatus array has correct sums per status
  });
});
```

### 11.2 ProjectCost Integration Tests (20%)

**Test File:** `tests/integration/project-cost/project-cost-api.integration.spec.ts`

```typescript
describe("ProjectCost API Integration", () => {
  it("POST /api/v1/project-costs - should create cost with calculations", async () => {
    // Given: Authenticated PLAN user
    // When: POST with projectId, costType, quantity, unitPrice
    // Then: 201 Created, totalCostEur calculated, taxAmountEur calculated
  });

  it("POST /api/v1/project-costs/:id/approve - should enforce approval threshold", async () => {
    // Given: PLAN user, cost = €600
    // When: POST /project-costs/:id/approve
    // Then: 403 Forbidden (requires GF)
  });

  it("PUT /api/v1/project-costs/:id - should prevent editing PAID costs", async () => {
    // Given: Cost with status PAID
    // When: PUT with updated quantity
    // Then: 403 Forbidden, GoBD compliance message
  });

  it("GET /api/v1/projects/:projectId/material-costs - should return summary", async () => {
    // Given: Project with 20 costs
    // When: GET /projects/project-abc/material-costs
    // Then: 200 OK, correct totals, breakdown by type and status
  });

  it("GET /api/v1/project-costs/pending-payment - should list invoiced costs", async () => {
    // Given: 8 costs with INVOICED status across 3 projects
    // When: GET /project-costs/pending-payment
    // Then: 200 OK, 8 costs returned, totalPendingEur correct
  });

  it("should enforce RBAC: INNEN cannot access project costs", async () => {
    // Given: Authenticated INNEN user
    // When: GET /api/v1/project-costs
    // Then: 403 Forbidden
  });
});
```

### 11.3 ProjectCost E2E Tests (10%)

**Test File:** `tests/e2e/project-cost/cost-management-workflow.spec.ts`

```typescript
test("Complete Project Cost Workflow", async ({ page }) => {
  // 1. Login as PLAN user
  // 2. Navigate to project detail → "Kosten" tab
  // 3. Click "Neue Kosten"
  // 4. Fill in: Material, description, supplier, quantity, unit price
  // 5. Click "Speichern" (status = PLANNED)
  // 6. Verify cost appears in list
  // 7. Click "Bestellt" (status → ORDERED)
  // 8. Upload purchase order PDF
  // 9. Mark as "Erhalten" (status → RECEIVED)
  // 10. Upload invoice PDF
  // 11. Mark as "Rechnung erhalten" (status → INVOICED)
  // 12. Verify appears in "Ausstehende Zahlungen"
  // 13. Login as BUCH user
  // 14. Navigate to pending payments
  // 15. Click "Als bezahlt markieren"
  // 16. Verify status = PAID
  // 17. Verify cost is read-only (GoBD compliance)
});

test("GF Approval Workflow for High-Value Cost", async ({ page }) => {
  // 1. Login as PLAN user
  // 2. Create project cost: €1200 (above €500 threshold)
  // 3. Try to approve → See error "Erfordert GF-Freigabe"
  // 4. Logout and login as GF
  // 5. Navigate to "Freigaben"
  // 6. See pending cost approval
  // 7. Click "Genehmigen"
  // 8. Verify cost approved
  // 9. Verify PLAN user notified
});

test("Budget Warning Display", async ({ page }) => {
  // 1. Login as PLAN user
  // 2. Navigate to project with budget = €10,000
  // 3. Add project costs totaling €8,500 (85% of budget)
  // 4. Verify warning banner: "Kosten bei 85% des Budgets"
  // 5. Add another cost bringing total to €10,500
  // 6. Verify critical warning: "Budget überschritten um €500"
  // 7. Verify warning visible on project dashboard
});
```

---

## Document History

| Version | Date       | Author | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------- | ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | 2025-01-28 | System | Initial specification: 70/20/10 pyramid, coverage targets, location management tests, decision authority tests, offline conflict tests, test fixtures                                                                                                                                                                                                                                                                                                                                                                 |
| 1.1     | 2025-01-28 | System | Added calendar & resource management test scenarios (Section 9)                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 1.2     | 2025-01-28 | System | **Added Time Tracking & Project Cost Management test scenarios (Phase 1 MVP)**: TimeEntry tests (Sections 10.1-10.3) covering timer start/stop, manual entry, approval workflow, bulk operations, labor cost calculations; ProjectCost tests (Sections 11.1-11.3) covering cost creation with calculations, status lifecycle, approval thresholds, invoice management, budget warnings, material cost summaries. Includes unit tests (70%), integration tests (20%), and E2E tests (10%) with complete test scenarios |

---

**End of TEST_STRATEGY_DOCUMENT.md v1.2**
