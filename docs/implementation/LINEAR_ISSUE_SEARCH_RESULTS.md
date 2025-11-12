# Linear Issue Search Results - RBAC Multi-Role System

**Date:** 2025-01-27  
**Search Context:** RBAC Multi-Role System Enhancement  
**Related Plan:** `rbac-multi-role-system.plan.md`

---

## Search Queries to Execute in Linear

Please run these searches in Linear and document findings below:

### Query 1: RBAC General
```
RBAC OR "role-based access control" OR "access control"
```

### Query 2: Role Management
```
role OR roles OR "user role" OR "role assignment"
```

### Query 3: Permission System
```
permission OR permissions OR "permission matrix" OR authorize
```

### Query 4: Multiple Roles
```
"multiple roles" OR "multi-role" OR "roles array"
```

### Query 5: User Management
```
"user management" OR "assign role" OR "revoke role"
```

---

## Search Results

### Found Issues

**Instructions:** For each issue found, document:
- Issue ID (e.g., KOM-XXX)
- Title
- Status (Todo/In Progress/Done/Canceled)
- Current Description
- Relevant Labels
- Decision: UPDATE (add reference to plan) or SKIP (not related)

**Example:**
```
KOM-XXX: Implement RBAC permission system
Status: In Progress
Labels: backend, rbac, security
Decision: UPDATE - Add reference to multi-role plan and hybrid architecture
```

---

## Issues to Create (if not found)

If no existing issues cover these areas, create the following:

### Issue 1: Multiple Roles Per User
- **Title:** Implement multiple roles per user support
- **Labels:** backend, frontend, shared, rbac, high-priority
- **Description:**
  ```
  Refactor User entity and permission checking to support multiple roles per user.
  
  Current: User has single role: UserRole
  Target: User has roles: UserRole[] with primaryRole: UserRole
  
  Scope:
  - Update User entity in packages/shared/src/types/entities/user.ts
  - Update permission checking functions in rbac.constants.ts
  - Update RbacGuard to check roles[] array
  - Update all services/controllers expecting single role
  
  References:
  - docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md (to be updated)
  - rbac-multi-role-system.plan.md
  - Skeleton code in packages/shared/src/types/entities/
  
  Acceptance Criteria:
  - [ ] User can have multiple roles (e.g., ADM + PLAN)
  - [ ] Permission checking uses OR logic (ANY role grants permission)
  - [ ] Primary role determines UI defaults
  - [ ] All tests pass with multi-role support
  - [ ] Database migration created for User entity
  ```

### Issue 2: Hybrid Database-Driven RBAC Configuration
- **Title:** Implement hybrid database-driven RBAC configuration
- **Labels:** backend, database, rbac, medium-priority
- **Description:**
  ```
  Store permission matrix in CouchDB with fallback to static TypeScript definitions.
  
  Hybrid Approach:
  - Keep TypeScript enums (UserRole, EntityType, Permission) for compile-time safety
  - Store permission matrix in CouchDB for runtime configuration
  - Fallback to static PERMISSION_MATRIX if database unavailable
  
  Scope:
  - Create Role entity in CouchDB (roleId, name, permissions)
  - Create PermissionMatrix entity in CouchDB (version, matrix, effectiveDate)
  - Create RoleService to fetch runtime permissions
  - Update RbacGuard to use runtime permissions
  - Create CouchDB views for role queries
  
  References:
  - packages/shared/src/types/entities/role.ts (skeleton)
  - apps/backend/src/modules/role/ (skeleton module)
  - rbac-multi-role-system.plan.md
  
  Acceptance Criteria:
  - [ ] Role and PermissionMatrix documents defined in CouchDB
  - [ ] RoleService fetches active permission matrix
  - [ ] System falls back to static matrix if DB unavailable
  - [ ] Permission changes in DB take effect without code deployment
  - [ ] Audit log for all permission matrix changes
  ```

