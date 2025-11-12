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
2. [Multiple Roles Per User (NEW)](#2-multiple-roles-per-user-new)
3. [Hybrid RBAC Architecture (NEW)](#3-hybrid-rbac-architecture-new)
4. [Role Definitions](#4-role-definitions)
5. [Permission Model](#5-permission-model)
6. [Customer Permissions](#6-customer-permissions)
7. [Location Permissions](#7-location-permissions)
8. [Contact Permissions](#8-contact-permissions)
9. [Permission Matrix](#9-permission-matrix)
10. [Record-Level Permissions](#10-record-level-permissions)
11. [Role Assignment and Management](#11-role-assignment-and-management-new)
12. [Future Entity Permissions (Placeholders)](#12-future-entity-permissions-placeholders)

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

## 2. Multiple Roles Per User (NEW)

**Updated:** 2025-01-27  
**Status:** Planned for implementation

### Overview

KOMPASS will support **multiple roles per user** to accommodate real-world business scenarios where individuals perform multiple functions, especially in smaller organizations.

### User Role Model

```typescript
interface User {
  _id: string;
  email: string;
  displayName: string;
  
  // Multiple roles support
  roles: UserRole[];        // Array of assigned roles (e.g., ['ADM', 'PLAN'])
  primaryRole: UserRole;    // Default role for UI context (e.g., 'ADM')
  
  // ... other fields
}
```

### Permission Checking Logic

**OR Logic (Permissive):**
- A user has a permission if **ANY** of their roles grants that permission
- Example: User with roles `['ADM', 'PLAN']` can perform ANY action that either ADM OR PLAN can perform

```typescript
function hasPermission(
  roles: UserRole[],
  entity: EntityType,
  action: Permission
): boolean {
  // Check if ANY role has the permission
  return roles.some(role => {
    const rolePermissions = PERMISSION_MATRIX[role];
    return rolePermissions?.[entity]?.[action] === true;
  });
}
```

### Primary Role

The **primary role** determines:
- Default UI context and navigation
- Which dashboard the user sees on login
- Role badge displayed in the UI
- Default filtering and views

**Example:** User with roles `['ADM', 'PLAN']` and `primaryRole: 'ADM'`:
- Sees ADM dashboard by default
- Can switch to PLAN view via role selector
- Has combined permissions of both roles

### Use Cases

**Small Company Scenario:**
- One person acts as both INNEN (cost estimation) and BUCH (accounting)
- Roles: `['INNEN', 'BUCH']`, `primaryRole: 'INNEN'`
- Can create offers AND manage invoices

**Growing Company Scenario:**
- GF also performs sales activities in early stages
- Roles: `['GF', 'ADM']`, `primaryRole: 'GF'`
- Has full GF access but also appears in ADM lists

**Specialist Scenario:**
- Senior planner also handles complex cost estimation
- Roles: `['PLAN', 'KALK']`, `primaryRole: 'PLAN'`
- Can manage projects AND create detailed cost estimates

### Constraints

1. **Minimum One Role:** User must have at least one role
2. **Primary Role Validation:** `primaryRole` must be in `roles[]` array
3. **Role Compatibility:** Certain role combinations may be restricted (TBD based on business rules)
4. **Audit Trail:** All role assignments/revocations are logged with reason and timestamp

### UI Considerations

**Role Switcher:**
- Top-right corner near user avatar
- Dropdown showing all user's roles
- Current role highlighted
- Switching role updates dashboard, navigation, filters

**Permission Indicators:**
- Show combined permissions in user profile
- "Via ADM role" or "Via PLAN role" annotations in permission lists
- Clear indication of which role grants which permission

### API Impact

**Endpoints:**
- `PUT /api/v1/users/:userId/roles` - Assign multiple roles (GF/ADMIN only)
- `DELETE /api/v1/users/:userId/roles/:roleId` - Revoke specific role
- `PUT /api/v1/users/:userId/primary-role` - Change primary role (user can do for self)

**Authorization Checks:**
- All existing `@RequirePermission` decorators automatically support multiple roles
- Record-level checks (e.g., ADM ownership) apply based on ANY applicable role

---

## 3. Hybrid RBAC Architecture (NEW)

**Updated:** 2025-01-27  
**Status:** Planned for implementation

### Overview

KOMPASS will use a **hybrid RBAC architecture** that combines:
1. **Static TypeScript definitions** for compile-time safety and defaults
2. **Dynamic CouchDB storage** for runtime configuration and flexibility

### Architecture Components

#### Static Layer (Compile-Time)

**Purpose:** Type safety, IDE autocomplete, default fallback

**Location:** `packages/shared/src/constants/rbac.constants.ts`

```typescript
// TypeScript enums remain for type safety
export enum UserRole {
  GF = 'GF',
  PLAN = 'PLAN',
  ADM = 'ADM',
  INNEN = 'INNEN',
  KALK = 'KALK',
  BUCH = 'BUCH',
}

export enum EntityType {
  Customer = 'Customer',
  Project = 'Project',
  // ... etc
}

export enum Permission {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  // ... etc
}

// Static permission matrix as fallback
export const PERMISSION_MATRIX: Record<UserRole, EntityPermissions> = {
  // ... default permissions
};
```

#### Dynamic Layer (Runtime)

**Purpose:** Configurable permissions without code deployment

**CouchDB Documents:**

```typescript
// Role configuration document
{
  _id: 'role-plan',
  type: 'role',
  roleId: 'PLAN',
  name: 'Planungsabteilung',
  description: 'Planning/design team for project execution',
  permissions: {
    Customer: { READ: true, CREATE: false, UPDATE: false, DELETE: false },
    Project: { READ: true, CREATE: false, UPDATE: true, DELETE: false },
    Task: { READ: true, CREATE: true, UPDATE: true, DELETE: true },
    // ... entity permissions
  },
  active: true,
  priority: 50,
  version: 1,
  createdAt: '2025-01-27T...',
  modifiedBy: 'admin-user-id'
}

// Permission matrix version document
{
  _id: 'permission-matrix-v2.0',
  type: 'permission_matrix',
  version: '2.0',
  effectiveDate: '2025-02-01T00:00:00Z',
  matrix: {
    GF: { /* full permissions */ },
    PLAN: { /* limited permissions */ },
    // ... all roles
  },
  previousVersion: 'permission-matrix-v1.0',
  changelog: 'Added Invoice.APPROVE permission for BUCH role',
  createdBy: 'admin-user-id',
  createdAt: '2025-01-27T...'
}
```

### Permission Resolution Flow

```typescript
// RbacGuard checks permissions at runtime
@Injectable()
export class RbacGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = context.switchToHttp().getRequest().user;
    const requiredPermission = this.reflector.get('permission', context.getHandler());
    
    // 1. Fetch runtime permission matrix from CouchDB
    let permissionMatrix: PermissionMatrix;
    try {
      permissionMatrix = await this.roleService.getActivePermissionMatrix();
    } catch (error) {
      // 2. Fallback to static matrix if database unavailable
      console.warn('Using static permission matrix (DB unavailable)');
      permissionMatrix = PERMISSION_MATRIX;
    }
    
    // 3. Check if ANY of user's roles has the required permission
    return hasPermission(user.roles, requiredPermission.entity, requiredPermission.action, permissionMatrix);
  }
}
```

### Sync Mechanism

**Code to Database:**
- On application startup, check if role definitions exist in CouchDB
- If missing or outdated, seed from static `PERMISSION_MATRIX`
- Log differences between code and database

**Database to Code:**
- Runtime permission checks ALWAYS use database matrix (with fallback)
- Changes in database take effect immediately (no restart required)
- Static matrix serves as documentation and type definitions

**Conflict Resolution:**
- Database matrix overrides static matrix at runtime
- If database matrix missing/corrupted, use static fallback
- Admin can "reset to defaults" which copies static matrix to database

### Benefits

**Flexibility:**
- Adjust permissions without code deployment
- Test permission changes in staging before production
- Emergency permission revocation without restart

**Safety:**
- Static enums prevent typos (compile-time checking)
- Fallback ensures system never breaks if database unavailable
- Permission changes require admin authentication and are audited

**Scalability:**
- Multi-tenant support (different permission matrices per tenant)
- A/B testing of permission models
- Gradual rollout of permission changes

### Admin UI

**Permission Matrix Editor:**
- Visual table: Entities (rows) × Roles (columns)
- Checkboxes for each permission
- "Reset to defaults" button (copies from static matrix)
- "Preview changes" before applying
- Requires ADMIN role to access

**Audit Log:**
- All permission matrix changes logged
- Shows: Who, When, What changed, Why (reason field)
- Ability to revert to previous version

**Role Configuration:**
- Create custom roles (beyond the 5 standard roles)
- Clone existing role as starting point
- Set role priority for conflict resolution

### Migration Path

**Phase 1 (MVP):**
- Implement multiple roles support in User entity
- Keep using static `PERMISSION_MATRIX` only

**Phase 2 (Post-MVP):**
- Implement `Role` and `PermissionMatrix` entities in CouchDB
- Create RoleService to fetch runtime permissions
- Update RbacGuard to use runtime matrix with fallback
- Seed database with static matrix on first run

**Phase 3 (Future):**
- Build admin UI for permission matrix editing
- Implement audit log viewer
- Add custom role creation

---

## 4. Role Definitions

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
- **Access Level:** Full access to projects and tasks; **read-only** access to customers (project-related); limited financial data access
- **Key Restrictions:** Cannot create/edit/delete customers; cannot approve large offers; cannot access full financial data
- **User Count:** 5-8 users
- **Examples:** Interior Designers, Project Planners, Technical Architects
- **Note:** PLAN is an **internal service role** that executes projects after sales handoff, not a sales or customer management role

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
| `Customer.CREATE` | Create new customers | GF, INNEN, ADM |
| `Customer.UPDATE` | Modify customer information | GF, INNEN, ADM (own only) |
| `Customer.DELETE` | Delete/archive customers | GF only |
| `Customer.VIEW_FINANCIAL` | View financial data (credit limit, payment terms) | GF, BUCH |

**Note:** PLAN role has READ-ONLY access to customers for project-related needs. They cannot create, update, or delete customers.

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
| `Location.CREATE` | Create new locations for customer | GF, INNEN, PLAN, ADM (own customers) |
| `Location.UPDATE` | Modify location information | GF, INNEN, PLAN, ADM (own customers) |
| `Location.DELETE` | Remove locations | GF, INNEN |
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

## 9. Permission Matrix

**Corrected Permission Matrix (Updated 2025-01-27):**

| Entity | Action | GF | PLAN | INNEN | ADM | KALK | BUCH |
|--------|--------|----|----|-------|-----|------|------|
| **Customer** | READ | ✅ All | ✅ All (read-only) | ✅ All | ✅ All (own full, others basic) | ✅ All | ✅ All |
| | CREATE | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| | UPDATE | ✅ | ❌ | ✅ | ✅ (own only) | ❌ | ❌ |
| | DELETE | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Location** | READ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | CREATE | ✅ | ✅ | ✅ | ✅ (own customers) | ❌ | ❌ |
| | UPDATE | ✅ | ✅ | ✅ | ✅ (own customers) | ❌ | ❌ |
| | DELETE | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Contact** | READ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| | CREATE | ✅ | ✅ | ✅ | ✅ (own customers) | ❌ | ❌ |
| | UPDATE | ✅ (all fields) | ✅ (including decision) | ✅ | ✅ (basic, own customers) | ❌ | ❌ |
| | DELETE | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Project** | READ | ✅ | ✅ All | ✅ | ✅ | ✅ | ✅ |
| | CREATE | ✅ | ❌ (from oppty) | ❌ | ❌ | ❌ | ❌ |
| | UPDATE | ✅ | ✅ (assigned) | ❌ | ❌ | ❌ | ❌ |
| | DELETE | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Invoice** | READ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| | CREATE | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| | UPDATE | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ (pre-final) |
| | DELETE | ✅ (drafts) | ❌ | ❌ | ❌ | ❌ | ❌ |

**Key:**
- ✅ = Permission granted
- ❌ = Permission denied
- (own only) = Only for records user owns
- (own customers) = Only for locations/contacts of owned customers
- (assigned) = Only for projects where user is assigned
- INNEN = Internal Sales / Cost Estimation (previously sometimes called KALK)

---

## 10. Record-Level Permissions

### Multiple Roles Impact on Record-Level Permissions

When a user has multiple roles, record-level permissions are evaluated using **OR logic**:

**Example:** User has roles `['ADM', 'PLAN']`
- Can access **own customers** (via ADM role)
- Can also access **all customers read-only** (via PLAN role)
- Can edit **assigned projects** (via PLAN role)
- Effectively has permissions from both roles combined

### Ownership Model

Ownership applies primarily to **ADM** role:
- ADM owns customers they created or were assigned
- ADM can only UPDATE/DELETE their own customers
- ADM can only create/edit locations/contacts for own customers

If user has ADM + another role (e.g., PLAN), they retain ADM ownership restrictions for customer editing but gain PLAN's broader read access.

---

## 11. Role Assignment and Management (NEW)

**Updated:** 2025-01-27  
**Status:** Planned for implementation

### Role Assignment Permissions

| Permission | Description | Who Has It |
|------------|-------------|------------|
| `User.READ_ROLES` | View user's assigned roles | GF, ADMIN, Self |
| `User.ASSIGN_ROLES` | Assign roles to users | GF, ADMIN only |
| `User.REVOKE_ROLES` | Remove roles from users | GF, ADMIN only |
| `User.CHANGE_PRIMARY_ROLE` | Change primary role | Self (from own roles), GF, ADMIN |
| `Role.READ` | View role definitions | All roles |
| `Role.UPDATE_PERMISSIONS` | Modify permission matrix | ADMIN only |

### Role Assignment Rules

1. **Who Can Assign Roles:**
   - Only **GF** and **ADMIN** can assign/revoke roles
   - Users can change their own `primaryRole` (must be in `roles[]` array)

2. **Validation:**
   - User must have at least one role (cannot revoke all roles)
   - `primaryRole` must be in `roles[]` array
   - Role assignment requires reason (audit trail)

3. **Audit Trail:**
   - All role assignments logged with: who, when, which roles, why
   - All role revocations logged with: who, when, which role, why
   - Permission matrix changes logged with: who, when, what changed, why

### Role Assignment API

```typescript
// Assign multiple roles to user
PUT /api/v1/users/:userId/roles
{
  "roles": ["ADM", "PLAN"],
  "primaryRole": "ADM",
  "reason": "User now handles both sales and project planning"
}

// Revoke specific role
DELETE /api/v1/users/:userId/roles/:roleId
{
  "reason": "User transferred to different department"
}

// Change primary role (user can do for self)
PUT /api/v1/users/:userId/primary-role
{
  "primaryRole": "PLAN"  // Must be in user's roles[]
}
```

### Role Assignment Business Rules

1. **GF Role:**
   - Can only be assigned by existing GF or ADMIN
   - Requires special approval (security consideration)

2. **ADMIN Role:**
   - Can only be assigned/revoked by GF
   - Cannot revoke own ADMIN role (prevent lockout)

3. **Role Combinations:**
   - Most combinations allowed (e.g., ADM + PLAN, INNEN + BUCH)
   - Some combinations may be restricted (TBD based on business needs)

4. **Automatic Role Transitions:**
   - When user leaves company: All roles set to inactive (soft delete)
   - When user changes department: Roles updated with reason logged

### Permission Matrix Management

**Who Can Modify:**
- Only **ADMIN** role can modify the permission matrix
- GF can request changes but cannot directly edit

**Change Process:**
1. ADMIN accesses permission matrix editor
2. Makes changes (e.g., grant BUCH role Invoice.APPROVE permission)
3. Provides reason for change
4. System creates new permission matrix version
5. Change takes effect immediately (no restart needed)
6. All users see updated permissions on next request

**Rollback:**
- Admin can revert to previous matrix version
- Shows diff of what changed
- Requires reason for rollback

### UI Components

**Role Badge (User Profile):**
```
Michael Schmidt (ADM, PLAN)
Primary: Außendienst
```

**Role Switcher (Dropdown):**
```
Currently: Außendienst (ADM) ✓
Switch to: Planung (PLAN)
```

**Role Assignment Dialog (Admin Only):**
- Multi-select checkboxes for roles
- Primary role dropdown (from selected roles)
- Reason text area (required)
- Preview of combined permissions
- Save/Cancel buttons

**Permission Matrix Editor (Admin Only):**
- Table: Entities (rows) × Roles (columns)
- Checkboxes for each permission
- Color coding: Green (granted), Red (denied)
- "Reset to defaults" button
- Audit log viewer below table

---

## 12. Future Entity Permissions (Placeholders)

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
| 1.1     | 2025-01-27 | System | Added multiple roles per user support, hybrid RBAC architecture, role assignment/management section, corrected PLAN role permissions (read-only customers), updated permission matrix |

---

**End of RBAC_PERMISSION_MATRIX.md**

