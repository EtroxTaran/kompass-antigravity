# CouchDB Design Documents for RBAC System

**Date**: 2025-01-27  
**Status**: Specification  
**Purpose**: Define CouchDB design documents and views for database-driven RBAC

---

## Overview

This document specifies the CouchDB design documents, views, and indexes required for the hybrid RBAC system implementation.

**See Also**:
- `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md` - RBAC specification
- `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md` - Data model

---

## 1. Role Design Document

### Document ID

```
_design/role
```

### Views

#### View: `by_active`

**Purpose**: Query roles by active status

**Map Function**:
```javascript
function (doc) {
  if (doc.type === 'role') {
    emit([doc.active, doc.priority], {
      roleId: doc.roleId,
      name: doc.name,
      description: doc.description,
      active: doc.active,
      priority: doc.priority
    });
  }
}
```

**Query Examples**:
```javascript
// Get all active roles, sorted by priority (desc)
GET /kompass/_design/role/_view/by_active?startkey=[true,9999]&endkey=[true,0]&descending=true

// Get all roles (active and inactive)
GET /kompass/_design/role/_view/by_active
```

#### View: `by_roleId`

**Purpose**: Query roles by roleId for efficient lookup

**Map Function**:
```javascript
function (doc) {
  if (doc.type === 'role') {
    emit(doc.roleId, {
      _id: doc._id,
      roleId: doc.roleId,
      name: doc.name,
      active: doc.active,
      priority: doc.priority
    });
  }
}
```

**Query Example**:
```javascript
// Get role by roleId
GET /kompass/_design/role/_view/by_roleId?key="ADM"
```

### Mango Indexes

#### Index: `role-active-priority`

**Purpose**: Efficient filtering by active status and sorting by priority

**Definition**:
```json
{
  "index": {
    "fields": [
      "type",
      "active",
      "priority"
    ]
  },
  "name": "role-active-priority-index",
  "type": "json"
}
```

**Usage**:
```javascript
// Mango query for active roles sorted by priority
{
  "selector": {
    "type": "role",
    "active": true
  },
  "sort": [
    { "priority": "desc" }
  ],
  "use_index": "role-active-priority-index"
}
```

---

## 2. Permission Matrix Design Document

### Document ID

```
_design/permission_matrix
```

### Views

#### View: `by_version`

**Purpose**: Query permission matrices by version number

**Map Function**:
```javascript
function (doc) {
  if (doc.type === 'permission_matrix') {
    emit(doc.version, {
      version: doc.version,
      effectiveDate: doc.effectiveDate,
      active: doc.active,
      changelog: doc.changelog
    });
  }
}
```

**Query Examples**:
```javascript
// Get all versions sorted by version (desc)
GET /kompass/_design/permission_matrix/_view/by_version?descending=true

// Get specific version
GET /kompass/_design/permission_matrix/_view/by_version?key=5
```

#### View: `active`

**Purpose**: Get currently active permission matrix

**Map Function**:
```javascript
function (doc) {
  if (doc.type === 'permission_matrix' && doc.active === true) {
    emit(doc.effectiveDate, {
      _id: doc._id,
      version: doc.version,
      effectiveDate: doc.effectiveDate,
      matrix: doc.matrix
    });
  }
}
```

**Query Example**:
```javascript
// Get active permission matrix
GET /kompass/_design/permission_matrix/_view/active?limit=1&descending=true
```

### Mango Indexes

#### Index: `permission-matrix-active`

**Purpose**: Efficient lookup of active permission matrix

**Definition**:
```json
{
  "index": {
    "fields": [
      "type",
      "active",
      "effectiveDate"
    ]
  },
  "name": "permission-matrix-active-index",
  "type": "json"
}
```

**Usage**:
```javascript
// Mango query for active permission matrix
{
  "selector": {
    "type": "permission_matrix",
    "active": true
  },
  "sort": [
    { "effectiveDate": "desc" }
  ],
  "limit": 1,
  "use_index": "permission-matrix-active-index"
}
```

#### Index: `permission-matrix-version`

**Purpose**: Efficient version-based queries

**Definition**:
```json
{
  "index": {
    "fields": [
      "type",
      "version"
    ]
  },
  "name": "permission-matrix-version-index",
  "type": "json"
}
```

**Usage**:
```javascript
// Mango query for specific version
{
  "selector": {
    "type": "permission_matrix",
    "version": 5
  },
  "limit": 1,
  "use_index": "permission-matrix-version-index"
}
```

---

## 3. User Roles Design Document

### Document ID

```
_design/user_roles
```

### Views

#### View: `by_role`

**Purpose**: Query users by assigned roles

**Map Function**:
```javascript
function (doc) {
  if (doc.type === 'user' && doc.roles && Array.isArray(doc.roles)) {
    doc.roles.forEach(function(role) {
      emit(role, {
        userId: doc._id,
        email: doc.email,
        name: doc.name,
        primaryRole: doc.primaryRole,
        roles: doc.roles
      });
    });
  }
}
```

**Query Example**:
```javascript
// Get all users with ADM role
GET /kompass/_design/user_roles/_view/by_role?key="ADM"
```

#### View: `by_primary_role`

**Purpose**: Query users by primary role

