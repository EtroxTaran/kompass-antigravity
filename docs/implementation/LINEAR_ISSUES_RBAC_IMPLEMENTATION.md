# Linear Issues for RBAC Multiple Roles Implementation

**Date**: 2025-01-27  
**Status**: Issue Specifications  
**Purpose**: Define Linear issues for implementing multiple roles per user and database-driven RBAC

---

## Overview

This document specifies the Linear issues that should be created or updated for the RBAC multiple roles implementation. All skeleton code and documentation have been completed as specified in the implementation plan.

**Implementation Plan**: `docs/implementation/RBAC_MULTI_ROLE_IMPLEMENTATION_PLAN.md`

---

## Issue 1: Implement Multiple Roles Per User (Backend)

### Title
`[RBAC] Implement multiple roles per user - Backend`

### Description
```markdown
Implement support for users having multiple roles with a primary role designation.

**Changes Required:**
1. Update User entity with roles[] array and primaryRole field
2. Implement role change history logging
3. Update RbacGuard to use hasAnyRolePermission() with OR logic
4. Implement user roles management API endpoints

**Files Created:**
- ✅ `packages/shared/src/types/entities/user.ts`
- ✅ `packages/shared/src/constants/rbac.constants.ts` (updated with multiple roles functions)
- ✅ `apps/backend/src/modules/auth/guards/rbac.guard.ts`
- ✅ `apps/backend/src/modules/auth/decorators/require-permission.decorator.ts`
- ✅ `apps/backend/src/modules/user/user.module.ts`
- ✅ `apps/backend/src/modules/user/user-roles.controller.ts`
- ✅ `apps/backend/src/modules/user/dto/assign-roles.dto.ts`
- ✅ `apps/backend/src/modules/user/dto/update-primary-role.dto.ts`

**Documentation:**
- ✅ `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md` (updated)
- ✅ `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md` (updated)
- ✅ `docs/specifications/reviews/API_SPECIFICATION.md` (updated)

**Tasks:**
- [ ] Implement UserService for user CRUD
- [ ] Implement UserRepository for CouchDB operations
- [ ] Implement UserRolesController endpoints (PUT /users/:id/roles, DELETE /users/:id/roles/:roleId)
- [ ] Add validation that primaryRole is in roles array
- [ ] Add role change history logging
- [ ] Add tests for multiple roles permission checking
- [ ] Add integration tests for role assignment API

**Acceptance Criteria:**
- User can have multiple roles assigned
- User must have at least one role
- User has a designated primary role
- Role changes are logged in roleChangeHistory
- RbacGuard checks permissions using OR logic across all roles
- API endpoints work for role assignment and revocation
```

### Labels
- `backend`
- `rbac`
- `feature`
- `high-priority`

### Estimate
- **8 story points** (Medium complexity)

---

## Issue 2: Implement Database-Driven RBAC Configuration

### Title
`[RBAC] Implement database-driven role configuration`

### Description
```markdown
Implement hybrid RBAC architecture with runtime permission matrix stored in CouchDB.

**Changes Required:**
1. Create CouchDB design documents and indexes for role and permission_matrix
2. Implement RoleService for role configuration management
3. Implement PermissionMatrixService for versioned permission matrix
4. Update RbacGuard to fetch runtime permission matrix with fallback to static

**Files Created:**
- ✅ `packages/shared/src/types/entities/role.ts`
- ✅ `apps/backend/src/modules/role/role.module.ts`
- ✅ `apps/backend/src/modules/role/role.controller.ts`
- ✅ `apps/backend/src/modules/role/role.service.ts`
- ✅ `apps/backend/src/modules/role/role.repository.interface.ts`
- ✅ `apps/backend/src/modules/role/role.repository.ts`
- ✅ `docs/implementation/COUCHDB_RBAC_DESIGN_DOCUMENTS.md`

**Documentation:**
- ✅ `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md` (hybrid architecture section)
- ✅ `docs/specifications/reviews/API_SPECIFICATION.md` (role configuration endpoints)

**Tasks:**
- [ ] Create CouchDB design documents (_design/role, _design/permission_matrix, _design/user_roles)
- [ ] Create Mango indexes (role-active-priority, permission-matrix-active, etc.)
- [ ] Implement RoleService methods (listRoles, getRoleById, getRolePermissions, updateRolePermissions)
- [ ] Implement RoleRepository CouchDB operations
- [ ] Implement PermissionMatrixService (getActivePermissionMatrix, createPermissionMatrixVersion, activatePermissionMatrixVersion)
- [ ] Update RbacGuard to fetch runtime permission matrix
- [ ] Add caching layer for permission matrix (5-minute TTL)
- [ ] Add permission matrix version history API
- [ ] Add tests for runtime permission matrix resolution
- [ ] Create setup script (scripts/setup-couchdb-rbac.ts)

**Acceptance Criteria:**
- CouchDB design documents and indexes are created
- RoleService can query and update role configurations
- Permission matrix versions are stored in CouchDB
- RbacGuard uses runtime permission matrix with static fallback
- Permission changes are versioned and logged
- Active permission matrix can be changed without code deployment
```

