# RBAC Permissions Matrix

**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Status:** ✅ Finalized

## Cross-References

- **Data Model:** `docs/specifications/data-model.md` - Entity definitions
- **API Specification:** `docs/specifications/api-specification.md` - Endpoint permission requirements
- **Architecture Rules:** `.cursor/rules/*.mdc` - RBAC enforcement patterns

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
  roles: UserRole[]; // Array of assigned roles (e.g., ['ADM', 'PLAN'])
  primaryRole: UserRole; // Default role for UI context (e.g., 'ADM')

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
  action: Permission,
): boolean {
  // Check if ANY role has the permission
  return roles.some((role) => {
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
  GF = "GF",
  PLAN = "PLAN",
  ADM = "ADM",
  INNEN = "INNEN",
  KALK = "KALK",
  BUCH = "BUCH",
}

export enum EntityType {
  Customer = "Customer",
  Project = "Project",
  // ... etc
}

export enum Permission {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
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
    const requiredPermission = this.reflector.get(
      "permission",
      context.getHandler(),
    );

    // 1. Fetch runtime permission matrix from CouchDB
    let permissionMatrix: PermissionMatrix;
    try {
      permissionMatrix = await this.roleService.getActivePermissionMatrix();
    } catch (error) {
      // 2. Fallback to static matrix if database unavailable
      console.warn("Using static permission matrix (DB unavailable)");
      permissionMatrix = PERMISSION_MATRIX;
    }

    // 3. Check if ANY of user's roles has the required permission
    return hasPermission(
      user.roles,
      requiredPermission.entity,
      requiredPermission.action,
      permissionMatrix,
    );
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
- **Note:** ADM focuses on **field sales and customer relationships**, not internal project execution

### INNEN (Innendienst / Inside Sales)

- **Full Name:** Innendienst / Inside Sales & Customer Service
- **Description:** Internal sales team managing customers, opportunities, and offers from the office
- **Access Level:** Full access to **all** customers, opportunities, offers, and contracts; **read-only** access to projects
- **Key Responsibilities:** Customer management, opportunity qualification, offer creation, contract negotiation
- **Key Restrictions:** Cannot manage project execution (tasks, time entries, project costs); read-only project access for customer context
- **User Count:** 3-5 users
- **Examples:** Inside Sales Representatives, Customer Service Managers, Sales Coordinators
- **Handover Point:** INNEN hands off won contracts to PLAN for project execution

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

## 4.1. Role Boundaries: INNEN vs. PLAN (NEW - Phase 1 MVP)

**Critical Distinction:** INNEN and PLAN are **separate roles** with distinct responsibilities and a clear handover workflow.

### INNEN (Inside Sales) - Pre-Sales Focus

**Responsibilities:**

- Customer relationship management (all customers, not just own)
- Opportunity qualification and pipeline management
- Offer creation and contract negotiation
- Tour planning coordination (Phase 2)

**Access:**

- ✅ **Full CRUD** on Customers, Locations, Contacts
- ✅ **Full CRUD** on Opportunities, Offers, Contracts
- ✅ **READ-ONLY** on Projects (for customer context)
- ❌ **NO ACCESS** to Project Tasks, Time Entries, Project Costs
- ✅ **Can create** UserTasks (personal to-dos)

**Handover Point:**

- Once a contract is signed → **INNEN hands off to PLAN**
- INNEN converts Opportunity → Offer → Contract
- PLAN converts Contract → Project

### PLAN (Planning/Execution) - Post-Sales Focus

**Responsibilities:**

- Project execution and delivery
- Task management and resource allocation
- Time tracking and cost management
- Project documentation and deliverables

**Access:**

- ✅ **Full CRUD** on Projects, ProjectTasks, TimeEntries, ProjectCosts
- ✅ **READ-ONLY** on Customers (for project context only)
- ✅ **READ-ONLY** on Contracts (to understand project scope)
- ❌ **NO ACCESS** to Opportunities, Offers (pre-sales)
- ❌ **CANNOT create/edit** Customers or Contracts
- ✅ **Can edit** Contacts (project-related updates, e.g., delivery coordinator)

**Handover Point:**

- Receives signed contract from INNEN
- Creates project from contract
- Manages project lifecycle until delivery

### Handover Workflow (INNEN → PLAN)

**Step 1: INNEN - Opportunity to Contract**

```typescript
1. INNEN creates Opportunity (status: "New")
2. INNEN qualifies → creates Offer
3. Customer accepts → INNEN creates Contract (signed)
4. Contract.status = "Active"
```

**Step 2: Handover (INNEN notifies PLAN)**

```typescript
5. System notification: "Contract C-2025-00042 ready for project creation"
6. INNEN assigns Project Manager (PLAN user) in contract
7. PLAN user receives notification
```

**Step 3: PLAN - Contract to Project**

```typescript
8. PLAN user converts Contract → Project
9. Project.contractId = contract._id (linked)
10. Project.status = "Planning"
11. PLAN creates ProjectTasks, assigns team
```

**Step 4: Ongoing Coordination**

- INNEN: Read-only project access for customer updates
- PLAN: Read-only contract access to verify scope
- Both can view/update shared Contacts (different purposes)

### Permission Conflicts (Multiple Roles)

If a user has **both INNEN and PLAN roles**:

- They can manage both pre-sales AND post-sales
- Primary role determines default dashboard
- UI shows role-switcher for context

**Example:** A small team member might have both roles to cover full sales-to-delivery cycle.

### Business Rules

**BR-RBAC-001: INNEN Cannot Manage Project Execution**

```typescript
if (user.role === "INNEN") {
  // Can view projects for customer context
  if (action === "READ" && entity === "Project") {
    return true;
  }

  // Cannot create/edit/delete projects, tasks, time entries, project costs
  if (
    ["CREATE", "UPDATE", "DELETE"].includes(action) &&
    ["Project", "ProjectTask", "TimeEntry", "ProjectCost"].includes(entity)
  ) {
    throw new ForbiddenException(
      "INNEN role cannot manage project execution. Contact PLAN team.",
    );
  }
}
```

**BR-RBAC-002: PLAN Cannot Manage Customers**

```typescript
if (user.role === "PLAN") {
  // Can view customers for project context
  if (action === "READ" && entity === "Customer") {
    return true;
  }

  // Cannot create/edit/delete customers
  if (
    ["CREATE", "UPDATE", "DELETE"].includes(action) &&
    entity === "Customer"
  ) {
    throw new ForbiddenException(
      "PLAN role cannot manage customers. Contact INNEN or ADM.",
    );
  }
}
```

**BR-RBAC-003: PLAN Cannot Manage Pre-Sales**

```typescript
if (user.role === "PLAN") {
  // Cannot access opportunities or offers
  if (
    ["READ", "CREATE", "UPDATE", "DELETE"].includes(action) &&
    ["Opportunity", "Offer"].includes(entity)
  ) {
    throw new ForbiddenException(
      "PLAN role cannot manage opportunities or offers. Contact INNEN.",
    );
  }

  // Can READ contracts (for project scope), but cannot CREATE/UPDATE/DELETE
  if (
    ["CREATE", "UPDATE", "DELETE"].includes(action) &&
    entity === "Contract"
  ) {
    throw new ForbiddenException(
      "PLAN role cannot manage contracts. Contact INNEN or GF.",
    );
  }
}
```

### UI Indicators

**INNEN Dashboard:**

- Shows: Pipeline, Opportunities, Offers, Active Contracts
- Shows: Project status overview (read-only, for customer updates)
- Hides: Project tasks, time entries, project costs details

**PLAN Dashboard:**

- Shows: Active Projects, Tasks, Time Entries, Resource Allocation
- Shows: Customer info (read-only, for contact details)
- Hides: Opportunities, Offers, Contract negotiation

**Shared Views:**

- Customer Detail: INNEN (edit all), PLAN (read-only)
- Project Detail: PLAN (edit all), INNEN (read-only)
- Contact Detail: Both can edit (different use cases)

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

| Action                    | Description                                    | Examples                                        |
| ------------------------- | ---------------------------------------------- | ----------------------------------------------- |
| `READ`                    | View/retrieve entity data                      | List customers, view customer details           |
| `CREATE`                  | Create new entity records                      | Add new customer, create location               |
| `UPDATE`                  | Modify existing entity records                 | Update customer address, change location status |
| `DELETE`                  | Remove entity records                          | Delete location, archive customer               |
| `UPDATE_DECISION_ROLE`    | Special: Update contact decision-making fields | Change contact approval authority               |
| `VIEW_ALL_LOCATIONS`      | Special: View all customer locations           | See all locations regardless of assignment      |
| `VIEW_ASSIGNED_LOCATIONS` | Special: View only assigned locations          | See only locations where user is assigned       |

---

## 4. Customer Permissions

### Customer Entity Actions

| Permission                | Description                                       | Who Has It                |
| ------------------------- | ------------------------------------------------- | ------------------------- |
| `Customer.READ`           | View customer data                                | All roles                 |
| `Customer.CREATE`         | Create new customers                              | GF, INNEN, ADM            |
| `Customer.UPDATE`         | Modify customer information                       | GF, INNEN, ADM (own only) |
| `Customer.DELETE`         | Delete/archive customers                          | GF only                   |
| `Customer.VIEW_FINANCIAL` | View financial data (credit limit, payment terms) | GF, BUCH                  |

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

| Permission               | Description                                 | Who Has It                           |
| ------------------------ | ------------------------------------------- | ------------------------------------ |
| `Location.READ`          | View location data                          | All roles                            |
| `Location.CREATE`        | Create new locations for customer           | GF, INNEN, PLAN, ADM (own customers) |
| `Location.UPDATE`        | Modify location information                 | GF, INNEN, PLAN, ADM (own customers) |
| `Location.DELETE`        | Remove locations                            | GF, INNEN                            |
| `Location.VIEW_ALL`      | View all locations regardless of assignment | GF, PLAN, KALK, BUCH                 |
| `Location.VIEW_ASSIGNED` | View only assigned locations                | ADM (locations for their customers)  |

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

| Permission                      | Description                                    | Who Has It                     |
| ------------------------------- | ---------------------------------------------- | ------------------------------ |
| `Contact.READ`                  | View contact data                              | All roles                      |
| `Contact.CREATE`                | Create new contacts                            | GF, PLAN, ADM (own customers)  |
| `Contact.UPDATE`                | Modify contact basic information               | GF, PLAN, ADM (own customers)  |
| `Contact.DELETE`                | Remove contacts                                | GF, PLAN                       |
| `Contact.UPDATE_DECISION_ROLE`  | **Update decision-making roles and authority** | **GF, PLAN only** (restricted) |
| `Contact.VIEW_AUTHORITY_LEVELS` | View decision-making roles and approval limits | All roles                      |

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

| Entity.Action                 | GF  | PLAN | ADM  | KALK | BUCH | Notes                                    |
| ----------------------------- | --- | ---- | ---- | ---- | ---- | ---------------------------------------- |
| **Customer**                  |     |      |      |      |
| Customer.READ                 | ✅  | ✅   | ✅   | ✅   | ✅   | ADM: Own full, others basic              |
| Customer.CREATE               | ✅  | ✅   | ✅   | ❌   | ❌   |                                          |
| Customer.UPDATE               | ✅  | ✅   | ✅\* | ❌   | ❌   | \*ADM: Own customers only                |
| Customer.DELETE               | ✅  | ❌   | ❌   | ❌   | ❌   | GF only                                  |
| Customer.VIEW_FINANCIAL       | ✅  | ❌   | ❌   | ❌   | ✅   | Financial data restricted                |
| **Location (NEW)**            |     |      |      |      |
| Location.READ                 | ✅  | ✅   | ✅   | ✅   | ✅   | All roles can view                       |
| Location.CREATE               | ✅  | ✅   | ✅\* | ❌   | ❌   | \*ADM: Own customers only                |
| Location.UPDATE               | ✅  | ✅   | ✅\* | ❌   | ❌   | \*ADM: Own customers only                |
| Location.DELETE               | ✅  | ✅   | ❌   | ❌   | ❌   | Cannot delete if in use                  |
| Location.VIEW_ALL             | ✅  | ✅   | ❌   | ✅   | ✅   | See all customer locations               |
| Location.VIEW_ASSIGNED        | ❌  | ❌   | ✅   | ❌   | ❌   | ADM sees only their customers' locations |
| **Contact (NEW)**             |     |      |      |      |
| Contact.READ                  | ✅  | ✅   | ✅   | ✅   | ✅   | All roles can view                       |
| Contact.CREATE                | ✅  | ✅   | ✅\* | ❌   | ❌   | \*ADM: Own customers only                |
| Contact.UPDATE                | ✅  | ✅   | ✅\* | ❌   | ❌   | \*ADM: Own customers only, basic info    |
| Contact.DELETE                | ✅  | ✅   | ❌   | ❌   | ❌   |                                          |
| Contact.UPDATE_DECISION_ROLE  | ✅  | ✅   | ❌   | ❌   | ❌   | **RESTRICTED: ADM+ only**                |
| Contact.VIEW_AUTHORITY_LEVELS | ✅  | ✅   | ✅   | ✅   | ✅   | All can view decision roles              |

**Legend:**

- ✅ = Full permission
- ✅\* = Conditional permission (see notes)
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

| Entity          | Action      | GF                   | PLAN                    | INNEN                  | ADM                             | KALK             | BUCH              |
| --------------- | ----------- | -------------------- | ----------------------- | ---------------------- | ------------------------------- | ---------------- | ----------------- |
| **Customer**    | READ        | ✅ All               | ✅ All (read-only)      | ✅ All                 | ✅ All (own full, others basic) | ✅ All           | ✅ All            |
|                 | CREATE      | ✅                   | ❌                      | ✅                     | ✅                              | ❌               | ❌                |
|                 | UPDATE      | ✅                   | ❌                      | ✅                     | ✅ (own only)                   | ❌               | ❌                |
|                 | DELETE      | ✅                   | ❌                      | ❌                     | ❌                              | ❌               | ❌                |
| **Location**    | READ        | ✅                   | ✅                      | ✅                     | ✅                              | ✅               | ✅                |
|                 | CREATE      | ✅                   | ✅                      | ✅                     | ✅ (own customers)              | ❌               | ❌                |
|                 | UPDATE      | ✅                   | ✅                      | ✅                     | ✅ (own customers)              | ❌               | ❌                |
|                 | DELETE      | ✅                   | ❌                      | ✅                     | ❌                              | ❌               | ❌                |
| **Contact**     | READ        | ✅                   | ✅                      | ✅                     | ✅                              | ✅               | ✅                |
|                 | CREATE      | ✅                   | ✅                      | ✅                     | ✅ (own customers)              | ❌               | ❌                |
|                 | UPDATE      | ✅ (all fields)      | ✅ (including decision) | ✅                     | ✅ (basic, own customers)       | ❌               | ❌                |
|                 | DELETE      | ✅                   | ❌                      | ✅                     | ❌                              | ❌               | ❌                |
| **Project**     | READ        | ✅                   | ✅ All                  | ✅                     | ✅                              | ✅               | ✅                |
|                 | CREATE      | ✅                   | ❌ (from oppty)         | ❌                     | ❌                              | ❌               | ❌                |
|                 | UPDATE      | ✅                   | ✅ (assigned)           | ❌                     | ❌                              | ❌               | ❌                |
|                 | DELETE      | ✅                   | ❌                      | ❌                     | ❌                              | ❌               | ❌                |
| **Invoice**     | READ        | ✅                   | ❌                      | ✅                     | ❌                              | ❌               | ✅                |
|                 | CREATE      | ✅                   | ❌                      | ❌                     | ❌                              | ❌               | ✅                |
|                 | UPDATE      | ✅                   | ❌                      | ❌                     | ❌                              | ❌               | ✅ (pre-final)    |
|                 | DELETE      | ✅ (drafts)          | ❌                      | ❌                     | ❌                              | ❌               | ❌                |
| **TimeEntry**   | READ        | ✅ All               | ✅ (own + project)      | ✅ (own)               | ❌                              | ✅ All           | ✅ All            |
|                 | CREATE      | ✅                   | ✅ (assigned projects)  | ✅                     | ❌                              | ❌               | ❌                |
|                 | UPDATE      | ✅                   | ✅ (own, pre-approved)  | ✅ (own, pre-approved) | ❌                              | ❌               | ❌                |
|                 | DELETE      | ✅                   | ✅ (own, pre-approved)  | ✅ (own, pre-approved) | ❌                              | ❌               | ❌                |
|                 | **APPROVE** | ✅ All               | ✅ (project team)       | ❌                     | ❌                              | ❌               | ❌                |
| **ProjectCost** | READ        | ✅ All               | ✅ (assigned projects)  | ❌                     | ❌                              | ✅ All           | ✅ All            |
|                 | CREATE      | ✅                   | ✅                      | ❌                     | ❌                              | ✅ (estimation)  | ❌                |
|                 | UPDATE      | ✅                   | ✅ (pre-paid)           | ❌                     | ❌                              | ✅ (pre-ordered) | ✅ (payment only) |
|                 | DELETE      | ✅ (planned/ordered) | ✅ (planned/ordered)    | ❌                     | ❌                              | ❌               | ❌                |
|                 | **APPROVE** | ✅ All               | ✅ (<€500)              | ❌                     | ❌                              | ❌               | ❌                |

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

| Permission                 | Description                | Who Has It                       |
| -------------------------- | -------------------------- | -------------------------------- |
| `User.READ_ROLES`          | View user's assigned roles | GF, ADMIN, Self                  |
| `User.ASSIGN_ROLES`        | Assign roles to users      | GF, ADMIN only                   |
| `User.REVOKE_ROLES`        | Remove roles from users    | GF, ADMIN only                   |
| `User.CHANGE_PRIMARY_ROLE` | Change primary role        | Self (from own roles), GF, ADMIN |
| `Role.READ`                | View role definitions      | All roles                        |
| `Role.UPDATE_PERMISSIONS`  | Modify permission matrix   | ADMIN only                       |

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

## 12. Task Management Permissions (NEW)

**Updated:** 2025-01-28  
**Status:** Planned for implementation (Phase 1 - MVP)

### UserTask Permissions

UserTask represents personal todo items and follow-up tasks for individual users.

| Permission                  | Description                  | Who Has It                            |
| --------------------------- | ---------------------------- | ------------------------------------- |
| `UserTask.READ`             | View user task data          | All roles (own tasks); GF (all tasks) |
| `UserTask.CREATE`           | Create new user tasks        | All roles                             |
| `UserTask.UPDATE`           | Modify user task information | All roles (own tasks); GF (all tasks) |
| `UserTask.DELETE`           | Delete user tasks            | All roles (own tasks); GF (all tasks) |
| `UserTask.ASSIGN_TO_OTHERS` | Assign tasks to other users  | GF, PLAN only                         |

**Record-Level Rules:**

- **All Users:** Can CREATE/READ/UPDATE/DELETE their own UserTasks (where `assignedTo = user.id`)
- **GF:** Can view and manage ALL UserTasks across all users (for oversight and delegation)
- **PLAN:** Can assign UserTasks to other users (project coordination)
- **ADM, INNEN, KALK, BUCH:** Can only manage their own UserTasks

**Example Permission Check:**

```typescript
async findUserTask(taskId: string, user: User): Promise<UserTask> {
  const task = await this.repository.findById(taskId);

  // Check if user can access this task
  if (task.assignedTo !== user.id && !user.roles.includes('GF')) {
    throw new ForbiddenException('You can only view your own tasks');
  }

  return task;
}
```

### ProjectTask Permissions

ProjectTask represents work items within a project context.

| Permission           | Description                     | Who Has It                                                 |
| -------------------- | ------------------------------- | ---------------------------------------------------------- |
| `ProjectTask.READ`   | View project task data          | All roles (filtered by project access)                     |
| `ProjectTask.CREATE` | Create new project tasks        | GF, PLAN, INNEN/KALK                                       |
| `ProjectTask.UPDATE` | Modify project task information | GF (all); PLAN (assigned + own projects); INNEN/KALK (all) |
| `ProjectTask.DELETE` | Delete project tasks            | GF, PLAN; INNEN/KALK (own created)                         |
| `ProjectTask.ASSIGN` | Assign tasks to project team    | GF, PLAN, INNEN/KALK                                       |

**Record-Level Rules:**

- **GF:** Full access to all ProjectTasks across all projects
- **PLAN:** Can CREATE/UPDATE ProjectTasks for projects they're assigned to; can READ all ProjectTasks
- **INNEN/KALK:** Can CREATE/UPDATE/DELETE ProjectTasks for all projects (coordination role)
- **ADM:** Can READ ProjectTasks for projects linked to their customers (read-only)
- **BUCH:** Can READ all ProjectTasks (visibility for financial planning)

**Business Rules:**

1. **Project Access Requirement:** User can only create ProjectTask if they have `Project.READ` permission on parent project
2. **Assignee Validation:** Can only assign ProjectTask to users who have `Project.READ` permission on that project
3. **Phase Access:** Viewing tasks filtered by phase requires project access
4. **Cascade Permissions:** ProjectTask permissions cascade from parent Project permissions

**Example Permission Check:**

```typescript
async createProjectTask(
  projectId: string,
  taskDto: CreateProjectTaskDto,
  user: User
): Promise<ProjectTask> {
  // Verify user can access parent project
  const project = await this.projectService.findById(projectId, user);

  // Check ProjectTask.CREATE permission
  if (!hasPermission(user.roles, 'ProjectTask', 'CREATE')) {
    throw new ForbiddenException('No permission to create project tasks');
  }

  // Verify assignee has project access
  const assignee = await this.userRepo.findById(taskDto.assignedTo);
  if (!hasPermission(assignee.roles, 'Project', 'READ')) {
    throw new ValidationException(
      'Cannot assign task to user without project access'
    );
  }

  return this.repository.create({ ...taskDto, projectId });
}
```

### Complete Task Permission Matrix

| Entity.Action             | GF     | PLAN   | ADM    | INNEN/KALK | BUCH   |
| ------------------------- | ------ | ------ | ------ | ---------- | ------ |
| **UserTask**              |        |        |        |            |
| UserTask.READ             | ✅ All | ✅ Own | ✅ Own | ✅ Own     | ✅ Own |
| UserTask.CREATE           | ✅     | ✅     | ✅     | ✅         | ✅     |
| UserTask.UPDATE           | ✅ All | ✅ Own | ✅ Own | ✅ Own     | ✅ Own |
| UserTask.DELETE           | ✅ All | ✅ Own | ✅ Own | ✅ Own     | ✅ Own |
| UserTask.ASSIGN_TO_OTHERS | ✅     | ✅     | ❌     | ❌         | ❌     |
| **ProjectTask**           |        |        |        |            |
| ProjectTask.READ          | ✅ All | ✅ All | ✅\*   | ✅ All     | ✅ All |
| ProjectTask.CREATE        | ✅     | ✅     | ❌     | ✅         | ❌     |
| ProjectTask.UPDATE        | ✅ All | ✅\*\* | ❌     | ✅ All     | ❌     |
| ProjectTask.DELETE        | ✅     | ✅     | ❌     | ✅\*\*\*   | ❌     |
| ProjectTask.ASSIGN        | ✅     | ✅     | ❌     | ✅         | ❌     |

**Legend:**

- ✅ = Full permission
- ✅\* = ADM can READ ProjectTasks for projects linked to their customers only
- ✅\*\* = PLAN can UPDATE tasks for projects they're assigned to
- ✅\*\*\* = INNEN/KALK can DELETE only ProjectTasks they created
- ❌ = No permission

### Task-Specific Authorization Examples

**Example 1: ADM Viewing Project Tasks (Limited)**

```typescript
async listProjectTasks(projectId: string, user: User): Promise<ProjectTask[]> {
  const project = await this.projectService.findById(projectId, user);

  // ADM can only view if project is for their customer
  if (user.roles.includes('ADM') && !user.roles.includes('PLAN')) {
    const customer = await this.customerRepo.findById(project.customerId);
    if (customer.owner !== user.id) {
      throw new ForbiddenException('ADM can only view tasks for own customer projects');
    }
  }

  return this.repository.findByProject(projectId);
}
```

**Example 2: PLAN User Assigning Task**

```typescript
async assignProjectTask(
  taskId: string,
  assigneeId: string,
  user: User
): Promise<ProjectTask> {
  const task = await this.repository.findById(taskId);
  const project = await this.projectService.findById(task.projectId, user);

  // PLAN can only assign tasks for projects they're on
  if (user.roles.includes('PLAN') && !user.roles.includes('GF')) {
    if (project.projectManager !== user.id && !project.teamMembers?.includes(user.id)) {
      throw new ForbiddenException('PLAN can only assign tasks for their assigned projects');
    }
  }

  task.assignedTo = assigneeId;
  task.modifiedBy = user.id;
  task.modifiedAt = new Date();
  task.version += 1;

  return this.repository.update(task);
}
```

### Task Filtering by Role

**Dashboard Queries:**

```typescript
// "My Tasks" - Shows user's assigned tasks
async getMyTasks(user: User): Promise<{userTasks: UserTask[], projectTasks: ProjectTask[]}> {
  const userTasks = await this.userTaskRepo.findByAssignee(user.id);
  const projectTasks = await this.projectTaskRepo.findByAssignee(user.id);

  return { userTasks, projectTasks };
}

// "Team Tasks" - Shows tasks for user's team (GF, PLAN see all)
async getTeamTasks(user: User): Promise<ProjectTask[]> {
  if (user.roles.includes('GF')) {
    // GF sees all project tasks
    return this.projectTaskRepo.findAll();
  }

  if (user.roles.includes('PLAN')) {
    // PLAN sees tasks for assigned projects
    const assignedProjects = await this.projectRepo.findByTeamMember(user.id);
    return this.projectTaskRepo.findByProjects(assignedProjects.map(p => p._id));
  }

  if (user.roles.includes('INNEN') || user.roles.includes('KALK')) {
    // INNEN/KALK see all project tasks (coordination role)
    return this.projectTaskRepo.findAll();
  }

  // ADM, BUCH see tasks for accessible projects only
  const accessibleProjects = await this.projectRepo.findAccessibleByUser(user);
  return this.projectTaskRepo.findByProjects(accessibleProjects.map(p => p._id));
}
```

---

## 13. Future Entity Permissions (Placeholders)

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

| Version | Date       | Author | Changes                                                                                                                                                                                           |
| ------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | 2025-01-28 | System | Initial specification: Role definitions, Customer/Location/Contact permissions, permission matrix, record-level rules, decision-making role restrictions                                          |
| 1.1     | 2025-01-27 | System | Added multiple roles per user support, hybrid RBAC architecture, role assignment/management section, corrected PLAN role permissions (read-only customers), updated permission matrix             |
| 1.2     | 2025-01-28 | System | Added Task Management permissions (UserTask and ProjectTask), complete task permission matrix, record-level rules for task access, dashboard query patterns, task-specific authorization examples |

---

**End of RBAC_PERMISSION_MATRIX.md**

## 13. Tour Planning & Expense Management Permissions (NEW - Phase 2)

**Added:** 2025-01-28  
**Status:** Planned for Phase 2 (Q3 2025)  
**Purpose:** Define permissions for field sales tour planning and expense tracking

### Tour Permissions

Tour represents business trips with multiple customer visits.

| Permission        | Description                  | Who Has It                            |
| ----------------- | ---------------------------- | ------------------------------------- |
| `Tour.READ`       | View tour data               | All roles (filtered by ownership)     |
| `Tour.CREATE`     | Create new tours             | ADM, PLAN, GF                         |
| `Tour.UPDATE`     | Modify tour information      | ADM (own tours), PLAN (all), GF (all) |
| `Tour.DELETE`     | Delete tours                 | ADM (own, if status=planned), GF      |
| `Tour.ACTIVATE`   | Change tour status to active | ADM (own), PLAN, GF                   |
| `Tour.COMPLETE`   | Mark tour as completed       | ADM (own), PLAN, GF                   |
| `Tour.VIEW_COSTS` | View tour cost breakdown     | ADM (own), PLAN, GF, BUCH             |

**Record-Level Rules:**

**ADM (Sales Field Agents):**

- Can CREATE/UPDATE/DELETE/COMPLETE their own tours (where `tour.userId = user.id`)
- Can READ basic info for other users' tours (no cost details)
- Can only DELETE tours in 'planned' status
- Auto-suggested tours based on meeting locations

**PLAN (Planning):**

- Can READ all tours (for coordination)
- Can UPDATE/COMPLETE all tours (oversight)
- Can VIEW_COSTS for all tours (resource planning)

**GF (Management):**

- Full access to all tour operations
- Can view cost analytics and ROI reports

**BUCH (Accounting):**

- Can READ all tours
- Can VIEW_COSTS for expense reporting
- Cannot CREATE/UPDATE/DELETE tours

**Business Rules:**

**TR-PERM-001: Tour Completion Authorization**

- User can only mark tour as 'completed' if:
  - All meetings are attended or cancelled
  - User owns the tour OR has PLAN/GF role

**TR-PERM-002: Tour Deletion Restrictions**

- Can only delete tours in 'planned' status
- Cannot delete if expenses are linked
- GF can delete tours in any status

**Example Permission Check:**

```typescript
async completeTour(tourId: string, user: User): Promise<Tour> {
  const tour = await this.repository.findById(tourId);

  // Check ownership or elevated role
  if (tour.userId !== user.id && !user.roles.some(r => ['PLAN', 'GF'].includes(r))) {
    throw new ForbiddenException('You can only complete your own tours');
  }

  // Check if all meetings are complete
  const meetings = await this.meetingRepo.findByTour(tourId);
  const incompleteMeetings = meetings.filter(m => m.status === 'scheduled');
  if (incompleteMeetings.length > 0) {
    throw new ValidationException(
      `Cannot complete tour: ${incompleteMeetings.length} meetings are still scheduled`
    );
  }

  tour.status = 'completed';
  tour.completedAt = new Date();
  return this.repository.update(tour);
}
```

---

### Meeting Permissions

Meeting represents scheduled customer visits.

| Permission               | Description                  | Who Has It                              |
| ------------------------ | ---------------------------- | --------------------------------------- |
| `Meeting.READ`           | View meeting data            | All roles (filtered by customer access) |
| `Meeting.CREATE`         | Create new meetings          | ADM (own customers), PLAN, GF           |
| `Meeting.UPDATE`         | Modify meeting information   | ADM (own), PLAN, GF                     |
| `Meeting.DELETE`         | Delete meetings              | ADM (own, if status=scheduled), GF      |
| `Meeting.CHECK_IN`       | Check in at meeting location | ADM (own), PLAN                         |
| `Meeting.UPDATE_OUTCOME` | Update meeting outcome       | ADM (own), PLAN, GF                     |
| `Meeting.LINK_TOUR`      | Link meeting to tour         | ADM (own), PLAN, GF                     |

**Record-Level Rules:**

**ADM (Sales Field Agents):**

- Can CREATE meetings for their own customers
- Can UPDATE/DELETE meetings they created (before completion)
- Can CHECK_IN at meeting locations (GPS-validated)
- Can UPDATE_OUTCOME for attended meetings
- System auto-suggests tours for new meetings

**PLAN (Planning):**

- Can READ all meetings (coordination)
- Can UPDATE meetings for any customer
- Can CHECK_IN if conducting site visits

**GF (Management):**

- Full access to all meeting operations
- Can view meeting analytics and conversion rates

**Business Rules:**

**MT-PERM-001: Meeting Creation Requires Customer Access**

- User must have `Customer.READ` permission on parent customer
- ADM can only create meetings for own customers

**MT-PERM-002: Check-In Authorization**

- Check-in requires GPS validation (within 500m of location)
- User must be meeting owner or have PLAN/GF role
- Check-in auto-creates activity protocol entry

**MT-PERM-003: Outcome Update Window**

- Meeting outcome must be updated within 24h of meeting
- After 24h, only PLAN/GF can update outcome

**Example Permission Check:**

```typescript
async checkInToMeeting(
  meetingId: string,
  gpsCoordinates: GPSCoordinates,
  user: User
): Promise<Meeting> {
  const meeting = await this.repository.findById(meetingId);

  // Check ownership or elevated role
  if (meeting.userId !== user.id && !user.roles.some(r => ['PLAN', 'GF'].includes(r))) {
    throw new ForbiddenException('You can only check in to your own meetings');
  }

  // Validate GPS proximity (500m)
  const location = await this.locationRepo.findById(meeting.locationId);
  const distance = calculateGPSDistance(gpsCoordinates, location.gpsCoordinates);
  if (distance > 0.5) { // 500m
    throw new ValidationException(
      `Check-in failed: You are ${(distance * 1000).toFixed(0)}m away from the location. Must be within 500m.`
    );
  }

  meeting.checkInTime = new Date();
  meeting.checkInGPS = gpsCoordinates;
  meeting.status = 'in-progress';

  // Auto-create activity protocol
  await this.activityService.createFromCheckIn(meeting, user);

  return this.repository.update(meeting);
}
```

---

### HotelStay Permissions

HotelStay represents overnight accommodations during tours.

| Permission             | Description                   | Who Has It                                |
| ---------------------- | ----------------------------- | ----------------------------------------- |
| `HotelStay.READ`       | View hotel stay data          | All roles (filtered by tour ownership)    |
| `HotelStay.CREATE`     | Create new hotel stays        | ADM (own tours), PLAN, GF                 |
| `HotelStay.UPDATE`     | Modify hotel stay information | ADM (own tours), PLAN, GF                 |
| `HotelStay.DELETE`     | Delete hotel stays            | ADM (own tours, if no expense linked), GF |
| `HotelStay.VIEW_COSTS` | View hotel costs              | ADM (own), PLAN, GF, BUCH                 |

**Record-Level Rules:**

**ADM (Sales Field Agents):**

- Can CREATE/UPDATE hotel stays for their own tours
- Can DELETE if no expense is linked
- Can VIEW_COSTS for own hotel stays
- Hotel preferences tracked for future suggestions

**PLAN (Planning):**

- Can READ all hotel stays (travel coordination)
- Can VIEW_COSTS for all stays

**GF (Management):**

- Full access to all hotel stay operations
- Can view hotel spending analytics

**BUCH (Accounting):**

- Can READ and VIEW_COSTS for all hotel stays
- Used for expense reporting and reimbursement

**Business Rules:**

**HS-PERM-001: Hotel Stay Creation Requires Tour**

- Hotel stay must be linked to an existing tour
- User must own the tour OR have PLAN/GF role

**HS-PERM-002: Deletion Restrictions**

- Cannot delete if linked to an approved/paid expense
- GF can override and delete with reason

**Example Permission Check:**

```typescript
async createHotelStay(
  tourId: string,
  hotelDto: CreateHotelStayDto,
  user: User
): Promise<HotelStay> {
  const tour = await this.tourRepo.findById(tourId);

  // Check tour ownership or elevated role
  if (tour.userId !== user.id && !user.roles.some(r => ['PLAN', 'GF'].includes(r))) {
    throw new ForbiddenException('You can only add hotel stays to your own tours');
  }

  // Create hotel stay
  const hotelStay = await this.repository.create({
    ...hotelDto,
    tourId,
    userId: user.id,
  });

  // Add to user's hotel preferences if rated
  if (hotelDto.rating && hotelDto.rating >= 4) {
    await this.userPreferenceService.addPreferredHotel(user.id, hotelStay);
  }

  return hotelStay;
}
```

---

### Expense Permissions with Approval Workflow

Expense represents business expenses requiring approval.

| Permission          | Description                 | Who Has It                                 |
| ------------------- | --------------------------- | ------------------------------------------ |
| `Expense.READ`      | View expense data           | All roles (filtered by ownership/approval) |
| `Expense.CREATE`    | Create new expenses         | All roles                                  |
| `Expense.UPDATE`    | Modify expense information  | Expense owner (if draft/rejected), GF      |
| `Expense.DELETE`    | Delete expenses             | Expense owner (if draft), GF               |
| `Expense.SUBMIT`    | Submit expense for approval | Expense owner                              |
| `Expense.APPROVE`   | Approve submitted expenses  | GF only                                    |
| `Expense.REJECT`    | Reject submitted expenses   | GF only                                    |
| `Expense.MARK_PAID` | Mark expense as paid        | BUCH, GF                                   |
| `Expense.VIEW_ALL`  | View all expenses           | GF, BUCH                                   |

**Record-Level Rules:**

**All Users:**

- Can CREATE expenses for their own work (tours, meetings, projects)
- Can UPDATE/DELETE own expenses in 'draft' status
- Can SUBMIT own expenses for approval
- Can READ own expenses in all statuses

**GF (Management):**

- Full access to all expense operations
- Can APPROVE/REJECT any expense
- Can override and edit any expense with reason
- Auto-approval for expenses < €25 (configurable)

**BUCH (Accounting):**

- Can READ all submitted/approved/paid expenses
- Can MARK_PAID once expense is reimbursed
- Cannot CREATE/UPDATE/DELETE expenses

**PLAN (Planning):**

- Can READ expenses for projects they manage
- Cannot APPROVE expenses

**Business Rules:**

**EX-PERM-001: Expense Approval Thresholds**

- Expenses ≤ €25: Auto-approved (no receipt required for mileage)
- Expenses €25-€100: GF approval required + receipt required
- Expenses > €100: GF approval required + receipt required + justification

**EX-PERM-002: Expense Status Transitions**

```typescript
// Valid status transitions with permissions
DRAFT → SUBMITTED (Expense owner)
SUBMITTED → APPROVED | REJECTED (GF only)
APPROVED → PAID (BUCH, GF)
REJECTED → DRAFT (Expense owner can resubmit)
PAID → (terminal state, no changes allowed)
```

**EX-PERM-003: Receipt Requirements**

- Receipt image required for expenses > €25 (except mileage)
- OCR extracts amount/vendor, user verifies
- Missing receipt blocks approval

**EX-PERM-004: Resubmission After Rejection**

- User can UPDATE and re-SUBMIT rejected expenses
- Must address rejection reason
- New submission resets approval flow

**Approval Workflow:**

```typescript
async approveExpense(
  expenseId: string,
  user: User
): Promise<Expense> {
  // Check GF role
  if (!user.roles.includes('GF')) {
    throw new ForbiddenException('Only GF can approve expenses');
  }

  const expense = await this.repository.findById(expenseId);

  // Validate status
  if (expense.status !== 'submitted') {
    throw new ValidationException('Can only approve submitted expenses');
  }

  // Validate receipt for amounts > €25
  if (expense.amount > 25 && !expense.receiptImageUrl && expense.category !== 'mileage') {
    throw new ValidationException('Receipt image required for expenses over €25');
  }

  // Approve
  expense.status = 'approved';
  expense.approvedBy = user.id;
  expense.approvedAt = new Date();

  // Audit log
  await this.auditService.log({
    entityType: 'Expense',
    entityId: expenseId,
    action: 'APPROVE',
    userId: user.id,
    timestamp: new Date(),
    details: { amount: expense.amount, category: expense.category },
  });

  return this.repository.update(expense);
}

async rejectExpense(
  expenseId: string,
  rejectionReason: string,
  user: User
): Promise<Expense> {
  // Check GF role
  if (!user.roles.includes('GF')) {
    throw new ForbiddenException('Only GF can reject expenses');
  }

  const expense = await this.repository.findById(expenseId);

  // Validate status
  if (expense.status !== 'submitted') {
    throw new ValidationException('Can only reject submitted expenses');
  }

  // Validate rejection reason
  if (!rejectionReason || rejectionReason.length < 10) {
    throw new ValidationException('Rejection reason required (min 10 characters)');
  }

  // Reject
  expense.status = 'rejected';
  expense.rejectedAt = new Date();
  expense.rejectionReason = rejectionReason;

  // Notify user
  await this.notificationService.notifyExpenseRejected(expense, rejectionReason);

  return this.repository.update(expense);
}
```

---

### MileageLog Permissions

MileageLog tracks GPS-recorded journeys for expense calculation.

| Permission                     | Description                    | Who Has It                             |
| ------------------------------ | ------------------------------ | -------------------------------------- |
| `MileageLog.READ`              | View mileage log data          | All roles (filtered by tour ownership) |
| `MileageLog.CREATE`            | Create new mileage logs        | ADM (own tours), PLAN, GF              |
| `MileageLog.UPDATE`            | Modify mileage log information | ADM (own, if no expense linked), GF    |
| `MileageLog.DELETE`            | Delete mileage logs            | ADM (own, if no expense linked), GF    |
| `MileageLog.OVERRIDE_DISTANCE` | Manually adjust GPS distance   | GF only                                |
| `MileageLog.VIEW_ROUTE`        | View GPS route audit trail     | ADM (own), GF, BUCH                    |

**Record-Level Rules:**

**ADM (Sales Field Agents):**

- Can CREATE mileage logs for their own tours
- Can UPDATE/DELETE if not linked to expense
- GPS tracking auto-creates logs
- Can VIEW_ROUTE for own logs

**GF (Management):**

- Full access to all mileage log operations
- Can OVERRIDE_DISTANCE with reason (audit trail)
- Can VIEW_ROUTE for all logs (audit)

**BUCH (Accounting):**

- Can READ and VIEW_ROUTE for all logs
- Used for tax reporting and expense validation

**Business Rules:**

**ML-PERM-001: Mileage Log Creation Requires Tour**

- Mileage log must be linked to existing tour
- User must own the tour OR have GF role

**ML-PERM-002: GPS Distance Validation**

- distance should match gpsDistance ±5%
- If outside tolerance, manual override required (GF only)

**ML-PERM-003: Expense Linkage**

- Once mileage log is linked to expense, it becomes immutable
- GF can override with reason (audit logged)

**Example Permission Check:**

```typescript
async overrideMileageDistance(
  mileageLogId: string,
  newDistance: number,
  reason: string,
  user: User
): Promise<MileageLog> {
  // Check GF role
  if (!user.roles.includes('GF')) {
    throw new ForbiddenException('Only GF can override mileage distance');
  }

  const mileageLog = await this.repository.findById(mileageLogId);

  // Validate reason
  if (!reason || reason.length < 20) {
    throw new ValidationException('Override reason required (min 20 characters)');
  }

  // Check if linked to expense
  if (mileageLog.expenseId) {
    const expense = await this.expenseRepo.findById(mileageLog.expenseId);
    if (expense.status === 'paid') {
      throw new ValidationException('Cannot override mileage for paid expenses');
    }
  }

  // Log the override
  await this.auditService.log({
    entityType: 'MileageLog',
    entityId: mileageLogId,
    action: 'OVERRIDE_DISTANCE',
    oldValue: mileageLog.distance,
    newValue: newDistance,
    userId: user.id,
    timestamp: new Date(),
    reason: reason,
  });

  mileageLog.distance = newDistance;
  mileageLog.manualOverride = true;
  mileageLog.overrideReason = reason;
  mileageLog.calculatedCost = newDistance * mileageLog.ratePerKm;

  return this.repository.update(mileageLog);
}
```

---

### Complete Tour Management Permission Matrix

| Entity.Action                | GF     | PLAN               | ADM                      | KALK                    | BUCH   | Notes                            |
| ---------------------------- | ------ | ------------------ | ------------------------ | ----------------------- | ------ | -------------------------------- |
| **Tour**                     |        |                    |                          |                         |        |
| Tour.READ                    | ✅ All | ✅ All             | ✅ Own + Basic Others    | ✅ All                  | ✅ All | ADM: Own full, others basic info |
| Tour.CREATE                  | ✅     | ✅                 | ✅                       | ❌                      | ❌     |                                  |
| Tour.UPDATE                  | ✅ All | ✅ All             | ✅ Own                   | ❌                      | ❌     | ADM: Own tours only              |
| Tour.DELETE                  | ✅ All | ❌                 | ✅ Own (planned only)    | ❌                      | ❌     | GF can delete any status         |
| Tour.ACTIVATE                | ✅     | ✅                 | ✅ Own                   | ❌                      | ❌     |                                  |
| Tour.COMPLETE                | ✅     | ✅                 | ✅ Own                   | ❌                      | ❌     | Requires all meetings complete   |
| Tour.VIEW_COSTS              | ✅     | ✅                 | ✅ Own                   | ❌                      | ✅     |                                  |
| **Meeting**                  |        |                    |                          |                         |        |
| Meeting.READ                 | ✅ All | ✅ All             | ✅ Own + Customer Access | ✅ All                  | ✅ All | ADM: Own + customer meetings     |
| Meeting.CREATE               | ✅     | ✅                 | ✅ Own Customers         | ❌                      | ❌     | ADM: Own customers only          |
| Meeting.UPDATE               | ✅ All | ✅ All             | ✅ Own                   | ❌                      | ❌     | ADM: Own meetings only           |
| Meeting.DELETE               | ✅ All | ❌                 | ✅ Own (scheduled only)  | ❌                      | ❌     |                                  |
| Meeting.CHECK_IN             | ✅     | ✅                 | ✅ Own                   | ❌                      | ❌     | GPS-validated                    |
| Meeting.UPDATE_OUTCOME       | ✅ All | ✅ All             | ✅ Own (24h window)      | ❌                      | ❌     | ADM: Within 24h of meeting       |
| Meeting.LINK_TOUR            | ✅     | ✅                 | ✅ Own                   | ❌                      | ❌     |                                  |
| **HotelStay**                |        |                    |                          |                         |        |
| HotelStay.READ               | ✅ All | ✅ All             | ✅ Own Tours             | ❌                      | ✅ All |                                  |
| HotelStay.CREATE             | ✅     | ✅                 | ✅ Own Tours             | ❌                      | ❌     |                                  |
| HotelStay.UPDATE             | ✅ All | ✅ All             | ✅ Own Tours             | ❌                      | ❌     |                                  |
| HotelStay.DELETE             | ✅ All | ❌                 | ✅ Own (no expense)      | ❌                      | ❌     | Cannot delete if expense linked  |
| HotelStay.VIEW_COSTS         | ✅     | ✅                 | ✅ Own                   | ❌                      | ✅     |                                  |
| **Expense**                  |        |                    |                          |                         |        |
| Expense.READ                 | ✅ All | ✅ Project-Related | ✅ Own                   | ❌                      | ✅ All | PLAN: Projects only              |
| Expense.CREATE               | ✅     | ✅                 | ✅                       | ✅                      | ❌     | All can create own expenses      |
| Expense.UPDATE               | ✅ All | ❌                 | ✅ Own (draft/rejected)  | ✅ Own (draft/rejected) | ❌     | Only draft/rejected              |
| Expense.DELETE               | ✅ All | ❌                 | ✅ Own (draft only)      | ✅ Own (draft only)     | ❌     |                                  |
| Expense.SUBMIT               | ✅     | ✅                 | ✅ Own                   | ✅ Own                  | ❌     |                                  |
| Expense.APPROVE              | ✅     | ❌                 | ❌                       | ❌                      | ❌     | **GF ONLY**                      |
| Expense.REJECT               | ✅     | ❌                 | ❌                       | ❌                      | ❌     | **GF ONLY**                      |
| Expense.MARK_PAID            | ✅     | ❌                 | ❌                       | ❌                      | ✅     | GF or BUCH                       |
| Expense.VIEW_ALL             | ✅     | ❌                 | ❌                       | ❌                      | ✅     |                                  |
| **MileageLog**               |        |                    |                          |                         |        |
| MileageLog.READ              | ✅ All | ✅ All             | ✅ Own Tours             | ❌                      | ✅ All |                                  |
| MileageLog.CREATE            | ✅     | ✅                 | ✅ Own Tours             | ❌                      | ❌     | Auto-created by GPS              |
| MileageLog.UPDATE            | ✅ All | ❌                 | ✅ Own (no expense)      | ❌                      | ❌     | Cannot edit if expense linked    |
| MileageLog.DELETE            | ✅ All | ❌                 | ✅ Own (no expense)      | ❌                      | ❌     |                                  |
| MileageLog.OVERRIDE_DISTANCE | ✅     | ❌                 | ❌                       | ❌                      | ❌     | **GF ONLY** with reason          |
| MileageLog.VIEW_ROUTE        | ✅     | ❌                 | ✅ Own                   | ❌                      | ✅     | GPS audit trail                  |

**Legend:**

- ✅ = Full permission
- ✅ Own = Permission for own records only
- ✅ All = Permission for all records
- ❌ = No permission
- **BOLD** = Restricted permission (high security)

---

### Tour Management Authorization Examples

**Example 1: ADM Submitting Expenses for Tour**

```typescript
async submitTourExpenses(tourId: string, user: User): Promise<void> {
  const tour = await this.tourRepo.findById(tourId);

  // Check tour ownership
  if (tour.userId !== user.id && !user.roles.includes('GF')) {
    throw new ForbiddenException('You can only submit expenses for your own tours');
  }

  // Check tour is completed
  if (tour.status !== 'completed') {
    throw new ValidationException('Tour must be completed before submitting expenses');
  }

  // Get all tour expenses
  const expenses = await this.expenseRepo.findByTour(tourId);
  const draftExpenses = expenses.filter(e => e.status === 'draft');

  if (draftExpenses.length === 0) {
    throw new ValidationException('No draft expenses to submit');
  }

  // Submit all draft expenses
  for (const expense of draftExpenses) {
    // Validate receipt requirement
    if (expense.amount > 25 && !expense.receiptImageUrl && expense.category !== 'mileage') {
      throw new ValidationException(
        `Expense "${expense.title}" requires receipt (amount: €${expense.amount})`
      );
    }

    expense.status = 'submitted';
    expense.submittedAt = new Date();
    await this.expenseRepo.update(expense);
  }

  // Notify GF
  await this.notificationService.notifyExpensesSubmitted(tour, draftExpenses, user);
}
```

**Example 2: GF Approving Tour Expenses in Bulk**

```typescript
async approveTourExpenses(tourId: string, user: User): Promise<void> {
  // Check GF role
  if (!user.roles.includes('GF')) {
    throw new ForbiddenException('Only GF can approve expenses');
  }

  const tour = await this.tourRepo.findById(tourId);
  const expenses = await this.expenseRepo.findByTour(tourId);
  const submittedExpenses = expenses.filter(e => e.status === 'submitted');

  if (submittedExpenses.length === 0) {
    throw new ValidationException('No submitted expenses to approve');
  }

  // Validate total amount
  const totalAmount = submittedExpenses.reduce((sum, e) => sum + e.amount, 0);
  if (totalAmount > 5000) {
    // Require additional justification for large expense totals
    throw new ValidationException(
      `Tour expenses total €${totalAmount} requires additional review. Please approve individually.`
    );
  }

  // Approve all
  for (const expense of submittedExpenses) {
    expense.status = 'approved';
    expense.approvedBy = user.id;
    expense.approvedAt = new Date();
    await this.expenseRepo.update(expense);

    // Audit log
    await this.auditService.log({
      entityType: 'Expense',
      entityId: expense._id,
      action: 'APPROVE',
      userId: user.id,
      timestamp: new Date(),
    });
  }

  // Notify expense owner
  const expenseOwner = await this.userRepo.findById(tour.userId);
  await this.notificationService.notifyExpensesApproved(tour, submittedExpenses, expenseOwner);
}
```

**Example 3: BUCH Marking Expenses as Paid**

```typescript
async markExpensesPaid(
  expenseIds: string[],
  paymentReference: string,
  user: User
): Promise<void> {
  // Check BUCH or GF role
  if (!user.roles.some(r => ['BUCH', 'GF'].includes(r))) {
    throw new ForbiddenException('Only BUCH or GF can mark expenses as paid');
  }

  // Validate payment reference
  if (!paymentReference || paymentReference.length < 5) {
    throw new ValidationException('Payment reference required (min 5 characters)');
  }

  for (const expenseId of expenseIds) {
    const expense = await this.expenseRepo.findById(expenseId);

    // Check expense is approved
    if (expense.status !== 'approved') {
      throw new ValidationException(
        `Expense "${expense.title}" is not approved (status: ${expense.status})`
      );
    }

    expense.status = 'paid';
    expense.paidAt = new Date();
    expense.paymentReference = paymentReference;
    await this.expenseRepo.update(expense);

    // Audit log
    await this.auditService.log({
      entityType: 'Expense',
      entityId: expenseId,
      action: 'MARK_PAID',
      userId: user.id,
      timestamp: new Date(),
      details: { paymentReference },
    });
  }

  // Notify expense owners
  const groupedByOwner = await this.groupExpensesByOwner(expenseIds);
  for (const [ownerId, expenses] of Object.entries(groupedByOwner)) {
    const owner = await this.userRepo.findById(ownerId);
    await this.notificationService.notifyExpensesPaid(expenses, owner, paymentReference);
  }
}
```

---

### Security & Compliance Considerations

**GPS Privacy (DSGVO):**

- GPS tracking requires explicit user consent
- Users can pause tracking
- GPS data can be deleted after 2 years (configurable)
- Audit trail for GPS data access

**Expense Approval Audit (GoBD):**

- All expense approvals/rejections logged
- Cannot modify approved expenses (only GF can correct with reason)
- Audit trail includes timestamps, amounts, categories
- Change log for all modifications

**Receipt Storage (Security):**

- Receipts stored in MinIO with encryption at rest
- Access logged for audit
- Retention: 10 years (GoBD requirement for receipts)
- Can be anonymized after retention period

**Access Control:**

- Expense data filtered by ownership and role
- ADM cannot see other users' expense details
- PLAN can see project-related expenses only
- BUCH/GF have full visibility for reporting

---

## 14. Future Entity Permissions (Placeholders)

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

## 15. Supplier Management Permissions (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Status:** Critical - Addresses Pre-Mortem Danger #3  
**Priority:** Phase 1 MVP

### Supplier Entity Permissions

| Permission             | INN   | PLAN  | KALK  | BUCH  | ADM       | GF    |
| ---------------------- | ----- | ----- | ----- | ----- | --------- | ----- |
| **Supplier.READ**      | ✓ All | ✓ All | ✓ All | ✓ All | ✓ Limited | ✓ All |
| **Supplier.CREATE**    | ✓     | ✓     | ✓     | ❌    | ❌        | ✓     |
| **Supplier.UPDATE**    | ✓     | ❌    | ❌    | ❌    | ❌        | ✓     |
| **Supplier.DELETE**    | ❌    | ❌    | ❌    | ❌    | ❌        | ✓     |
| **Supplier.APPROVE**   | ❌    | ❌    | ❌    | ❌    | ❌        | ✓     |
| **Supplier.BLACKLIST** | ❌    | ❌    | ❌    | ❌    | ❌        | ✓     |
| **Supplier.RATE**      | ✓     | ✓     | ❌    | ❌    | ❌        | ✓     |

### SupplierContract Permissions

| Permission                   | INN     | PLAN    | KALK  | BUCH     | ADM | GF      |
| ---------------------------- | ------- | ------- | ----- | -------- | --- | ------- |
| **SupplierContract.READ**    | ✓ All   | ✓ All   | ✓ All | ✓ All    | ❌  | ✓ All   |
| **SupplierContract.CREATE**  | ✓       | ✓       | ❌    | ❌       | ❌  | ✓       |
| **SupplierContract.UPDATE**  | ✓ Draft | ✓ Draft | ❌    | ❌       | ❌  | ✓ All   |
| **SupplierContract.DELETE**  | ✓ Draft | ✓ Draft | ❌    | ❌       | ❌  | ✓       |
| **SupplierContract.APPROVE** | ❌      | ❌      | ❌    | ✓ Review | ❌  | ✓ >€50k |
| **SupplierContract.SIGN**    | ✓       | ❌      | ❌    | ❌       | ❌  | ✓       |

### SupplierInvoice Permissions

| Permission                    | INN       | PLAN      | KALK      | BUCH      | ADM | GF      |
| ----------------------------- | --------- | --------- | --------- | --------- | --- | ------- |
| **SupplierInvoice.READ**      | ✓ All     | ✓ Project | ✓ Project | ✓ All     | ❌  | ✓ All   |
| **SupplierInvoice.CREATE**    | ✓         | ❌        | ❌        | ✓         | ❌  | ✓       |
| **SupplierInvoice.UPDATE**    | ✓ Pending | ❌        | ❌        | ✓ Pending | ❌  | ✓       |
| **SupplierInvoice.DELETE**    | ✓ Pending | ❌        | ❌        | ✓ Pending | ❌  | ✓       |
| **SupplierInvoice.APPROVE**   | ❌        | ❌        | ❌        | ✓ ≤€10k   | ❌  | ✓ >€10k |
| **SupplierInvoice.MARK_PAID** | ❌        | ❌        | ❌        | ✓         | ❌  | ✓       |
| **SupplierInvoice.DISPUTE**   | ✓         | ❌        | ❌        | ✓         | ❌  | ✓       |

### Business Rules: Supplier Permissions

**SU-RBAC-001:** INN Role Enhancement

- INN is the primary supplier relationship manager
- INN has full CRUD on suppliers (except blacklist)
- INN can create contracts, assign to projects, log communications
- INN receives and processes supplier invoices

**SU-RBAC-002:** Supplier Approval Workflow

- New suppliers status = 'PendingApproval'
- Only GF can approve new suppliers (sets status = 'Active')
- Blacklisting requires GF + reason (cannot be undone without GF)

**SU-RBAC-003:** Contract Approval Thresholds

- <€50k: Auto-approved after INN creates
- €50k-€200k: GF approval required
- > €200k: GF + BUCH pre-approval required

**SU-RBAC-004:** Invoice Approval Thresholds

- <€1k: Auto-approved if 3-way match passes
- €1k-€10k: BUCH approval required
- > €10k: GF approval required

**SU-RBAC-005:** Supplier Rating Authority

- INN and PLAN can rate suppliers after project completion
- Ratings visible to all users (transparency)
- GF can edit ratings if demonstrably incorrect

---

## 16. Material & Inventory Permissions (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Status:** Critical - Addresses Pre-Mortem Danger #3  
**Priority:** Phase 1 MVP

### Material Entity Permissions

| Permission                 | INN   | PLAN  | KALK     | BUCH  | ADM       | GF    |
| -------------------------- | ----- | ----- | -------- | ----- | --------- | ----- |
| **Material.READ**          | ✓ All | ✓ All | ✓ All    | ✓ All | ✓ Limited | ✓ All |
| **Material.CREATE**        | ✓     | ✓     | ✓        | ❌    | ❌        | ✓     |
| **Material.UPDATE**        | ✓     | ❌    | ✓ Prices | ❌    | ❌        | ✓     |
| **Material.DELETE**        | ❌    | ❌    | ❌       | ❌    | ❌        | ✓     |
| **Material.DISCONTINUE**   | ✓     | ❌    | ❌       | ❌    | ❌        | ✓     |
| **Material.UPDATE_PRICES** | ✓     | ❌    | ✓        | ❌    | ❌        | ✓     |

### ProjectMaterialRequirement Permissions

| Permission                  | INN   | PLAN  | KALK       | BUCH  | ADM | GF    |
| --------------------------- | ----- | ----- | ---------- | ----- | --- | ----- |
| **ProjectMaterial.READ**    | ✓ All | ✓ All | ✓ All      | ✓ All | ❌  | ✓ All |
| **ProjectMaterial.CREATE**  | ✓     | ✓     | ✓ Estimate | ❌    | ❌  | ✓     |
| **ProjectMaterial.UPDATE**  | ✓     | ✓     | ✓ Estimate | ❌    | ❌  | ✓     |
| **ProjectMaterial.DELETE**  | ✓     | ✓     | ❌         | ❌    | ❌  | ✓     |
| **ProjectMaterial.CONFIRM** | ❌    | ✓     | ❌         | ❌    | ❌  | ✓     |

### PurchaseOrder Permissions

| Permission                         | INN        | PLAN      | KALK      | BUCH    | ADM | GF      |
| ---------------------------------- | ---------- | --------- | --------- | ------- | --- | ------- |
| **PurchaseOrder.READ**             | ✓ All      | ✓ Project | ✓ Project | ✓ All   | ❌  | ✓ All   |
| **PurchaseOrder.CREATE**           | ✓          | ✓ ≤€10k   | ❌        | ❌      | ❌  | ✓       |
| **PurchaseOrder.UPDATE**           | ✓ Pre-send | ✓ Draft   | ❌        | ❌      | ❌  | ✓       |
| **PurchaseOrder.DELETE**           | ✓ Draft    | ✓ Draft   | ❌        | ❌      | ❌  | ✓       |
| **PurchaseOrder.APPROVE**          | ❌         | ❌        | ❌        | ✓ ≤€10k | ❌  | ✓ >€10k |
| **PurchaseOrder.SEND**             | ✓          | ❌        | ❌        | ❌      | ❌  | ✓       |
| **PurchaseOrder.RECEIVE_DELIVERY** | ✓          | ✓         | ❌        | ❌      | ❌  | ✓       |
| **PurchaseOrder.CANCEL**           | ✓          | ✓ Project | ❌        | ✓       | ❌  | ✓       |

### Business Rules: Material Permissions

**MAT-RBAC-001:** Material Catalog is Shared Resource

- All users can read materials (for reference)
- KALK creates materials during estimate preparation
- INN creates materials during procurement
- Only INN/GF can discontinue materials

**MAT-RBAC-002:** Project Material Requirements

- KALK creates initial requirements during estimate (status = estimated)
- PLAN confirms/adjusts requirements (status = confirmed)
- INN procures based on confirmed requirements
- Actual quantities/costs update project budget real-time

**MAT-RBAC-003:** Purchase Order Approval

- ≤€1k: Auto-approved (no manual approval)
- €1k-€10k: BUCH approval required
- > €10k: GF approval required
- PLAN can create small POs (≤€10k) for urgent needs

**MAT-RBAC-004:** Delivery Recording

- INN primarily records deliveries
- PLAN can record if received on-site
- Delivery updates project costs immediately (triggers budget alerts if needed)

**MAT-RBAC-005:** Price Update Authority

- INN updates prices when receiving supplier quotes
- KALK updates prices during market research
- Price changes trigger notification to KALK for active estimates

---

## 17. INN Role Definition (UPDATED)

**Updated:** 2025-11-12  
**Status:** Expanded role definition

### Role: INN (INNEN - Internal Services Coordination)

**German Name:** Innendienst / Interne Dienstleistungen  
**English Name:** Internal Services / Coordination  
**Badge Color:** Purple

**Primary Responsibilities:**

- Supplier & subcontractor relationship management
- Material procurement and purchase order processing
- Contract coordination (supplier contracts)
- Delivery tracking and invoice processing
- Project support and logistics coordination

**Dashboard Focus:**

- Supplier performance overview
- Active purchase orders and deliveries
- Pending supplier invoices (approval queue)
- Material procurement status
- Communication and follow-up tasks

**Permissions Summary:**

| Entity Category        | Permissions                                                      |
| ---------------------- | ---------------------------------------------------------------- |
| **Customers**          | READ all                                                         |
| **Suppliers**          | Full CRUD (except blacklist), Approve workflow, Rate performance |
| **Materials**          | Full CRUD (except delete), Update prices, Manage inventory       |
| **Purchase Orders**    | Create, Send, Track, Record delivery                             |
| **Supplier Contracts** | Create, Update (draft), Sign                                     |
| **Supplier Invoices**  | Create, Update (pending), Flag for approval                      |
| **Projects**           | READ all (for context), Update material/supplier assignments     |
| **Communications**     | CREATE (log supplier communications), READ                       |

**Key Workflows:**

1. Onboard new suppliers → GF approval
2. Create purchase orders → Approval workflow (BUCH/GF)
3. Record deliveries → Update project costs real-time
4. Process supplier invoices → Approval routing (BUCH/GF)
5. Manage supplier relationships → Log communications, track performance

**Record-Level Rules:**

- INN is account manager for assigned suppliers
- INN can view all projects (for procurement context)
- INN cannot view customer financial details unless project-related

---

## Document History

| Version | Date       | Author | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------- | ---------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | 2025-01-28 | System | Initial specification: Role definitions, Customer/Location/Contact permissions, permission matrix, record-level rules, decision-making role restrictions                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 1.1     | 2025-01-27 | System | Added multiple roles per user support, hybrid RBAC architecture, role assignment/management section, corrected PLAN role permissions (read-only customers), updated permission matrix                                                                                                                                                                                                                                                                                                                                                                                              |
| 1.2     | 2025-01-28 | System | Added Task Management permissions (UserTask and ProjectTask), complete task permission matrix, record-level rules for task access, dashboard query patterns, task-specific authorization examples                                                                                                                                                                                                                                                                                                                                                                                  |
| 1.3     | 2025-01-28 | System | **Added Tour Planning & Expense Management permissions (Phase 2)**: Tour, Meeting, HotelStay, Expense, MileageLog with complete permission matrix, approval workflows, GPS validation, record-level rules, authorization examples, security/compliance considerations                                                                                                                                                                                                                                                                                                              |
| 1.4     | 2025-01-28 | System | **Added Time Tracking & Project Cost Management permissions (Phase 1 MVP)**: TimeEntry (CRUD, approval workflow, cost visibility) and ProjectCost (CRUD, approval thresholds, payment management) with detailed RBAC rules, authorization examples, GoBD compliance requirements, role-specific access patterns                                                                                                                                                                                                                                                                    |
| 1.5     | 2025-11-12 | System | **CRITICAL UPDATE - Added Supplier & Material Management permissions (Phase 1 MVP)**: Complete permission matrix for Supplier, Material, ProjectMaterialRequirement, PurchaseOrder, SupplierContract, ProjectSubcontractor, SupplierInvoice, SupplierCommunication. Updated INN role definition with expanded responsibilities. Approval workflows: Supplier (GF), Contracts (<€50k auto, ≥€50k GF, >€200k GF+BUCH), Purchase Orders (≤€1k auto, €1k-€10k BUCH, >€10k GF), Invoices (<€1k auto, €1k-€10k BUCH, >€10k GF). Addresses Pre-Mortem Danger #3 (Critical Workflow Gaps). |

---

**End of RBAC_PERMISSION_MATRIX.md v1.5**