### Issue 3: Role Management and User Role Assignment API
- **Title:** Create role management and user role assignment API
- **Labels:** backend, api, rbac, high-priority
- **Description:**
  ```
  Implement API endpoints for role assignment, revocation, and permission management.
  
  New Endpoints:
  - GET /api/v1/users/:userId/roles - Get user roles
  - PUT /api/v1/users/:userId/roles - Assign roles (GF/ADMIN only)
  - DELETE /api/v1/users/:userId/roles/:roleId - Revoke role
  - GET /api/v1/roles - List all roles
  - GET /api/v1/roles/:roleId - Get role details
  - GET /api/v1/roles/:roleId/permissions - Get role permissions
  - PUT /api/v1/roles/:roleId/permissions - Update permissions (ADMIN only)
  - GET /api/v1/permissions/matrix - Get current matrix
  - PUT /api/v1/permissions/matrix - Update matrix (ADMIN only)
  
  References:
  - apps/backend/src/modules/role/role.controller.ts (skeleton)
  - apps/backend/src/modules/user/user-roles.controller.ts (skeleton)
  - docs/specifications/reviews/API_SPECIFICATION.md (to be updated)
  
  Dependencies:
  - Requires Issue 1 (multiple roles support)
  
  Acceptance Criteria:
  - [ ] All endpoints implemented with proper guards
  - [ ] Only GF/ADMIN can assign/revoke roles
  - [ ] Audit trail for all role changes
  - [ ] OpenAPI documentation complete
  - [ ] Integration tests for all endpoints
  ```

### Issue 4: Build Role Management Admin UI
- **Title:** Build role management admin UI
- **Labels:** frontend, admin, rbac, medium-priority
- **Description:**
  ```
  Create admin panel for assigning roles to users and editing permission matrix.
  
  Components:
  - RoleAssignmentDialog: Assign/revoke roles for a user
  - PermissionMatrixEditor: Edit permission matrix (ADMIN only)
  - UserRolesBadge: Display user's roles in UI
  - RoleSwitcher: Allow user to switch primary role
  
  Features:
  - Multi-select checkboxes for role assignment
  - Primary role selector
  - Reason field for audit trail
  - Real-time permission preview
  - Permission matrix editor with validation
  - Audit log display for changes
  
  References:
  - apps/frontend/src/features/admin/components/RoleAssignmentDialog.tsx (skeleton)
  - apps/frontend/src/features/admin/components/PermissionMatrixEditor.tsx (skeleton)
  - rbac-multi-role-system.plan.md
  
  Dependencies:
  - Requires Issue 1 (multiple roles support)
  - Requires Issue 3 (role management API)
  
  Acceptance Criteria:
  - [ ] GF/ADMIN can assign roles to users via UI
  - [ ] User must have at least one role
  - [ ] Primary role must be in selected roles
  - [ ] Changes logged with reason
  - [ ] ADMIN can edit permission matrix
  - [ ] Changes take effect immediately
  - [ ] E2E tests for role assignment flow
  ```

### Issue 5: Fix Incorrect PLAN Role Permissions in UI/UX Documentation
- **Title:** Fix incorrect PLAN role permissions in UI/UX documentation and Figma
- **Labels:** documentation, ui-ux, figma, high-priority
- **Description:**
  ```
  Systematic review and correction of PLAN role permissions across all UI/UX files.
  
  Problem:
  - Some UI/UX documentation may show PLAN with admin rights
  - PLAN should have LIMITED access (not full admin)
  - Financial data should be restricted for PLAN
  - Some action buttons may be incorrectly visible
  
  Scope:
  - Review all files in ui-ux/ directory
  - Identify incorrect PLAN role references
  - Correct role-based visibility rules
  - Create Figma migration prompt with exact specifications
  - Update ui-ux/README.md
  
  PLAN Role Correct Permissions:
  - ✅ Read all projects
  - ✅ Update assigned projects only
  - ✅ Read customers (project-related)
  - ✅ Can update Contact.DECISION_ROLE
  - ❌ CANNOT delete customers
  - ❌ CANNOT create projects (only from opportunities)
  - ❌ CANNOT access full financial data
  - ❌ CANNOT approve large offers
  
  Deliverables:
  - [ ] Complete audit of ui-ux/ files with findings
  - [ ] All incorrect references corrected
  - [ ] Migration prompt: ui-ux/00-updates/FIGMA-UPDATE-RBAC-ROLE-PERMISSIONS-2025-01.md
  - [ ] ui-ux/README.md updated
  
  References:
  - docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md
  - docs/personas/Strategische Referenzpersona_ Planungsabteilung.md
  ```

---

## Next Steps

1. Execute Linear searches using the queries above
2. Document found issues in "Search Results" section
3. For each found issue, decide: UPDATE or SKIP
4. Create new issues for gaps using the templates above
5. Update all issues with links to:
   - rbac-multi-role-system.plan.md
   - Relevant skeleton code files
   - Updated documentation files

---

**Note:** Linear issue creation/updates should be done via Linear web interface or API. Document all issue IDs and status updates in this file.