### Labels
- `backend`
- `rbac`
- `database`
- `feature`
- `high-priority`

### Estimate
- **13 story points** (High complexity)

---

## Issue 3: Implement Role Management Admin UI

### Title
`[RBAC] Implement role management admin UI`

### Description
```markdown
Create admin UI components for role assignment and permission matrix editing.

**Changes Required:**
1. Create RoleAssignmentDialog component
2. Create PermissionMatrixEditor component
3. Add admin role management page
4. Implement API integration

**Files Created:**
- ✅ `apps/frontend/src/components/admin/RoleAssignmentDialog.tsx`
- ✅ `apps/frontend/src/components/admin/PermissionMatrixEditor.tsx`

**Tasks:**
- [ ] Implement API calls in RoleAssignmentDialog
  - [ ] Fetch user roles
  - [ ] Assign roles PUT /api/v1/users/:userId/roles
  - [ ] Revoke role DELETE /api/v1/users/:userId/roles/:roleId
  - [ ] Update primary role PUT /api/v1/users/:userId/primary-role
- [ ] Add validation (primaryRole must be in roles array)
- [ ] Add loading and error states
- [ ] Add success/error toast notifications
- [ ] Implement API calls in PermissionMatrixEditor
  - [ ] Fetch active permission matrix
  - [ ] Create new permission matrix version
  - [ ] List permission matrix versions
  - [ ] Activate previous version
- [ ] Add permission matrix diff view
- [ ] Add confirmation dialogs for changes
- [ ] Add role change history display
- [ ] Create admin page route
- [ ] Add RBAC checks (GF-only access)
- [ ] Add E2E tests for role assignment workflow

**Acceptance Criteria:**
- GF users can assign/revoke roles for users
- GF users can update primary role
- GF users can edit permission matrix
- Changes create new permission matrix version
- UI shows version history
- UI shows unsaved changes warning
- All actions have confirmation dialogs
- Success/error feedback is provided
```

### Labels
- `frontend`
- `rbac`
- `admin-ui`
- `feature`
- `medium-priority`

### Estimate
- **8 story points** (Medium complexity)

---

## Issue 4: Update UI/UX for RBAC Role Badges

### Title
`[UI/UX] Update Figma designs for RBAC role badges and permissions`

### Description
```markdown
Update Figma designs to reflect corrected RBAC permissions and multiple roles support.

**Changes Required:**
1. Apply FIGMA-UPDATE-RBAC-ROLE-PERMISSIONS-2025-01.md migration prompt
2. Update all role badges to show multiple roles
3. Update permission indicators
4. Update role-specific UI variations

**Documentation:**
- ✅ `ui-ux/00-updates/FIGMA-UPDATE-RBAC-ROLE-PERMISSIONS-2025-01.md`
- ✅ Updated 9 UI/UX markdown files with corrected PLAN role permissions

**Files Updated:**
- ✅ `ui-ux/08-specialized/rbac-permission-indicators.md`
- ✅ `ui-ux/03-entity-forms/customer-form.md`
- ✅ `ui-ux/04-list-views/location-list.md`
- ✅ `ui-ux/04-list-views/contact-list.md`
- ✅ `ui-ux/03-entity-forms/opportunity-form.md`
- ✅ `ui-ux/03-entity-forms/bulk-import-form.md`
- ✅ `ui-ux/README.md`
- ✅ `ui-ux/06-dashboards/plan-dashboard.md`

**Tasks:**
- [ ] Open Figma project
- [ ] Apply migration prompt FIGMA-UPDATE-RBAC-ROLE-PERMISSIONS-2025-01.md
- [ ] Update all role badges to show primary + secondary roles
- [ ] Update permission indicators (Full, Limited, Read-only, Restricted)
- [ ] Update tooltips for role badges
- [ ] Update role-based UI variations (8 files)
- [ ] Verify PLAN role shows as "read-only" for customers
- [ ] Verify GF role shows as "full access"
- [ ] Export updated designs
- [ ] Update component library

**Acceptance Criteria:**
- All role badges show multiple roles (e.g., "ADM + INNEN")
- Primary role is visually distinct
- Permission indicators are accurate
- PLAN role correctly shows as read-only for customers
- All 8 affected files are updated in Figma
- Quality checklist from migration prompt is completed
```

### Labels
- `ui-ux`
- `design`
- `rbac`
- `figma`
- `medium-priority`

