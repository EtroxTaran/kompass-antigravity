# KOMPASS Data Model Specification

**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Status:** Draft

## Cross-References

- **API Specification:** `docs/reviews/API_SPECIFICATION.md` - REST endpoints and DTOs
- **RBAC Matrix:** `docs/reviews/RBAC_PERMISSION_MATRIX.md` - Permissions for entities
- **Test Strategy:** `docs/reviews/TEST_STRATEGY_DOCUMENT.md` - Test scenarios and coverage
- **Product Vision:** `docs/product-vision/Produktvision & Zielbild – Kontakt- & Kundenverwaltung (CRM-Basis).md` - Business requirements
- **Architecture Rules:** `.cursorrules` - Entity structure patterns and validation standards

---

## Table of Contents

1. [Base Entity Structure](#1-base-entity-structure)
2. [Customer Entity](#2-customer-entity)
3. [Location Entity](#3-location-entity-new)
4. [Contact/ContactPerson Entity](#4-contactcontactperson-entity)
5. [Decision-Making Enums](#5-decision-making-enums-new)
6. [Address Structure](#6-address-structure)
7. [Validation Rules](#7-validation-rules)
8. [Business Rules](#8-business-rules)
9. [Migration Strategy](#9-migration-strategy)
10. [Future Entities (Placeholders)](#10-future-entities-placeholders)

---

## 1. Base Entity Structure

All CouchDB documents in KOMPASS MUST extend the `BaseEntity` interface to ensure consistency, GoBD compliance, and offline-first synchronization support.

### BaseEntity Interface

```typescript
interface BaseEntity {
  // CouchDB metadata
  _id: string;                    // Document ID (format: "{type}-{uuid}")
  _rev: string;                   // CouchDB revision (optimistic locking)
  type: string;                   // Document type discriminator (e.g., 'customer', 'location', 'contact')
  
  // Audit trail (GoBD compliance - required for all entities)
  createdBy: string;              // User ID who created the record
  createdAt: Date;                // ISO 8601 timestamp of creation
  modifiedBy: string;             // User ID who last modified the record
  modifiedAt: Date;               // ISO 8601 timestamp of last modification
  version: number;                // Optimistic locking version (increments on update)
  
  // Offline sync support (PouchDB/CouchDB replication)
  _conflicts?: string[];          // CouchDB conflict array (populated during sync)
  lastSyncedAt?: Date;            // Last successful sync timestamp (client-side tracking)
}
```

### ID Generation Rules

- **Customer:** `customer-{uuid}` (e.g., `customer-550e8400-e29b-41d4-a716-446655440000`)
- **Location:** `location-{uuid}` (e.g., `location-123e4567-e89b-12d3-a456-426614174000`)
- **Contact:** `contact-{uuid}` (e.g., `contact-98765432-e89b-12d3-a456-426614174000`)

Use `packages/shared/utils/id-generator.ts` for all ID generation. NEVER generate IDs manually in business logic.

---

## 2. Customer Entity

The Customer entity represents a company or organization. Customers can have multiple physical locations with separate delivery addresses.

### Customer Interface

```typescript
interface Customer extends BaseEntity {
  _id: string;                    // Format: "customer-{uuid}"
  type: 'customer';               // Fixed discriminator
  
  // Basic company information
  companyName: string;            // Official company name (2-200 chars)
  vatNumber?: string;             // German VAT number (format: DE123456789)
  email?: string;                 // Primary company email
  phone?: string;                 // Primary phone number (international format)
  website?: string;               // Company website URL
  
  // Financial information
  creditLimit?: number;           // Credit limit in EUR (0-1,000,000)
  paymentTerms?: string;          // e.g., "30 Tage netto"
  
  // Categorization
  industry?: string;              // Business sector/industry
  customerType?: 'direct_marketer' | 'retail' | 'franchise' | 'cooperative' | 'other';
  rating?: 'A' | 'B' | 'C';       // Customer rating (A=best)
  
  // Address Management (NEW)
  billingAddress: Address;        // Single primary billing address (REQUIRED)
  locations: string[];            // Array of Location IDs (1:n relationship)
  defaultDeliveryLocationId?: string; // Default location for deliveries (must exist in locations array)
  
  // Relationship management
  owner: string;                  // User ID (ADM) responsible for this customer
  contactPersons: string[];       // Array of Contact IDs
  
  // DSGVO compliance
  dsgvoConsent?: {
    marketing: boolean;           // Marketing consent granted
    aiProcessing: boolean;        // AI processing consent
    dataSharing: boolean;         // Third-party data sharing consent
    grantedAt?: Date;             // When consent was granted
    grantedBy?: string;           // Who granted consent (contact ID)
    revokedAt?: Date;             // When consent was revoked
  };
  
  // Data retention
  dataRetentionUntil?: Date;      // DSGVO data retention deadline
  anonymized?: boolean;           // True if customer was anonymized
  anonymizedAt?: Date;            // When anonymization occurred
  
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
  _id: string;                    // Format: "location-{uuid}"
  type: 'location';               // Fixed discriminator
  
  // Parent reference
  customerId: string;             // Parent customer ID (REQUIRED)
  
  // Location identity
  locationName: string;           // Descriptive name (e.g., "Filiale München", "Hauptstandort")
  locationType: 'headquarter' | 'branch' | 'warehouse' | 'project_site' | 'other';
  isActive: boolean;              // Whether location is currently operational
  
  // Delivery address (separate from billing)
  deliveryAddress: Address;       // Full delivery address (REQUIRED)
  
  // Location-specific contacts
  primaryContactPersonId?: string; // Main contact at this location (optional)
  contactPersons: string[];       // Contact IDs assigned to this location
  
  // Operational details
  deliveryNotes?: string;         // Special delivery instructions
  openingHours?: string;          // Operating hours (free text)
  parkingInstructions?: string;   // Parking/access instructions
  
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
  _id: string;                    // Format: "contact-{uuid}"
  type: 'contact';                // Fixed discriminator
  
  // Basic information
  firstName: string;              // First name (REQUIRED)
  lastName: string;               // Last name (REQUIRED)
  title?: string;                 // Professional title (e.g., "Dr.", "Prof.")
  position?: string;              // Job position (e.g., "Geschäftsführer", "Einkaufsleiter")
  
  // Contact details
  email?: string;                 // Email address
  phone?: string;                 // Phone number
  mobile?: string;                // Mobile number
  
  // Relationship
  customerId: string;             // Parent customer ID (REQUIRED)
  
  // Decision-Making & Authority (NEW)
  decisionMakingRole: DecisionMakingRole;  // Role in decision-making process (REQUIRED)
  authorityLevel: 'low' | 'medium' | 'high' | 'final_authority'; // Authority level
  canApproveOrders: boolean;      // Can approve orders/quotes
  approvalLimitEur?: number;      // Maximum order value they can approve (required if canApproveOrders=true)
  
  // Role & Responsibilities (NEW)
  functionalRoles: FunctionalRole[]; // Multiple roles possible (e.g., purchasing + facility)
  departmentInfluence: string[];  // Departments they influence (e.g., ["purchasing", "operations", "finance"])
  
  // Location Assignment (NEW)
  assignedLocationIds: string[];  // Locations this contact is responsible for
  isPrimaryContactForLocations: string[]; // Locations where they're the main contact
  
  // Communication preferences
  preferredContactMethod?: 'email' | 'phone' | 'mobile';
  language?: string;              // Preferred language (ISO 639-1 code, default: "de")
  
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
  DECISION_MAKER = 'decision_maker',           // Final decision authority (e.g., CEO, Owner)
  KEY_INFLUENCER = 'key_influencer',           // Strong influence on decisions (e.g., Purchasing Manager)
  RECOMMENDER = 'recommender',                 // Provides recommendations (e.g., Project Manager)
  GATEKEEPER = 'gatekeeper',                   // Controls access to decision makers (e.g., Executive Assistant)
  OPERATIONAL_CONTACT = 'operational_contact', // Day-to-day operations only (e.g., Store Manager)
  INFORMATIONAL = 'informational'              // Kept informed, no decision power (e.g., Receptionist)
}
```

### FunctionalRole Enum

Defines the functional responsibilities of a contact.

```typescript
enum FunctionalRole {
  OWNER_CEO = 'owner_ceo',                    // Business owner or CEO
  PURCHASING_MANAGER = 'purchasing_manager',   // Purchasing/procurement
  FACILITY_MANAGER = 'facility_manager',       // Facility management
  STORE_MANAGER = 'store_manager',             // Store/branch management
  PROJECT_COORDINATOR = 'project_coordinator', // Project coordination
  FINANCIAL_CONTROLLER = 'financial_controller', // Financial control
  OPERATIONS_MANAGER = 'operations_manager',   // Operations management
  ADMINISTRATIVE = 'administrative'            // Administrative support
}
```

### Authority Level Guidelines

- **low:** Can provide information, no approval authority (€0)
- **medium:** Can approve orders up to €10,000
- **high:** Can approve orders up to €50,000
- **final_authority:** Can approve any order value

*Note: These are guidelines. Actual approval limits are set per contact.*

---

## 6. Address Structure

The Address structure is used for both billing addresses (Customer) and delivery addresses (Location).

### Address Interface

```typescript
interface Address {
  street: string;                 // Street name (REQUIRED)
  streetNumber?: string;          // House/building number
  addressLine2?: string;          // Additional info (e.g., "Hintereingang", "2. Stock")
  zipCode: string;                // Postal code (REQUIRED)
  city: string;                   // City name (REQUIRED)
  state?: string;                 // State/Bundesland (e.g., "Bayern")
  country: string;                // Country name (default: "Deutschland")
  
  // Geolocation (optional, for route planning)
  latitude?: number;              // GPS latitude
  longitude?: number;             // GPS longitude
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
      'Default delivery location must be one of the customer\'s locations'
    );
  }
}
```

**Rule CR-002: At Least One Active Location**
```typescript
if (customer.locations.length > 0) {
  const activeLocations = await this.locationRepo.findActive(customer.locations);
  if (activeLocations.length === 0) {
    warnings.push({
      level: 'warning',
      message: 'Customer has no active locations. At least one should be active.'
    });
  }
}
```

#### Location Rules

**Rule LR-001: Unique Location Names Per Customer**
```typescript
const existingLocation = await this.locationRepo.findByCustomerAndName(
  location.customerId,
  location.locationName
);
if (existingLocation && existingLocation._id !== location._id) {
  throw new ValidationException(
    `Location name "${location.locationName}" already exists for this customer`
  );
}
```

**Rule LR-002: Primary Contact Must Be Assigned**
```typescript
if (location.primaryContactPersonId) {
  if (!location.contactPersons.includes(location.primaryContactPersonId)) {
    throw new ValidationException(
      'Primary contact must be in the list of assigned contact persons'
    );
  }
}
```

#### Contact Rules

**Rule CO-001: Approval Limit Required for Approvers**
```typescript
if (contact.canApproveOrders === true) {
  if (!contact.approvalLimitEur || contact.approvalLimitEur <= 0) {
    throw new ValidationException(
      'Contacts who can approve orders must have an approval limit > 0'
    );
  }
}
```

**Rule CO-002: Primary Contact Location Must Be Assigned**
```typescript
for (const primaryLocationId of contact.isPrimaryContactForLocations) {
  if (!contact.assignedLocationIds.includes(primaryLocationId)) {
    throw new ValidationException(
      `Contact is primary for location ${primaryLocationId} but not assigned to it`
    );
  }
}
```

**Rule CO-003: At Least One Decision Maker Per Customer**
```typescript
// Warning (not error) if customer has no decision-maker
const contacts = await this.contactRepo.findByCustomer(customerId);
const hasDecisionMaker = contacts.some(c => 
  c.decisionMakingRole === 'decision_maker' || 
  c.decisionMakingRole === 'key_influencer'
);
if (!hasDecisionMaker) {
  warnings.push({
    level: 'warning',
    message: 'Customer should have at least one decision maker or key influencer'
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
  reason: string;           // REQUIRED for post-finalization changes
  approvedBy?: string;      // GF approval for significant changes
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
  address: Address;  // Single address field
}
```

**Target State:**
```typescript
interface Customer {
  billingAddress: Address;  // Renamed from 'address'
  locations: string[];      // New field (empty by default)
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
     _id: generateId('location'),
     type: 'location',
     customerId: customer._id,
     locationName: 'Hauptstandort',
     locationType: 'headquarter',
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
  decisionMakingRole: DecisionMakingRole;  // NEW
  authorityLevel: string;                  // NEW
  canApproveOrders: boolean;               // NEW
  approvalLimitEur?: number;               // NEW
  functionalRoles: FunctionalRole[];       // NEW
  assignedLocationIds: string[];           // NEW
}
```

**Migration Steps:**

1. **Set Default Values:**
   ```typescript
   contact.decisionMakingRole = 'operational_contact'; // Conservative default
   contact.authorityLevel = 'low';
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
  const customers = await db.allDocs({ include_docs: true, startkey: 'customer-', endkey: 'customer-\ufff0' });
  
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
    customer.modifiedBy = 'system-migration';
    customer.modifiedAt = new Date();
    customer.version += 1;
    
    await db.put(customer);
  }
}

async function migrateContactDecisionRoles() {
  const contacts = await db.allDocs({ include_docs: true, startkey: 'contact-', endkey: 'contact-\ufff0' });
  
  for (const row of contacts.rows) {
    const contact = row.doc;
    
    // Set defaults for new fields
    if (!contact.decisionMakingRole) {
      contact.decisionMakingRole = 'operational_contact';
      contact.authorityLevel = 'low';
      contact.canApproveOrders = false;
      contact.functionalRoles = [];
      contact.assignedLocationIds = [];
      contact.isPrimaryContactForLocations = [];
      
      contact.modifiedBy = 'system-migration';
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

### Invoice Entity (TBD)
- Extends BaseEntity with GoBD immutability
- Links to Project and Customer
- **Address Reference:** Uses customer's billing address (frozen at invoice creation)
- Immutable after finalization

### Activity/Protocol Entity (TBD)
- Extends BaseEntity
- Customer interactions (calls, meetings, visits)
- Links to Customer, Contact, and optionally Location (visit location)

---

## Validation Examples

### Example 1: Simple Customer (No Locations)

```typescript
const simpleCustomer: Customer = {
  _id: 'customer-12345',
  _rev: '1-abc',
  type: 'customer',
  companyName: 'Hofladen Müller GmbH',
  vatNumber: 'DE123456789',
  billingAddress: {
    street: 'Hauptstraße',
    streetNumber: '15',
    zipCode: '80331',
    city: 'München',
    country: 'Deutschland'
  },
  locations: [],  // No separate delivery locations
  owner: 'user-adm-001',
  contactPersons: ['contact-001'],
  createdBy: 'user-adm-001',
  createdAt: new Date('2025-01-15'),
  modifiedBy: 'user-adm-001',
  modifiedAt: new Date('2025-01-15'),
  version: 1
};
// ✅ Valid: Billing address provided, no locations (simple case)
```

### Example 2: Multi-Location Customer (Franchise)

```typescript
const franchiseCustomer: Customer = {
  _id: 'customer-67890',
  _rev: '1-def',
  type: 'customer',
  companyName: 'Bäckerei Schmidt Franchise GmbH',
  vatNumber: 'DE987654321',
  billingAddress: {
    street: 'Verwaltungsweg',
    streetNumber: '10',
    zipCode: '70173',
    city: 'Stuttgart',
    country: 'Deutschland'
  },
  locations: ['location-001', 'location-002', 'location-003'],
  defaultDeliveryLocationId: 'location-001',
  owner: 'user-adm-002',
  contactPersons: ['contact-100', 'contact-101', 'contact-102'],
  createdBy: 'user-adm-002',
  createdAt: new Date('2025-01-20'),
  modifiedBy: 'user-adm-002',
  modifiedAt: new Date('2025-01-20'),
  version: 1
};

const location1: Location = {
  _id: 'location-001',
  _rev: '1-ghi',
  type: 'location',
  customerId: 'customer-67890',
  locationName: 'Filiale Stuttgart Mitte',
  locationType: 'branch',
  isActive: true,
  deliveryAddress: {
    street: 'Königstraße',
    streetNumber: '42',
    zipCode: '70173',
    city: 'Stuttgart',
    country: 'Deutschland'
  },
  primaryContactPersonId: 'contact-100',
  contactPersons: ['contact-100'],
  deliveryNotes: 'Hintereingang nutzen, Mo-Fr 6:00-14:00 Uhr',
  createdBy: 'user-adm-002',
  createdAt: new Date('2025-01-20'),
  modifiedBy: 'user-adm-002',
  modifiedAt: new Date('2025-01-20'),
  version: 1
};
// ✅ Valid: Multi-location setup with default delivery location
```

### Example 3: Contact as Decision Maker with Approval Limit

```typescript
const decisionMakerContact: ContactPerson = {
  _id: 'contact-100',
  _rev: '1-jkl',
  type: 'contact',
  firstName: 'Thomas',
  lastName: 'Schmidt',
  position: 'Geschäftsführer',
  email: 'thomas.schmidt@baeckerei-schmidt.de',
  phone: '+49-711-123456',
  customerId: 'customer-67890',
  
  // Decision-making fields
  decisionMakingRole: 'decision_maker',
  authorityLevel: 'final_authority',
  canApproveOrders: true,
  approvalLimitEur: 100000,  // Can approve up to €100k
  
  functionalRoles: ['owner_ceo', 'purchasing_manager'],
  departmentInfluence: ['purchasing', 'operations', 'finance'],
  
  assignedLocationIds: ['location-001', 'location-002', 'location-003'],
  isPrimaryContactForLocations: ['location-001'],
  
  createdBy: 'user-adm-002',
  createdAt: new Date('2025-01-20'),
  modifiedBy: 'user-adm-002',
  modifiedAt: new Date('2025-01-20'),
  version: 1
};
// ✅ Valid: Decision maker with high approval limit
```

### Example 4: Validation Error - Missing Approval Limit

```typescript
const invalidContact: ContactPerson = {
  // ... other fields
  canApproveOrders: true,
  approvalLimitEur: undefined,  // ❌ ERROR: Required when canApproveOrders=true
};
// ValidationException: "Contacts who can approve orders must have an approval limit > 0"
```

### Example 5: Validation Error - Non-Unique Location Name

```typescript
// Customer already has location named "Filiale München"
const duplicateLocation: Location = {
  customerId: 'customer-12345',
  locationName: 'Filiale München',  // ❌ ERROR: Already exists
  // ... other fields
};
// ValidationException: "Location name 'Filiale München' already exists for this customer"
```

---

## Document History

| Version | Date       | Author | Changes |
|---------|------------|--------|---------|
| 1.0     | 2025-01-28 | System | Initial specification: BaseEntity, Customer (multi-location), Location entity, Contact (decision-making), validation rules, migration strategy |

---

**End of DATA_MODEL_SPECIFICATION.md**