**Map Function**:
```javascript
function (doc) {
  if (doc.type === 'user' && doc.primaryRole) {
    emit(doc.primaryRole, {
      userId: doc._id,
      email: doc.email,
      name: doc.name,
      primaryRole: doc.primaryRole,
      roles: doc.roles
    });
  }
}
```

**Query Example**:
```javascript
// Get all users with PLAN as primary role
GET /kompass/_design/user_roles/_view/by_primary_role?key="PLAN"
```

### Mango Indexes

#### Index: `user-roles-index`

**Purpose**: Efficient queries for users with specific roles

**Definition**:
```json
{
  "index": {
    "fields": [
      "type",
      "roles"
    ]
  },
  "name": "user-roles-index",
  "type": "json"
}
```

**Usage**:
```javascript
// Mango query for users with specific role
{
  "selector": {
    "type": "user",
    "roles": {
      "$in": ["ADM"]
    }
  },
  "use_index": "user-roles-index"
}
```

---

## 4. Installation Script

### TODO: Create CouchDB Setup Script

**File**: `scripts/setup-couchdb-rbac.ts`

**Purpose**: Automated script to install design documents and indexes

**Tasks**:
1. Connect to CouchDB
2. Create `_design/role` document with views
3. Create `_design/permission_matrix` document with views
4. Create `_design/user_roles` document with views
5. Create Mango indexes:
   - `role-active-priority-index`
   - `permission-matrix-active-index`
   - `permission-matrix-version-index`
   - `user-roles-index`
6. Verify indexes are built
7. Log success/failure

**Example Implementation Skeleton**:
```typescript
import { Nano } from 'nano';

async function setupRBACDesignDocuments(nano: Nano) {
  const db = nano.use('kompass');

  // 1. Create role design document
  await db.insert({
    _id: '_design/role',
    views: {
      by_active: {
        map: `function (doc) { ... }`,
      },
      by_roleId: {
        map: `function (doc) { ... }`,
      },
    },
  });

  // 2. Create permission_matrix design document
  // ...

  // 3. Create user_roles design document
  // ...

  // 4. Create Mango indexes
  await db.createIndex({
    index: { fields: ['type', 'active', 'priority'] },
    name: 'role-active-priority-index',
  });

  // ...
}
```

---

## 5. Query Performance Considerations

### Indexing Strategy

- **Always filter by `type` first** to limit document scans
- **Use compound indexes** for common query patterns
- **Avoid `$or` in selectors** when possible (use multiple queries instead)
- **Use `limit` and pagination** for large result sets

### Caching Strategy

- Cache active permission matrix in memory with 5-minute TTL
- Cache role configurations by roleId with 10-minute TTL
- Invalidate caches when permission matrix or role configurations are updated

### View vs Mango

- **Use views** for simple key-based lookups and sorting
- **Use Mango** for complex queries with multiple conditions
- **Create indexes** for all Mango queries to avoid full scans

---

## 6. Implementation Checklist

- [ ] Create `_design/role` document in CouchDB
- [ ] Create `_design/permission_matrix` document in CouchDB
- [ ] Create `_design/user_roles` document in CouchDB
- [ ] Create all Mango indexes
- [ ] Write setup script (`scripts/setup-couchdb-rbac.ts`)
- [ ] Test all views with sample data
- [ ] Test all Mango queries with sample data
- [ ] Document query patterns in repository implementations
- [ ] Add error handling for missing indexes
- [ ] Add retry logic for view updates

---

## 7. Testing

### Test Data Setup

Create test documents:
```javascript
// Test Role
{
  "_id": "role-TEST",
  "type": "role",
  "roleId": "TEST",
  "name": "Test Role",
  "description": "Test role for validation",
  "active": true,
  "priority": 50,
  "permissions": {},
  "createdAt": "2025-01-27T00:00:00.000Z",
  "createdBy": "system"
}

// Test Permission Matrix
{
  "_id": "permission-matrix-1",
  "type": "permission_matrix",
  "version": 1,
  "effectiveDate": "2025-01-27T00:00:00.000Z",
  "matrix": {},
  "changelog": [],
  "active": true,
  "createdAt": "2025-01-27T00:00:00.000Z",
  "createdBy": "system"
}

// Test User
{
  "_id": "user-test-123",
  "type": "user",
  "email": "test@example.com",
  "roles": ["ADM", "INNEN"],
  "primaryRole": "ADM",
  "roleChangeHistory": []
}
```

### View Testing

```bash
# Test role views
curl -X GET http://localhost:5984/kompass/_design/role/_view/by_active
curl -X GET http://localhost:5984/kompass/_design/role/_view/by_roleId?key="ADM"

# Test permission matrix views
curl -X GET http://localhost:5984/kompass/_design/permission_matrix/_view/active
curl -X GET http://localhost:5984/kompass/_design/permission_matrix/_view/by_version

# Test user roles views
curl -X GET http://localhost:5984/kompass/_design/user_roles/_view/by_role?key="ADM"
curl -X GET http://localhost:5984/kompass/_design/user_roles/_view/by_primary_role?key="PLAN"
```

---

## References

- CouchDB Views: https://docs.couchdb.org/en/stable/ddocs/views/index.html
- CouchDB Mango Queries: https://docs.couchdb.org/en/stable/api/database/find.html
- CouchDB Indexing: https://docs.couchdb.org/en/stable/ddocs/views/indexing.html