### Estimate
- **5 story points** (Design work)

---

## Issue 5: RBAC Documentation and Testing

### Title
`[RBAC] Complete documentation and testing for multiple roles`

### Description
```markdown
Complete documentation, testing, and deployment preparation for RBAC multiple roles feature.

**Changes Required:**
1. Complete integration tests for role assignment
2. Complete E2E tests for admin UI workflows
3. Update developer documentation
4. Create migration guide

**Documentation Created:**
- ✅ `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md` (v1.1)
- ✅ `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md` (v1.1)
- ✅ `docs/specifications/reviews/API_SPECIFICATION.md` (v1.1)
- ✅ `docs/implementation/LINEAR_ISSUE_SEARCH_RESULTS.md`
- ✅ `docs/implementation/UI_UX_RBAC_AUDIT_FINDINGS.md`
- ✅ `docs/implementation/COUCHDB_RBAC_DESIGN_DOCUMENTS.md`
- ✅ `docs/implementation/RBAC_MULTI_ROLE_IMPLEMENTATION_PLAN.md`

**Tasks:**
- [ ] Write unit tests for hasAnyRolePermission() and hasAllRolesPermission()
- [ ] Write integration tests for role assignment API
- [ ] Write integration tests for permission matrix API
- [ ] Write E2E tests for RoleAssignmentDialog workflow
- [ ] Write E2E tests for PermissionMatrixEditor workflow
- [ ] Test permission resolution with runtime matrix
- [ ] Test fallback to static matrix
- [ ] Create RBAC migration guide (single role → multiple roles)
- [ ] Update API documentation (OpenAPI/Swagger)
- [ ] Document role assignment best practices
- [ ] Document permission matrix versioning workflow
- [ ] Create deployment checklist
- [ ] Run security audit on permission checking
- [ ] Perform load testing on permission matrix caching

**Acceptance Criteria:**
- Test coverage ≥ 80% for RBAC code
- All API endpoints have integration tests
- E2E tests cover happy path and error cases
- Documentation is complete and reviewed
- Migration guide is tested with staging data
- Security audit passes
- Performance tests meet NFR targets
```

### Labels
- `testing`
- `documentation`
- `rbac`
- `high-priority`

### Estimate
- **8 story points** (Testing and documentation)

---

## Issue Creation Instructions

### Step 1: Search for Existing Issues

Before creating new issues, search Linear for:
- Keywords: "RBAC", "role", "permission", "multiple roles"
- Check if similar issues already exist
- If found, update existing issues instead of creating duplicates

### Step 2: Create Issues in Linear

For each issue above:
1. **Create new issue** in Linear
2. **Copy title** exactly as specified
3. **Copy description** markdown
4. **Add labels** as specified
5. **Set estimate** (story points)
6. **Link to implementation plan**: `docs/implementation/RBAC_MULTI_ROLE_IMPLEMENTATION_PLAN.md`
7. **Link to specification docs**:
   - `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md`
   - `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md`
   - `docs/specifications/reviews/API_SPECIFICATION.md`

### Step 3: Link Issues Together

Create dependencies:
- Issue 1 (Backend) **blocks** Issue 3 (UI)
- Issue 2 (Database) **blocks** Issue 1 (Backend)
- Issue 4 (UI/UX) is **parallel** to Issues 1-3
- Issue 5 (Testing) **depends on** Issues 1-3

### Step 4: Set Priority and Milestone

- **Priority**: High (Issues 1, 2, 5), Medium (Issues 3, 4)
- **Milestone**: RBAC Multiple Roles v1.0
- **Project**: KOMPASS Core Features

---

## Summary

**Total Issues**: 5  
**Total Story Points**: 42  
**Estimated Duration**: 3-4 sprints (depending on team capacity)

**Dependencies**:
```
Issue 2 (Database) ─→ Issue 1 (Backend) ─→ Issue 3 (UI)
                                            ↓
                                      Issue 5 (Testing)
                                            ↑
                      Issue 4 (UI/UX) ──────┘
```

**Implementation Order**:
1. Issue 2: Database-Driven RBAC (Foundation)
2. Issue 1: Multiple Roles Backend (Core Logic)
3. Issue 3: Admin UI (User-Facing Features)
4. Issue 4: UI/UX Updates (Design Sync)
5. Issue 5: Testing & Documentation (Quality Assurance)

---

## References

- Implementation Plan: `docs/implementation/RBAC_MULTI_ROLE_IMPLEMENTATION_PLAN.md`
- RBAC Specification: `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md`
- API Specification: `docs/specifications/reviews/API_SPECIFICATION.md`
- UI/UX Audit: `docs/implementation/UI_UX_RBAC_AUDIT_FINDINGS.md`

