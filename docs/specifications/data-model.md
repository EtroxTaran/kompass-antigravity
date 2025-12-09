# Data Model Specification

**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Status:** ✅ Finalized

## Cross-References

- **API Specification:** `docs/specifications/api-specification.md` - REST endpoints and DTOs
- **RBAC Matrix:** `docs/specifications/rbac-permissions.md` - Permissions for entities
- **Test Strategy:** `docs/specifications/test-strategy.md` - Test scenarios and coverage
- **Product Vision:** `docs/product-vision/Produktvision & Zielbild – Kontakt- & Kundenverwaltung (CRM-Basis).md` - Business requirements
- **System Architecture:** `docs/architecture/system-architecture.md` - Complete technical specification
- **Architecture Rules:** `.cursor/rules/*.mdc` - Entity structure patterns and validation standards

---

## Table of Contents

1. [Base Entity Structure](#1-base-entity-structure)
2. [User Entity (NEW)](#2-user-entity-new)
3. [Role Entity (NEW)](#3-role-entity-new)
4. [PermissionMatrix Entity (NEW)](#4-permissionmatrix-entity-new)
5. [Customer Entity](#5-customer-entity)
6. [Location Entity](#6-location-entity)
7. [Contact/ContactPerson Entity](#7-contactcontactperson-entity)
8. [Decision-Making Enums](#8-decision-making-enums)
9. [Address Structure](#9-address-structure)
10. [Validation Rules](#10-validation-rules)
11. [Business Rules](#11-business-rules)
12. [Migration Strategy](#12-migration-strategy)
13. [Future Entities (Placeholders)](#13-future-entities-placeholders)
14. [UserTask Entity (NEW)](#14-usertask-entity-new)
15. [ProjectTask Entity (NEW)](#15-projecttask-entity-new)
16. [Task Entity Cross-Field Validation](#16-task-entity-cross-field-validation)
17. [CalendarEvent Interface (NEW)](#17-calendarevent-interface-new)
18. [CalendarSubscription Entity (NEW)](#18-calendarsubscription-entity-new-phase-1)
19. [Tour Entity (NEW)](#18-tour-entity-new-phase-2)
20. [Meeting Entity (NEW)](#18-meeting-entity-new-phase-2)
21. [HotelStay Entity (NEW)](#19-hotelstay-entity-new-phase-2)
22. [Expense Entity (NEW)](#20-expense-entity-new-phase-2)
23. [MileageLog Entity (NEW)](#21-mileagelog-entity-new-phase-2)
24. [TimeEntry Entity (NEW)](#22-timeentry-entity-new-phase-1-mvp)
25. [ProjectCost Entity (NEW)](#23-projectcost-entity-new-phase-1-mvp)

---

## 1. Base Entity Structure

All CouchDB documents in KOMPASS MUST extend the `BaseEntity` interface to ensure consistency, GoBD compliance, and offline-first synchronization support.

### BaseEntity Interface

```typescript
interface BaseEntity {
  // CouchDB metadata
  _id: string; // Document ID (format: "{type}-{uuid}")
  _rev: string; // CouchDB revision (optimistic locking)
  type: string; // Document type discriminator (e.g., 'customer', 'location', 'contact')

  // Audit trail (GoBD compliance - required for all entities)
  createdBy: string; // User ID who created the record
  createdAt: Date; // ISO 8601 timestamp of creation
  modifiedBy: string; // User ID who last modified the record
  modifiedAt: Date; // ISO 8601 timestamp of last modification
  version: number; // Optimistic locking version (increments on update)

  // Offline sync support (PouchDB/CouchDB replication)
  _conflicts?: string[]; // CouchDB conflict array (populated during sync)
  lastSyncedAt?: Date; // Last successful sync timestamp (client-side tracking)
}
```

### ID Generation Rules

- **User:** `user-{uuid}` (e.g., `user-a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
- **Role:** `role-{roleId}` (e.g., `role-plan`, `role-adm`, `role-gf`)
- **PermissionMatrix:** `permission-matrix-{version}` (e.g., `permission-matrix-v2.0`)
- **Customer:** `customer-{uuid}` (e.g., `customer-550e8400-e29b-41d4-a716-446655440000`)
- **Location:** `location-{uuid}` (e.g., `location-123e4567-e89b-12d3-a456-426614174000`)
- **Contact:** `contact-{uuid}` (e.g., `contact-98765432-e89b-12d3-a456-426614174000`)

Use `packages/shared/utils/id-generator.ts` for all ID generation. NEVER generate IDs manually in business logic.

---

## 2. User Entity (NEW)

**Updated:** 2025-01-27  
**Status:** Planned for implementation

The User entity represents a system user with authentication credentials and role assignments. Users can have multiple roles to accommodate real-world business scenarios.

### User Interface

```typescript
interface User extends BaseEntity {
  _id: string; // Format: "user-{uuid}"
  type: "user"; // Fixed discriminator

  // Identity
  email: string; // Unique email address (login username)
  displayName: string; // Full name for UI display

  // Role Management (Multiple Roles Support)
  roles: UserRole[]; // Array of assigned roles (e.g., ['ADM', 'PLAN'])
  primaryRole: UserRole; // Default role for UI context (must be in roles[])

  // Authentication (Note: Hashed password stored separately in auth service)
  active: boolean; // Account active status
  lastLoginAt?: Date; // Last successful login timestamp
  passwordChangedAt?: Date; // Last password change timestamp

  // Profile
  avatarUrl?: string; // Profile picture URL
  phoneNumber?: string; // Contact phone
  department?: string; // Department/division

  // Preferences
  language?: "de" | "en"; // UI language (default: 'de')
  timezone?: string; // User timezone (default: 'Europe/Berlin')

  // Working Hours & Availability (NEW - Phase 1)
  workingHours?: WorkingHoursSchedule; // Custom working hours per day
  availability?: UserAvailability; // Current availability status
  officePresence?: OfficePresenceSchedule; // In-office days schedule

  // RBAC metadata (audit)
  rolesAssignedBy?: string; // User ID who assigned current roles
  rolesAssignedAt?: Date; // When current roles were assigned
  roleChangeHistory?: RoleChangeEntry[]; // History of role assignments/revocations
}

interface WorkingHoursSchedule {
  enabled: boolean; // Whether custom schedule is active (default: false)
  timezone: string; // Schedule timezone (default: user.timezone)
  days: {
    monday?: DayWorkingHours;
    tuesday?: DayWorkingHours;
    wednesday?: DayWorkingHours;
    thursday?: DayWorkingHours;
    friday?: DayWorkingHours;
    saturday?: DayWorkingHours;
    sunday?: DayWorkingHours;
  };
  vacationDays?: DateRange[]; // Scheduled vacation periods
  publicHolidays?: Date[]; // Public holidays (auto-populated)
}

interface DayWorkingHours {
  isWorkday: boolean; // Whether this is a working day
  startTime: string; // Start time (HH:mm format, e.g., "09:00")
  endTime: string; // End time (HH:mm format, e.g., "17:00")
  breakDuration?: number; // Break duration in minutes (default: 0)
  notes?: string; // Optional notes (e.g., "Half day")
}

interface UserAvailability {
  status: "available" | "busy" | "away" | "vacation" | "sick" | "offline"; // Current status
  statusMessage?: string; // Custom status message (max 200 chars)
  availableUntil?: Date; // When status expires (auto-reset to 'available')
  lastUpdated: Date; // When status was last changed
  updatedBy: string; // User ID who updated (self or admin)
}

interface OfficePresenceSchedule {
  defaultLocation?: string; // Default office location ID
  weeklySchedule?: {
    monday?: OfficePresenceDay;
    tuesday?: OfficePresenceDay;
    wednesday?: OfficePresenceDay;
    thursday?: OfficePresenceDay;
    friday?: OfficePresenceDay;
    saturday?: OfficePresenceDay;
    sunday?: OfficePresenceDay;
  };
  overrides?: OfficePresenceOverride[]; // Specific date overrides
}

interface OfficePresenceDay {
  location: "office" | "remote" | "hybrid" | "off"; // Where user is working
  officeLocationId?: string; // Specific office location (if 'office' or 'hybrid')
  notes?: string; // Optional notes (max 200 chars)
}

interface OfficePresenceOverride {
  date: Date; // Specific date for override
  location: "office" | "remote" | "hybrid" | "off";
  officeLocationId?: string;
  notes?: string;
}

interface DateRange {
  startDate: Date; // Start date of range
  endDate: Date; // End date of range (inclusive)
  reason?: string; // Reason for absence (e.g., "Annual Leave")
}

interface RoleChangeEntry {
  timestamp: Date; // When role was changed
  changedBy: string; // User ID who made the change
  action: "ASSIGN" | "REVOKE" | "PRIMARY_CHANGED"; // What changed
  role: UserRole; // Which role was affected
  reason: string; // Why the change was made (required)
}
```

### ID Generation

- **User ID:** `user-{uuid}` (e.g., `user-a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Validation Rules

| Field                                      | Validation                                                        |
| ------------------------------------------ | ----------------------------------------------------------------- |
| `email`                                    | Required, valid email format, unique across system                |
| `displayName`                              | Required, 2-100 chars                                             |
| `roles`                                    | Required, non-empty array, all values must be valid UserRole enum |
| `primaryRole`                              | Required, must be in `roles[]` array                              |
| `active`                                   | Required, boolean                                                 |
| `language`                                 | Optional, must be 'de' or 'en'                                    |
| `workingHours.days.*.startTime`            | Optional, format HH:mm (e.g., "09:00")                            |
| `workingHours.days.*.endTime`              | Optional, format HH:mm, must be > startTime                       |
| `workingHours.days.*.breakDuration`        | Optional, 0-480 minutes (max 8 hours)                             |
| `availability.status`                      | Optional, valid enum value                                        |
| `availability.statusMessage`               | Optional, max 200 chars                                           |
| `officePresence.weeklySchedule.*.location` | Optional, valid enum value                                        |
| `officePresence.weeklySchedule.*.notes`    | Optional, max 200 chars                                           |

### Business Rules

1. **Minimum Role Requirement:** User must have at least one role (cannot revoke all roles)
2. **Primary Role Validation:** `primaryRole` must exist in `roles[]` array
3. **Role Assignment Authorization:** Only GF and ADMIN can assign/revoke roles
4. **Self Primary Role Change:** User can change their own `primaryRole` (if in `roles[]`)
5. **Audit Trail:** All role changes must be logged with reason in `roleChangeHistory`
6. **Email Uniqueness:** Email must be unique across all users
7. **Working Hours Validation:** If workingHours.enabled = true, at least one workday must be defined
8. **Time Range Validation:** endTime must be greater than startTime for all working days
9. **Break Duration:** Break duration cannot exceed working hours duration
10. **Office Location Reference:** officeLocationId must reference valid Location entity (if specified)
11. **Vacation Overlap:** Vacation date ranges cannot overlap
12. **Availability Auto-Reset:** If availableUntil is reached, status auto-resets to 'available'
13. **Presence Override Priority:** Date-specific overrides take precedence over weekly schedule

---

## 3. Role Entity (NEW)

**Updated:** 2025-01-27  
**Status:** Planned for implementation (Hybrid RBAC Phase 2)

The Role entity represents a configurable role definition stored in CouchDB. This enables runtime permission configuration without code deployment.

### Role Interface

```typescript
interface Role extends BaseEntity {
  _id: string; // Format: "role-{roleId}" (e.g., "role-plan")
  type: "role"; // Fixed discriminator

  // Role identification
  roleId: UserRole; // Role identifier matching UserRole enum (e.g., 'PLAN')
  name: string; // Display name (e.g., "Planungsabteilung")
  description: string; // Role description and responsibilities

  // Permission configuration
  permissions: Partial<
    Record<EntityType, Partial<Record<Permission, boolean>>>
  >; // Entity-action permissions

  // Role status
  active: boolean; // Is role currently active?
  priority: number; // Role priority for conflict resolution (1-100)

  // Metadata
  version: number; // Role definition version
}
```

### Example Role Document

```typescript
{
  _id: 'role-plan',
  type: 'role',
  roleId: 'PLAN',
  name: 'Planungsabteilung',
  description: 'Planning/design team responsible for project execution',
  permissions: {
    Customer: { READ: true, CREATE: false, UPDATE: false, DELETE: false },
    Location: { READ: true, CREATE: true, UPDATE: true, DELETE: false },
    Contact: { READ: true, CREATE: true, UPDATE: true, DELETE: false },
    Project: { READ: true, CREATE: false, UPDATE: true, DELETE: false },
    Task: { READ: true, CREATE: true, UPDATE: true, DELETE: true }
  },
  active: true,
  priority: 50,
  version: 1,
  createdBy: 'user-admin',
  createdAt: '2025-01-27T10:00:00Z',
  modifiedBy: 'user-admin',
  modifiedAt: '2025-01-27T10:00:00Z'
}
```

### ID Generation

- **Role ID:** `role-{roleId}` (e.g., `role-plan`, `role-adm`)

### Validation Rules

| Field         | Validation                                   |
| ------------- | -------------------------------------------- |
| `roleId`      | Required, must match UserRole enum           |
| `name`        | Required, 2-100 chars                        |
| `description` | Required, 10-500 chars                       |
| `permissions` | Required, object with entity-action mappings |
| `active`      | Required, boolean                            |
| `priority`    | Required, 1-100                              |

### Business Rules

1. **Enum Consistency:** `roleId` must match a value in `UserRole` enum
2. **Single Role Definition:** Only one active Role document per `roleId`
3. **Admin-Only Modification:** Only ADMIN role can create/update Role documents
4. **Audit Requirement:** All role permission changes must be logged
5. **Fallback to Static:** If Role document missing/corrupted, system falls back to static `PERMISSION_MATRIX`

---

## 4. PermissionMatrix Entity (NEW)

**Updated:** 2025-01-27  
**Status:** Planned for implementation (Hybrid RBAC Phase 2)

The PermissionMatrix entity represents a versioned snapshot of the complete permission matrix. This allows atomic permission updates and rollback capabilities.

### PermissionMatrix Interface

```typescript
interface PermissionMatrix extends BaseEntity {
  _id: string; // Format: "permission-matrix-{version}" (e.g., "permission-matrix-v2.0")
  type: "permission_matrix"; // Fixed discriminator

  // Version control
  version: string; // Semantic version (e.g., "2.0", "2.1")
  effectiveDate: Date; // When this matrix becomes/became active

  // Permission data
  matrix: Record<
    UserRole,
    Partial<Record<EntityType, Partial<Record<Permission, boolean>>>>
  >; // Complete permission matrix

  // Change tracking
  previousVersion?: string; // ID of previous matrix version
  changelog: string; // Human-readable description of changes

  // Status
  active: boolean; // Is this the active matrix?
}
```

### Example PermissionMatrix Document

```typescript
{
  _id: 'permission-matrix-v2.0',
  type: 'permission_matrix',
  version: '2.0',
  effectiveDate: '2025-02-01T00:00:00Z',
  matrix: {
    GF: {
      Customer: { READ: true, CREATE: true, UPDATE: true, DELETE: true },
      Project: { READ: true, CREATE: true, UPDATE: true, DELETE: true },
      // ... all entities
    },
    PLAN: {
      Customer: { READ: true, CREATE: false, UPDATE: false, DELETE: false },
      Project: { READ: true, CREATE: false, UPDATE: true, DELETE: false },
      // ... all entities
    },
    // ... all roles
  },
  previousVersion: 'permission-matrix-v1.0',
  changelog: 'Corrected PLAN role: removed Customer.CREATE and Customer.UPDATE permissions',
  active: true,
  createdBy: 'user-admin',
  createdAt: '2025-01-27T10:00:00Z',
  modifiedBy: 'user-admin',
  modifiedAt: '2025-01-27T10:00:00Z',
  version: 1
}
```

### ID Generation

- **Matrix ID:** `permission-matrix-{version}` (e.g., `permission-matrix-v2.0`)

### Validation Rules

| Field             | Validation                                           |
| ----------------- | ---------------------------------------------------- |
| `version`         | Required, semantic version format (e.g., "2.0")      |
| `effectiveDate`   | Required, ISO 8601 date                              |
| `matrix`          | Required, complete permission matrix for all roles   |
| `changelog`       | Required, 10-500 chars                               |
| `active`          | Required, boolean                                    |
| `previousVersion` | Optional, must reference existing matrix if provided |

### Business Rules

1. **Single Active Matrix:** Only one PermissionMatrix document can have `active: true` at a time
2. **Effective Date Validation:** Cannot activate matrix with future `effectiveDate`
3. **Version Immutability:** Once created, matrix document cannot be modified (only active status)
4. **Admin-Only Creation:** Only ADMIN role can create new permission matrices
5. **Audit Requirement:** All matrix changes logged with changelog and user
6. **Rollback Support:** Can activate previous version by setting its `active: true`

---

## 5. Customer Entity

The Customer entity represents a company or organization. Customers can have multiple physical locations with separate delivery addresses.

### Customer Interface

```typescript
interface Customer extends BaseEntity {
  _id: string; // Format: "customer-{uuid}"
  type: "customer"; // Fixed discriminator

  // Basic company information
  companyName: string; // Official company name (2-200 chars)
  vatNumber?: string; // German VAT number (format: DE123456789)
  email?: string; // Primary company email
  phone?: string; // Primary phone number (international format)
  website?: string; // Company website URL

  // Financial information
  creditLimit?: number; // Credit limit in EUR (0-1,000,000)
  paymentTerms?: string; // e.g., "30 Tage netto"

  // Categorization
  industry?: string; // Business sector/industry
  customerType?:
    | "direct_marketer"
    | "retail"
    | "franchise"
    | "cooperative"
    | "other";
  rating?: "A" | "B" | "C"; // Customer rating (A=best)

  // Address Management (NEW)
  billingAddress: Address; // Single primary billing address (REQUIRED)
  locations: string[]; // Array of Location IDs (1:n relationship)
  defaultDeliveryLocationId?: string; // Default location for deliveries (must exist in locations array)

  // Relationship management
  owner: string; // User ID (ADM) responsible for this customer
  contactPersons: string[]; // Array of Contact IDs

  // DSGVO compliance
  dsgvoConsent?: {
    marketing: boolean; // Marketing consent granted
    aiProcessing: boolean; // AI processing consent
    dataSharing: boolean; // Third-party data sharing consent
    grantedAt?: Date; // When consent was granted
    grantedBy?: string; // Who granted consent (contact ID)
    revokedAt?: Date; // When consent was revoked
  };

  // Data retention
  dataRetentionUntil?: Date; // DSGVO data retention deadline
  anonymized?: boolean; // True if customer was anonymized
  anonymizedAt?: Date; // When anonymization occurred

  // Audit trail (inherited from BaseEntity)
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

### Customer Business Rules

1. **Required Fields:** `companyName`, `billingAddress`, `owner`
2. **Billing Address:** Every customer MUST have exactly one billing address
3. **Locations:** Customer CAN have 0 to n delivery locations
4. **Default Delivery:** If `defaultDeliveryLocationId` is set, it MUST reference an ID in the `locations` array
5. **Owner Assignment:** `owner` MUST reference an existing User with role ADM
6. **GoBD Compliance:** All changes to `companyName`, `vatNumber`, or `billingAddress` MUST be logged in audit trail

---

## 3. Location Entity (NEW)

The Location entity represents a physical location for a customer (e.g., headquarters, branch, warehouse, project site). Each location has its own delivery address and can have assigned contact persons.

### Location Interface

```typescript
interface Location extends BaseEntity {
  _id: string; // Format: "location-{uuid}"
  type: "location"; // Fixed discriminator

  // Parent reference
  customerId: string; // Parent customer ID (REQUIRED)

  // Location identity
  locationName: string; // Descriptive name (e.g., "Filiale München", "Hauptstandort")
  locationType:
    | "headquarter"
    | "branch"
    | "warehouse"
    | "project_site"
    | "other";
  isActive: boolean; // Whether location is currently operational

  // Delivery address (separate from billing)
  deliveryAddress: Address; // Full delivery address (REQUIRED)

  // Location-specific contacts
  primaryContactPersonId?: string; // Main contact at this location (optional)
  contactPersons: string[]; // Contact IDs assigned to this location

  // Operational details
  deliveryNotes?: string; // Special delivery instructions
  openingHours?: string; // Operating hours (free text)
  parkingInstructions?: string; // Parking/access instructions

  // Audit trail (inherited from BaseEntity)
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

### Location Business Rules

1. **Required Fields:** `customerId`, `locationName`, `locationType`, `deliveryAddress`, `isActive`
2. **Unique Names:** `locationName` must be unique within a customer (across all locations for that customer)
3. **Active Locations:** If a customer has locations, at least one SHOULD be active
4. **Primary Contact:** If `primaryContactPersonId` is set, it MUST be in the `contactPersons` array
5. **Parent Reference:** `customerId` MUST reference an existing Customer
6. **Contact Assignment:** All IDs in `contactPersons` MUST reference existing Contact entities

### Location Use Cases

**Use Case 1: Single-Location Customer**

- Customer has only `billingAddress`, no separate locations
- Simple case: billing and delivery are the same

**Use Case 2: Multi-Location Customer (Franchise)**

- Customer: "Bäckerei Müller GmbH & Co. KG"
- Billing Address: Hauptverwaltung in München
- Locations:
  - Location 1: "Filiale München Innenstadt" (branch)
  - Location 2: "Filiale Nürnberg" (branch)
  - Location 3: "Zentrallager" (warehouse)

**Use Case 3: Headquarters + Branches**

- Main office for billing/admin
- Multiple branch locations for deliveries
- Each branch has own contact persons and delivery instructions

**Use Case 4: Project-Specific Delivery**

- Customer has permanent warehouse
- Additional temporary project sites for specific deliveries

---

## 4. Contact/ContactPerson Entity

The Contact entity represents an individual person associated with a customer. Contacts can have decision-making roles and authority levels for business processes.

### ContactPerson Interface

```typescript
interface ContactPerson extends BaseEntity {
  _id: string; // Format: "contact-{uuid}"
  type: "contact"; // Fixed discriminator

  // Basic information
  firstName: string; // First name (REQUIRED)
  lastName: string; // Last name (REQUIRED)
  title?: string; // Professional title (e.g., "Dr.", "Prof.")
  position?: string; // Job position (e.g., "Geschäftsführer", "Einkaufsleiter")

  // Contact details
  email?: string; // Email address
  phone?: string; // Phone number
  mobile?: string; // Mobile number

  // Relationship
  customerId: string; // Parent customer ID (REQUIRED)

  // Decision-Making & Authority (NEW)
  decisionMakingRole: DecisionMakingRole; // Role in decision-making process (REQUIRED)
  authorityLevel: "low" | "medium" | "high" | "final_authority"; // Authority level
  canApproveOrders: boolean; // Can approve orders/quotes
  approvalLimitEur?: number; // Maximum order value they can approve (required if canApproveOrders=true)

  // Role & Responsibilities (NEW)
  functionalRoles: FunctionalRole[]; // Multiple roles possible (e.g., purchasing + facility)
  departmentInfluence: string[]; // Departments they influence (e.g., ["purchasing", "operations", "finance"])

  // Location Assignment (NEW)
  assignedLocationIds: string[]; // Locations this contact is responsible for
  isPrimaryContactForLocations: string[]; // Locations where they're the main contact

  // Communication preferences
  preferredContactMethod?: "email" | "phone" | "mobile";
  language?: string; // Preferred language (ISO 639-1 code, default: "de")

  // Audit trail (inherited from BaseEntity)
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

### Contact Business Rules

1. **Required Fields:** `firstName`, `lastName`, `customerId`, `decisionMakingRole`, `authorityLevel`, `canApproveOrders`
2. **Approval Limit:** If `canApproveOrders = true`, then `approvalLimitEur` MUST be defined
3. **Decision-Maker Requirement:** Every customer SHOULD have at least one contact with `decisionMakingRole` = 'decision_maker' or 'key_influencer'
4. **Opportunity Warning:** When creating an opportunity/quote, if the value exceeds the highest `approvalLimitEur` of assigned contacts, system MUST warn user
5. **Location Assignment:** All IDs in `assignedLocationIds` and `isPrimaryContactForLocations` MUST reference existing Location entities
6. **Primary Contact Validation:** If a contact is in `isPrimaryContactForLocations`, they MUST also be in `assignedLocationIds`

---

## 5. Decision-Making Enums (NEW)

### DecisionMakingRole Enum

Defines the role of a contact in the decision-making process.

```typescript
enum DecisionMakingRole {
  DECISION_MAKER = "decision_maker", // Final decision authority (e.g., CEO, Owner)
  KEY_INFLUENCER = "key_influencer", // Strong influence on decisions (e.g., Purchasing Manager)
  RECOMMENDER = "recommender", // Provides recommendations (e.g., Project Manager)
  GATEKEEPER = "gatekeeper", // Controls access to decision makers (e.g., Executive Assistant)
  OPERATIONAL_CONTACT = "operational_contact", // Day-to-day operations only (e.g., Store Manager)
  INFORMATIONAL = "informational", // Kept informed, no decision power (e.g., Receptionist)
}
```

### FunctionalRole Enum

Defines the functional responsibilities of a contact.

```typescript
enum FunctionalRole {
  OWNER_CEO = "owner_ceo", // Business owner or CEO
  PURCHASING_MANAGER = "purchasing_manager", // Purchasing/procurement
  FACILITY_MANAGER = "facility_manager", // Facility management
  STORE_MANAGER = "store_manager", // Store/branch management
  PROJECT_COORDINATOR = "project_coordinator", // Project coordination
  FINANCIAL_CONTROLLER = "financial_controller", // Financial control
  OPERATIONS_MANAGER = "operations_manager", // Operations management
  ADMINISTRATIVE = "administrative", // Administrative support
}
```

### Authority Level Guidelines

- **low:** Can provide information, no approval authority (€0)
- **medium:** Can approve orders up to €10,000
- **high:** Can approve orders up to €50,000
- **final_authority:** Can approve any order value

_Note: These are guidelines. Actual approval limits are set per contact._

---

## 6. Address Structure

The Address structure is used for both billing addresses (Customer) and delivery addresses (Location).

### Address Interface

```typescript
interface Address {
  street: string; // Street name (REQUIRED)
  streetNumber?: string; // House/building number
  addressLine2?: string; // Additional info (e.g., "Hintereingang", "2. Stock")
  zipCode: string; // Postal code (REQUIRED)
  city: string; // City name (REQUIRED)
  state?: string; // State/Bundesland (e.g., "Bayern")
  country: string; // Country name (default: "Deutschland")

  // Geolocation (optional, for route planning)
  latitude?: number; // GPS latitude
  longitude?: number; // GPS longitude
}
```

### Address Validation Rules

- **street:** Required, 2-100 characters
- **zipCode:** Required, format depends on country (Germany: 5 digits)
- **city:** Required, 2-100 characters
- **country:** Required, default "Deutschland"
- **Geolocation:** If `latitude` is provided, `longitude` MUST also be provided (and vice versa)

---

## 7. Validation Rules

### Customer Validation

#### companyName

- **Required:** true
- **Min length:** 2
- **Max length:** 200
- **Pattern:** `/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/`
- **Error:** "Company name must be 2-200 characters, letters, numbers, and basic punctuation only"

#### vatNumber (German VAT)

- **Required:** false
- **Pattern:** `/^DE\d{9}$/`
- **Error:** "German VAT number must be format: DE123456789"

#### email

- **Required:** false
- **Pattern:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Error:** "Invalid email format"

#### phone

- **Required:** false
- **Pattern:** `/^[\+]?[0-9\s\-()]+$/`
- **Min length:** 7
- **Max length:** 20
- **Error:** "Invalid phone number format"

#### creditLimit

- **Required:** false
- **Min:** 0
- **Max:** 1000000 (€1M)
- **Error:** "Credit limit must be between €0 and €1,000,000"

#### owner

- **Required:** true
- **Must reference:** Existing User with role ADM
- **Error:** "Owner must be a valid ADM user"

#### billingAddress

- **Required:** true
- **Validation:** Must satisfy Address validation rules
- **Error:** "Valid billing address is required"

#### defaultDeliveryLocationId

- **Required:** false
- **Validation:** If provided, must exist in `locations` array
- **Error:** "Default delivery location must be one of the customer's locations"

#### lastVisitDate (Tour Planning)

- **Required:** false
- **Type:** Date (ISO 8601)
- **Validation:** Cannot be in future
- **Max:** Today's date
- **Error:** "Last visit date cannot be in future"
- **Purpose:** Tracks when ADM last visited customer (auto-updated on protocol creation)

#### visitFrequencyDays (Tour Planning)

- **Required:** false
- **Type:** number
- **Min:** 1
- **Max:** 365
- **Default:** null (no scheduled visits)
- **Error:** "Visit frequency must be 1-365 days"
- **Purpose:** Recommended visit interval for tour route optimization

#### preferredVisitTime (Tour Planning)

- **Required:** false
- **Type:** string
- **Enum:** ['morning', 'afternoon', 'flexible']
- **Default:** 'flexible'
- **Error:** "Preferred visit time must be: morning, afternoon, or flexible"
- **Purpose:** Customer's preferred time window for ADM visits

### Location Validation

#### customerId

- **Required:** true
- **Must reference:** Existing Customer
- **Error:** "Valid customer ID is required"

#### locationName

- **Required:** true
- **Min length:** 2
- **Max length:** 100
- **Pattern:** `/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/`
- **Unique:** Within customer (no duplicate location names for same customer)
- **Error:** "Location name must be 2-100 characters and unique for this customer"

#### locationType

- **Required:** true
- **Enum:** ['headquarter', 'branch', 'warehouse', 'project_site', 'other']
- **Error:** "Invalid location type"

#### deliveryAddress

- **Required:** true
- **Validation:** Must satisfy Address validation rules
- **Error:** "Valid delivery address is required"

#### isActive

- **Required:** true
- **Type:** boolean
- **Business Rule:** At least one location should be active if customer has locations
- **Warning:** "No active locations for this customer"

#### primaryContactPersonId

- **Required:** false
- **Validation:** If provided, must be in `contactPersons` array
- **Error:** "Primary contact must be assigned to this location"

#### gpsCoordinates (Tour Planning - NEW)

- **Required:** false
- **Type:** Object with latitude and longitude
- **Validation:**
  - `latitude`: -90 to 90
  - `longitude`: -180 to 180
- **Error:** "GPS coordinates must be valid (latitude: -90 to 90, longitude: -180 to 180)"
- **Purpose:** For navigation, route planning, and tour optimization

#### isHotel (Tour Planning - NEW)

- **Required:** false
- **Type:** boolean
- **Default:** false
- **Purpose:** Marks location as a hotel for tour overnight stays
- **Business Rule:** If true, location can be selected for HotelStay entities

#### hotelRating (Tour Planning - NEW)

- **Required:** false (required if isHotel = true)
- **Type:** number
- **Min:** 1
- **Max:** 5
- **Validation:** Integer between 1-5 (stars)
- **Error:** "Hotel rating must be 1-5 stars"
- **Conditional:** Only applicable if isHotel = true

### Contact Validation

#### firstName, lastName

- **Required:** true
- **Min length:** 2
- **Max length:** 50
- **Pattern:** `/^[a-zA-ZäöüÄÖÜß\s\.\-]+$/`
- **Error:** "Name must be 2-50 characters, letters only"

#### email

- **Required:** false
- **Pattern:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Error:** "Invalid email format"

#### phone, mobile

- **Required:** false
- **Pattern:** `/^[\+]?[0-9\s\-()]+$/`
- **Min length:** 7
- **Max length:** 20
- **Error:** "Invalid phone number format"

#### customerId

- **Required:** true
- **Must reference:** Existing Customer
- **Error:** "Valid customer ID is required"

#### decisionMakingRole

- **Required:** true
- **Enum:** DecisionMakingRole values
- **Error:** "Invalid decision-making role"

#### authorityLevel

- **Required:** true
- **Enum:** ['low', 'medium', 'high', 'final_authority']
- **Error:** "Invalid authority level"

#### canApproveOrders

- **Required:** true
- **Type:** boolean

#### approvalLimitEur

- **Required:** if `canApproveOrders = true`
- **Min:** 0
- **Max:** 10000000 (€10M)
- **Error:** "Approval limit required when contact can approve orders"

#### functionalRoles

- **Required:** false (can be empty array)
- **Type:** FunctionalRole[] (array)
- **Validation:** All values must be valid FunctionalRole enum values

#### assignedLocationIds

- **Required:** false (can be empty array)
- **Validation:** All IDs must reference existing Location entities
- **Error:** "All assigned locations must exist"

#### isPrimaryContactForLocations

- **Required:** false (can be empty array)
- **Validation:** All IDs must be in `assignedLocationIds`
- **Error:** "Primary contact locations must be in assigned locations"

---

## 8. Business Rules

### Cross-Field Validation

#### Customer Rules

**Rule CR-001: Default Delivery Location Validation**

```typescript
if (customer.defaultDeliveryLocationId) {
  if (!customer.locations.includes(customer.defaultDeliveryLocationId)) {
    throw new ValidationException(
      "Default delivery location must be one of the customer's locations",
    );
  }
}
```

**Rule CR-002: At Least One Active Location**

```typescript
if (customer.locations.length > 0) {
  const activeLocations = await this.locationRepo.findActive(
    customer.locations,
  );
  if (activeLocations.length === 0) {
    warnings.push({
      level: "warning",
      message:
        "Customer has no active locations. At least one should be active.",
    });
  }
}
```

**Rule CR-003: Tour Planning Field Visibility (NEW)**

```typescript
// Tour planning fields only visible to ADM, INNEN, GF roles
if (user.role !== "ADM" && user.role !== "INNEN" && user.role !== "GF") {
  // Strip tour planning fields from response
  delete customerResponse.lastVisitDate;
  delete customerResponse.visitFrequencyDays;
  delete customerResponse.preferredVisitTime;
}
```

**Rule CR-004: Last Visit Date Auto-Update (NEW)**

```typescript
// When protocol is created with locationCheckIn (on-site visit)
if (
  protocol.locationCheckIn &&
  protocol.locationCheckIn.checkInType === "on_site"
) {
  customer.lastVisitDate = protocol.createdAt;
  await customerRepository.update(customer);
}
```

**Rule CR-005: Visit Frequency Recommendations (NEW - Phase 2)**

```typescript
// Recommend next visit based on frequency
if (customer.visitFrequencyDays && customer.lastVisitDate) {
  const nextVisitDate = addDays(
    customer.lastVisitDate,
    customer.visitFrequencyDays,
  );

  if (isAfter(new Date(), nextVisitDate)) {
    warnings.push({
      level: "info",
      message: `Customer is due for a visit (last: ${customer.lastVisitDate}, frequency: ${customer.visitFrequencyDays} days)`,
    });
  }
}
```

#### Location Rules

**Rule LR-001: Unique Location Names Per Customer**

```typescript
const existingLocation = await this.locationRepo.findByCustomerAndName(
  location.customerId,
  location.locationName,
);
if (existingLocation && existingLocation._id !== location._id) {
  throw new ValidationException(
    `Location name "${location.locationName}" already exists for this customer`,
  );
}
```

**Rule LR-002: Primary Contact Must Be Assigned**

```typescript
if (location.primaryContactPersonId) {
  if (!location.contactPersons.includes(location.primaryContactPersonId)) {
    throw new ValidationException(
      "Primary contact must be in the list of assigned contact persons",
    );
  }
}
```

**Rule LR-003: GPS Coordinates Validation (NEW)**

```typescript
if (location.gpsCoordinates) {
  const { latitude, longitude } = location.gpsCoordinates;

  if (latitude < -90 || latitude > 90) {
    throw new ValidationException(
      `Latitude must be between -90 and 90 (got ${latitude})`,
    );
  }

  if (longitude < -180 || longitude > 180) {
    throw new ValidationException(
      `Longitude must be between -180 and 180 (got ${longitude})`,
    );
  }
}
```

**Rule LR-004: Hotel Rating Conditional Requirement (NEW)**

```typescript
if (location.isHotel === true && !location.hotelRating) {
  warnings.push({
    level: "warning",
    message: "Hotel locations should have a rating (1-5 stars)",
  });
}

if (location.hotelRating && location.isHotel !== true) {
  warnings.push({
    level: "info",
    message: "Hotel rating is only applicable for hotel locations",
  });
}
```

**Rule LR-005: GPS Distance Calculation (NEW - Phase 2)**

```typescript
// Calculate distance between two locations for tour route planning
function calculateDistance(loc1: Location, loc2: Location): number {
  if (!loc1.gpsCoordinates || !loc2.gpsCoordinates) {
    return null; // Cannot calculate without GPS data
  }

  const R = 6371; // Earth radius in km
  const φ1 = (loc1.gpsCoordinates.latitude * Math.PI) / 180;
  const φ2 = (loc2.gpsCoordinates.latitude * Math.PI) / 180;
  const Δφ =
    ((loc2.gpsCoordinates.latitude - loc1.gpsCoordinates.latitude) * Math.PI) /
    180;
  const Δλ =
    ((loc2.gpsCoordinates.longitude - loc1.gpsCoordinates.longitude) *
      Math.PI) /
    180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
}
```

#### Contact Rules

**Rule CO-001: Approval Limit Required for Approvers**

```typescript
if (contact.canApproveOrders === true) {
  if (!contact.approvalLimitEur || contact.approvalLimitEur <= 0) {
    throw new ValidationException(
      "Contacts who can approve orders must have an approval limit > 0",
    );
  }
}
```

**Rule CO-002: Primary Contact Location Must Be Assigned**

```typescript
for (const primaryLocationId of contact.isPrimaryContactForLocations) {
  if (!contact.assignedLocationIds.includes(primaryLocationId)) {
    throw new ValidationException(
      `Contact is primary for location ${primaryLocationId} but not assigned to it`,
    );
  }
}
```

**Rule CO-003: At Least One Decision Maker Per Customer**

```typescript
// Warning (not error) if customer has no decision-maker
const contacts = await this.contactRepo.findByCustomer(customerId);
const hasDecisionMaker = contacts.some(
  (c) =>
    c.decisionMakingRole === "decision_maker" ||
    c.decisionMakingRole === "key_influencer",
);
if (!hasDecisionMaker) {
  warnings.push({
    level: "warning",
    message:
      "Customer should have at least one decision maker or key influencer",
  });
}
```

### RBAC Permission Checks

EVERY data access operation MUST check permissions. Examples:

**Example: View Customer with Locations**

```typescript
async findCustomer(id: string, currentUser: User): Promise<Customer> {
  const customer = await this.repository.findById(id);

  // Check entity-level permission
  if (!hasPermission(currentUser.role, 'Customer', 'READ')) {
    throw new ForbiddenException('You do not have permission to view customers');
  }

  // Check record-level permission (ownership for ADM)
  if (currentUser.role === 'ADM' && customer.owner !== currentUser.id) {
    throw new ForbiddenException('You can only view your own customers');
  }

  // Load locations with permission filtering
  customer.locations = await this.filterLocationsByPermission(
    customer.locations,
    currentUser
  );

  return customer;
}
```

**Example: Update Contact Decision Role (Restricted)**

```typescript
async updateContactDecisionRole(
  contactId: string,
  updates: Partial<ContactPerson>,
  currentUser: User
): Promise<ContactPerson> {
  // Only ADM+ (PLAN, GF) can update decision-making roles
  if (!hasPermission(currentUser.role, 'Contact', 'UPDATE_DECISION_ROLE')) {
    throw new ForbiddenException(
      'Only ADM+ users can update contact decision-making roles'
    );
  }

  // ... perform update
}
```

### GoBD Compliance

**Immutable Fields After Finalization:**
For entities linked to financial records (invoices), certain customer/location fields become immutable:

- Customer: `companyName`, `vatNumber`, `billingAddress` (after first invoice)
- Location: `deliveryAddress` (after used in project/invoice)

**Change Log Pattern:**

```typescript
interface ChangeLogEntry {
  field: string;
  oldValue: any;
  newValue: any;
  changedBy: string;
  changedAt: Date;
  reason: string; // REQUIRED for post-finalization changes
  approvedBy?: string; // GF approval for significant changes
}

// All entities with financial impact MUST have changeLog
interface GoBDEntity extends BaseEntity {
  changeLog: ChangeLogEntry[];
  immutableAt?: Date;
  immutableHash?: string;
  finalized?: boolean;
}
```

---

## 9. Migration Strategy

### Overview

Existing KOMPASS data must be migrated to support the new multi-location and decision-making features. This migration is **backward-compatible** and can be executed in phases.

### Phase 1: Customer Address Migration

**Current State:**

```typescript
interface CustomerOld {
  address: Address; // Single address field
}
```

**Target State:**

```typescript
interface Customer {
  billingAddress: Address; // Renamed from 'address'
  locations: string[]; // New field (empty by default)
}
```

**Migration Steps:**

1. **Rename Field:** `customer.address` → `customer.billingAddress`
   - Direct field rename in CouchDB documents
   - No data loss, purely structural

2. **Initialize Locations:** Add empty `locations: []` array to all customers
   - Default: No separate locations (backward compatible)
   - Customers continue to use billing address for deliveries

3. **Optional Default Location Creation:**
   - For customers who need delivery tracking, optionally create a default location:

   ```typescript
   const defaultLocation: Location = {
     _id: generateId("location"),
     type: "location",
     customerId: customer._id,
     locationName: "Hauptstandort",
     locationType: "headquarter",
     deliveryAddress: customer.billingAddress, // Copy billing address
     isActive: true,
     contactPersons: customer.contactPersons,
     // ... audit fields
   };
   customer.locations.push(defaultLocation._id);
   customer.defaultDeliveryLocationId = defaultLocation._id;
   ```

4. **Update Application Code:**
   - Update DTOs to use `billingAddress` instead of `address`
   - Add location management endpoints
   - Update frontend to show "Standorte" tab

### Phase 2: Contact Decision-Making Migration

**Current State:**

```typescript
interface ContactOld {
  // No decision-making fields
}
```

**Target State:**

```typescript
interface Contact {
  decisionMakingRole: DecisionMakingRole; // NEW
  authorityLevel: string; // NEW
  canApproveOrders: boolean; // NEW
  approvalLimitEur?: number; // NEW
  functionalRoles: FunctionalRole[]; // NEW
  assignedLocationIds: string[]; // NEW
}
```

**Migration Steps:**

1. **Set Default Values:**

   ```typescript
   contact.decisionMakingRole = "operational_contact"; // Conservative default
   contact.authorityLevel = "low";
   contact.canApproveOrders = false;
   contact.functionalRoles = [];
   contact.assignedLocationIds = [];
   contact.isPrimaryContactForLocations = [];
   ```

2. **Manual Review Process:**
   - Generate report of all contacts with default values
   - ADM+ users review and assign actual decision-making roles
   - Set appropriate approval limits for decision-makers

3. **Bulk Update Tool:**
   - Admin interface to bulk-update contact roles
   - Import from CSV if customer provides org chart data

4. **Validation:**
   - Ensure each customer has at least one decision-maker (warning if not)
   - Validate approval limits are set for approvers

### Phase 3: Location Assignment

**Manual Process (Post-Migration):**

1. **Identify Multi-Location Customers:**
   - Review customer list for franchises, chains, multi-site operations
   - Flag customers who mentioned multiple addresses in notes/projects

2. **Create Locations:**
   - ADM users create Location records via new UI
   - Assign delivery addresses, operational details
   - Link contacts to specific locations

3. **Update Projects:**
   - Historical projects: Optionally link to appropriate location
   - New projects: Require location selection for multi-location customers

### Migration Script Outline

```typescript
// NOT IMPLEMENTED - Documentation only
async function migrateCustomerAddresses() {
  const customers = await db.allDocs({
    include_docs: true,
    startkey: "customer-",
    endkey: "customer-\ufff0",
  });

  for (const row of customers.rows) {
    const customer = row.doc;

    // Step 1: Rename address to billingAddress
    if (customer.address && !customer.billingAddress) {
      customer.billingAddress = customer.address;
      delete customer.address;
    }

    // Step 2: Initialize locations array
    if (!customer.locations) {
      customer.locations = [];
    }

    // Step 3: Update metadata
    customer.modifiedBy = "system-migration";
    customer.modifiedAt = new Date();
    customer.version += 1;

    await db.put(customer);
  }
}

async function migrateContactDecisionRoles() {
  const contacts = await db.allDocs({
    include_docs: true,
    startkey: "contact-",
    endkey: "contact-\ufff0",
  });

  for (const row of contacts.rows) {
    const contact = row.doc;

    // Set defaults for new fields
    if (!contact.decisionMakingRole) {
      contact.decisionMakingRole = "operational_contact";
      contact.authorityLevel = "low";
      contact.canApproveOrders = false;
      contact.functionalRoles = [];
      contact.assignedLocationIds = [];
      contact.isPrimaryContactForLocations = [];

      contact.modifiedBy = "system-migration";
      contact.modifiedAt = new Date();
      contact.version += 1;

      await db.put(contact);
    }
  }
}
```

### Rollback Strategy

If migration issues occur:

1. **Customer Address:** Rename `billingAddress` back to `address`, remove `locations` field
2. **Contact Roles:** Remove new fields (decision-making fields are optional/defaulted)
3. **Location Entities:** Delete all Location documents (if not yet in use)

### Testing Migration

- **Test Environment:** Execute migration on copy of production database
- **Validation Queries:** Verify all customers have `billingAddress`, all contacts have decision roles
- **Sample Checks:** Manually review 10-20 migrated records for correctness
- **Performance:** Migration should complete in <10 minutes for 5,000 customers

---

## 10. Future Entities (Placeholders)

The following entities will be documented in future iterations:

### Opportunity Entity (TBD)

- Extends BaseEntity
- Represents sales opportunities (leads → won/lost)
- Links to Customer and Contact
- **Location Integration:** Opportunity can specify target delivery location
- Status transitions: New → Qualifying → Proposal → Negotiation → Won/Lost

### Project Entity (TBD)

- Extends BaseEntity
- Represents customer projects (execution phase)
- Links to Customer, Opportunity, and Location
- **Location Integration:** Project delivery to specific customer location
- Budget tracking, milestone management

### Offer Entity (Angebot)

- Extends BaseEntity
- Represents sales offers/quotes sent to customers
- **PDF Upload:** Upload PDF of offer document
- **Metadata:** Customer, totalAmount, offerDate, validUntil, status
- **Status:** Draft → Sent → Accepted → Rejected
- **Conversion:** Can be converted to Contract entity
- Links to Customer and Opportunity

### Contract Entity (Auftragsbestätigung)

- Extends BaseEntity with GoBD compliance
- Represents accepted contracts/purchase orders
- **PDF Upload:** Upload PDF of signed contract
- **Metadata:** Customer, totalAmount, contractDate, status
- **Status:** Draft → Signed → InProgress → Completed
- **Immutable after Signed status** (GoBD requirement)
- Links to Customer, Opportunity, and Project
- Source of project budget data for financial tracking

### Activity/Protocol Entity (TBD)

- Extends BaseEntity
- Customer interactions (calls, meetings, visits)
- Links to Customer, Contact, and optionally Location (visit location)

---

## Validation Examples

### Example 1: Simple Customer (No Locations)

```typescript
const simpleCustomer: Customer = {
  _id: "customer-12345",
  _rev: "1-abc",
  type: "customer",
  companyName: "Hofladen Müller GmbH",
  vatNumber: "DE123456789",
  billingAddress: {
    street: "Hauptstraße",
    streetNumber: "15",
    zipCode: "80331",
    city: "München",
    country: "Deutschland",
  },
  locations: [], // No separate delivery locations
  owner: "user-adm-001",
  contactPersons: ["contact-001"],
  createdBy: "user-adm-001",
  createdAt: new Date("2025-01-15"),
  modifiedBy: "user-adm-001",
  modifiedAt: new Date("2025-01-15"),
  version: 1,
};
// ✅ Valid: Billing address provided, no locations (simple case)
```

### Example 2: Multi-Location Customer (Franchise)

```typescript
const franchiseCustomer: Customer = {
  _id: "customer-67890",
  _rev: "1-def",
  type: "customer",
  companyName: "Bäckerei Schmidt Franchise GmbH",
  vatNumber: "DE987654321",
  billingAddress: {
    street: "Verwaltungsweg",
    streetNumber: "10",
    zipCode: "70173",
    city: "Stuttgart",
    country: "Deutschland",
  },
  locations: ["location-001", "location-002", "location-003"],
  defaultDeliveryLocationId: "location-001",
  owner: "user-adm-002",
  contactPersons: ["contact-100", "contact-101", "contact-102"],
  createdBy: "user-adm-002",
  createdAt: new Date("2025-01-20"),
  modifiedBy: "user-adm-002",
  modifiedAt: new Date("2025-01-20"),
  version: 1,
};

const location1: Location = {
  _id: "location-001",
  _rev: "1-ghi",
  type: "location",
  customerId: "customer-67890",
  locationName: "Filiale Stuttgart Mitte",
  locationType: "branch",
  isActive: true,
  deliveryAddress: {
    street: "Königstraße",
    streetNumber: "42",
    zipCode: "70173",
    city: "Stuttgart",
    country: "Deutschland",
  },
  primaryContactPersonId: "contact-100",
  contactPersons: ["contact-100"],
  deliveryNotes: "Hintereingang nutzen, Mo-Fr 6:00-14:00 Uhr",
  createdBy: "user-adm-002",
  createdAt: new Date("2025-01-20"),
  modifiedBy: "user-adm-002",
  modifiedAt: new Date("2025-01-20"),
  version: 1,
};
// ✅ Valid: Multi-location setup with default delivery location
```

### Example 3: Contact as Decision Maker with Approval Limit

```typescript
const decisionMakerContact: ContactPerson = {
  _id: "contact-100",
  _rev: "1-jkl",
  type: "contact",
  firstName: "Thomas",
  lastName: "Schmidt",
  position: "Geschäftsführer",
  email: "thomas.schmidt@baeckerei-schmidt.de",
  phone: "+49-711-123456",
  customerId: "customer-67890",

  // Decision-making fields
  decisionMakingRole: "decision_maker",
  authorityLevel: "final_authority",
  canApproveOrders: true,
  approvalLimitEur: 100000, // Can approve up to €100k

  functionalRoles: ["owner_ceo", "purchasing_manager"],
  departmentInfluence: ["purchasing", "operations", "finance"],

  assignedLocationIds: ["location-001", "location-002", "location-003"],
  isPrimaryContactForLocations: ["location-001"],

  createdBy: "user-adm-002",
  createdAt: new Date("2025-01-20"),
  modifiedBy: "user-adm-002",
  modifiedAt: new Date("2025-01-20"),
  version: 1,
};
// ✅ Valid: Decision maker with high approval limit
```

### Example 4: Validation Error - Missing Approval Limit

```typescript
const invalidContact: ContactPerson = {
  // ... other fields
  canApproveOrders: true,
  approvalLimitEur: undefined, // ❌ ERROR: Required when canApproveOrders=true
};
// ValidationException: "Contacts who can approve orders must have an approval limit > 0"
```

### Example 5: Validation Error - Non-Unique Location Name

```typescript
// Customer already has location named "Filiale München"
const duplicateLocation: Location = {
  customerId: "customer-12345",
  locationName: "Filiale München", // ❌ ERROR: Already exists
  // ... other fields
};
// ValidationException: "Location name 'Filiale München' already exists for this customer"
```

---

## 14. UserTask Entity (NEW)

**Updated:** 2025-01-28  
**Status:** Planned for implementation (Phase 1 - MVP)

The UserTask entity represents personal todo items and follow-up tasks for individual users. These are not project-bound but can be optionally linked to customers, opportunities, or projects for context.

### UserTask Interface

```typescript
interface UserTask extends BaseEntity {
  _id: string; // Format: "usertask-{uuid}"
  type: "user_task"; // Fixed discriminator

  // Core MVP fields
  title: string; // Task title (5-200 chars)
  description?: string; // Detailed description (rich text)
  status: "open" | "in_progress" | "completed" | "cancelled"; // Task status
  priority: "low" | "medium" | "high" | "urgent"; // Task priority
  dueDate?: Date; // Optional due date
  assignedTo: string; // User ID (can be self-assigned)

  // Context linking (optional - for organization)
  relatedCustomerId?: string; // Link to customer
  relatedOpportunityId?: string; // Link to opportunity
  relatedProjectId?: string; // Link to project (for follow-ups)

  // MVP metadata
  completedAt?: Date; // When task was completed
  completedBy?: string; // User ID who completed task

  // Phase 2+ (architecture placeholders - DO NOT IMPLEMENT IN MVP)
  reminderDate?: Date; // For notifications
  recurring?: RecurringPattern; // For recurring tasks (Phase 2)
  tags?: string[]; // For categorization

  // Audit trail (inherited from BaseEntity)
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

### RecurringPattern Interface (Phase 2+ - Placeholder Only)

```typescript
interface RecurringPattern {
  frequency: "daily" | "weekly" | "monthly";
  interval: number; // Every N days/weeks/months
  endDate?: Date; // When to stop creating recurring tasks
  lastCreated?: Date; // Last time task was auto-created
}
```

### ID Generation

- **UserTask ID:** `usertask-{uuid}` (e.g., `usertask-a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Validation Rules

| Field                  | Validation                                                            |
| ---------------------- | --------------------------------------------------------------------- |
| `title`                | Required, 5-200 chars, pattern: `/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&(),!?]+$/` |
| `description`          | Optional, max 2000 chars                                              |
| `status`               | Required, enum: ['open', 'in_progress', 'completed', 'cancelled']     |
| `priority`             | Required, enum: ['low', 'medium', 'high', 'urgent']                   |
| `dueDate`              | Optional, must be present or future date (not in past on creation)    |
| `assignedTo`           | Required, must reference existing User                                |
| `relatedCustomerId`    | Optional, must reference existing Customer if provided                |
| `relatedOpportunityId` | Optional, must reference existing Opportunity if provided             |
| `relatedProjectId`     | Optional, must reference existing Project if provided                 |

### Business Rules

1. **Self-Assignment Default:** When creating UserTask, `assignedTo` defaults to current user if not specified
2. **Completion Validation:** When status changes to 'completed', `completedAt` and `completedBy` are automatically set
3. **Cancellation:** Cancelled tasks cannot be reopened (must create new task)
4. **Related Entity Access:** User must have READ permission for any related entity they link to task
5. **Ownership:** Users can only UPDATE/DELETE their own UserTasks (where `assignedTo = user.id`), except GF who can manage all
6. **Status Transitions:** Valid transitions:
   - open → in_progress, completed, cancelled
   - in_progress → completed, cancelled, open (reopen)
   - completed → (terminal state)
   - cancelled → (terminal state)

### Use Cases

**Use Case 1: Sales Follow-Up Task**

```typescript
{
  _id: 'usertask-12345',
  type: 'user_task',
  title: 'Call Hofladen Müller about delivery timeline',
  description: 'Customer wants to confirm installation date for next month',
  status: 'open',
  priority: 'high',
  dueDate: '2025-02-05T00:00:00Z',
  assignedTo: 'user-adm-001',
  relatedCustomerId: 'customer-98765',
  relatedOpportunityId: 'opportunity-54321',
  createdBy: 'user-adm-001',
  createdAt: '2025-01-28T14:30:00Z',
  modifiedBy: 'user-adm-001',
  modifiedAt: '2025-01-28T14:30:00Z',
  version: 1
}
```

**Use Case 2: Internal Administrative Task**

```typescript
{
  _id: 'usertask-67890',
  type: 'user_task',
  title: 'Update customer credit limits in Q1 review',
  description: null,
  status: 'open',
  priority: 'medium',
  dueDate: '2025-03-31T00:00:00Z',
  assignedTo: 'user-innen-002',
  createdBy: 'user-gf-001',  // Assigned by GF
  createdAt: '2025-01-28T10:00:00Z',
  modifiedBy: 'user-gf-001',
  modifiedAt: '2025-01-28T10:00:00Z',
  version: 1
}
```

---

## 15. ProjectTask Entity (NEW)

**Updated:** 2025-01-28  
**Status:** Planned for implementation (Phase 1 - MVP)

The ProjectTask entity represents work items within a project context. These tasks are bound to specific projects and managed by project team members (PLAN, INNEN).

### ProjectTask Interface

```typescript
interface ProjectTask extends BaseEntity {
  _id: string; // Format: "projecttask-{uuid}"
  type: "project_task"; // Fixed discriminator

  // Core MVP fields
  projectId: string; // Parent project ID (REQUIRED)
  title: string; // Task title (5-200 chars)
  description?: string; // Detailed description (rich text)
  status: "todo" | "in_progress" | "review" | "done" | "blocked"; // Task status
  priority: "low" | "medium" | "high" | "critical"; // Task priority
  assignedTo: string; // User ID (PLAN, INNEN, etc.)
  dueDate?: Date; // Optional due date

  // Project context
  phase?: string; // Project phase: "planning" | "execution" | "delivery" | "closure"
  milestone?: string; // Link to project milestone (optional)

  // MVP metadata
  completedAt?: Date; // When task was completed
  completedBy?: string; // User ID who completed task
  blockingReason?: string; // Reason if status = blocked (required when blocked)

  // Phase 2+ (architecture placeholders - DO NOT IMPLEMENT IN MVP)
  dependsOn?: string[]; // Task dependencies (Phase 2)
  blockedBy?: string[]; // Tasks blocking this one (calculated, Phase 2)
  estimatedHours?: number; // Time estimation (Phase 2)
  actualHours?: number; // Time tracking (Phase 2)
  timeEntries?: TimeEntry[]; // Time log entries (Phase 2)
  subtasks?: SubTask[]; // Subtask breakdown (Phase 2)
  parentTaskId?: string; // For hierarchical tasks (Phase 2)
  startDate?: Date; // Calculated from dependencies (Phase 2)
  criticalPath?: boolean; // Is on critical path (Phase 2)

  // Audit trail (inherited from BaseEntity)
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

### SubTask Interface (Phase 2+ - Placeholder Only)

```typescript
interface SubTask {
  id: string; // Subtask ID
  title: string; // Subtask title (5-100 chars)
  completed: boolean; // Completion status
  order: number; // Display order
  completedAt?: Date; // When completed
}
```

### TimeEntry Interface (Phase 2+ - Placeholder Only)

```typescript
interface TimeEntry {
  id: string; // Entry ID
  userId: string; // Who logged time
  hours: number; // Hours worked
  date: Date; // Date of work
  description?: string; // What was done
  createdAt: Date;
}
```

### ID Generation

- **ProjectTask ID:** `projecttask-{uuid}` (e.g., `projecttask-550e8400-e29b-41d4-a716-446655440000`)

### Validation Rules

| Field            | Validation                                                            |
| ---------------- | --------------------------------------------------------------------- |
| `projectId`      | Required, must reference existing Project                             |
| `title`          | Required, 5-200 chars, pattern: `/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&(),!?]+$/` |
| `description`    | Optional, max 2000 chars                                              |
| `status`         | Required, enum: ['todo', 'in_progress', 'review', 'done', 'blocked']  |
| `priority`       | Required, enum: ['low', 'medium', 'high', 'critical']                 |
| `assignedTo`     | Required, must reference existing User with Project.READ permission   |
| `dueDate`        | Optional, must be present or future date                              |
| `phase`          | Optional, enum: ['planning', 'execution', 'delivery', 'closure']      |
| `milestone`      | Optional, must reference existing milestone if provided               |
| `blockingReason` | Required if status = 'blocked', 10-500 chars                          |

### Business Rules

1. **Project Association:** ProjectTask can only be created for existing Project
2. **Assignment Permission:** `assignedTo` user must have `Project.READ` permission on parent project
3. **Phase Validation:** If `phase` is set, it should match one of the project's defined phases
4. **Completion Tracking:** When status changes to 'done', `completedAt` and `completedBy` are automatically set
5. **Blocking Validation:** If status = 'blocked', `blockingReason` is REQUIRED
6. **Permission Cascade:** Users can only view/manage ProjectTasks for projects they have access to
7. **Status Transitions:** Valid transitions:
   - todo → in_progress, blocked, done
   - in_progress → review, blocked, todo (reopen), done
   - review → done, in_progress (revise), blocked
   - done → (terminal state)
   - blocked → todo, in_progress (unblocked)

### Use Cases

**Use Case 1: Planning Task**

```typescript
{
  _id: 'projecttask-11111',
  type: 'project_task',
  projectId: 'project-98765',
  title: 'Create technical drawings for Hofladen Müller',
  description: 'Complete CAD drawings for store layout, include furniture placement and electrical plan',
  status: 'todo',
  priority: 'high',
  assignedTo: 'user-plan-003',
  dueDate: '2025-02-15T00:00:00Z',
  phase: 'planning',
  createdBy: 'user-innen-001',
  createdAt: '2025-01-28T09:00:00Z',
  modifiedBy: 'user-innen-001',
  modifiedAt: '2025-01-28T09:00:00Z',
  version: 1
}
```

**Use Case 2: Execution Task with Blocking**

```typescript
{
  _id: 'projecttask-22222',
  type: 'project_task',
  projectId: 'project-98765',
  title: 'Order custom furniture from supplier',
  description: 'Order items per approved design: counter units, shelving, checkout desk',
  status: 'blocked',
  priority: 'critical',
  assignedTo: 'user-innen-001',
  dueDate: '2025-02-20T00:00:00Z',
  phase: 'execution',
  blockingReason: 'Waiting for final approval from customer on wood finish selection',
  createdBy: 'user-innen-001',
  createdAt: '2025-01-28T10:00:00Z',
  modifiedBy: 'user-plan-003',
  modifiedAt: '2025-02-01T15:30:00Z',
  version: 2
}
```

**Use Case 3: Review Task**

```typescript
{
  _id: 'projecttask-33333',
  type: 'project_task',
  projectId: 'project-98765',
  title: 'Review and approve electrical plans',
  description: null,
  status: 'review',
  priority: 'high',
  assignedTo: 'user-innen-001',  // Reviewer
  dueDate: '2025-02-10T00:00:00Z',
  phase: 'planning',
  completedAt: null,  // Not completed yet
  createdBy: 'user-plan-003',
  createdAt: '2025-02-05T11:00:00Z',
  modifiedBy: 'user-plan-003',
  modifiedAt: '2025-02-08T09:30:00Z',
  version: 1
}
```

### Validation Examples

**Example 1: Valid ProjectTask Creation**

```typescript
const validProjectTask: ProjectTask = {
  _id: "projecttask-12345",
  _rev: "1-abc",
  type: "project_task",
  projectId: "project-98765",
  title: "Schedule installation team for week 8",
  status: "todo",
  priority: "medium",
  assignedTo: "user-innen-001",
  dueDate: new Date("2025-02-20"),
  phase: "execution",
  createdBy: "user-innen-001",
  createdAt: new Date("2025-01-28"),
  modifiedBy: "user-innen-001",
  modifiedAt: new Date("2025-01-28"),
  version: 1,
};
// ✅ Valid: All required fields present, valid project reference
```

**Example 2: Validation Error - Missing Blocking Reason**

```typescript
const invalidTask: ProjectTask = {
  // ... other fields
  status: "blocked",
  blockingReason: undefined, // ❌ ERROR: Required when status = blocked
};
// ValidationException: "Blocking reason is required when task status is blocked"
```

**Example 3: Validation Error - Invalid Assignee Permission**

```typescript
// User 'user-adm-005' does NOT have Project.READ permission on project-98765
const invalidTask: ProjectTask = {
  projectId: "project-98765",
  assignedTo: "user-adm-005", // ❌ ERROR: User cannot access this project
  // ... other fields
};
// ForbiddenException: "Cannot assign task to user who doesn't have access to project"
```

---

## 16. Task Entity Cross-Field Validation

### UserTask Validation

**Rule UT-001: Valid Due Date**

```typescript
if (userTask.dueDate) {
  const now = new Date();
  if (userTask.dueDate < now && !userTask._id) {
    // Only check on creation
    throw new ValidationException("Due date cannot be in the past");
  }
}
```

**Rule UT-002: Related Entity Validation**

```typescript
// If task links to customer, verify customer exists and user has access
if (userTask.relatedCustomerId) {
  const customer = await this.customerRepo.findById(userTask.relatedCustomerId);
  if (!customer) {
    throw new ValidationException("Related customer not found");
  }
  if (!hasPermission(currentUser.roles, "Customer", "READ")) {
    throw new ForbiddenException("Cannot link to customer you cannot access");
  }
}
```

**Rule UT-003: Assignment Permission**

```typescript
// Only GF and PLAN can assign tasks to other users
if (userTask.assignedTo !== currentUser.id) {
  if (!hasPermission(currentUser.roles, "UserTask", "ASSIGN_TO_OTHERS")) {
    throw new ForbiddenException(
      "You can only create tasks assigned to yourself. GF/PLAN can assign to others.",
    );
  }
}
```

**Rule UT-004: Completion Metadata**

```typescript
// When marking completed, set completion metadata
if (userTask.status === "completed") {
  if (!userTask.completedAt) {
    userTask.completedAt = new Date();
    userTask.completedBy = currentUser.id;
  }
}
```

### ProjectTask Validation

**Rule PT-001: Project Access Validation**

```typescript
// User must have Project.READ permission
const project = await this.projectRepo.findById(projectTask.projectId);
if (!project) {
  throw new NotFoundException("Project not found");
}
if (!hasPermission(currentUser.roles, "Project", "READ")) {
  throw new ForbiddenException(
    "Cannot create tasks for projects you cannot access",
  );
}
```

**Rule PT-002: Assignee Project Permission**

```typescript
// Assignee must have Project.READ on parent project
const assignee = await this.userRepo.findById(projectTask.assignedTo);
if (!hasPermission(assignee.roles, "Project", "READ")) {
  throw new ValidationException(
    "Cannot assign task to user who does not have access to this project",
  );
}
```

**Rule PT-003: Blocking Reason Requirement**

```typescript
if (projectTask.status === "blocked") {
  if (!projectTask.blockingReason || projectTask.blockingReason.length < 10) {
    throw new ValidationException(
      "Blocking reason is required (min 10 characters) when task status is blocked",
    );
  }
}
```

**Rule PT-004: Phase Validation**

```typescript
// If phase specified, should be valid project phase
if (projectTask.phase) {
  const validPhases = ["planning", "execution", "delivery", "closure"];
  if (!validPhases.includes(projectTask.phase)) {
    throw new ValidationException(
      `Invalid phase. Must be one of: ${validPhases.join(", ")}`,
    );
  }
}
```

**Rule PT-005: Review Status Assignment**

```typescript
// When status changes to 'review', task should be assigned to reviewer (not original assignee)
if (projectTask.status === "review") {
  warnings.push({
    level: "info",
    message:
      "Task is in review status. Consider reassigning to reviewer if not already done.",
  });
}
```

---

## Document History

| Version | Date       | Author | Changes                                                                                                                                                                                          |
| ------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.0     | 2025-01-28 | System | Initial specification: BaseEntity, Customer (multi-location), Location entity, Contact (decision-making), validation rules, migration strategy                                                   |
| 1.1     | 2025-01-27 | System | Added User entity (multiple roles support), Role entity (hybrid RBAC), PermissionMatrix entity (runtime configuration), updated ID generation rules                                              |
| 1.2     | 2025-01-28 | System | Added UserTask entity (personal todos), ProjectTask entity (project work items), task validation rules, business rules, use cases, Phase 2+ placeholders for dependencies/time tracking/subtasks |

---

---

## 17. CalendarEvent Interface (NEW)

**Added:** 2025-01-28  
**Status:** Planned for MVP - Calendar Views  
**Purpose:** Unified interface for displaying tasks, projects, opportunities, and milestones in calendar views

### CalendarEvent Interface

The `CalendarEvent` interface provides a normalized view of all date-driven entities in KOMPASS for display in calendar components. It is not stored in CouchDB but generated dynamically from UserTask, ProjectTask, Project, Opportunity, and Milestone entities.

```typescript
interface CalendarEvent {
  // Identity
  id: string; // Unique event ID (entity-specific format)
  type: CalendarEventType; // Event type discriminator

  // Display
  title: string; // Event title (max 200 chars)
  description?: string; // Event description (optional)
  color: string; // Hex color for visual coding (#RRGGBB)
  icon?: string; // Icon name for event type

  // Timing
  startDate: Date; // Event start date/time (required)
  endDate?: Date; // Event end date/time (optional)
  allDay: boolean; // True if all-day event, false if timed

  // Entity Reference
  entityId: string; // Reference to source entity (_id)
  entityType: CalendarEntityType; // Source entity type

  // Metadata
  status: string; // Entity-specific status
  priority?: CalendarPriority; // Priority level (if applicable)
  assignedTo?: string[]; // User IDs assigned to event

  // Additional Context
  location?: string; // Physical location (if applicable)
  tags?: string[]; // Custom tags for filtering
  url?: string; // Deep link to entity detail page
}
```

### CalendarEventType Enum

```typescript
enum CalendarEventType {
  USER_TASK = "user_task", // UserTask due date
  PROJECT_TASK = "project_task", // ProjectTask due date
  PROJECT_DEADLINE = "project_deadline", // Project plannedEndDate
  PROJECT_START = "project_start", // Project plannedStartDate
  PROJECT_MILESTONE = "project_milestone", // Project milestone
  OPPORTUNITY_CLOSE = "opportunity_close", // Opportunity expectedCloseDate
  INVOICE_DUE = "invoice_due", // Invoice paymentDueDate
  ACTIVITY_SCHEDULED = "activity_scheduled", // Scheduled activity/meeting
  USER_VACATION = "user_vacation", // User vacation/time off
  HOLIDAY = "holiday", // Company/public holiday
}
```

### CalendarEntityType Enum

```typescript
enum CalendarEntityType {
  USER_TASK = "UserTask",
  PROJECT_TASK = "ProjectTask",
  PROJECT = "Project",
  OPPORTUNITY = "Opportunity",
  INVOICE = "Invoice",
  ACTIVITY = "Activity",
  USER = "User",
  SYSTEM = "System",
}
```

### CalendarPriority Enum

```typescript
enum CalendarPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
  CRITICAL = "critical",
}
```

### Color Coding Standards

**Event Type Colors:**

- `USER_TASK`: Blue (#3B82F6) - Personal task indicator
- `PROJECT_TASK`: Green (#10B981) - Project work indicator
- `PROJECT_DEADLINE`: Green (#10B981) - Project milestone
- `PROJECT_START`: Green (#22C55E) - Project kickoff
- `PROJECT_MILESTONE`: Emerald (#059669) - Key milestone
- `OPPORTUNITY_CLOSE`: Purple (#A855F7) - Sales opportunity
- `INVOICE_DUE`: Amber (#F59E0B) - Financial deadline
- `ACTIVITY_SCHEDULED`: Cyan (#06B6D4) - Meeting/activity
- `USER_VACATION`: Gray (#6B7280) - Out of office
- `HOLIDAY`: Red (#EF4444) - Company holiday

**Priority Override (for tasks):**

- `URGENT`: Red (#EF4444) - Overrides type color
- `CRITICAL`: Dark Red (#DC2626) - Overrides type color
- `HIGH`: Orange (#F97316) - Overrides type color

### Event Generation Rules

#### From UserTask

```typescript
function userTaskToCalendarEvent(task: UserTask): CalendarEvent {
  return {
    id: task._id,
    type: CalendarEventType.USER_TASK,
    title: task.title,
    description: task.description,
    color: getPriorityColor(task.priority) || "#3B82F6",
    icon: "CheckSquare",
    startDate: task.dueDate,
    endDate: task.dueDate,
    allDay: true,
    entityId: task._id,
    entityType: CalendarEntityType.USER_TASK,
    status: task.status,
    priority: mapPriority(task.priority),
    assignedTo: [task.assignedTo],
    url: `/tasks/${task._id}`,
  };
}
```

#### From ProjectTask

```typescript
function projectTaskToCalendarEvent(task: ProjectTask): CalendarEvent {
  return {
    id: task._id,
    type: CalendarEventType.PROJECT_TASK,
    title: task.title,
    description: task.description,
    color: getPriorityColor(task.priority) || "#10B981",
    icon: "Briefcase",
    startDate: task.dueDate,
    endDate: task.dueDate,
    allDay: true,
    entityId: task._id,
    entityType: CalendarEntityType.PROJECT_TASK,
    status: task.status,
    priority: mapPriority(task.priority),
    assignedTo: [task.assignedTo],
    url: `/projects/${task.projectId}/tasks/${task._id}`,
  };
}
```

#### From Project (Deadlines & Milestones)

```typescript
function projectToCalendarEvents(project: Project): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  // Project start date
  events.push({
    id: `${project._id}-start`,
    type: CalendarEventType.PROJECT_START,
    title: `Start: ${project.projectName}`,
    description: project.projectDescription,
    color: "#22C55E",
    icon: "PlayCircle",
    startDate: project.plannedStartDate,
    endDate: project.plannedStartDate,
    allDay: true,
    entityId: project._id,
    entityType: CalendarEntityType.PROJECT,
    status: project.status,
    url: `/projects/${project._id}`,
  });

  // Project end date
  events.push({
    id: `${project._id}-end`,
    type: CalendarEventType.PROJECT_DEADLINE,
    title: `Deadline: ${project.projectName}`,
    description: project.projectDescription,
    color: "#10B981",
    icon: "Flag",
    startDate: project.plannedEndDate,
    endDate: project.plannedEndDate,
    allDay: true,
    entityId: project._id,
    entityType: CalendarEntityType.PROJECT,
    status: project.status,
    url: `/projects/${project._id}`,
  });

  // Milestones (if implemented)
  if (project.milestones) {
    project.milestones.forEach((milestone) => {
      events.push({
        id: `${project._id}-milestone-${milestone.id}`,
        type: CalendarEventType.PROJECT_MILESTONE,
        title: milestone.name,
        description: milestone.description,
        color: "#059669",
        icon: "Target",
        startDate: milestone.dueDate,
        endDate: milestone.dueDate,
        allDay: true,
        entityId: project._id,
        entityType: CalendarEntityType.PROJECT,
        status: milestone.status,
        url: `/projects/${project._id}#milestone-${milestone.id}`,
      });
    });
  }

  return events;
}
```

#### From Opportunity

```typescript
function opportunityToCalendarEvent(opp: Opportunity): CalendarEvent {
  return {
    id: opp._id,
    type: CalendarEventType.OPPORTUNITY_CLOSE,
    title: `Close: ${opp.title}`,
    description: opp.description,
    color: "#A855F7",
    icon: "Target",
    startDate: opp.expectedCloseDate,
    endDate: opp.expectedCloseDate,
    allDay: true,
    entityId: opp._id,
    entityType: CalendarEntityType.OPPORTUNITY,
    status: opp.status,
    priority: mapProbabilityToPriority(opp.probability),
    url: `/opportunities/${opp._id}`,
  };
}
```

### Validation Rules

| Field        | Validation                                 |
| ------------ | ------------------------------------------ |
| `id`         | Required, unique within response           |
| `type`       | Required, valid CalendarEventType enum     |
| `title`      | Required, 1-200 chars                      |
| `color`      | Required, valid hex color (#RRGGBB)        |
| `startDate`  | Required, valid ISO 8601 date              |
| `endDate`    | Optional, must be >= startDate if provided |
| `allDay`     | Required, boolean                          |
| `entityId`   | Required, valid entity reference           |
| `entityType` | Required, valid CalendarEntityType enum    |
| `status`     | Required, non-empty string                 |

### Business Rules

**CE-001: Date Range Validation**

- If `endDate` is provided, it must be >= `startDate`
- For all-day events, times are ignored (00:00:00)
- For timed events, times must be valid (00:00 - 23:59)

**CE-002: Color Accessibility**

- All colors must meet WCAG AA contrast ratio (4.5:1) against white background
- Color alone must not convey meaning (use icons + color)

**CE-003: Event Filtering**

- Users see only events for entities they have READ permission for
- ADM role: Sees own UserTasks + ProjectTasks for assigned projects
- PLAN/GF: Sees all events (team-wide calendar)

**CE-004: Event Density Limits**

- Calendar API returns maximum 1000 events per request
- Use date range filtering to limit results
- Recommend 30-day maximum range for performance

### RBAC Integration

Calendar events inherit permissions from source entities:

```typescript
function filterCalendarEvents(
  events: CalendarEvent[],
  user: User,
): CalendarEvent[] {
  return events.filter((event) => {
    switch (event.entityType) {
      case CalendarEntityType.USER_TASK:
        return (
          hasPermission(user, "UserTask", "READ") &&
          (user.role === "GF" ||
            user.role === "PLAN" ||
            event.assignedTo?.includes(user._id))
        );

      case CalendarEntityType.PROJECT_TASK:
        return (
          hasPermission(user, "ProjectTask", "READ") &&
          canAccessProject(user, event.entityId)
        );

      case CalendarEntityType.PROJECT:
        return hasPermission(user, "Project", "READ");

      case CalendarEntityType.OPPORTUNITY:
        return hasPermission(user, "Opportunity", "READ");

      default:
        return false;
    }
  });
}
```

### Usage Example

```typescript
// Backend: Generate calendar events
const calendarService = new CalendarService();
const events = await calendarService.getEvents({
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
  types: [CalendarEventType.USER_TASK, CalendarEventType.PROJECT_TASK],
  assignedTo: currentUser._id,
});

// Frontend: Display in calendar
<Calendar
  events={events}
  onEventClick={(event) => navigate(event.url)}
  view="month"
  colorField="color"
/>
```

### Related Entities

- **UserTask** (Section 14) - Source for user task events
- **ProjectTask** (Section 15) - Source for project task events
- **Project** (Future) - Source for project deadlines and milestones
- **Opportunity** (Future) - Source for opportunity close dates

---

## 18. CalendarSubscription Entity (NEW - Phase 1)

**Added:** 2025-01-28  
**Status:** Planned for Phase 1 (Q1 2025)  
**Purpose:** Manage secure calendar subscription feeds (WebCal) for real-time calendar sync

The CalendarSubscription entity represents a subscription feed that allows users to subscribe to their KOMPASS calendar in external calendar applications (Outlook, Google Calendar, Apple Calendar) using the WebCal (webcal://) protocol. Each subscription generates a unique, secure token that grants read-only access to the user's calendar events.

### CalendarSubscription Interface

```typescript
interface CalendarSubscription extends BaseEntity {
  _id: string; // Format: "calendar-subscription-{uuid}"
  type: "calendar-subscription"; // Fixed discriminator

  // Subscription Identity
  name: string; // Subscription name (e.g., "Personal Tasks", "Team Calendar")
  description?: string; // Optional description (max 500 chars)

  // Owner
  userId: string; // User ID who owns this subscription

  // Subscription Configuration
  scope: SubscriptionScope; // What events to include
  token: string; // Secure 256-bit random token (non-guessable)
  webcalUrl: string; // Full webcal:// URL for subscription
  httpsUrl: string; // Alternative https:// URL (for compatibility)

  // Filters
  eventTypes?: EventType[]; // Event types to include (empty = all)
  status?: TaskStatus[]; // Task statuses to include (empty = all)
  priority?: TaskPriority[]; // Priorities to include (empty = all)
  dateRangeType?: DateRangeType; // Date range for events

  // Security
  active: boolean; // Is subscription active? (default: true)
  expiresAt?: Date; // Optional expiry date (null = never expires)
  lastAccessedAt?: Date; // Last time subscription feed was accessed
  accessCount: number; // Number of times feed has been accessed

  // Rate Limiting
  maxRequestsPerHour: number; // Max requests per hour (default: 60)

  // Metadata
  userAgent?: string; // Last User-Agent that accessed the feed
  ipAddress?: string; // Last IP address that accessed the feed (hashed for privacy)
}

interface SubscriptionScope {
  type: "personal" | "team" | "custom"; // Subscription scope type

  // Personal scope (default)
  includeOwnTasks?: boolean; // Include own UserTasks (default: true)
  includeAssignedTasks?: boolean; // Include assigned ProjectTasks (default: true)
  includeProjects?: boolean; // Include project deadlines (default: false)
  includeOpportunities?: boolean; // Include opportunity close dates (default: false)

  // Team scope (GF/PLAN only)
  includeTeamTasks?: boolean; // Include all team UserTasks (default: false)
  includeTeamProjects?: boolean; // Include all team Projects (default: false)
  includeTeamOpportunities?: boolean; // Include all team Opportunities (default: false)

  // Custom scope
  customFilters?: {
    customerIds?: string[]; // Filter by specific customers
    projectIds?: string[]; // Filter by specific projects
    opportunityIds?: string[]; // Filter by specific opportunities
    assignedToUserIds?: string[]; // Filter by assigned users (GF/PLAN only)
  };
}

enum DateRangeType {
  PAST_7_DAYS = "past_7_days",
  PAST_30_DAYS = "past_30_days",
  NEXT_7_DAYS = "next_7_days",
  NEXT_30_DAYS = "next_30_days",
  NEXT_90_DAYS = "next_90_days",
  CURRENT_MONTH = "current_month",
  CURRENT_QUARTER = "current_quarter",
  CURRENT_YEAR = "current_year",
  ALL = "all", // All events (no date filter)
}
```

### ID Format

- **Subscription ID:** `calendar-subscription-{uuid}` (e.g., `calendar-subscription-a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
- **Token:** 256-bit random hex string (64 characters, URL-safe)

### Validation Rules

| Field                | Validation                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `name`               | Required, 2-100 chars                                                                      |
| `description`        | Optional, max 500 chars                                                                    |
| `userId`             | Required, must reference existing User                                                     |
| `scope.type`         | Required, valid enum value                                                                 |
| `token`              | Required, exactly 64 hex characters, unique across system                                  |
| `webcalUrl`          | Auto-generated, format: `webcal://{domain}/api/v1/calendar/subscriptions/{token}/feed.ics` |
| `httpsUrl`           | Auto-generated, format: `https://{domain}/api/v1/calendar/subscriptions/{token}/feed.ics`  |
| `active`             | Required, boolean                                                                          |
| `expiresAt`          | Optional, must be future date if set                                                       |
| `maxRequestsPerHour` | Required, 1-3600 (default: 60)                                                             |
| `dateRangeType`      | Optional, valid enum value (default: NEXT_90_DAYS)                                         |

### Business Rules

1. **Token Uniqueness:** Subscription token must be globally unique and non-guessable
2. **Token Generation:** Use cryptographically secure random generator (crypto.randomBytes)
3. **Maximum Subscriptions:** Max 5 active subscriptions per user
4. **Scope Authorization:** Team scope requires GF or PLAN role
5. **Rate Limiting:** Enforce maxRequestsPerHour on feed access
6. **Auto-Expiry:** Subscriptions with expiresAt in the past are automatically deactivated
7. **Access Tracking:** Update lastAccessedAt and accessCount on each feed access
8. **Revocation:** User can revoke (deactivate) subscription at any time
9. **Token Hashing:** Store token hash in database, not plain token (for security)
10. **Feed Cache:** Calendar feeds can be cached for 5 minutes (ETag/If-None-Match)

### Security Considerations

- **Secure Token Storage:** Store SHA-256 hash of token in database, compare hashes on access
- **Token Entropy:** 256 bits of entropy (64 hex chars) prevents brute-force attacks
- **No Authentication Required:** Subscription feeds are publicly accessible via token (read-only)
- **Rate Limiting:** Prevent abuse with per-token rate limiting
- **IP Hashing:** Store hashed IP addresses for abuse detection (not plain IP for privacy)
- **User-Agent Logging:** Log User-Agent to identify calendar clients
- **Token Revocation:** Instant revocation when subscription is deactivated

### Feed Generation Rules

1. **Date Range:** Apply dateRangeType filter to limit event count
2. **Event Filtering:** Apply eventTypes, status, priority filters
3. **RBAC Enforcement:** Only include events user has permission to view
4. **ICS Compliance:** Generate RFC 5545 compliant ICS file
5. **Update Frequency:** Clients poll every 5-15 minutes (recommended)
6. **Cache Headers:** Set ETag for client caching
7. **Content-Type:** `text/calendar; charset=utf-8`

### Examples

#### Personal Subscription (Own Tasks Only)

```typescript
const personalSubscription: CalendarSubscription = {
  _id: "calendar-subscription-1",
  type: "calendar-subscription",
  name: "My Tasks",
  description: "Personal task calendar for Outlook",
  userId: "user-adm-1",
  scope: {
    type: "personal",
    includeOwnTasks: true,
    includeAssignedTasks: true,
    includeProjects: false,
    includeOpportunities: false,
  },
  token: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
  webcalUrl:
    "webcal://api.kompass.de/api/v1/calendar/subscriptions/a1b2...56/feed.ics",
  httpsUrl:
    "https://api.kompass.de/api/v1/calendar/subscriptions/a1b2...56/feed.ics",
  eventTypes: ["USER_TASK", "PROJECT_TASK"],
  status: ["TODO", "IN_PROGRESS"],
  dateRangeType: "NEXT_90_DAYS",
  active: true,
  accessCount: 0,
  maxRequestsPerHour: 60,
  createdBy: "user-adm-1",
  createdAt: new Date("2025-02-01"),
  modifiedBy: "user-adm-1",
  modifiedAt: new Date("2025-02-01"),
  version: 1,
};
```

#### Team Calendar Subscription (GF only)

```typescript
const teamSubscription: CalendarSubscription = {
  _id: "calendar-subscription-2",
  type: "calendar-subscription",
  name: "Team Overview",
  description: "All team tasks and projects",
  userId: "user-gf-1",
  scope: {
    type: "team",
    includeTeamTasks: true,
    includeTeamProjects: true,
    includeTeamOpportunities: false,
  },
  token: "f1e2d3c4b5a6987654321fedcba9876543210fedcba9876543210fedcba98765",
  webcalUrl:
    "webcal://api.kompass.de/api/v1/calendar/subscriptions/f1e2...65/feed.ics",
  httpsUrl:
    "https://api.kompass.de/api/v1/calendar/subscriptions/f1e2...65/feed.ics",
  eventTypes: ["USER_TASK", "PROJECT_TASK", "PROJECT_DEADLINE"],
  dateRangeType: "NEXT_30_DAYS",
  active: true,
  expiresAt: new Date("2025-12-31"), // Expires end of year
  accessCount: 0,
  maxRequestsPerHour: 120, // Higher limit for team calendar
  createdBy: "user-gf-1",
  createdAt: new Date("2025-02-01"),
  modifiedBy: "user-gf-1",
  modifiedAt: new Date("2025-02-01"),
  version: 1,
};
```

### API Endpoints

- `POST /api/v1/calendar/subscriptions` - Create new subscription
- `GET /api/v1/calendar/subscriptions` - List user's subscriptions
- `GET /api/v1/calendar/subscriptions/:id` - Get subscription details
- `PUT /api/v1/calendar/subscriptions/:id` - Update subscription
- `DELETE /api/v1/calendar/subscriptions/:id` - Delete subscription
- `POST /api/v1/calendar/subscriptions/:id/regenerate-token` - Regenerate token (revoke old)
- `GET /api/v1/calendar/subscriptions/{token}/feed.ics` - Get ICS feed (public, no auth)

---

**End of DATA_MODEL_SPECIFICATION.md**

---

## 18. Tour Entity (NEW - Phase 2)

**Added:** 2025-01-28  
**Status:** Planned for Phase 2 (Q3 2025)  
**Purpose:** Group customer visits into business trips for expense tracking and route planning

The Tour entity represents a business trip that groups multiple customer meetings/visits. Used primarily by ADM (Außendienst) for tour planning, route optimization, and expense management.

### Tour Interface

```typescript
interface Tour extends BaseEntity {
  _id: string; // Format: "tour-{uuid}"
  type: "tour"; // Fixed discriminator

  // Tour Identity
  title: string; // Tour name (2-200 chars)
  purpose?: string; // Purpose/description
  region?: string; // Region covered (e.g., "Bayern Süd")

  // Schedule
  startDate: Date; // Tour start date/time
  endDate: Date; // Tour end date/time (must be >= startDate)
  status: TourStatus; // 'planned' | 'active' | 'completed' | 'cancelled'

  // Ownership
  ownerId: string; // User ID (typically ADM)

  // Route Planning
  plannedRoute?: RouteWaypoint[]; // Planned route waypoints
  estimatedDistance?: number; // Estimated km
  actualDistance?: number; // Actual km driven

  // Cost Management
  estimatedCosts?: number; // Estimated EUR
  actualCosts?: number; // Actual EUR (sum of expenses + mileage)
  mileageCost?: number; // Mileage cost (distance × €0.30)

  // Related Entities
  meetingIds: string[]; // Associated meetings
  hotelStayIds: string[]; // Overnight stays
  expenseIds: string[]; // All expenses
  mileageLogIds: string[]; // Mileage logs

  // Completion
  completedAt?: Date; // When tour completed
  completionNotes?: string; // Notes about completion
  searchableText?: string; // Full-text search
}
```

### Tour Status Enum

```typescript
enum TourStatus {
  PLANNED = "planned", // Tour is scheduled
  ACTIVE = "active", // Tour is in progress
  COMPLETED = "completed", // Tour finished
  CANCELLED = "cancelled", // Tour cancelled
}
```

### Tour Validation Rules

| Field               | Validation                             |
| ------------------- | -------------------------------------- |
| `title`             | Required, 2-200 chars                  |
| `startDate`         | Required, cannot be > 365 days in past |
| `endDate`           | Required, must be >= startDate         |
| `status`            | Required, valid enum value             |
| `ownerId`           | Required, must reference existing User |
| `estimatedDistance` | Optional, >= 0 if provided             |
| `actualDistance`    | Optional, >= 0 if provided             |
| `estimatedCosts`    | Optional, >= 0 if provided             |
| `actualCosts`       | Optional, >= 0 if provided             |

### Tour Business Rules

**TR-001: Tour Completion Requirements**

- Tour can only be completed if all meetings are attended or cancelled

**TR-002: Distance Validation**

- actualDistance should match sum of mileage logs ±5%

**TR-003: Cost Calculation**

- actualCosts should equal: Σ(expenses) + mileageCost

**TR-004: Access Control**

- Only tour owner (ADM) or GF can modify tour

**TR-005: Status Transitions**

```typescript
// Valid status transitions
PLANNED → ACTIVE | CANCELLED
ACTIVE → COMPLETED | CANCELLED
COMPLETED → (terminal state)
CANCELLED → (terminal state)
```

### Tour Use Cases

1. **Weekly Tour Planning**: ADM plans week's customer visits
2. **Route Optimization**: System suggests optimal route based on GPS
3. **Expense Tracking**: All tour expenses linked to tour
4. **Monthly Reporting**: Generate expense reports by tour
5. **ROI Analysis**: Compare tour costs vs. opportunities closed (future)

---

## 18. Meeting Entity (NEW - Phase 2)

**Added:** 2025-01-28  
**Status:** Planned for Phase 2 (Q3 2025)  
**Purpose:** Schedule and track customer visits with auto-tour linkage

The Meeting/Appointment entity represents a scheduled customer visit. Meetings can be auto-linked to tours based on date and geographic proximity.

### Meeting Interface

```typescript
interface Meeting extends BaseEntity {
  _id: string; // Format: "meeting-{uuid}"
  type: "meeting"; // Fixed discriminator

  // Meeting Identity
  title: string; // Meeting subject (2-200 chars)
  description?: string; // Meeting description

  // Schedule
  scheduledAt: Date; // Scheduled date/time
  duration: number; // Duration in minutes (15-480)
  meetingType: MeetingType; // 'first_visit' | 'follow_up' | 'presentation' | etc.

  // Location & Participants
  customerId: string; // Customer ID (REQUIRED)
  locationId: string; // Location ID (REQUIRED)
  attendees?: string[]; // Contact IDs attending

  // Tour Association
  tourId?: string; // Tour ID (auto-suggested or manual)

  // Project/Opportunity Linkage
  opportunityId?: string; // Related opportunity
  projectId?: string; // Related project

  // Meeting Execution
  attended?: boolean; // Whether meeting happened
  actualStartTime?: Date; // Check-in time
  actualEndTime?: Date; // Check-out time
  checkInGPS?: GPSCoordinates; // GPS at check-in

  // Outcome
  outcome?: MeetingOutcome; // 'successful' | 'needs_follow_up' | etc.
  notes?: string; // Meeting notes (markdown)
  actionItems?: string[]; // Action items from meeting
  nextSteps?: string; // Next steps agreed
  followUpDate?: Date; // Follow-up date if needed

  // Preparation
  agenda?: string[]; // Agenda items
  preparationNotes?: string; // Preparation notes

  // Reminders
  reminderSent?: boolean; // Reminder sent flag
  reminderSentAt?: Date; // When reminder sent
}
```

### Meeting Type Enum

```typescript
enum MeetingType {
  FIRST_VISIT = "first_visit",
  FOLLOW_UP = "follow_up",
  PRESENTATION = "presentation",
  NEGOTIATION = "negotiation",
  CLOSING = "closing",
  PROJECT_REVIEW = "project_review",
  OTHER = "other",
}
```

### Meeting Outcome Enum

```typescript
enum MeetingOutcome {
  SUCCESSFUL = "successful",
  NEEDS_FOLLOW_UP = "needs_follow_up",
  DELAYED = "delayed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}
```

### Meeting Validation Rules

| Field         | Validation                                        |
| ------------- | ------------------------------------------------- |
| `title`       | Required, 2-200 chars                             |
| `scheduledAt` | Required, not > 7 days in past (for new meetings) |
| `duration`    | Required, 15-480 minutes                          |
| `meetingType` | Required, valid enum value                        |
| `customerId`  | Required, must reference existing Customer        |
| `locationId`  | Required, must reference existing Location        |
| `attended`    | Cannot be true if scheduledAt is future           |
| `outcome`     | Required if attended = true                       |

### Meeting Business Rules

**MT-001: Auto-Tour Suggestion**

- When creating meeting, suggest existing tours (same day ±1, region <50km)
- If no tour matches, offer to create new tour

**MT-002: Attendance Validation**

- Meeting can only be marked attended if scheduledAt is in past

**MT-003: GPS Check-In Validation**

- Check-in requires GPS within 500m of location (using Haversine formula)

**MT-004: Outcome Requirement**

- Meeting outcome must be provided within 24h of meeting

**MT-005: Follow-Up Tracking**

- If outcome = 'needs_follow_up', followUpDate should be set

### Meeting Use Cases

1. **Schedule Customer Visit**: ADM schedules visit with auto-tour suggestion
2. **GPS Check-In**: ADM arrives at location, GPS validates proximity, check-in
3. **Quick Notes**: ADM logs meeting outcome and action items
4. **Follow-Up Tracking**: System reminds ADM of follow-up meetings

---

## 19. HotelStay Entity (NEW - Phase 2)

**Added:** 2025-01-28  
**Status:** Planned for Phase 2 (Q3 2025)  
**Purpose:** Track overnight accommodations during business tours

The HotelStay entity represents overnight accommodation during business trips. Tracks hotel preferences and costs for expense reporting.

### HotelStay Interface

```typescript
interface HotelStay extends BaseEntity {
  _id: string; // Format: "hotel-stay-{uuid}"
  type: "hotel_stay"; // Fixed discriminator

  // Tour Association
  tourId: string; // Tour ID (REQUIRED)
  userId: string; // Traveler ID (REQUIRED)

  // Hotel Information
  hotelName: string; // Hotel name (2-200 chars)
  locationId: string; // Location ID (hotel address)
  hotelChain?: string; // Hotel brand (e.g., "Marriott")
  website?: string; // Hotel website
  phone?: string; // Hotel phone

  // Stay Details
  checkIn: Date; // Check-in date
  checkOut: Date; // Check-out date (must be > checkIn)
  nights?: number; // Number of nights (calculated)
  roomType?: string; // Room type (e.g., "Single")

  // Costs
  pricePerNight: number; // EUR per night
  totalCost: number; // Total EUR (nights × pricePerNight)
  bookingReference?: string; // Booking confirmation
  expenseId?: string; // Linked expense ID

  // Experience Tracking
  rating?: number; // 1-5 stars
  notes?: string; // Review notes
  wouldStayAgain?: boolean; // Preference flag
  amenities?: string[]; // ["WiFi", "Breakfast", "Parking"]

  // Booking Details
  bookedVia?: string; // "Booking.com" | "Direct" | "Phone"
  bookedAt?: Date; // Booking date
  cancellationPolicy?: string; // Cancellation policy notes
}
```

### HotelStay Validation Rules

| Field           | Validation                                 |
| --------------- | ------------------------------------------ |
| `tourId`        | Required, must reference existing Tour     |
| `userId`        | Required, must reference existing User     |
| `hotelName`     | Required, 2-200 chars                      |
| `locationId`    | Required, must reference existing Location |
| `checkIn`       | Required, not > 365 days in past           |
| `checkOut`      | Required, must be > checkIn                |
| `pricePerNight` | Required, >= 0                             |
| `totalCost`     | Required, >= 0                             |
| `rating`        | Optional, 1-5 if provided                  |

### HotelStay Business Rules

**HS-001: Date Validation**

- Check-out must be after check-in

**HS-002: Cost Calculation**

- totalCost must equal: nights × pricePerNight (tolerance ±€0.01)

**HS-003: Past Hotels List**

- Hotels are automatically added to user's "past hotels" preference list

**HS-004: Access Control**

- Only tour owner or GF can modify hotel stays

**HS-005: Nights Calculation**

```typescript
nights = ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
```

### HotelStay Use Cases

1. **Find Past Hotels**: ADM browses past hotels in region
2. **Add New Hotel**: ADM finds hotel via map, adds to tour
3. **Track Preferences**: System suggests preferred hotels based on ratings
4. **Expense Reporting**: Hotel stay auto-creates expense entry

---

## 20. Expense Entity (NEW - Phase 2)

**Added:** 2025-01-28  
**Status:** Planned for Phase 2 (Q3 2025)  
**Purpose:** Track business expenses with OCR receipt scanning and approval workflow

The Expense entity represents all business expenses including receipts, mileage, meals, etc. Supports OCR receipt processing and GF approval workflow.

### Expense Interface

```typescript
interface Expense extends BaseEntity {
  _id: string; // Format: "expense-{uuid}"
  type: "expense"; // Fixed discriminator

  // Expense Identity
  title: string; // Description (2-200 chars)
  description?: string; // Detailed description

  // Category & Date
  expenseDate: Date; // Expense date (not > 90 days past)
  category: ExpenseCategory; // 'mileage' | 'hotel' | 'meal' | etc.

  // Amount & Currency
  amount: number; // Amount in EUR (> 0, max 10,000)
  currency: string; // Currency code (default 'EUR')
  vatAmount?: number; // VAT amount
  vatRate?: number; // VAT rate percentage

  // Receipt
  receiptImageUrl?: string; // MinIO storage URL (required if amount > €25)
  vendor?: string; // Vendor name (from OCR)
  invoiceNumber?: string; // Invoice number (from OCR)
  ocrConfidence?: number; // OCR confidence (0-1)
  ocrVerified?: boolean; // Manual verification flag

  // Ownership & Associations
  userId: string; // User who incurred expense
  tourId?: string; // Tour ID (required if not meeting/project)
  meetingId?: string; // Meeting ID
  projectId?: string; // Project ID
  customerId?: string; // Customer ID

  // Category-Specific Data
  distance?: number; // Mileage: km driven
  mileageRate?: number; // Mileage: rate/km (€0.30 default)
  numberOfPeople?: number; // Meal: number of people
  numberOfNights?: number; // Hotel: nights

  // Approval Workflow
  status: ExpenseStatus; // 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid'
  submittedAt?: Date; // Submission timestamp
  approvedBy?: string; // Approver user ID (GF)
  approvedAt?: Date; // Approval timestamp
  rejectedAt?: Date; // Rejection timestamp
  rejectionReason?: string; // Rejection reason (required if rejected)
  paidAt?: Date; // Payment timestamp
  paymentReference?: string; // Payment reference number

  // Notes
  notes?: string; // Internal notes
  adminNotes?: string; // Admin notes (GF/BUCH only)
}
```

### Expense Category Enum

```typescript
enum ExpenseCategory {
  MILEAGE = "mileage",
  HOTEL = "hotel",
  MEAL = "meal",
  FUEL = "fuel",
  PARKING = "parking",
  TOLL = "toll",
  PUBLIC_TRANSPORT = "public_transport",
  CLIENT_ENTERTAINMENT = "client_entertainment",
  OFFICE_SUPPLIES = "office_supplies",
  PHONE = "phone",
  OTHER = "other",
}
```

### Expense Status Enum

```typescript
enum ExpenseStatus {
  DRAFT = "draft", // Being edited
  SUBMITTED = "submitted", // Submitted for approval
  APPROVED = "approved", // Approved by GF
  REJECTED = "rejected", // Rejected (can resubmit)
  PAID = "paid", // Reimbursed
}
```

### Expense Validation Rules

| Field                        | Validation                             |
| ---------------------------- | -------------------------------------- |
| `title`                      | Required, 2-200 chars                  |
| `expenseDate`                | Required, not > 90 days in past        |
| `category`                   | Required, valid enum value             |
| `amount`                     | Required, > 0, max €10,000             |
| `userId`                     | Required, must reference existing User |
| `status`                     | Required, valid enum value             |
| `receiptImageUrl`            | Required if amount > €25               |
| `tourId/meetingId/projectId` | At least one must be set               |
| `rejectionReason`            | Required if status = 'rejected'        |

### Expense Business Rules

**EX-001: Receipt Requirement**

- Receipt image required for expenses > €25

**EX-002: GF Approval**

- Expenses > €100 require GF approval

**EX-003: Resubmission**

- Rejected expenses can be resubmitted after corrections

**EX-004: Category-Specific Validation**

- Mileage: distance and mileageRate required, amount = distance × rate
- Hotel: numberOfNights should match hotel stay if linked
- Meal: numberOfPeople should be provided for team meals

**EX-005: Linkage Requirement**

- Expense must be linked to tour OR meeting OR project

**EX-006: Status Transitions**

```typescript
// Valid status transitions
DRAFT → SUBMITTED
SUBMITTED → APPROVED | REJECTED | DRAFT
APPROVED → PAID
REJECTED → DRAFT (resubmit)
PAID → (terminal state)
```

**EX-007: Mileage Calculation**

```typescript
// For mileage expenses
amount = distance × mileageRate (€0.30/km Germany standard)
// Tolerance: ±€0.01
```

### Expense Use Cases

1. **Capture Receipt**: ADM photographs receipt, OCR extracts amount/vendor
2. **Manual Expense**: ADM manually enters expense without receipt (< €25)
3. **Mileage Expense**: System auto-creates from mileage log
4. **Submit for Approval**: ADM submits expenses, GF reviews and approves
5. **Monthly Report**: ADM generates PDF report of expenses for accounting

---

## 21. MileageLog Entity (NEW - Phase 2)

**Added:** 2025-01-28  
**Status:** Planned for Phase 2 (Q3 2025)  
**Purpose:** GPS-tracked mileage for accurate expense calculation and tax reporting

The MileageLog entity tracks GPS-recorded journeys for tour expense calculation. Provides accurate distance tracking with route audit trail for tax reporting compliance.

### MileageLog Interface

```typescript
interface MileageLog extends BaseEntity {
  _id: string; // Format: "mileage-log-{uuid}"
  type: "mileage_log"; // Fixed discriminator

  // Tour Association
  tourId: string; // Tour ID (REQUIRED)
  userId: string; // Driver ID (REQUIRED)

  // Journey Details
  startLocation: LocationSnapshot; // Start point with GPS
  endLocation: LocationSnapshot; // End point with GPS
  startTime: Date; // Journey start time
  endTime: Date; // Journey end time (must be > startTime)
  duration?: number; // Duration in minutes (calculated)

  // Distance & Route
  distance: number; // Distance in km
  routeGeoJSON?: string; // GPS route as GeoJSON LineString
  routeWaypoints?: GPSCoordinates[]; // Simplified waypoints
  gpsDistance?: number; // GPS-calculated distance (for validation)
  manualOverride?: boolean; // Whether distance manually adjusted
  overrideReason?: string; // Reason for override (required if manual)

  // Cost Calculation
  ratePerKm: number; // Rate per km (€0.30 default)
  calculatedCost: number; // Cost in EUR (distance × rate)
  currency: string; // Currency (default 'EUR')

  // Vehicle Information
  vehicle?: VehicleInfo; // Vehicle details
  odometerStart?: number; // Odometer start reading
  odometerEnd?: number; // Odometer end reading (must be > start)

  // Purpose
  purpose?: string; // Journey purpose
  passengers?: string[]; // Passenger names

  // Linked Entities
  meetingIds?: string[]; // Meetings visited
  customerIds?: string[]; // Customers visited
  expenseId?: string; // Linked expense ID

  // Tracking Metadata
  gpsTracking: boolean; // Whether GPS tracking used
  gpsPointCount?: number; // Number of GPS points recorded
  trackingAccuracy?: number; // Tracking accuracy (meters)
  notes?: string; // Notes
}

interface LocationSnapshot {
  address: string;
  gps: GPSCoordinates;
  timestamp: Date;
  customerId?: string;
  locationId?: string;
}

interface VehicleInfo {
  type: string; // "Car" | "Van"
  make?: string;
  model?: string;
  licensePlate?: string;
  fuelType?: string; // "Diesel" | "Petrol" | "Electric"
}
```

### MileageLog Validation Rules

| Field            | Validation                             |
| ---------------- | -------------------------------------- |
| `tourId`         | Required, must reference existing Tour |
| `userId`         | Required, must reference existing User |
| `startLocation`  | Required with GPS coordinates          |
| `endLocation`    | Required with GPS coordinates          |
| `startTime`      | Required                               |
| `endTime`        | Required, must be > startTime          |
| `distance`       | Required, >= 0, warning if > 2000km    |
| `ratePerKm`      | Required, >= 0, warning if > €1.00     |
| `overrideReason` | Required if manualOverride = true      |
| `odometerEnd`    | Must be > odometerStart if provided    |

### MileageLog Business Rules

**ML-001: GPS Distance Validation**

- distance should match gpsDistance ±5%
- If outside tolerance, require manual override with reason

**ML-002: Cost Calculation**

- calculatedCost = distance × ratePerKm (€0.30/km standard)
- Tolerance: ±€0.01

**ML-003: Manual Override**

- Manual distance adjustment requires reason
- Original GPS distance preserved in gpsDistance field

**ML-004: Route Audit Trail**

- Route stored as GeoJSON for audit/tax purposes
- GPS tracking metadata (point count, accuracy) recorded

**ML-005: Odometer Validation**

```typescript
// If odometer readings provided
if (odometerEnd && odometerStart) {
  odometerDistance = odometerEnd - odometerStart;
  // Should match distance ±5%
}
```

**ML-006: Duration Calculation**

```typescript
duration = (endTime - startTime) / (1000 * 60); // minutes
```

**ML-007: GPS Distance Calculation**

```typescript
// Haversine formula for direct distance
function calculateGPSDistance(
  from: GPSCoordinates,
  to: GPSCoordinates,
): number {
  const R = 6371; // Earth radius in km
  const φ1 = (from.latitude * Math.PI) / 180;
  const φ2 = (to.latitude * Math.PI) / 180;
  const Δφ = ((to.latitude - from.latitude) * Math.PI) / 180;
  const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // km
}
```

### MileageLog Use Cases

1. **Auto Tracking**: GPS tracks journey, auto-creates log at tour end
2. **Manual Entry**: ADM manually enters mileage for privacy/offline
3. **Expense Auto-Create**: System auto-creates expense from mileage log
4. **Validation**: Compare GPS distance vs. odometer vs. claimed distance
5. **Tax Export**: Export mileage logs with route proof for tax audit

---

## Tour Planning Feature Summary

### Entity Relationships

```
Tour (1:n)
  ├─> Meeting (n) - Customer visits
  ├─> HotelStay (n) - Overnight accommodations
  ├─> Expense (n) - All expenses
  └─> MileageLog (n) - GPS journeys

Meeting (n:1)
  ├─> Customer (1)
  ├─> Location (1)
  └─> Tour (0-1) - Optional tour linkage

HotelStay (n:1)
  ├─> Tour (1)
  └─> Location (1) - Hotel address

Expense (n:1)
  ├─> User (1)
  ├─> Tour (0-1)
  ├─> Meeting (0-1)
  └─> Project (0-1)

MileageLog (n:1)
  ├─> Tour (1)
  └─> Meeting (n) - Stops along route
```

### RBAC Permissions

| Role | Tour            | Meeting         | Expense             | HotelStay       | MileageLog      |
| ---- | --------------- | --------------- | ------------------- | --------------- | --------------- |
| ADM  | Full CRUD (own) | Full CRUD (own) | CREATE/READ (own)   | Full CRUD (own) | Full CRUD (own) |
| PLAN | READ            | READ            | READ (all)          | READ (all)      | READ (all)      |
| GF   | Full CRUD (all) | Full CRUD (all) | Full CRUD + APPROVE | Full CRUD (all) | Full CRUD (all) |
| BUCH | READ (all)      | READ (all)      | READ (all)          | READ (all)      | READ (all)      |

### Offline-First Considerations

1. **Meeting Check-In**: Works offline, syncs GPS data when online
2. **Expense Photos**: Stored locally, uploaded on sync
3. **GPS Tracking**: Buffered offline, synced when connected
4. **Route Data**: Stored as GeoJSON, compressed for storage efficiency
5. **Conflict Resolution**: Last-write-wins for drafts, manual review for submitted expenses

### Security & Compliance

1. **Receipt Storage**: MinIO with encryption at rest
2. **GPS Privacy**: User can pause tracking, data DSGVO-compliant
3. **Expense Approval**: Audit trail for GF approval (GoBD)
4. **Access Control**: ADM can only access own tours/expenses
5. **DSGVO**: GPS tracking requires user consent

---

## 22. TimeEntry Entity (NEW - Phase 1 MVP)

**Added:** 2025-01-28  
**Status:** Implemented  
**Purpose:** Time tracking for project work with timer and manual entry support

The TimeEntry entity represents time worked by team members on projects, supporting both real-time timer tracking and manual entry. It includes approval workflows and labor cost calculations for project cost management.

### TimeEntry Interface

```typescript
interface TimeEntry extends BaseEntity {
  _id: string; // Format: "time-entry-{uuid}"
  type: "time_entry"; // Fixed discriminator

  // Project & Task references
  projectId: string; // Parent project (REQUIRED)
  taskId?: string; // Optional task within project
  taskDescription: string; // What was done (REQUIRED, 10-500 chars)

  // Time tracking
  userId: string; // Team member who worked (REQUIRED)
  startTime: Date; // When work started (ISO 8601)
  endTime?: Date; // When work ended (null = timer in progress)
  durationMinutes: number; // Calculated: (endTime - startTime) in minutes

  // Status
  status: TimeEntryStatus; // Current status of time entry
  isManualEntry: boolean; // true = manual entry, false = timer-based

  // Cost calculation
  hourlyRateEur?: number; // Rate at time of entry (cached from user profile)
  totalCostEur?: number; // Calculated: (durationMinutes / 60) × hourlyRateEur

  // Approval workflow
  approvedBy?: string; // User ID who approved
  approvedAt?: Date; // When approved
  rejectionReason?: string; // If rejected, why

  // Offline sync
  syncedToTimeCard?: boolean; // For future TimeCard integration
  timeCardEntryId?: string; // TimeCard reference if synced
}

enum TimeEntryStatus {
  IN_PROGRESS = "in_progress", // Timer running or manual entry not completed
  COMPLETED = "completed", // Timer stopped, ready for approval
  APPROVED = "approved", // Approved by manager (included in cost calculations)
  REJECTED = "rejected", // Rejected by manager
}
```

### TimeEntry Supporting Interfaces

```typescript
// Labor Cost Summary - Aggregated labor costs for a project
interface LaborCostSummary {
  projectId: string;
  totalHours: number; // Sum of approved time entries in hours
  totalCostEur: number; // Sum of all labor costs
  byUser: UserLaborCost[]; // Breakdown by team member
  byMonth: MonthlyLaborCost[]; // Breakdown by month
}

// User Labor Cost - Breakdown for a specific user
interface UserLaborCost {
  userId: string;
  userName: string;
  totalHours: number;
  averageHourlyRateEur: number;
  totalCostEur: number;
  entryCount: number;
}

// Monthly Labor Cost - Breakdown by month
interface MonthlyLaborCost {
  year: number;
  month: number; // 1-12
  totalHours: number;
  totalCostEur: number;
  entryCount: number;
}
```

### TimeEntry DTOs

```typescript
// Create Time Entry DTO
interface CreateTimeEntryDto {
  projectId: string;
  taskId?: string;
  taskDescription: string;
  startTime: Date;
  endTime?: Date; // Optional for starting timer
  isManualEntry: boolean;
  hourlyRateEur?: number; // Optional, defaults to user's current rate
}

// Update Time Entry DTO
interface UpdateTimeEntryDto {
  taskDescription?: string;
  startTime?: Date;
  endTime?: Date;
  isManualEntry?: boolean;
  hourlyRateEur?: number;
}

// Time Entry Response DTO
interface TimeEntryResponseDto extends TimeEntry {
  projectName: string; // Populated from project
  userName: string; // Populated from user
  approvedByName?: string; // Populated from approver user
}
```

### TimeEntry Validation Rules

| Field             | Validation Rules                                                 |
| ----------------- | ---------------------------------------------------------------- |
| `projectId`       | Required, must reference existing Project                        |
| `userId`          | Required, must reference existing User with role PLAN/INNEN/KALK |
| `taskDescription` | Required, 10-500 chars                                           |
| `startTime`       | Required, cannot be in future                                    |
| `endTime`         | Optional (null if timer running), must be > startTime if set     |
| `durationMinutes` | Calculated automatically, must be >= 1 minute                    |
| `hourlyRateEur`   | Optional, >= 0, <= 500 (sanity check)                            |
| `totalCostEur`    | Calculated automatically                                         |
| `status`          | Required, must be valid TimeEntryStatus enum value               |
| `isManualEntry`   | Required boolean                                                 |
| `rejectionReason` | Required if status = REJECTED, 10-500 chars                      |

### TimeEntry Business Rules

**TE-001: Timer Start**

- Only one active timer per user at a time
- Timer starts with status = IN_PROGRESS
- endTime = null when timer is running

**TE-002: Timer Stop**

- Calculates durationMinutes = (endTime - startTime) / 60000
- Updates status to COMPLETED
- Auto-fetches user's current hourlyRateEur and caches it
- Calculates totalCostEur = (durationMinutes / 60) × hourlyRateEur

**TE-003: Manual Entry**

- Both startTime and endTime must be provided
- Status starts as COMPLETED (ready for approval)
- User can optionally override hourlyRateEur

**TE-004: Approval Workflow**

```typescript
// Valid status transitions
const VALID_TRANSITIONS = {
  IN_PROGRESS: ["COMPLETED"], // Timer stopped
  COMPLETED: ["APPROVED", "REJECTED"], // Manager review
  APPROVED: [], // Terminal state
  REJECTED: ["COMPLETED"], // Re-submit after rejection
};
```

**TE-005: Cost Calculation**

```typescript
// Automatic calculation on timer stop or manual entry
durationMinutes = (endTime - startTime) / (1000 * 60);
totalCostEur = (durationMinutes / 60) * hourlyRateEur;
// Round to 2 decimal places
totalCostEur = Math.round(totalCostEur * 100) / 100;
```

**TE-006: Hourly Rate Caching**

- Hourly rate is cached from user profile at time of entry creation/completion
- Prevents retroactive rate changes from affecting existing time entries
- If user has no hourly rate, system uses default rate (e.g., €50/hour)

**TE-007: Deletion Rules**

- Only entries with status IN_PROGRESS or COMPLETED can be deleted
- APPROVED entries cannot be deleted (GoBD compliance)
- REJECTED entries can be deleted by original user

**TE-008: Edit Rules**

- IN_PROGRESS entries: Can edit taskDescription, hourlyRateEur
- COMPLETED entries: Can edit taskDescription, startTime, endTime
- APPROVED/REJECTED entries: Read-only, no edits allowed

**TE-009: Bulk Approval**

- GF and project managers (PLAN) can approve multiple entries at once
- All entries must belong to same project
- Cannot mix entries from different users or projects

**TE-010: Labor Cost Summary**

- Only APPROVED time entries are included in cost calculations
- Summary updates in real-time when entries are approved
- Cached summaries refresh on approval/rejection events

### TimeEntry Use Cases

1. **Start Timer**: PLAN user clicks "Zeit erfassen" on project, timer starts
2. **Stop Timer**: User clicks "Stoppen", entry marked COMPLETED, costs calculated
3. **Manual Entry**: User enters start/end times for work done yesterday
4. **Approve Entries**: Project manager bulk-approves team's weekly time entries
5. **Reject Entry**: Manager rejects entry with reason "Task not part of project scope"
6. **Labor Cost Report**: GF views total labor costs per project, broken down by user
7. **Monthly Summary**: System generates monthly labor cost summary for all projects

### RBAC Permissions

| Role  | TimeEntry Permissions                                                               |
| ----- | ----------------------------------------------------------------------------------- |
| PLAN  | Full CRUD (own entries), APPROVE (project team entries), READ (all project entries) |
| INNEN | CREATE/READ/UPDATE (own entries), no approval rights                                |
| GF    | Full CRUD (all entries), APPROVE (all entries)                                      |
| KALK  | READ-only (all project entries for cost estimation)                                 |
| ADM   | No access (sales role, not involved in project execution)                           |
| BUCH  | READ-only (all entries for payroll/accounting)                                      |

### Offline-First Considerations

1. **Timer Tracking**: Works offline, syncs when online
2. **Manual Entry**: Created offline, queued for sync
3. **Approval**: Requires online connection (manager action)
4. **Conflict Resolution**: Last-write-wins for edits, manual review for deletions
5. **Cost Calculations**: Performed client-side, validated server-side

### Security & Compliance

1. **Hourly Rate Privacy**: Only GF/BUCH can see other users' hourly rates
2. **Audit Trail**: All status changes logged with user and timestamp
3. **GoBD Compliance**: APPROVED entries are immutable
4. **Access Control**: Users can only edit their own time entries
5. **Manager Approval**: Requires PLAN/GF role permission

---

## 23. ProjectCost Entity (NEW - Phase 1 MVP)

**Added:** 2025-01-28  
**Status:** Implemented  
**Purpose:** Non-labor project costs tracking (materials, contractors, services)

The ProjectCost entity represents all non-labor costs associated with projects, including materials, contractor fees, external services, and equipment rental. It includes invoice tracking, payment status, and approval workflows.

### ProjectCost Interface

```typescript
interface ProjectCost extends BaseEntity {
  _id: string; // Format: "project-cost-{uuid}"
  type: "project_cost"; // Fixed discriminator

  // Project reference
  projectId: string; // Parent project (REQUIRED)

  // Cost details
  costType: ProjectCostType; // Type of cost
  description: string; // What was purchased/hired (REQUIRED, 10-500 chars)
  supplierName?: string; // Supplier/contractor name

  // Financial
  quantity: number; // Amount/hours (default: 1)
  unitPriceEur: number; // Price per unit
  totalCostEur: number; // Calculated: quantity × unitPriceEur
  taxRate: number; // VAT rate (default: 19% = 0.19)
  taxAmountEur: number; // Calculated tax
  totalWithTaxEur: number; // Total including tax

  // Documentation
  invoiceNumber?: string; // Supplier invoice reference
  invoiceDate?: Date; // Date of invoice
  invoicePdfUrl?: string; // Uploaded invoice PDF (MinIO URL)
  orderNumber?: string; // Purchase order reference

  // Status
  status: ProjectCostStatus; // Current status
  paidAt?: Date; // When payment was made

  // Approval
  approvedBy?: string; // User ID who approved expense
  approvedAt?: Date; // When approved
}

enum ProjectCostType {
  MATERIAL = "material", // Construction materials, supplies
  CONTRACTOR = "contractor", // External contractor labor
  EXTERNAL_SERVICE = "external_service", // Consulting, specialized services
  EQUIPMENT = "equipment", // Equipment rental or purchase
  OTHER = "other", // Miscellaneous costs
}

enum ProjectCostStatus {
  PLANNED = "planned", // Planned but not yet ordered
  ORDERED = "ordered", // Purchase order issued
  RECEIVED = "received", // Goods/services received
  INVOICED = "invoiced", // Invoice received
  PAID = "paid", // Payment completed
}
```

### ProjectCost Supporting Interfaces

```typescript
// Material Cost Summary - Aggregated costs for a project
interface MaterialCostSummary {
  projectId: string;
  totalCostEur: number; // Sum of all costs (excluding tax)
  totalWithTaxEur: number; // Sum including tax
  byCostType: CostTypeSummary[]; // Breakdown by cost type
  byStatus: CostStatusSummary[]; // Breakdown by payment status
  pendingPaymentEur: number; // Costs not yet paid (INVOICED status)
}

// Cost Type Summary - Breakdown by type
interface CostTypeSummary {
  costType: ProjectCostType;
  totalCostEur: number;
  totalWithTaxEur: number;
  itemCount: number;
}

// Cost Status Summary - Breakdown by status
interface CostStatusSummary {
  status: ProjectCostStatus;
  totalCostEur: number;
  totalWithTaxEur: number;
  itemCount: number;
}
```

### ProjectCost DTOs

```typescript
// Create Project Cost DTO
interface CreateProjectCostDto {
  projectId: string;
  costType: ProjectCostType;
  description: string;
  supplierName?: string;
  quantity: number;
  unitPriceEur: number;
  taxRate?: number; // Optional, defaults to 19%
  invoiceNumber?: string;
  invoiceDate?: Date;
  orderNumber?: string;
  status: ProjectCostStatus;
}

// Update Project Cost DTO
interface UpdateProjectCostDto {
  costType?: ProjectCostType;
  description?: string;
  supplierName?: string;
  quantity?: number;
  unitPriceEur?: number;
  taxRate?: number;
  invoiceNumber?: string;
  invoiceDate?: Date;
  invoicePdfUrl?: string;
  orderNumber?: string;
  status?: ProjectCostStatus;
}

// Project Cost Response DTO
interface ProjectCostResponseDto extends ProjectCost {
  projectName: string; // Populated from project
  approvedByName?: string; // Populated from approver user
}
```

### ProjectCost Validation Rules

| Field             | Validation Rules                                             |
| ----------------- | ------------------------------------------------------------ |
| `projectId`       | Required, must reference existing Project                    |
| `costType`        | Required, must be valid ProjectCostType enum value           |
| `description`     | Required, 10-500 chars                                       |
| `supplierName`    | Optional, 2-200 chars if provided                            |
| `quantity`        | Required, > 0, warning if > 10000                            |
| `unitPriceEur`    | Required, >= 0, warning if > €100,000                        |
| `taxRate`         | Optional, 0-1 (defaults to 0.19 = 19% VAT)                   |
| `totalCostEur`    | Calculated automatically, must equal quantity × unitPriceEur |
| `taxAmountEur`    | Calculated automatically                                     |
| `totalWithTaxEur` | Calculated automatically                                     |
| `status`          | Required, must be valid ProjectCostStatus enum value         |
| `invoiceNumber`   | Optional, unique per supplier                                |
| `invoiceDate`     | Optional, cannot be in future if provided                    |
| `invoicePdfUrl`   | Optional, valid MinIO URL format                             |

### ProjectCost Business Rules

**PC-001: Cost Calculation**

```typescript
// Automatic calculation on create/update
totalCostEur = quantity * unitPriceEur;
taxAmountEur = totalCostEur * taxRate;
totalWithTaxEur = totalCostEur + taxAmountEur;

// Round to 2 decimal places
totalCostEur = Math.round(totalCostEur * 100) / 100;
taxAmountEur = Math.round(taxAmountEur * 100) / 100;
totalWithTaxEur = Math.round(totalWithTaxEur * 100) / 100;
```

**PC-002: Status Lifecycle**

```typescript
// Valid status transitions
const VALID_TRANSITIONS = {
  PLANNED: ["ORDERED", "PAID"], // Direct payment for small items
  ORDERED: ["RECEIVED", "PAID"], // Goods arrived or prepaid
  RECEIVED: ["INVOICED", "PAID"], // Invoice received or payment on delivery
  INVOICED: ["PAID"], // Payment made
  PAID: [], // Terminal state
};
```

**PC-003: Approval Requirements**

- Costs < €500: PLAN can approve
- Costs >= €500: Requires GF approval
- Approval required before status can move to PAID

**PC-004: Invoice Upload**

- Invoice PDF required when status = INVOICED
- PDF stored in MinIO with encryption
- Invoice must match cost amount ±€1

**PC-005: Deletion Rules**

- Only costs with status PLANNED or ORDERED can be deleted
- RECEIVED/INVOICED/PAID costs cannot be deleted (GoBD compliance)
- Deletion requires reason and approval for costs > €100

**PC-006: Edit Rules**

- PLANNED costs: All fields editable
- ORDERED costs: Can edit status, invoiceNumber, invoiceDate
- RECEIVED/INVOICED costs: Can only update status and payment info
- PAID costs: Read-only (GoBD compliance)

**PC-007: Material Cost Summary**

- Summary updates in real-time when costs are added/updated
- Pending payment calculation includes all INVOICED status costs
- Breakdown by cost type helps identify spending patterns

**PC-008: Tax Rate Defaults**

- Default tax rate: 19% (German VAT)
- Support for reduced rates: 7% (food, books)
- Support for 0% (international purchases, reverse charge)

**PC-009: Supplier Tracking**

- Same supplier used across multiple projects
- Track total spending per supplier
- Payment terms tracking (future enhancement)

**PC-010: Budget Warnings**

```typescript
// Warn if project costs exceed budget
if (materialCostSummary.totalWithTaxEur > project.budget * 0.8) {
  warnings.push({
    level: "warning",
    message: `Material costs at 80% of budget (€${materialCostSummary.totalWithTaxEur} / €${project.budget})`,
  });
}

if (materialCostSummary.totalWithTaxEur > project.budget) {
  warnings.push({
    level: "critical",
    message: `Material costs EXCEED budget by €${materialCostSummary.totalWithTaxEur - project.budget}`,
  });
}
```

### ProjectCost Use Cases

1. **Plan Material**: PLAN user adds planned material costs during project planning
2. **Order Material**: User marks cost as ORDERED, adds purchase order number
3. **Receive Goods**: User marks cost as RECEIVED when delivery arrives
4. **Upload Invoice**: User uploads supplier invoice PDF, marks as INVOICED
5. **Record Payment**: BUCH marks cost as PAID when payment is made
6. **Cost Summary**: GF views total project costs broken down by type and status
7. **Budget Monitoring**: System alerts when material costs approach/exceed budget
8. **Supplier Report**: GF views total spending per supplier across all projects

### RBAC Permissions

| Role  | ProjectCost Permissions                                          |
| ----- | ---------------------------------------------------------------- |
| PLAN  | Full CRUD (all project costs), APPROVE (costs < €500)            |
| KALK  | CREATE/READ/UPDATE (for cost estimation), no approval            |
| GF    | Full CRUD (all costs), APPROVE (all costs, required for >= €500) |
| BUCH  | READ (all costs), UPDATE (payment status only)                   |
| INNEN | No access (pre-sales role, not involved in project execution)    |
| ADM   | No access (sales role, not involved in project execution)        |

### Offline-First Considerations

1. **Cost Entry**: Created offline, synced when online
2. **Invoice Upload**: Queued offline, uploaded on sync
3. **Status Updates**: Tracked offline, synced when connected
4. **Approval**: Requires online connection (manager action)
5. **Conflict Resolution**: Last-write-wins for edits, manual review for deletions

### Security & Compliance

1. **Invoice Storage**: MinIO with encryption at rest
2. **Audit Trail**: All status changes logged with user and timestamp
3. **GoBD Compliance**: PAID costs are immutable
4. **Access Control**: PLAN can only edit project costs for assigned projects
5. **Approval Workflow**: Costs >= €500 require GF approval (dual control)

---

## 24. Offer Entity (NEW - Phase 1 MVP)

The Offer entity represents a formal price quote/proposal sent to a customer based on a qualified Opportunity. Offers can be accepted (→ Contract) or rejected (→ Opportunity Lost).

### Offer Interface

```typescript
interface Offer extends BaseEntity {
  _id: string; // Format: "offer-{uuid}" or "A-YYYY-NNNNN" (GoBD-compliant)
  type: "offer"; // Fixed discriminator

  // References
  opportunityId: string; // Source opportunity (REQUIRED)
  customerId: string; // Target customer (REQUIRED)
  contactPersonId?: string; // Decision maker at customer

  // Offer identity
  offerNumber: string; // Format: "A-2025-00042" (Angebot = Offer)
  offerDate: Date; // When offer was created
  validUntil: Date; // Offer expiration date

  // Status
  status: OfferStatus; // Current offer status

  // Line items
  lineItems: OfferLineItem[]; // Products/services offered

  // Pricing
  subtotalEur: number; // Sum of line items (net)
  discountPercent?: number; // Optional discount %
  discountAmountEur?: number; // Calculated discount amount
  taxRate: number; // VAT rate (default: 19%)
  taxAmountEur: number; // Calculated tax
  totalEur: number; // Final total (gross)

  // Terms
  paymentTermsDays: number; // Payment deadline (days)
  deliveryTimeDays?: number; // Estimated delivery time
  validityDays: number; // Offer validity period (default: 30)

  // Documents
  pdfUrl?: string; // Generated PDF in MinIO
  terms?: string; // Terms & conditions (rich text)
  notes?: string; // Internal notes (rich text)

  // Response tracking
  sentAt?: Date; // When offer was sent to customer
  viewedAt?: Date; // When customer viewed offer (tracking)
  acceptedAt?: Date; // When customer accepted
  rejectedAt?: Date; // When customer rejected
  rejectionReason?: string; // Why customer rejected

  // GoBD compliance
  finalized?: boolean; // Once finalized, offer is immutable
  immutableHash?: string; // SHA-256 hash for tamper detection
  contractId?: string; // Link to resulting Contract (if accepted)
}

enum OfferStatus {
  DRAFT = "draft", // Being created
  SENT = "sent", // Sent to customer
  VIEWED = "viewed", // Customer opened PDF
  ACCEPTED = "accepted", // Customer accepted (→ Contract)
  REJECTED = "rejected", // Customer declined
  EXPIRED = "expired", // Validity period passed
  SUPERSEDED = "superseded", // Replaced by newer offer
}

interface OfferLineItem {
  position: number; // Line number (1, 2, 3...)
  description: string; // Item description
  quantity: number; // Amount
  unit: string; // Unit (e.g., "Stück", "Stunden", "Pauschal")
  unitPriceEur: number; // Price per unit (net)
  totalPriceEur: number; // Calculated: quantity × unitPriceEur
  taxRate: number; // VAT rate for this item
}
```

### Offer Validation Rules

#### offerNumber

- **Required:** true
- **Unique:** true (globally)
- **Pattern:** `/^A-\d{4}-\d{5}$/`
- **Example:** "A-2025-00042"
- **Generated by:** `generateGoBDNumber('offer')` from shared utils

#### offerDate

- **Required:** true
- **Min:** -7 days from today (allow 1 week retroactive)
- **Max:** today
- **Error:** "Offer date must be within last 7 days"

#### validUntil

- **Required:** true
- **Min:** offerDate
- **Max:** offerDate + 365 days
- **Default:** offerDate + 30 days
- **Error:** "Offer validity must be between offer date and 1 year"

#### lineItems

- **Required:** true
- **Min length:** 1
- **Max length:** 100
- **Validation:** Each line item must have valid description, quantity > 0, unitPriceEur >= 0
- **Error:** "Offer must have at least one line item"

#### totalEur

- **Required:** true
- **Calculated:** (subtotal - discount + tax)
- **Tolerance:** ±0.01 (1 cent rounding)
- **Error:** "Offer total does not match calculated total"

### Offer Business Rules

**Rule OF-001: Total Calculation**

```typescript
const subtotal = offer.lineItems.reduce(
  (sum, item) => sum + item.totalPriceEur,
  0,
);
const discountAmount = offer.discountPercent
  ? subtotal * (offer.discountPercent / 100)
  : 0;
const netTotal = subtotal - discountAmount;
const taxAmount = netTotal * (offer.taxRate / 100);
const total = netTotal + taxAmount;

if (Math.abs(total - offer.totalEur) >= 0.01) {
  throw new ValidationException("Offer total calculation mismatch");
}
```

**Rule OF-002: Expiration Check**

```typescript
if (offer.status === OfferStatus.SENT || offer.status === OfferStatus.VIEWED) {
  if (new Date() > offer.validUntil) {
    offer.status = OfferStatus.EXPIRED;
    warnings.push({
      level: "warning",
      message: `Offer ${offer.offerNumber} has expired`,
    });
  }
}
```

**Rule OF-003: Finalization (GoBD Immutability)**

```typescript
if (offer.status === OfferStatus.SENT) {
  offer.finalized = true;
  offer.immutableHash = generateSHA256Hash(offer);
  // Immutable fields: offerNumber, offerDate, customerId, lineItems, pricing
}
```

**Rule OF-004: Acceptance → Contract Conversion**

```typescript
if (offer.status === OfferStatus.ACCEPTED) {
  const contract = await createContractFromOffer(offer);
  offer.contractId = contract._id;
  offer.acceptedAt = new Date();
}
```

### Offer Use Cases

1. **Create Offer from Opportunity**: INNEN converts qualified opportunity to offer
2. **Generate PDF**: System generates professional offer PDF with company branding
3. **Send Offer**: INNEN emails PDF to customer contact
4. **Track Viewing**: System tracks when customer opens PDF (optional tracking pixel)
5. **Customer Accepts**: INNEN creates Contract from accepted Offer
6. **Customer Rejects**: INNEN marks Opportunity as Lost, captures rejection reason
7. **Revise Offer**: If customer negotiates, create superseded offer with new terms
8. **Offer Expires**: System auto-expires offers past validUntil date

### RBAC Permissions

| Role  | Offer Permissions                                |
| ----- | ------------------------------------------------ |
| INNEN | Full CRUD (all offers), SEND, ACCEPT/REJECT      |
| GF    | Full CRUD (all offers), APPROVE (offers > €10K)  |
| ADM   | CREATE (own customers), READ (own), no ACCEPT    |
| PLAN  | READ-ONLY (for project context after acceptance) |
| KALK  | CREATE/READ (for cost estimation), no SEND       |
| BUCH  | No access (not involved in sales)                |

---

## 25. Contract Entity (NEW - Phase 1 MVP)

The Contract entity represents a legally binding agreement between the company and customer, created from an accepted Offer. Contracts are the foundation for Project creation.

### Contract Interface

```typescript
interface Contract extends BaseEntity {
  _id: string; // Format: "contract-{uuid}" or "C-YYYY-NNNNN"
  type: "contract"; // Fixed discriminator

  // References
  offerId: string; // Source offer (REQUIRED)
  opportunityId: string; // Original opportunity (REQUIRED)
  customerId: string; // Customer (REQUIRED)
  contactPersonId?: string; // Signing authority at customer

  // Contract identity
  contractNumber: string; // Format: "C-2025-00042" (Vertrag = Contract)
  contractDate: Date; // Signing date
  startDate: Date; // Contract effective date
  endDate?: Date; // Contract end date (if applicable)

  // Status
  status: ContractStatus; // Current contract status

  // Financial (copied from accepted Offer)
  contractValueEur: number; // Total contract value (gross)
  subtotalEur: number; // Net value
  taxAmountEur: number; // VAT amount

  // Terms (copied from Offer, can be amended)
  paymentTermsDays: number; // Payment deadline
  deliverySchedule?: string; // Delivery milestones (rich text)
  terms: string; // T&C (rich text)

  // Project planning
  projectManagerId?: string; // Assigned PLAN user
  estimatedStartDate?: Date; // When project should start
  estimatedDuration?: number; // Estimated days to complete

  // Documents
  signedPdfUrl?: string; // Signed contract PDF in MinIO
  customerSignature?: string; // Customer signature (base64 or URL)
  ourSignature?: string; // Our signature (GF)

  // Tracking
  projectId?: string; // Link to created Project
  projectCreatedAt?: Date; // When project was created from contract

  // GoBD compliance (immutable once signed)
  finalized: boolean; // true = contract signed & immutable
  immutableHash: string; // SHA-256 hash
  changeLog: ChangeLogEntry[]; // Audit trail for any corrections
}

enum ContractStatus {
  DRAFT = "draft", // Being prepared
  PENDING_SIGNATURE = "pending_signature", // Awaiting customer signature
  SIGNED = "signed", // Signed by customer
  ACTIVE = "active", // Project in progress
  COMPLETED = "completed", // Project delivered
  TERMINATED = "terminated", // Contract cancelled
}
```

### Contract Validation Rules

#### contractNumber

- **Required:** true
- **Unique:** true (globally)
- **Pattern:** `/^C-\d{4}-\d{5}$/`
- **Example:** "C-2025-00042"
- **GoBD Compliant:** Sequential, gap-free numbering

#### contractDate

- **Required:** true
- **Min:** offerDate (from source offer)
- **Max:** today + 7 days (allow slight future-dating)
- **Error:** "Contract date must be after offer date and not far in future"

#### startDate

- **Required:** true
- **Min:** contractDate
- **Max:** contractDate + 365 days
- **Error:** "Contract start date must be after contract date"

#### contractValueEur

- **Required:** true
- **Must match:** offer.totalEur (from source offer)
- **Immutable:** true (once signed)
- **Error:** "Contract value must match accepted offer total"

### Contract Business Rules

**Rule CO-001: Contract Creation from Offer**

```typescript
async function createContractFromOffer(offer: Offer): Promise<Contract> {
  if (offer.status !== OfferStatus.ACCEPTED) {
    throw new BusinessRuleException(
      "Cannot create contract from non-accepted offer",
    );
  }

  const contract: Contract = {
    _id: generateContractId(),
    type: "contract",
    offerId: offer._id,
    opportunityId: offer.opportunityId,
    customerId: offer.customerId,
    contractNumber: await generateGoBDNumber("contract"),
    contractDate: new Date(),
    startDate: addDays(new Date(), 7), // Default: start in 1 week
    status: ContractStatus.DRAFT,
    contractValueEur: offer.totalEur,
    subtotalEur: offer.subtotalEur,
    taxAmountEur: offer.taxAmountEur,
    paymentTermsDays: offer.paymentTermsDays,
    terms: offer.terms || "",
    finalized: false,
    immutableHash: "",
    changeLog: [],
    // ... audit fields
  };

  return await contractRepository.create(contract);
}
```

**Rule CO-002: Contract Signing (Immutability)**

```typescript
async function signContract(
  contract: Contract,
  signature: string,
  user: User,
): Promise<Contract> {
  if (contract.finalized) {
    throw new BusinessRuleException("Contract is already signed and immutable");
  }

  contract.status = ContractStatus.SIGNED;
  contract.customerSignature = signature;
  contract.finalized = true;
  contract.immutableHash = generateSHA256Hash(contract);
  contract.modifiedBy = user.id;
  contract.modifiedAt = new Date();

  return await contractRepository.update(contract);
}
```

**Rule CO-003: Contract → Project Conversion**

```typescript
async function createProjectFromContract(
  contract: Contract,
  user: User,
): Promise<Project> {
  if (contract.status !== ContractStatus.SIGNED) {
    throw new BusinessRuleException(
      "Contract must be signed before project creation",
    );
  }

  if (user.role !== "PLAN" && user.role !== "GF") {
    throw new ForbiddenException(
      "Only PLAN or GF can create projects from contracts",
    );
  }

  const project = await projectService.createFromContract(contract);

  contract.projectId = project._id;
  contract.projectCreatedAt = new Date();
  contract.status = ContractStatus.ACTIVE;

  await contractRepository.update(contract);
  return project;
}
```

**Rule CO-004: GoBD Correction Pattern**

```typescript
// Signed contracts are immutable - corrections require audit trail
async function correctContract(
  contract: Contract,
  correction: Partial<Contract>,
  reason: string,
  user: User,
): Promise<Contract> {
  if (!contract.finalized) {
    // Draft contracts can be edited normally
    return await contractRepository.update({ ...contract, ...correction });
  }

  // Signed contracts require GF approval and change log
  if (user.role !== "GF") {
    throw new ForbiddenException("Only GF can correct signed contracts");
  }

  // Log every field change
  Object.keys(correction).forEach((field) => {
    contract.changeLog.push({
      field,
      oldValue: contract[field],
      newValue: correction[field],
      changedBy: user.id,
      changedAt: new Date(),
      reason,
      approvedBy: user.id,
    });
  });

  return await contractRepository.update({ ...contract, ...correction });
}
```

### Contract Use Cases

1. **Create from Offer**: INNEN accepts offer → creates contract draft
2. **Review & Adjust**: INNEN reviews terms, adjusts if needed before signature
3. **Send for Signature**: INNEN emails contract PDF to customer for signature
4. **Customer Signs**: Customer signs contract (digital or scanned)
5. **Upload Signed PDF**: INNEN uploads signed contract to system
6. **Handover to PLAN**: INNEN assigns project manager, notifies PLAN team
7. **Create Project**: PLAN user converts contract to active project
8. **Monitor Delivery**: Contract status tracks project progress (Active → Completed)

### RBAC Permissions

| Role  | Contract Permissions                                                       |
| ----- | -------------------------------------------------------------------------- |
| INNEN | Full CRUD (pre-signature), READ-ONLY (post-signature), SEND                |
| GF    | Full CRUD (all contracts), CORRECT (signed contracts), APPROVE             |
| PLAN  | CREATE (from signed contracts → projects), READ (all for project planning) |
| ADM   | READ (own customers only)                                                  |
| KALK  | READ-ONLY (for estimation context)                                         |
| BUCH  | No access (handled via Lexware integration in Phase 2+)                    |

### Offer/Contract Workflow Summary

```
Opportunity (INNEN)
  → Offer (INNEN creates, sends)
  → Customer accepts
  → Contract (INNEN creates, customer signs)
  → Contract finalized (immutable)
  → Project (PLAN creates from contract)
  → Project delivery (PLAN manages)
  → Lexware invoicing (Phase 2+, BUCH)
```

---

## 26. Supplier Entity (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Status:** Critical - Addresses Pre-Mortem Danger #3 (Workflow Gap)  
**Priority:** Phase 1 MVP - Required for INN persona workflow

### Supplier Interface

```typescript
interface Supplier extends BaseEntity {
  _id: string; // Format: "supplier-{uuid}"
  _rev: string;
  type: "supplier";

  // Basic Information
  companyName: string; // Required, 2-200 chars
  legalForm?: string; // "GmbH", "e.K.", "GbR", etc.
  vatNumber?: string; // Optional, format: DE123456789
  taxId?: string; // Steuernummer

  // Contact Information
  email: string; // Required
  phone: string; // Required
  mobile?: string;
  website?: string;

  // Address
  billingAddress: Address; // Required
  deliveryAddresses?: Address[]; // Optional multiple

  // Supplier Classification
  supplierType:
    | "material_supplier"
    | "service_provider"
    | "subcontractor"
    | "craftsman"
    | "logistics"
    | "mixed";
  serviceCategories: string[]; // Required, min 1
  serviceDescription: string; // Required, 50-1000 chars

  // Business Details
  paymentTerms: {
    paymentMethod:
      | "Invoice"
      | "DirectDebit"
      | "CreditCard"
      | "Cash"
      | "BankTransfer";
    daysUntilDue: number; // 0-120
    discountPercentage?: number; // Skonto
    discountDays?: number;
    partialPaymentAllowed: boolean;
  };
  minimumOrderValue?: number; // € minimum
  deliveryLeadTime?: number; // Days
  workingRadius?: number; // km

  // Performance Tracking
  rating: {
    overall: number; // 1-5 stars, calculated
    quality: number;
    reliability: number;
    communication: number;
    priceValue: number;
    reviewCount: number;
    lastUpdated: Date;
  };

  // Financial
  totalContractValue: number; // Sum of all contracts
  outstandingInvoices: number; // Sum of unpaid invoices
  activeProjectCount: number; // Current assignments

  // Status
  status: "Active" | "Inactive" | "Blacklisted" | "PendingApproval";
  blacklistReason?: string;
  approvedBy?: string; // User ID (GF)
  approvedAt?: Date;

  // Relationships
  accountManagerId: string; // INN user managing supplier

  // Audit Trail
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

### Validation Rules: Supplier

- **companyName:** Required, 2-200 chars, pattern: `/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/`
- **email:** Required, valid email format
- **phone:** Required, 7-20 chars, pattern: `/^[\+]?[0-9\s\-()]+$/`
- **supplierType:** Required, enum
- **serviceCategories:** Required, min 1, max 10
- **serviceDescription:** Required, 50-1000 chars
- **paymentTerms.daysUntilDue:** Required, 0-120 days

### Business Rules: Supplier

- **SU-001:** INN is primary owner (account manager required)
- **SU-002:** New suppliers require GF approval (status = PendingApproval initially)
- **SU-003:** Only GF can blacklist suppliers (requires reason)
- **SU-004:** Rating calculated from project ratings (post-completion)
- **SU-005:** Blacklisted suppliers cannot be assigned to new projects

### RBAC Permissions: Supplier

| Role | Permissions                      |
| ---- | -------------------------------- |
| INN  | Full CRUD, Assign to projects    |
| PLAN | Read, Create, Assign to projects |
| BUCH | Read, View invoices              |
| GF   | Full CRUD, Approve, Blacklist    |
| ADM  | Read (limited)                   |
| KALK | Read (for cost estimation)       |

---

## 27. Material Entity (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Status:** Critical - Addresses Pre-Mortem Danger #3 (Workflow Gap)  
**Priority:** Phase 1 MVP - Required for project cost tracking

### Material Interface

```typescript
interface Material extends BaseEntity {
  _id: string; // Format: "material-{uuid}"
  _rev: string;
  type: "material";

  // Basic Information
  materialCode: string; // Required, unique, "MAT-XXX-###"
  materialName: string; // Required, 5-200 chars
  description: string; // Required, 20-1000 chars
  category: string; // Required, MaterialCategory enum
  subcategory?: string;

  // Specifications
  unit:
    | "piece"
    | "square_meter"
    | "linear_meter"
    | "cubic_meter"
    | "kilogram"
    | "liter"
    | "package"
    | "set"
    | "hour";
  dimensions?: {
    length?: number; // cm
    width?: number;
    height?: number;
    diameter?: number;
    unit: "cm" | "mm" | "m";
  };
  color?: string;
  finish?: string; // "Matt", "Glänzend", etc.
  material?: string; // "Holz", "Metall", "Glas"
  weight?: number; // kg

  // Catalog
  manufacturerSKU?: string;
  manufacturerName?: string;
  productLine?: string;
  eanCode?: string; // Barcode

  // Multi-Supplier Pricing
  supplierPrices: Array<{
    supplierId: string;
    supplierName: string; // Denormalized
    unitPrice: number; // € per unit
    minimumOrderQuantity: number;
    leadTimeDays: number;
    bulkDiscounts?: Array<{
      quantityFrom: number;
      discountPercentage: number;
      unitPrice: number;
    }>;
    lastUpdated: Date;
    isPreferred: boolean; // Star supplier
  }>;
  averagePrice: number; // Calculated
  lowestPrice: number; // Calculated
  lastPriceUpdate: Date;

  // Inventory (Phase 2)
  trackInventory: boolean;
  currentStock?: number;
  minimumStock?: number;
  maximumStock?: number;
  stockLocation?: string;

  // Usage
  timesUsed: number; // Project count
  lastUsedDate?: Date;

  // Status
  status: "Active" | "Discontinued" | "OutOfStock";
  alternativeMaterialId?: string; // Replacement

  // Audit Trail
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

### Validation Rules: Material

- **materialName:** Required, 5-200 chars
- **materialCode:** Required, unique, pattern: `/^MAT-[A-Z]{3}-\d{3}$/`
- **description:** Required, 20-1000 chars
- **category:** Required, enum
- **unit:** Required, enum
- **supplierPrices:** Required, min 1 supplier

### Business Rules: Material

- **MAT-001:** At least one supplier price required
- **MAT-002:** Material catalog shared by all users (read access)
- **MAT-003:** Only INN/KALK can add materials
- **MAT-004:** Only INN/GF can discontinue materials
- **MAT-005:** Price updates trigger notification to KALK for active estimates

---

## 28. ProjectMaterialRequirement Entity (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Status:** Critical - Real-time project cost tracking  
**Priority:** Phase 1 MVP

### Interface

```typescript
interface ProjectMaterialRequirement extends BaseEntity {
  _id: string; // Format: "project-material-{uuid}"
  _rev: string;
  type: "project_material_requirement";

  // Assignment
  projectId: string; // Required
  materialId: string; // Required

  // Details
  phase:
    | "planning"
    | "preparation"
    | "construction"
    | "installation"
    | "finishing"
    | "handover";
  workPackage?: string;
  description?: string;

  // Quantity
  estimatedQuantity: number; // From KALK
  actualQuantity?: number; // After delivery
  unit: string; // From Material

  // Pricing
  estimatedUnitPrice: number; // From material.averagePrice or supplier
  actualUnitPrice?: number; // After purchase
  estimatedTotalCost: number; // estimatedQuantity * estimatedUnitPrice
  actualTotalCost?: number; // actualQuantity * actualUnitPrice

  // Procurement
  supplierId?: string;
  purchaseOrderId?: string;
  orderedDate?: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  deliveryStatus:
    | "not_ordered"
    | "ordered"
    | "in_transit"
    | "delivered"
    | "delayed"
    | "cancelled";

  // Status
  requirementStatus:
    | "estimated"
    | "confirmed"
    | "ordered"
    | "delivered"
    | "installed"
    | "returned";

  // Audit Trail
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

### Business Rules: ProjectMaterialRequirement

- **PMR-001:** KALK creates during estimate (status = estimated)
- **PMR-002:** PLAN confirms during planning (status = confirmed)
- **PMR-003:** INN procures (status = ordered)
- **PMR-004:** Delivery updates project.actualMaterialCosts real-time
- **PMR-005:** Significant variance (>10%) requires KALK review

---

## 29. PurchaseOrder Entity (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Status:** Critical - Procurement workflow  
**Priority:** Phase 1 MVP

### Interface

```typescript
interface PurchaseOrder extends BaseEntity {
  _id: string; // Format: "purchase-order-{uuid}"
  _rev: string;
  type: "purchase_order";

  // PO Basics
  poNumber: string; // Required, unique, "PO-2025-00234"
  projectId: string; // Required
  supplierId: string; // Required

  // Financial
  lineItems: Array<{
    materialId: string;
    materialName: string; // Denormalized
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    netAmount: number;
    taxRate: number;
    projectMaterialReqId?: string;
  }>;
  subtotal: number; // Sum of line items
  taxAmount: number; // Calculated
  shippingCost?: number;
  totalAmount: number; // subtotal + tax + shipping

  // Approval
  approvalRequired: boolean; // True if >€1k
  approvedBy?: string; // BUCH (≤€10k) or GF (>€10k)
  approvedAt?: Date;

  // Delivery
  requiredByDate: Date; // When materials needed
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  deliveryAddress: Address;

  // Status
  poStatus:
    | "draft"
    | "pending_approval"
    | "approved"
    | "sent_to_supplier"
    | "confirmed_by_supplier"
    | "partially_delivered"
    | "delivered"
    | "cancelled";

  // Payment
  invoiceReceived: boolean;
  supplierInvoiceId?: string;

  // Audit Trail
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

### Validation Rules: PurchaseOrder

- **lineItems:** Required, min 1, max 50
- **totalAmount:** Must equal subtotal + taxAmount + (shippingCost || 0), tolerance ±€0.01
- **requiredByDate:** Required, must be ≥today and ≤project.plannedEndDate
- **approvedBy:** Required if totalAmount >€1k

### Business Rules: PurchaseOrder

- **PO-001:** Auto-approve if ≤€1k
- **PO-002:** BUCH approves €1k-€10k
- **PO-003:** GF approves >€10k
- **PO-004:** Delivery updates project costs real-time
- **PO-005:** Cannot delete after status = sent_to_supplier

### RBAC Permissions: PurchaseOrder

| Role | Permissions                                                  |
| ---- | ------------------------------------------------------------ |
| INN  | Create, Update (pre-send), Send to supplier, Record delivery |
| PLAN | Create (≤€10k), View                                         |
| BUCH | Approve (€1k-€10k), View all                                 |
| GF   | Approve (>€10k), View all                                    |
| KALK | View (for cost context)                                      |

---

## 30. SupplierContract Entity (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Priority:** Phase 1 MVP

### Interface

```typescript
interface SupplierContract extends BaseEntity {
  _id: string; // Format: "supplier-contract-{uuid}"
  _rev: string;
  type: "supplier_contract";

  // Contract Basics
  contractNumber: string; // Required, unique, "SC-2025-00123"
  supplierId: string; // Required
  projectId?: string; // Optional, null = framework contract

  // Details
  contractType:
    | "framework"
    | "project"
    | "service_agreement"
    | "purchase_order";
  title: string; // Required, 10-200 chars
  description: string; // Required, 50-2000 chars
  scope: string[]; // Work packages

  // Financial
  contractValue: number; // Required, € total
  valueType: "Fixed" | "TimeAndMaterial" | "UnitPrice" | "CostPlus";
  paymentSchedule: Array<{
    description: string;
    percentage: number;
    amount: number;
    dueCondition: string;
    dueDate?: Date;
    invoiceId?: string;
    paidDate?: Date;
    status: "Pending" | "Invoiced" | "Paid";
  }>;
  retentionPercentage?: number; // Gewährleistungseinbehalt

  // Timeline
  startDate: Date; // Required
  endDate: Date; // Required
  noticePeriod?: number; // Days

  // Status
  status:
    | "draft"
    | "pending_approval"
    | "sent_to_supplier"
    | "under_negotiation"
    | "signed"
    | "in_execution"
    | "completed"
    | "terminated"
    | "cancelled";
  signedBySupplier: boolean;
  signedByUs: boolean;
  signedDate?: Date;
  approvedBy?: string; // GF for >€50k

  // Performance
  actualValue?: number;
  actualEndDate?: Date;

  // Audit Trail
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

### Business Rules: SupplierContract

- **SC-001:** Contracts <€50k auto-approved
- **SC-002:** Contracts ≥€50k require GF approval
- **SC-003:** Contracts >€200k require GF + BUCH approval
- **SC-004:** Payment milestones must total 100% of contract value
- **SC-005:** Cannot delete after status = signed

---

## 31. ProjectSubcontractor Entity (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Priority:** Phase 1 MVP - Links suppliers to projects

### Interface

```typescript
interface ProjectSubcontractor extends BaseEntity {
  _id: string; // Format: "project-subcontractor-{uuid}"
  _rev: string;
  type: "project_subcontractor";

  // Assignment
  projectId: string; // Required
  supplierId: string; // Required
  contractId?: string; // Optional

  // Work Details
  workPackage: string; // Required
  serviceCategory: string; // Required
  description: string; // Required

  // Schedule
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;

  // Financial
  estimatedCost: number;
  actualCost?: number;
  budgetStatus: "OnTrack" | "Warning" | "Exceeded";

  // Status
  status: "Planned" | "Confirmed" | "InProgress" | "Completed" | "Cancelled";
  completionPercentage: number; // 0-100

  // Performance
  qualityRating?: number; // 1-5, after completion
  timelinessRating?: number;
  communicationRating?: number;
  notes?: string;

  // Audit Trail
  assignedBy: string;
  assignedAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

### Business Rules: ProjectSubcontractor

- **PS-001:** Only INN and PLAN can assign subcontractors
- **PS-002:** Rating required after status = Completed
- **PS-003:** Actual costs update project.actualSupplierCosts real-time
- **PS-004:** Cannot delete assignment if invoices exist

---

## 32. SupplierInvoice Entity (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Priority:** Phase 1 MVP - Supplier payment workflow

### Interface

```typescript
interface SupplierInvoice extends BaseEntity {
  _id: string; // Format: "supplier-invoice-{uuid}"
  _rev: string;
  type: "supplier_invoice";

  // Invoice Basics
  invoiceNumber: string; // Supplier's invoice number
  supplierId: string; // Required
  contractId?: string;
  projectId: string; // Required

  // Financial
  invoiceDate: Date; // Required
  dueDate: Date; // Required
  netAmount: number;
  taxRate: number;
  taxAmount: number;
  grossAmount: number; // netAmount + taxAmount

  // Line Items
  lineItems: Array<{
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    netAmount: number;
    taxRate: number;
    materialId?: string;
  }>;

  // Payment
  paymentStatus: "Pending" | "Approved" | "Paid" | "Disputed";
  approvedBy?: string; // BUCH or GF
  approvedAt?: Date;
  paidDate?: Date;
  paidAmount?: number;

  // Audit Trail
  createdBy: string; // INN
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

### Business Rules: SupplierInvoice

- **SI-001:** Auto-approve if <€1k AND 3-way match OK
- **SI-002:** BUCH approves €1k-€10k
- **SI-003:** GF approves >€10k
- **SI-004:** 3-way match: Invoice vs. PO vs. Delivery confirmation
- **SI-005:** Payment updates project.actualSupplierCosts real-time

---

## 33. SupplierCommunication Entity (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Priority:** Phase 1 MVP - Supplier relationship tracking

### Interface

```typescript
interface SupplierCommunication extends BaseEntity {
  _id: string; // Format: "supplier-comm-{uuid}"
  _rev: string;
  type: "supplier_communication";

  // Context
  supplierId: string; // Required
  projectId?: string;
  contractId?: string;

  // Communication
  communicationType: "Email" | "Phone" | "InPerson" | "Video" | "SMS";
  direction: "Inbound" | "Outbound";
  subject: string; // Required, 10-200 chars
  content: string; // Required, 20-5000 chars

  // Metadata
  communicationDate: Date; // Required
  participants: string[]; // User IDs
  attachments?: Document[];

  // Follow-up
  requiresFollowUp: boolean;
  followUpDate?: Date;
  followUpCompleted?: boolean;

  // Audit Trail
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
}
```

---

## 34. Entity Relationships (Updated)

### New Relationships Added

**Supplier Relationships:**

- Supplier ↔ Materials: Many-to-many via Material.supplierPrices[]
- Supplier ↔ Projects: Many-to-many via ProjectSubcontractor
- Supplier ↔ Contracts: One-to-many (Supplier has many SupplierContracts)
- Supplier ↔ Invoices: One-to-many (Supplier has many SupplierInvoices)
- Supplier ↔ PurchaseOrders: One-to-many
- Supplier ↔ Communications: One-to-many

**Material Relationships:**

- Material ↔ Suppliers: Many-to-many via Material.supplierPrices[]
- Material ↔ Projects: Many-to-many via ProjectMaterialRequirement
- Material ↔ PurchaseOrders: Many-to-many via PO.lineItems[]

**Project Relationships (Extended):**

- Project ↔ Materials: One-to-many (ProjectMaterialRequirement)
- Project ↔ Suppliers: Many-to-many (ProjectSubcontractor)
- Project ↔ PurchaseOrders: One-to-many
- Project Cost Tracking:
  - project.actualMaterialCosts = sum(ProjectMaterialRequirement.actualTotalCost)
  - project.actualSupplierCosts = sum(SupplierInvoice.grossAmount WHERE paid)
  - project.actualCost = actualLaborCosts + actualMaterialCosts + actualSupplierCosts

---

## Document History (Updated)

| Version | Date       | Author | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1.0     | 2025-01-28 | System | Initial specification: BaseEntity, Customer (multi-location), Location entity, Contact (decision-making), validation rules, migration strategy                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 1.1     | 2025-01-27 | System | Added User entity (multiple roles support), Role entity (hybrid RBAC), PermissionMatrix entity (runtime configuration), updated ID generation rules                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 1.2     | 2025-01-28 | System | Added UserTask entity (personal todos), ProjectTask entity (project work items), task validation rules, business rules, use cases                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 1.3     | 2025-01-28 | System | **Added Tour Planning & Expense Management entities (Phase 2)**: Tour, Meeting, HotelStay, Expense, MileageLog with complete validation rules, business rules, RBAC permissions, offline-first considerations, and security compliance                                                                                                                                                                                                                                                                                                                                                     |
| 1.4     | 2025-01-28 | System | **Added Time Tracking & Project Cost Management entities (Phase 1 MVP)**: TimeEntry (timer-based & manual time tracking with approval workflow), ProjectCost (materials, contractors, services with invoice tracking & payment status). Includes complete validation rules, business rules, RBAC permissions, cost calculations, and GoBD compliance                                                                                                                                                                                                                                       |
| 1.5     | 2025-11-12 | System | **CRITICAL UPDATE - Added Supplier & Material Management entities (Phase 1 MVP)**: Supplier, Material, ProjectMaterialRequirement, PurchaseOrder, SupplierContract, ProjectSubcontractor, SupplierInvoice, SupplierCommunication. Addresses Pre-Mortem Danger #3 (Critical Workflow Gaps). Includes complete validation rules, business rules, RBAC permissions, real-time cost tracking, and INN persona workflows. See [Supplier Management Spec](./SUPPLIER_SUBCONTRACTOR_MANAGEMENT_SPEC.md) and [Material Management Spec](./MATERIAL_INVENTORY_MANAGEMENT_SPEC.md) for full details. |

---

**End of DATA_MODEL_SPECIFICATION.md v1.5**
