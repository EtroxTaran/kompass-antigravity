# KOMPASS RBAC Permission Matrix

**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Status:** Draft

## Cross-References

- **Data Model:** `docs/reviews/DATA_MODEL_SPECIFICATION.md` - Entity definitions
- **API Specification:** `docs/reviews/API_SPECIFICATION.md` - Endpoint permission requirements
- **Architecture Rules:** `.cursorrules` - RBAC enforcement patterns

---

## Table of Contents

1. [RBAC Overview](#1-rbac-overview)
2. [Role Definitions](#2-role-definitions)
3. [Permission Model](#3-permission-model)
4. [Customer Permissions](#4-customer-permissions)
5. [Location Permissions (NEW)](#5-location-permissions-new)
6. [Contact Permissions (NEW)](#6-contact-permissions-new)
7. [Permission Matrix](#7-permission-matrix)
8. [Record-Level Permissions](#8-record-level-permissions)
9. [Future Entity Permissions (Placeholders)](#9-future-entity-permissions-placeholders)

---

## 1. RBAC Overview

KOMPASS implements **Role-Based Access Control (RBAC)** to manage user permissions across the application. Every API endpoint and data access operation MUST check permissions before execution.

### Core Principles

1. **Deny by Default:** Users have no permissions unless explicitly granted
2. **Role-Based:** Permissions are assigned to roles, not individual users
3. **Hierarchical:** Some roles inherit permissions from others (e.g., GF has all permissions)
4. **Entity-Level + Record-Level:** Permissions apply at both entity type and individual record levels
5. **Audit Trail:** All permission checks and denials are logged

### Permission Check Pattern

```typescript
// EVERY controller method MUST have guards
@UseGuards(JwtAuthGuard, RbacGuard)
@RequirePermission('Customer', 'READ')
async findCustomer(@Param('id') id: string, @CurrentUser() user: User) {
  // Service layer performs additional record-level checks
  return this.customerService.findById(id, user);
}
```

---

## 2. Role Definitions

KOMPASS has **five primary roles** based on business functions:

### GF (Geschäftsführer / Management)
- **Full Name:** Geschäftsführer / CEO / Management
- **Description:** Business owners and top management with full system access
- **Access Level:** Full access to all data and functions
- **User Count:** 2-3 users
- **Examples:** CEO, Managing Director

### PLAN (Planung / Planning Department)
- **Full Name:** Planungsabteilung / Interior Design Planning
- **Description:** Planning/design team responsible for project execution
- **Access Level:** Full access to projects, customers, and opportunities; limited financial data access
- **User Count:** 5-8 users
- **Examples:** Interior Designers, Project Planners, Technical Architects

### ADM (Außendienst-Mitarbeiter / Sales Field Agents)
- **Full Name:** Außendienst / Sales Field Representatives
- **Description:** Sales team working on-site with customers
- **Access Level:** Full access to **own** customers, leads, and opportunities; read-only for others' customers (basic info only)
- **User Count:** 5-10 users
- **Examples:** Sales Representatives, Account Managers

### KALK (Kalkulation / Cost Estimation)
- **Full Name:** Kalkulation / Sales Back-Office
- **Description:** Internal sales support and cost calculation
- **Access Level:** Read access to all customers/projects; can create quotes and opportunities
- **User Count:** 2-4 users
- **Examples:** Cost Estimators, Sales Support

### BUCH (Buchhaltung / Accounting)
- **Full Name:** Buchhaltung / Finance Department
- **Description:** Accounting and finance team
- **Access Level:** Read-only access to customers/projects; full access to invoices and financial data
- **User Count:** 2-3 users
- **Examples:** Accountants, Financial Controllers

---

## 3. Permission Model

### Permission Format

Permissions follow the format: `Entity.Action`

**Examples:**
- `Customer.READ` - Read customer data
- `Customer.CREATE` - Create new customers
- `Location.UPDATE` - Update location information
- `Contact.UPDATE_DECISION_ROLE` - Update contact decision-making roles

### Action Types

| Action | Description | Examples |
|--------|-------------|----------|
| `READ` | View/retrieve entity data | List customers, view customer details |
| `CREATE` | Create new entity records | Add new customer, create location |
| `UPDATE` | Modify existing entity records | Update customer address, change location status |
| `DELETE` | Remove entity records | Delete location, archive customer |
| `UPDATE_DECISION_ROLE` | Special: Update contact decision-making fields | Change contact approval authority |
| `VIEW_ALL_LOCATIONS` | Special: View all customer locations | See all locations regardless of assignment |
| `VIEW_ASSIGNED_LOCATIONS` | Special: View only assigned locations | See only locations where user is assigned |

---

## 4. Customer Permissions

### Customer Entity Actions

| Permission | Description | Who Has It |
|------------|-------------|------------|
| `Customer.READ` | View customer data | All roles |
| `Customer.CREATE` | Create new customers | GF, PLAN, ADM |
| `Customer.UPDATE` | Modify customer information | GF, PLAN, ADM (own only) |
| `Customer.DELETE` | Delete/archive customers | GF only |
| `Customer.VIEW_FINANCIAL` | View financial data (credit limit, payment terms) | GF, BUCH |

### Record-Level Rules

**ADM (Sales Field Agents):**
- **Own Customers:** Full read/write access (where `customer.owner = user.id`)
- **Other Customers:** Read-only basic info (name, address, industry) - NO financial data, NO margin data

**Example:**
```typescript
async findCustomer(id: string, user: User): Promise<Customer> {
  const customer = await this.repository.findById(id);
  
  // Check entity-level permission
  if (!hasPermission(user.role, 'Customer', 'READ')) {
    throw new ForbiddenException('No permission to view customers');
  }
  
  // Check record-level permission for ADM
  if (user.role === 'ADM' && customer.owner !== user.id) {
    // ADM can see other customers but with filtered fields
    return this.filterCustomerFields(customer, ['companyName', 'address', 'phone', 'industry']);
  }
  
  return customer;
}
```

---

## 5. Location Permissions (NEW)

### Location Entity Actions

| Permission | Description | Who Has It |
|------------|-------------|------------|
| `Location.READ` | View location data | All roles |
| `Location.CREATE` | Create new locations for customer | GF, PLAN, ADM (own customers) |
| `Location.UPDATE` | Modify location information | GF, PLAN, ADM (own customers) |
| `Location.DELETE` | Remove locations | GF, PLAN |
| `Location.VIEW_ALL` | View all locations regardless of assignment | GF, PLAN, KALK, BUCH |
| `Location.VIEW_ASSIGNED` | View only assigned locations | ADM (locations for their customers) |

### Record-Level Rules for Locations

**ADM (Sales Field Agents):**
- Can CREATE/UPDATE/DELETE locations ONLY for customers they own (`customer.owner = user.id`)
- Can READ locations for any customer (as part of basic customer info)

**PLAN (Planning):**
- Can CREATE/UPDATE locations for any customer (needed for project setup)
- Can DELETE locations if no active projects reference them

**GF (Management):**
- Full access to all location operations

**KALK, BUCH:**
- Read-only access to all locations

### Business Rules

1. **Location Creation:** User must have `Customer.READ` permission for parent customer
2. **Location Update:** User must have permission to update parent customer OR be assigned to location
3. **Location Delete:** Cannot delete if location is referenced in active projects/quotes (enforced by business logic)
4. **Primary Contact:** If user updates `primaryContactPersonId`, they must have `Contact.UPDATE` permission

### Example Permission Check

```typescript
async createLocation(
  customerId: string,
  locationDto: CreateLocationDto,
  user: User
): Promise<Location> {
  // Check if user can read parent customer
  const customer = await this.customerService.findById(customerId, user);
  
  // Check location create permission
  if (!hasPermission(user.role, 'Location', 'CREATE')) {
    throw new ForbiddenException('No permission to create locations');
  }
  
  // ADM: Check ownership
  if (user.role === 'ADM' && customer.owner !== user.id) {
    throw new ForbiddenException('You can only create locations for your own customers');
  }
  
  // Validate unique location name per customer
  await this.validateUniqueLocationName(customerId, locationDto.locationName);
  
  return this.repository.create(locationDto);
}
```

---

## 6. Contact Permissions (NEW)

### Contact Entity Actions

| Permission | Description | Who Has It |
|------------|-------------|------------|
| `Contact.READ` | View contact data | All roles |
| `Contact.CREATE` | Create new contacts | GF, PLAN, ADM (own customers) |
| `Contact.UPDATE` | Modify contact basic information | GF, PLAN, ADM (own customers) |
| `Contact.DELETE` | Remove contacts | GF, PLAN |
| `Contact.UPDATE_DECISION_ROLE` | **Update decision-making roles and authority** | **GF, PLAN only** (restricted) |
| `Contact.VIEW_AUTHORITY_LEVELS` | View decision-making roles and approval limits | All roles |

### Decision-Making Role Restrictions

**Critical:** Only **ADM+** users (PLAN and GF) can update decision-making fields:
- `decisionMakingRole`
- `authorityLevel`
- `canApproveOrders`
- `approvalLimitEur`
- `functionalRoles`

**Rationale:** Decision-making authority has significant business impact (approval workflows, purchasing authority). Only management-level users should assign these roles.

### Record-Level Rules for Contacts

**ADM (Sales Field Agents):**
- Can CREATE/UPDATE contacts for their own customers
- Can VIEW decision-making roles for all contacts (read-only)
- **CANNOT** update decision-making roles

**PLAN (Planning):**
- Can UPDATE decision-making roles for any contact
- Can CREATE/UPDATE/DELETE contacts for any customer

**GF (Management):**
- Full access to all contact operations including decision roles

### Business Rules

1. **Approval Limit Validation:** If `canApproveOrders = true`, then `approvalLimitEur` MUST be set (validated in DTO)
2. **Decision-Maker Requirement:** System warns if customer has no decision-maker contact (warning, not error)
3. **Location Assignment:** Users can only assign contacts to locations they have permission to view
4. **Audit Trail:** All decision role changes are logged with reason and approver

### Example Permission Check

```typescript
async updateContactDecisionRole(
  contactId: string,
  updates: UpdateDecisionAuthorityDto,
  user: User
): Promise<Contact> {
  // CRITICAL: Check restricted permission
  if (!hasPermission(user.role, 'Contact', 'UPDATE_DECISION_ROLE')) {
    throw new ForbiddenException(
      'Only ADM+ users (PLAN, GF) can update contact decision-making roles'
    );
  }
  
  const contact = await this.repository.findById(contactId);
  
  // Validate approval limit if canApproveOrders is true
  if (updates.canApproveOrders && !updates.approvalLimitEur) {
    throw new ValidationException(
      'Approval limit required when contact can approve orders'
    );
  }
  
  // Log the change (GoBD audit trail)
  await this.auditService.log({
    entityType: 'Contact',
    entityId: contactId,
    action: 'UPDATE_DECISION_ROLE',
    oldValue: contact.decisionMakingRole,
    newValue: updates.decisionMakingRole,
    userId: user.id,
    timestamp: new Date()
  });
  
  return this.repository.update(contactId, updates);
}
```

---

## 7. Permission Matrix

### Complete Permission Matrix Table

| Entity.Action | GF | PLAN | ADM | KALK | BUCH | Notes |
|---------------|----|----|-----|------|------|-------|
| **Customer** |||||
| Customer.READ | ✅ | ✅ | ✅ | ✅ | ✅ | ADM: Own full, others basic |
| Customer.CREATE | ✅ | ✅ | ✅ | ❌ | ❌ | |
| Customer.UPDATE | ✅ | ✅ | ✅* | ❌ | ❌ | *ADM: Own customers only |
| Customer.DELETE | ✅ | ❌ | ❌ | ❌ | ❌ | GF only |
| Customer.VIEW_FINANCIAL | ✅ | ❌ | ❌ | ❌ | ✅ | Financial data restricted |
| **Location (NEW)** |||||
| Location.READ | ✅ | ✅ | ✅ | ✅ | ✅ | All roles can view |
| Location.CREATE | ✅ | ✅ | ✅* | ❌ | ❌ | *ADM: Own customers only |
| Location.UPDATE | ✅ | ✅ | ✅* | ❌ | ❌ | *ADM: Own customers only |
| Location.DELETE | ✅ | ✅ | ❌ | ❌ | ❌ | Cannot delete if in use |
| Location.VIEW_ALL | ✅ | ✅ | ❌ | ✅ | ✅ | See all customer locations |
| Location.VIEW_ASSIGNED | ❌ | ❌ | ✅ | ❌ | ❌ | ADM sees only their customers' locations |
| **Contact (NEW)** |||||
| Contact.READ | ✅ | ✅ | ✅ | ✅ | ✅ | All roles can view |
| Contact.CREATE | ✅ | ✅ | ✅* | ❌ | ❌ | *ADM: Own customers only |
| Contact.UPDATE | ✅ | ✅ | ✅* | ❌ | ❌ | *ADM: Own customers only, basic info |
| Contact.DELETE | ✅ | ✅ | ❌ | ❌ | ❌ | |
| Contact.UPDATE_DECISION_ROLE | ✅ | ✅ | ❌ | ❌ | ❌ | **RESTRICTED: ADM+ only** |
| Contact.VIEW_AUTHORITY_LEVELS | ✅ | ✅ | ✅ | ✅ | ✅ | All can view decision roles |

**Legend:**
- ✅ = Full permission
- ✅* = Conditional permission (see notes)
- ❌ = No permission

---

## 8. Record-Level Permissions

### Ownership Model

**ADM (Sales Field Agents) - Ownership Rules:**

ADM users work with an **ownership model**:
1. **Own Customers:** Customers where `customer.owner = user.id`
   - Full READ/WRITE access
   - Can view all data including notes, opportunities, projects
   - Can create/update locations
   - Can create/update contacts (basic info only, not decision roles)

2. **Other Customers:** Customers owned by other ADM users
   - Read-only access to basic information:
     - Company name
     - Address (billing only, not all locations)
     - Phone, email
     - Industry, customer type
   - **CANNOT** see:
     - Financial data (credit limit, payment terms)
     - Margin calculations
     - Detailed project financials
     - Internal notes

### Location Assignment Model

**Contact-Location Assignment:**

Contacts can be assigned to specific locations via `assignedLocationIds`:
- ADM users see locations for their customers
- Contacts assigned as `primaryContactPersonId` for a location have enhanced visibility
- Location-specific permissions cascade from customer permissions

### Field-Level Filtering

**Example: Filtering Customer Data for ADM (Non-Owner):**

```typescript
function filterCustomerForNonOwner(customer: Customer): Partial<Customer> {
  return {
    _id: customer._id,
    companyName: customer.companyName,
    billingAddress: customer.billingAddress, // Billing only
    email: customer.email,
    phone: customer.phone,
    website: customer.website,
    industry: customer.industry,
    customerType: customer.customerType,
    // EXCLUDE: creditLimit, paymentTerms, locations, contacts, financial data
  };
}
```

### Cascading Permissions

**Location → Customer:**
- To CREATE location, user needs `Customer.READ` on parent customer
- To UPDATE location, user needs `Customer.UPDATE` on parent customer (or location-level override)
- To DELETE location, user needs elevated permissions (PLAN/GF)

**Contact → Customer:**
- To CREATE contact, user needs `Customer.READ` on parent customer
- To UPDATE contact basic info, user needs `Customer.UPDATE` on parent customer
- To UPDATE decision roles, user needs `Contact.UPDATE_DECISION_ROLE` (PLAN/GF only)

---

## 9. Future Entity Permissions (Placeholders)

The following permission sets will be defined in future iterations:

### Opportunity Permissions (TBD)

```
Opportunity.READ         - All roles
Opportunity.CREATE       - GF, PLAN, ADM, KALK
Opportunity.UPDATE       - GF, PLAN, ADM (own), KALK
Opportunity.DELETE       - GF, PLAN
Opportunity.WIN          - GF, PLAN (close as won)
Opportunity.LOSE         - GF, PLAN, ADM (close as lost)
```

**Note:** Opportunity approval checks will use contact decision-making roles to warn if quote exceeds approval authority.

### Project Permissions (TBD)

```
Project.READ             - All roles
Project.CREATE           - GF, PLAN
Project.UPDATE           - GF, PLAN
Project.DELETE           - GF only
Project.VIEW_FINANCIAL   - GF, BUCH
Project.ASSIGN_LOCATION  - GF, PLAN (link project to delivery location)
```

### Invoice Permissions (TBD)

```
Invoice.READ             - GF, BUCH
Invoice.CREATE           - GF, BUCH
Invoice.UPDATE           - GF, BUCH (before finalization)
Invoice.DELETE           - GF only (only drafts)
Invoice.FINALIZE         - GF, BUCH (make immutable per GoBD)
Invoice.CORRECT          - GF only (post-finalization corrections)
```

### Activity/Protocol Permissions (TBD)

```
Activity.READ            - All roles
Activity.CREATE          - All roles
Activity.UPDATE          - Creator + GF, PLAN (within 24h)
Activity.DELETE          - GF only
```

---

## Document History

| Version | Date       | Author | Changes |
|---------|------------|--------|---------|
| 1.0     | 2025-01-28 | System | Initial specification: Role definitions, Customer/Location/Contact permissions, permission matrix, record-level rules, decision-making role restrictions |

---

**End of RBAC_PERMISSION_MATRIX.md**

