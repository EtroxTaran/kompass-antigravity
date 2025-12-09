# API Specification

**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Status:** ✅ Finalized

## Cross-References

- **System Architecture:** `docs/architecture/system-architecture.md` - Complete technical specification and patterns
- **Data Model:** `docs/specifications/data-model.md` - Entity definitions and validation rules
- **RBAC Matrix:** `docs/specifications/rbac-permissions.md` - Permission requirements for endpoints
- **Test Strategy:** `docs/specifications/test-strategy.md` - API test scenarios
- **Architecture Rules:** `.cursor/rules/*.mdc` - API design patterns and OpenAPI standards

---

## Table of Contents

1. [API Design Principles](#1-api-design-principles)
2. [Authentication](#2-authentication)
3. [Versioning Strategy](#3-versioning-strategy)
4. [Error Response Format](#4-error-response-format-rfc-7807)
5. [User Role Management Endpoints (NEW)](#5-user-role-management-endpoints-new)
6. [Role Configuration Endpoints (NEW)](#6-role-configuration-endpoints-new)
7. [Permission Matrix Endpoints (NEW)](#7-permission-matrix-endpoints-new)
8. [Location Management Endpoints](#8-location-management-endpoints)
9. [Contact Decision Authority Endpoints](#9-contact-decision-authority-endpoints)
10. [Task Management Endpoints](#10-task-management-endpoints-new)
11. [Calendar & Export Endpoints](#11-calendar--export-endpoints-new)
12. [Time Tracking Endpoints](#12-time-tracking-endpoints-new-phase-1-mvp)
13. [Project Cost Management Endpoints](#13-project-cost-management-endpoints-new-phase-1-mvp)
14. [Request/Response DTOs](#14-requestresponse-dtos)
15. [OpenAPI Documentation Patterns](#15-openapi-documentation-patterns)
16. [Future Endpoints (Placeholders)](#16-future-endpoints-placeholders)
17. [AI Proxy Endpoints (NEW)](#23-ai-proxy-endpoints-new)

---

## 1. API Design Principles

### RESTful Conventions

KOMPASS follows RESTful API design principles as defined in `.cursorrules`:

#### HTTP Methods

| Method | Purpose                                   | Idempotent | Safe |
| ------ | ----------------------------------------- | ---------- | ---- |
| GET    | Retrieve resource(s)                      | ✅         | ✅   |
| POST   | Create new resource                       | ❌         | ❌   |
| PUT    | Update entire resource (full replacement) | ✅         | ❌   |
| PATCH  | Update partial resource                   | ❌         | ❌   |
| DELETE | Remove resource                           | ✅         | ❌   |

#### URL Structure

**✅ CORRECT: Resource-based URLs**

```
/api/v1/customers
/api/v1/customers/{customerId}
/api/v1/customers/{customerId}/locations
/api/v1/customers/{customerId}/locations/{locationId}
/api/v1/contacts/{contactId}
/api/v1/contacts/{contactId}/decision-authority
```

**❌ WRONG: Action-based URLs**

```
/api/v1/getCustomers
/api/v1/createCustomer
/api/v1/customer/list
```

### Nested Resources

For parent-child relationships (e.g., Customer → Location), use nested resource URLs:

- `/api/v1/customers/{customerId}/locations` - All locations for a customer
- `/api/v1/customers/{customerId}/locations/{locationId}` - Specific location

### Query Parameters

Use query parameters for filtering, sorting, and pagination:

- **Filtering:** `?locationType=branch&isActive=true`
- **Sorting:** `?sort=locationName&order=asc`
- **Pagination:** `?page=1&limit=20`
- **Search:** `?search=München`

---

## 2. Authentication

KOMPASS uses **Keycloak OIDC** for authentication. All API endpoints (except public health checks) require a valid JWT token issued by Keycloak.

### Authentication Flow

1. **User Login**: Frontend redirects user to Keycloak login page
2. **Keycloak Authentication**: User authenticates with Keycloak
3. **Token Issuance**: Keycloak issues JWT access token
4. **API Requests**: Frontend includes token in `Authorization` header
5. **Token Validation**: Backend validates token using Keycloak's public keys (JWKS)
6. **Role Extraction**: Backend extracts user roles from token for RBAC

### JWT Token Format

JWT tokens are issued by Keycloak and contain the following claims:

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "preferred_username": "username",
  "realm_access": {
    "roles": ["ADM", "PLAN"]
  },
  "resource_access": {
    "kompass-api": {
      "roles": ["ADM", "PLAN"]
    }
  },
  "exp": 1234567890,
  "iat": 1234567890,
  "iss": "http://keycloak:8080/realms/kompass",
  "aud": "kompass-api"
}
```

### Authorization Header

All authenticated requests must include the JWT token in the `Authorization` header:

```http
Authorization: Bearer {jwt_token}
```

**Example:**

```http
GET /api/v1/customers HTTP/1.1
Host: api.kompass.de
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Validation

The backend validates JWT tokens using:

1. **JWKS (JSON Web Key Set)**: Fetches public keys from Keycloak's well-known endpoint
2. **Token Signature**: Verifies token signature using Keycloak's public key
3. **Token Expiry**: Checks `exp` claim to ensure token is not expired
4. **Issuer Validation**: Verifies `iss` claim matches Keycloak realm
5. **Audience Validation**: Verifies `aud` claim matches configured client ID

### Role Extraction

User roles are extracted from the JWT token in the following priority:

1. **Client-specific roles**: `resource_access.{client-id}.roles` (preferred)
2. **Realm roles**: `realm_access.roles` (fallback)

Roles are mapped to KOMPASS `UserRole` enum:

- `ADM` → `UserRole.ADM`
- `INNEN` → `UserRole.INNEN`
- `PLAN` → `UserRole.PLAN`
- `KALK` → `UserRole.KALK`
- `BUCH` → `UserRole.BUCH`
- `GF` → `UserRole.GF`
- `ADMIN` → `UserRole.ADMIN`

### Authentication Endpoints

#### GET /auth/me

Get current authenticated user information.

**Request:**

```http
GET /auth/me HTTP/1.1
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**

```json
{
  "_id": "user-abc123",
  "type": "user",
  "email": "user@example.com",
  "displayName": "John Doe",
  "roles": ["ADM", "PLAN"],
  "primaryRole": "ADM",
  "active": true
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid or missing token

### Error Responses

#### 401 Unauthorized

Returned when:

- No `Authorization` header is provided
- Token is invalid or expired
- Token signature verification fails
- Token issuer or audience is invalid

**Response:**

```json
{
  "type": "https://api.kompass.de/errors/unauthorized",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Valid authentication token is required",
  "instance": "/api/v1/customers"
}
```

### Token Refresh

Frontend automatically refreshes tokens before expiry (within 30 seconds). If token refresh fails, the user is redirected to the login page.

### Public Endpoints

The following endpoints do not require authentication:

- Health check endpoints (if implemented)
- Public documentation endpoints

All other endpoints require a valid JWT token.

---

## 3. Versioning Strategy

KOMPASS uses **dual versioning** to support both header-based and path-based API versions.

### Path-Based Versioning (Primary)

All endpoints are prefixed with `/api/v1/`:

```
/api/v1/customers/{customerId}/locations
```

### Header-Based Versioning (Optional)

Clients can specify version via header:

```http
X-API-Version: 1
```

### Version Support

- **Current Version:** v1
- **Deprecation Policy:** Versions supported for minimum 12 months after new version release
- **Breaking Changes:** Require new major version (v2, v3, etc.)
- **Non-Breaking Changes:** Can be added to current version

---

## 4. Error Response Format (RFC 7807)

KOMPASS follows **RFC 7807 Problem Details for HTTP APIs** for consistent error responses.

### Error Response Schema

```typescript
interface ProblemDetails {
  type: string; // URI reference to problem type
  title: string; // Human-readable summary
  status: number; // HTTP status code
  detail?: string; // Human-readable explanation
  instance?: string; // URI reference to specific occurrence
  [key: string]: any; // Additional context-specific fields
}
```

### Example Error Responses

#### 400 Bad Request - Validation Error

```json
{
  "type": "https://api.kompass.de/errors/validation-error",
  "title": "Validation Failed",
  "status": 400,
  "detail": "One or more validation errors occurred",
  "instance": "/api/v1/customers/customer-123/locations",
  "errors": [
    {
      "field": "locationName",
      "message": "Location name must be 2-100 characters",
      "value": "M"
    },
    {
      "field": "deliveryAddress.zipCode",
      "message": "Invalid German postal code format",
      "value": "123"
    }
  ]
}
```

#### 401 Unauthorized

```json
{
  "type": "https://api.kompass.de/errors/unauthorized",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Valid authentication token is required",
  "instance": "/api/v1/customers/customer-123/locations"
}
```

#### 403 Forbidden - Insufficient Permissions

```json
{
  "type": "https://api.kompass.de/errors/forbidden",
  "title": "Forbidden",
  "status": 403,
  "detail": "You do not have permission to update contact decision-making roles",
  "instance": "/api/v1/contacts/contact-456/decision-authority",
  "requiredPermission": "Contact.UPDATE_DECISION_ROLE",
  "userRole": "ADM"
}
```

#### 404 Not Found

```json
{
  "type": "https://api.kompass.de/errors/not-found",
  "title": "Resource Not Found",
  "status": 404,
  "detail": "Location with ID 'location-999' not found",
  "instance": "/api/v1/customers/customer-123/locations/location-999",
  "resourceType": "Location",
  "resourceId": "location-999"
}
```

#### 409 Conflict - Business Rule Violation

```json
{
  "type": "https://api.kompass.de/errors/conflict",
  "title": "Conflict",
  "status": 409,
  "detail": "Location name 'Filiale München' already exists for this customer",
  "instance": "/api/v1/customers/customer-123/locations",
  "conflictType": "duplicate_location_name",
  "existingResourceId": "location-456"
}
```

#### 500 Internal Server Error

```json
{
  "type": "https://api.kompass.de/errors/internal-server-error",
  "title": "Internal Server Error",
  "status": 500,
  "detail": "An unexpected error occurred. Please contact support.",
  "instance": "/api/v1/customers/customer-123/locations",
  "errorId": "err-2025-01-28-12345"
}
```

---

## 5. User Role Management Endpoints (NEW)

**Updated:** 2025-01-27  
**Status:** Planned for implementation  
**RBAC:** GF and ADMIN only (except GET own roles)

### 4.1 Get User Roles

**GET** `/api/v1/users/{userId}/roles`

Retrieves all roles assigned to a user.

#### Request

**Path Parameters:**

- `userId` (string, required) - User ID

**Required Permission:** `User.READ_ROLES` (GF, ADMIN, or self)

#### Response

**200 OK:**

```json
{
  "userId": "user-abc123",
  "displayName": "Michael Schmidt",
  "roles": ["ADM", "PLAN"],
  "primaryRole": "ADM",
  "rolesAssignedBy": "user-gf-001",
  "rolesAssignedAt": "2025-01-15T10:30:00Z",
  "roleChangeHistory": [
    {
      "timestamp": "2025-01-15T10:30:00Z",
      "changedBy": "user-gf-001",
      "action": "ASSIGN",
      "role": "ADM",
      "reason": "Initial role assignment"
    },
    {
      "timestamp": "2025-01-20T14:00:00Z",
      "changedBy": "user-gf-001",
      "action": "ASSIGN",
      "role": "PLAN",
      "reason": "User now responsible for project planning"
    }
  ]
}
```

**403 Forbidden:** User cannot view other users' roles (unless GF/ADMIN)
**404 Not Found:** User ID does not exist

---

### 4.2 Assign Roles to User

**PUT** `/api/v1/users/{userId}/roles`

Assigns multiple roles to a user. Only GF and ADMIN can assign roles.

#### Request

**Path Parameters:**

- `userId` (string, required) - User ID

**Required Permission:** `User.ASSIGN_ROLES` (GF, ADMIN only)

**Request Body:**

```json
{
  "roles": ["ADM", "PLAN"],
  "primaryRole": "ADM",
  "reason": "User now handles both sales and project planning"
}
```

**Validation:**

- `roles`: Required, non-empty array, all values must be valid `UserRole` enum
- `primaryRole`: Required, must be in `roles[]` array
- `reason`: Required, 10-500 characters

#### Response

**200 OK:**

```json
{
  "userId": "user-abc123",
  "displayName": "Michael Schmidt",
  "roles": ["ADM", "PLAN"],
  "primaryRole": "ADM",
  "rolesAssignedBy": "user-gf-001",
  "rolesAssignedAt": "2025-01-27T11:00:00Z",
  "message": "Roles successfully assigned"
}
```

**400 Bad Request:** Invalid request (e.g., primaryRole not in roles array, empty roles array)
**403 Forbidden:** User does not have permission to assign roles
**404 Not Found:** User ID does not exist

#### Notes

- All existing roles are **replaced** with new roles array
- Audit log entry created with reason
- User's `roleChangeHistory` updated

---

### 4.3 Revoke Role from User

**DELETE** `/api/v1/users/{userId}/roles/{roleId}`

Removes a specific role from a user. Only GF and ADMIN can revoke roles.

#### Request

**Path Parameters:**

- `userId` (string, required) - User ID
- `roleId` (string, required) - Role to revoke (e.g., "PLAN")

**Required Permission:** `User.REVOKE_ROLES` (GF, ADMIN only)

**Request Body:**

```json
{
  "reason": "User transferred to different department"
}
```

**Validation:**

- `reason`: Required, 10-500 characters
- User must have at least one role remaining (cannot revoke last role)

#### Response

**200 OK:**

```json
{
  "userId": "user-abc123",
  "displayName": "Michael Schmidt",
  "roles": ["ADM"],
  "primaryRole": "ADM",
  "revokedRole": "PLAN",
  "revokedBy": "user-gf-001",
  "revokedAt": "2025-01-27T11:30:00Z",
  "message": "Role successfully revoked"
}
```

**400 Bad Request:** Cannot revoke last role
**403 Forbidden:** User does not have permission to revoke roles
**404 Not Found:** User ID or role ID does not exist

#### Notes

- If revoked role was `primaryRole`, system automatically sets `primaryRole` to first remaining role
- Audit log entry created with reason

---

### 4.4 Change User Primary Role

**PUT** `/api/v1/users/{userId}/primary-role`

Changes the user's primary role. Users can change their own primary role if the new role is in their `roles[]` array.

#### Request

**Path Parameters:**

- `userId` (string, required) - User ID

**Required Permission:** Self (for own primary role), GF, ADMIN (for any user)

**Request Body:**

```json
{
  "primaryRole": "PLAN"
}
```

**Validation:**

- `primaryRole`: Required, must be valid `UserRole` enum
- `primaryRole` must be in user's `roles[]` array

#### Response

**200 OK:**

```json
{
  "userId": "user-abc123",
  "primaryRole": "PLAN",
  "message": "Primary role successfully changed"
}
```

**400 Bad Request:** Primary role not in user's roles array
**403 Forbidden:** User cannot change another user's primary role (unless GF/ADMIN)
**404 Not Found:** User ID does not exist

---

## 6. Role Configuration Endpoints (NEW)

**Updated:** 2025-01-27  
**Status:** Planned for implementation (Hybrid RBAC Phase 2)  
**RBAC:** ADMIN only (except GET endpoints)

### 5.1 List All Roles

**GET** `/api/v1/roles`

Retrieves all role definitions.

#### Request

**Required Permission:** `Role.READ` (all roles can view)

**Query Parameters:**

- `active` (boolean, optional) - Filter by active status

#### Response

**200 OK:**

```json
{
  "roles": [
    {
      "roleId": "GF",
      "name": "Geschäftsführer",
      "description": "Business owners and top management with full system access",
      "active": true,
      "priority": 100
    },
    {
      "roleId": "PLAN",
      "name": "Planungsabteilung",
      "description": "Planning/design team responsible for project execution",
      "active": true,
      "priority": 50
    }
    // ... all roles
  ]
}
```

---

### 5.2 Get Role Details

**GET** `/api/v1/roles/{roleId}`

Retrieves detailed information about a specific role.

#### Request

**Path Parameters:**

- `roleId` (string, required) - Role identifier (e.g., "PLAN")

**Required Permission:** `Role.READ` (all roles can view)

#### Response

**200 OK:**

```json
{
  "_id": "role-plan",
  "roleId": "PLAN",
  "name": "Planungsabteilung",
  "description": "Planning/design team responsible for project execution",
  "permissions": {
    "Customer": {
      "READ": true,
      "CREATE": false,
      "UPDATE": false,
      "DELETE": false
    },
    "Project": {
      "READ": true,
      "CREATE": false,
      "UPDATE": true,
      "DELETE": false
    }
    // ... all entity permissions
  },
  "active": true,
  "priority": 50,
  "version": 1,
  "createdAt": "2025-01-27T10:00:00Z",
  "modifiedAt": "2025-01-27T10:00:00Z"
}
```

**404 Not Found:** Role ID does not exist

---

### 5.3 Get Role Permissions

**GET** `/api/v1/roles/{roleId}/permissions`

Retrieves the permission matrix for a specific role.

#### Request

**Path Parameters:**

- `roleId` (string, required) - Role identifier

**Required Permission:** `Role.READ`

#### Response

**200 OK:**

```json
{
  "roleId": "PLAN",
  "permissions": {
    "Customer": {
      "READ": true,
      "CREATE": false,
      "UPDATE": false,
      "DELETE": false
    },
    "Location": {
      "READ": true,
      "CREATE": true,
      "UPDATE": true,
      "DELETE": false
    },
    "Contact": {
      "READ": true,
      "CREATE": true,
      "UPDATE": true,
      "DELETE": false,
      "UPDATE_DECISION_ROLE": true
    },
    "Project": {
      "READ": true,
      "CREATE": false,
      "UPDATE": true,
      "DELETE": false
    },
    "Task": {
      "READ": true,
      "CREATE": true,
      "UPDATE": true,
      "DELETE": true
    }
  }
}
```

---

### 5.4 Update Role Permissions

**PUT** `/api/v1/roles/{roleId}/permissions`

Updates the permission matrix for a role. Only ADMIN can modify role permissions.

#### Request

**Path Parameters:**

- `roleId` (string, required) - Role identifier

**Required Permission:** `Role.UPDATE_PERMISSIONS` (ADMIN only)

**Request Body:**

```json
{
  "permissions": {
    "Customer": {
      "READ": true,
      "CREATE": false,
      "UPDATE": false,
      "DELETE": false
    }
    // ... updated permissions
  },
  "reason": "Removed Customer.UPDATE permission from PLAN role per security review"
}
```

**Validation:**

- `permissions`: Required, valid entity-permission mapping
- `reason`: Required, 10-500 characters

#### Response

**200 OK:**

```json
{
  "roleId": "PLAN",
  "permissions": {
    // ... updated permissions
  },
  "updatedBy": "user-admin-001",
  "updatedAt": "2025-01-27T12:00:00Z",
  "message": "Role permissions successfully updated"
}
```

**400 Bad Request:** Invalid permissions structure
**403 Forbidden:** User is not ADMIN
**404 Not Found:** Role ID does not exist

#### Notes

- Changes take effect immediately for all users with this role
- Audit log entry created with reason
- All active users notified of permission changes

---

## 7. Permission Matrix Endpoints (NEW)

**Updated:** 2025-01-27  
**Status:** Planned for implementation (Hybrid RBAC Phase 2)  
**RBAC:** ADMIN only (except GET current matrix)

### 6.1 Get Current Permission Matrix

**GET** `/api/v1/permissions/matrix`

Retrieves the currently active permission matrix.

#### Request

**Required Permission:** `Role.READ` (all roles can view)

**Query Parameters:**

- `version` (string, optional) - Specific version to retrieve (default: active version)

#### Response

**200 OK:**

```json
{
  "_id": "permission-matrix-v2.0",
  "version": "2.0",
  "effectiveDate": "2025-02-01T00:00:00Z",
  "active": true,
  "matrix": {
    "GF": {
      "Customer": {
        "READ": true,
        "CREATE": true,
        "UPDATE": true,
        "DELETE": true
      }
      // ... all entities
    },
    "PLAN": {
      "Customer": {
        "READ": true,
        "CREATE": false,
        "UPDATE": false,
        "DELETE": false
      }
      // ... all entities
    }
    // ... all roles
  },
  "previousVersion": "permission-matrix-v1.0",
  "changelog": "Corrected PLAN role permissions",
  "createdAt": "2025-01-27T10:00:00Z",
  "createdBy": "user-admin-001"
}
```

---

### 6.2 Create New Permission Matrix Version

**POST** `/api/v1/permissions/matrix`

Creates a new version of the permission matrix. Previous version is deactivated.

#### Request

**Required Permission:** `Role.UPDATE_PERMISSIONS` (ADMIN only)

**Request Body:**

```json
{
  "version": "2.1",
  "matrix": {
    // ... complete permission matrix for all roles
  },
  "effectiveDate": "2025-02-15T00:00:00Z",
  "changelog": "Added Invoice.APPROVE permission for BUCH role",
  "activateImmediately": true
}
```

**Validation:**

- `version`: Required, semantic version format, must be unique
- `matrix`: Required, complete permission matrix for all roles
- `effectiveDate`: Required, cannot be in the past if activating immediately
- `changelog`: Required, 10-500 characters
- `activateImmediately`: Optional, boolean (default: false)

#### Response

**201 Created:**

```json
{
  "_id": "permission-matrix-v2.1",
  "version": "2.1",
  "active": true,
  "effectiveDate": "2025-02-15T00:00:00Z",
  "previousVersion": "permission-matrix-v2.0",
  "message": "Permission matrix version 2.1 created and activated"
}
```

**400 Bad Request:** Invalid matrix structure or version already exists
**403 Forbidden:** User is not ADMIN

#### Notes

- If `activateImmediately: true`, previous matrix version is deactivated
- Changes take effect immediately for all users
- All active users notified of permission changes
- Complete audit log entry created

---

### 6.3 Update Permission Matrix (Shorthand)

**PUT** `/api/v1/permissions/matrix`

Updates the active permission matrix (creates new version automatically).

#### Request

**Required Permission:** `Role.UPDATE_PERMISSIONS` (ADMIN only)

**Request Body:**

```json
{
  "updates": {
    "PLAN": {
      "Customer": {
        "UPDATE": false
      }
    }
  },
  "changelog": "Removed PLAN Customer.UPDATE permission per security review"
}
```

**Validation:**

- `updates`: Required, partial matrix updates
- `changelog`: Required, 10-500 characters

#### Response

**200 OK:**

```json
{
  "version": "2.2",
  "active": true,
  "message": "Permission matrix updated successfully",
  "affectedRoles": ["PLAN"],
  "affectedUsers": 8
}
```

#### Notes

- Automatically increments minor version (e.g., 2.1 → 2.2)
- Merges updates with current matrix
- Creates new matrix version and activates it

---

### 6.4 List Permission Matrix Versions

**GET** `/api/v1/permissions/matrix/versions`

Lists all permission matrix versions with metadata.

#### Request

**Required Permission:** `Role.READ`

**Query Parameters:**

- `limit` (integer, optional) - Max results (default: 50)
- `includeInactive` (boolean, optional) - Include inactive versions (default: false)

#### Response

**200 OK:**

```json
{
  "versions": [
    {
      "_id": "permission-matrix-v2.0",
      "version": "2.0",
      "active": true,
      "effectiveDate": "2025-02-01T00:00:00Z",
      "changelog": "Corrected PLAN role permissions",
      "createdBy": "user-admin-001",
      "createdAt": "2025-01-27T10:00:00Z"
    },
    {
      "_id": "permission-matrix-v1.0",
      "version": "1.0",
      "active": false,
      "effectiveDate": "2025-01-01T00:00:00Z",
      "changelog": "Initial permission matrix",
      "createdBy": "system",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "totalCount": 2
}
```

---

### 6.5 Activate Permission Matrix Version (Rollback)

**PUT** `/api/v1/permissions/matrix/{version}/activate`

Activates a previous permission matrix version (rollback functionality).

#### Request

**Path Parameters:**

- `version` (string, required) - Version to activate (e.g., "1.0")

**Required Permission:** `Role.UPDATE_PERMISSIONS` (ADMIN only)

**Request Body:**

```json
{
  "reason": "Rolling back due to issues with v2.0 - PLAN users reporting access problems"
}
```

#### Response

**200 OK:**

```json
{
  "version": "1.0",
  "active": true,
  "previousActiveVersion": "2.0",
  "message": "Permission matrix rolled back to version 1.0"
}
```

**403 Forbidden:** User is not ADMIN
**404 Not Found:** Version does not exist

---

## 8. Location Management Endpoints

### 7.1 Create Location

**POST** `/api/v1/customers/{customerId}/locations`

Creates a new delivery location for a customer.

#### Request

**Path Parameters:**

- `customerId` (string, required) - Customer ID (format: `customer-{uuid}`)

**Request Body:**

```typescript
CreateLocationDto;
```

**Example Request:**

```http
POST /api/v1/customers/customer-12345/locations HTTP/1.1
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "locationName": "Filiale München Süd",
  "locationType": "branch",
  "deliveryAddress": {
    "street": "Lindwurmstraße",
    "streetNumber": "85",
    "zipCode": "80337",
    "city": "München",
    "country": "Deutschland"
  },
  "isActive": true,
  "deliveryNotes": "Hintereingang nutzen, Parkplatz vorhanden",
  "openingHours": "Mo-Fr 8:00-18:00, Sa 9:00-14:00"
}
```

#### Response

**201 Created**

```json
{
  "_id": "location-67890",
  "_rev": "1-abc123",
  "type": "location",
  "customerId": "customer-12345",
  "locationName": "Filiale München Süd",
  "locationType": "branch",
  "isActive": true,
  "deliveryAddress": {
    "street": "Lindwurmstraße",
    "streetNumber": "85",
    "zipCode": "80337",
    "city": "München",
    "country": "Deutschland"
  },
  "contactPersons": [],
  "deliveryNotes": "Hintereingang nutzen, Parkplatz vorhanden",
  "openingHours": "Mo-Fr 8:00-18:00, Sa 9:00-14:00",
  "createdBy": "user-adm-001",
  "createdAt": "2025-01-28T10:30:00Z",
  "modifiedBy": "user-adm-001",
  "modifiedAt": "2025-01-28T10:30:00Z",
  "version": 1
}
```

**Possible Errors:**

- `400` - Validation error (invalid address format, missing required fields)
- `401` - Unauthorized (no valid token)
- `403` - Forbidden (user cannot create locations for this customer)
- `404` - Customer not found
- `409` - Conflict (location name already exists for customer)

#### Permission Required

- `Location.CREATE` AND `Customer.READ` (for the parent customer)
- ADM can only create locations for their own customers
- GF/PLAN can create locations for any customer

---

### 4.2 List Locations for Customer

**GET** `/api/v1/customers/{customerId}/locations`

Retrieves all locations for a specific customer.

#### Request

**Path Parameters:**

- `customerId` (string, required) - Customer ID

**Query Parameters:**

- `locationType` (string, optional) - Filter by location type (`branch`, `warehouse`, etc.)
- `isActive` (boolean, optional) - Filter by active status
- `sort` (string, optional) - Sort field (default: `locationName`)
- `order` (string, optional) - Sort order (`asc` or `desc`, default: `asc`)

**Example Request:**

```http
GET /api/v1/customers/customer-12345/locations?locationType=branch&isActive=true HTTP/1.1
Authorization: Bearer {jwt_token}
```

#### Response

**200 OK**

```json
{
  "data": [
    {
      "_id": "location-67890",
      "locationName": "Filiale München Süd",
      "locationType": "branch",
      "isActive": true,
      "deliveryAddress": {
        "street": "Lindwurmstraße",
        "streetNumber": "85",
        "zipCode": "80337",
        "city": "München",
        "country": "Deutschland"
      },
      "contactPersons": ["contact-111"],
      "createdAt": "2025-01-28T10:30:00Z"
    },
    {
      "_id": "location-67891",
      "locationName": "Filiale Nürnberg",
      "locationType": "branch",
      "isActive": true,
      "deliveryAddress": {
        "street": "Hauptmarkt",
        "streetNumber": "12",
        "zipCode": "90403",
        "city": "Nürnberg",
        "country": "Deutschland"
      },
      "contactPersons": ["contact-222"],
      "createdAt": "2025-01-25T14:20:00Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20
}
```

**Possible Errors:**

- `401` - Unauthorized
- `403` - Forbidden (user cannot view this customer's locations)
- `404` - Customer not found

#### Permission Required

- `Location.READ` AND `Customer.READ`

---

### 4.3 Get Single Location

**GET** `/api/v1/customers/{customerId}/locations/{locationId}`

Retrieves a specific location by ID.

#### Request

**Path Parameters:**

- `customerId` (string, required) - Customer ID
- `locationId` (string, required) - Location ID

**Example Request:**

```http
GET /api/v1/customers/customer-12345/locations/location-67890 HTTP/1.1
Authorization: Bearer {jwt_token}
```

#### Response

**200 OK**

```json
{
  "_id": "location-67890",
  "_rev": "2-def456",
  "type": "location",
  "customerId": "customer-12345",
  "locationName": "Filiale München Süd",
  "locationType": "branch",
  "isActive": true,
  "deliveryAddress": {
    "street": "Lindwurmstraße",
    "streetNumber": "85",
    "addressLine2": "Hintereingang",
    "zipCode": "80337",
    "city": "München",
    "state": "Bayern",
    "country": "Deutschland",
    "latitude": 48.1351,
    "longitude": 11.582
  },
  "primaryContactPersonId": "contact-111",
  "contactPersons": ["contact-111", "contact-112"],
  "deliveryNotes": "Hintereingang nutzen, Parkplatz vorhanden",
  "openingHours": "Mo-Fr 8:00-18:00, Sa 9:00-14:00",
  "parkingInstructions": "Parkplätze direkt vor dem Gebäude",
  "createdBy": "user-adm-001",
  "createdAt": "2025-01-28T10:30:00Z",
  "modifiedBy": "user-adm-001",
  "modifiedAt": "2025-01-28T11:15:00Z",
  "version": 2
}
```

**Possible Errors:**

- `401` - Unauthorized
- `403` - Forbidden
- `404` - Location or Customer not found

#### Permission Required

- `Location.READ` AND `Customer.READ`

---

### 7.4 Update Location

**PUT** `/api/v1/customers/{customerId}/locations/{locationId}`

Updates an existing location (full replacement).

#### Request

**Path Parameters:**

- `customerId` (string, required) - Customer ID
- `locationId` (string, required) - Location ID

**Request Body:**

```typescript
UpdateLocationDto;
```

**Example Request:**

```http
PUT /api/v1/customers/customer-12345/locations/location-67890 HTTP/1.1
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "locationName": "Filiale München Süd (Hauptfiliale)",
  "locationType": "branch",
  "isActive": true,
  "deliveryAddress": {
    "street": "Lindwurmstraße",
    "streetNumber": "85",
    "addressLine2": "Hintereingang, 2. Stock",
    "zipCode": "80337",
    "city": "München",
    "state": "Bayern",
    "country": "Deutschland"
  },
  "primaryContactPersonId": "contact-111",
  "contactPersons": ["contact-111", "contact-112"],
  "deliveryNotes": "Hintereingang nutzen, Parkplatz vorhanden. Bei großen Lieferungen bitte 24h vorher anmelden.",
  "openingHours": "Mo-Fr 8:00-18:00, Sa 9:00-14:00",
  "parkingInstructions": "Parkplätze direkt vor dem Gebäude, max. 3,5t"
}
```

#### Response

**200 OK**

```json
{
  "_id": "location-67890",
  "_rev": "3-ghi789",
  "type": "location",
  "customerId": "customer-12345",
  "locationName": "Filiale München Süd (Hauptfiliale)",
  "locationType": "branch",
  "isActive": true,
  "deliveryAddress": {
    "street": "Lindwurmstraße",
    "streetNumber": "85",
    "addressLine2": "Hintereingang, 2. Stock",
    "zipCode": "80337",
    "city": "München",
    "state": "Bayern",
    "country": "Deutschland"
  },
  "primaryContactPersonId": "contact-111",
  "contactPersons": ["contact-111", "contact-112"],
  "deliveryNotes": "Hintereingang nutzen, Parkplatz vorhanden. Bei großen Lieferungen bitte 24h vorher anmelden.",
  "openingHours": "Mo-Fr 8:00-18:00, Sa 9:00-14:00",
  "parkingInstructions": "Parkplätze direkt vor dem Gebäude, max. 3,5t",
  "createdBy": "user-adm-001",
  "createdAt": "2025-01-28T10:30:00Z",
  "modifiedBy": "user-adm-001",
  "modifiedAt": "2025-01-28T14:45:00Z",
  "version": 3
}
```

**Possible Errors:**

- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden (user cannot update this location)
- `404` - Location or Customer not found
- `409` - Conflict (e.g., new location name already exists)

#### Permission Required

- `Location.UPDATE` AND `Customer.READ`

---

### 7.5 Delete Location

**DELETE** `/api/v1/customers/{customerId}/locations/{locationId}`

Deletes a location. Note: Cannot delete location if it's referenced in active projects or quotes.

#### Request

**Path Parameters:**

- `customerId` (string, required) - Customer ID
- `locationId` (string, required) - Location ID

**Example Request:**

```http
DELETE /api/v1/customers/customer-12345/locations/location-67890 HTTP/1.1
Authorization: Bearer {jwt_token}
```

#### Response

**204 No Content**

(Empty response body)

**Possible Errors:**

- `401` - Unauthorized
- `403` - Forbidden (user cannot delete this location)
- `404` - Location or Customer not found
- `409` - Conflict (location is referenced in active projects/quotes)

**Example 409 Conflict Response:**

```json
{
  "type": "https://api.kompass.de/errors/conflict",
  "title": "Conflict",
  "status": 409,
  "detail": "Cannot delete location: it is referenced in 3 active projects",
  "instance": "/api/v1/customers/customer-12345/locations/location-67890",
  "conflictType": "location_in_use",
  "referencedBy": [
    { "type": "project", "id": "project-111" },
    { "type": "project", "id": "project-222" },
    { "type": "quote", "id": "quote-333" }
  ]
}
```

#### Permission Required

- `Location.DELETE` AND `Customer.READ`

---

## 5. Contact Decision Authority Endpoints (NEW)

### 5.1 Get Contact Decision Authority

**GET** `/api/v1/contacts/{contactId}/decision-authority`

Retrieves decision-making role and authority information for a contact.

#### Request

**Path Parameters:**

- `contactId` (string, required) - Contact ID

**Example Request:**

```http
GET /api/v1/contacts/contact-111/decision-authority HTTP/1.1
Authorization: Bearer {jwt_token}
```

#### Response

**200 OK**

```json
{
  "contactId": "contact-111",
  "contactName": "Thomas Schmidt",
  "decisionMakingRole": "decision_maker",
  "authorityLevel": "final_authority",
  "canApproveOrders": true,
  "approvalLimitEur": 100000,
  "functionalRoles": ["owner_ceo", "purchasing_manager"],
  "departmentInfluence": ["purchasing", "operations", "finance"],
  "assignedLocationIds": ["location-001", "location-002"],
  "isPrimaryContactForLocations": ["location-001"],
  "lastUpdated": "2025-01-28T10:00:00Z",
  "updatedBy": "user-plan-001"
}
```

**Possible Errors:**

- `401` - Unauthorized
- `403` - Forbidden (user cannot view this contact)
- `404` - Contact not found

#### Permission Required

- `Contact.VIEW_AUTHORITY_LEVELS` (all roles have this permission)

---

### 5.2 Update Contact Decision Authority

**PUT** `/api/v1/contacts/{contactId}/decision-authority`

Updates decision-making role and authority for a contact. **Restricted to ADM+ users only.**

#### Request

**Path Parameters:**

- `contactId` (string, required) - Contact ID

**Request Body:**

```typescript
UpdateDecisionAuthorityDto;
```

**Example Request:**

```http
PUT /api/v1/contacts/contact-111/decision-authority HTTP/1.1
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "decisionMakingRole": "key_influencer",
  "authorityLevel": "high",
  "canApproveOrders": true,
  "approvalLimitEur": 50000,
  "functionalRoles": ["purchasing_manager", "operations_manager"],
  "departmentInfluence": ["purchasing", "operations"]
}
```

#### Response

**200 OK**

```json
{
  "contactId": "contact-111",
  "contactName": "Thomas Schmidt",
  "decisionMakingRole": "key_influencer",
  "authorityLevel": "high",
  "canApproveOrders": true,
  "approvalLimitEur": 50000,
  "functionalRoles": ["purchasing_manager", "operations_manager"],
  "departmentInfluence": ["purchasing", "operations"],
  "assignedLocationIds": ["location-001", "location-002"],
  "isPrimaryContactForLocations": ["location-001"],
  "lastUpdated": "2025-01-28T15:30:00Z",
  "updatedBy": "user-plan-001"
}
```

**Possible Errors:**

- `400` - Validation error (e.g., missing approval limit when canApproveOrders=true)
- `401` - Unauthorized
- `403` - Forbidden (only ADM+ can update decision-making roles)
- `404` - Contact not found

**Example 403 Forbidden Response:**

```json
{
  "type": "https://api.kompass.de/errors/forbidden",
  "title": "Forbidden",
  "status": 403,
  "detail": "Only ADM+ users (PLAN, GF) can update contact decision-making roles",
  "instance": "/api/v1/contacts/contact-111/decision-authority",
  "requiredPermission": "Contact.UPDATE_DECISION_ROLE",
  "userRole": "ADM"
}
```

#### Permission Required

- `Contact.UPDATE_DECISION_ROLE` (restricted to PLAN and GF roles)

---

## 6. Request/Response DTOs

### CreateLocationDto

```typescript
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  Length,
  Matches,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateLocationDto {
  @ApiProperty({
    description: "Descriptive name for the location",
    example: "Filiale München Süd",
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  @Matches(/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/, {
    message:
      "Location name can only contain letters, numbers, and basic punctuation",
  })
  locationName: string;

  @ApiProperty({
    description: "Type of location",
    enum: ["headquarter", "branch", "warehouse", "project_site", "other"],
    example: "branch",
  })
  @IsEnum(["headquarter", "branch", "warehouse", "project_site", "other"])
  locationType: string;

  @ApiProperty({
    description: "Delivery address for this location",
    type: () => AddressDto,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  deliveryAddress: AddressDto;

  @ApiProperty({
    description: "Whether the location is currently operational",
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: "Primary contact person ID for this location",
    example: "contact-111",
    required: false,
  })
  @IsOptional()
  @IsString()
  primaryContactPersonId?: string;

  @ApiProperty({
    description: "Array of contact person IDs assigned to this location",
    type: [String],
    example: ["contact-111", "contact-112"],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  contactPersons?: string[];

  @ApiProperty({
    description: "Special delivery instructions",
    example: "Hintereingang nutzen, Parkplatz vorhanden",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  deliveryNotes?: string;

  @ApiProperty({
    description: "Operating hours",
    example: "Mo-Fr 8:00-18:00, Sa 9:00-14:00",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  openingHours?: string;

  @ApiProperty({
    description: "Parking and access instructions",
    example: "Parkplätze vor dem Gebäude",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 300)
  parkingInstructions?: string;
}
```

### UpdateLocationDto

```typescript
// Same as CreateLocationDto, but all fields are optional
export class UpdateLocationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  locationName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(["headquarter", "branch", "warehouse", "project_site", "other"])
  locationType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  deliveryAddress?: AddressDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // ... other optional fields
}
```

### AddressDto

```typescript
export class AddressDto {
  @ApiProperty({
    description: "Street name",
    example: "Lindwurmstraße",
  })
  @IsString()
  @Length(2, 100)
  street: string;

  @ApiProperty({
    description: "House/building number",
    example: "85",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  streetNumber?: string;

  @ApiProperty({
    description: "Additional address information",
    example: "Hintereingang, 2. Stock",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  addressLine2?: string;

  @ApiProperty({
    description: "Postal code",
    example: "80337",
  })
  @IsString()
  @Matches(/^\d{5}$/, { message: "German postal code must be 5 digits" })
  zipCode: string;

  @ApiProperty({
    description: "City name",
    example: "München",
  })
  @IsString()
  @Length(2, 100)
  city: string;

  @ApiProperty({
    description: "State/Bundesland",
    example: "Bayern",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  state?: string;

  @ApiProperty({
    description: "Country name",
    example: "Deutschland",
    default: "Deutschland",
  })
  @IsString()
  @Length(2, 100)
  country: string;

  @ApiProperty({
    description: "GPS latitude",
    example: 48.1351,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: "GPS longitude",
    example: 11.582,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
```

### LocationResponseDto

```typescript
export class LocationResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  _rev: string;

  @ApiProperty()
  type: "location";

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  locationName: string;

  @ApiProperty()
  locationType: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  deliveryAddress: AddressDto;

  @ApiProperty({ required: false })
  primaryContactPersonId?: string;

  @ApiProperty({ type: [String] })
  contactPersons: string[];

  @ApiProperty({ required: false })
  deliveryNotes?: string;

  @ApiProperty({ required: false })
  openingHours?: string;

  @ApiProperty({ required: false })
  parkingInstructions?: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  modifiedBy: string;

  @ApiProperty()
  modifiedAt: Date;

  @ApiProperty()
  version: number;
}
```

### UpdateDecisionAuthorityDto

```typescript
export class UpdateDecisionAuthorityDto {
  @ApiProperty({
    description: "Decision-making role",
    enum: [
      "decision_maker",
      "key_influencer",
      "recommender",
      "gatekeeper",
      "operational_contact",
      "informational",
    ],
  })
  @IsEnum([
    "decision_maker",
    "key_influencer",
    "recommender",
    "gatekeeper",
    "operational_contact",
    "informational",
  ])
  decisionMakingRole: string;

  @ApiProperty({
    description: "Authority level",
    enum: ["low", "medium", "high", "final_authority"],
  })
  @IsEnum(["low", "medium", "high", "final_authority"])
  authorityLevel: string;

  @ApiProperty({
    description: "Can approve orders/quotes",
  })
  @IsBoolean()
  canApproveOrders: boolean;

  @ApiProperty({
    description: "Maximum order value they can approve (EUR)",
    example: 50000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000000)
  approvalLimitEur?: number;

  @ApiProperty({
    description: "Functional roles",
    type: [String],
    enum: [
      "owner_ceo",
      "purchasing_manager",
      "facility_manager",
      "store_manager",
      "project_coordinator",
      "financial_controller",
      "operations_manager",
      "administrative",
    ],
  })
  @IsString({ each: true })
  functionalRoles: string[];

  @ApiProperty({
    description: "Departments this contact influences",
    type: [String],
    example: ["purchasing", "operations"],
  })
  @IsString({ each: true })
  departmentInfluence: string[];
}
```

### DecisionAuthorityResponseDto

```typescript
export class DecisionAuthorityResponseDto {
  @ApiProperty()
  contactId: string;

  @ApiProperty()
  contactName: string;

  @ApiProperty()
  decisionMakingRole: string;

  @ApiProperty()
  authorityLevel: string;

  @ApiProperty()
  canApproveOrders: boolean;

  @ApiProperty({ required: false })
  approvalLimitEur?: number;

  @ApiProperty({ type: [String] })
  functionalRoles: string[];

  @ApiProperty({ type: [String] })
  departmentInfluence: string[];

  @ApiProperty({ type: [String] })
  assignedLocationIds: string[];

  @ApiProperty({ type: [String] })
  isPrimaryContactForLocations: string[];

  @ApiProperty()
  lastUpdated: Date;

  @ApiProperty()
  updatedBy: string;
}
```

---

## 7. OpenAPI Documentation Patterns

All endpoints MUST include complete OpenAPI documentation using NestJS decorators.

### Controller Documentation Example

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { JwtAuthGuard, RbacGuard } from "@/guards";
import { RequirePermission } from "@/decorators";
import { CurrentUser } from "@/decorators";
import { User } from "@/types";

@Controller("api/v1/customers/:customerId/locations")
@ApiTags("Locations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
export class LocationController {
  @Post()
  @ApiOperation({
    summary: "Create new location for customer",
    description:
      "Creates a new delivery location with address and operational details. Location names must be unique within a customer.",
  })
  @ApiParam({
    name: "customerId",
    description: "Customer ID",
    example: "customer-12345",
  })
  @ApiBody({ type: CreateLocationDto })
  @ApiResponse({
    status: 201,
    description: "Location created successfully",
    type: LocationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Validation error - invalid input data",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  @ApiResponse({
    status: 404,
    description: "Customer not found",
  })
  @ApiResponse({
    status: 409,
    description: "Conflict - location name already exists for this customer",
  })
  @RequirePermission("Location", "CREATE")
  async createLocation(
    @Param("customerId") customerId: string,
    @Body() createLocationDto: CreateLocationDto,
    @CurrentUser() user: User,
  ): Promise<LocationResponseDto> {
    return this.locationService.create(customerId, createLocationDto, user);
  }

  @Get()
  @ApiOperation({
    summary: "List all locations for customer",
    description:
      "Retrieves all delivery locations for a specific customer with optional filtering.",
  })
  @ApiParam({ name: "customerId", description: "Customer ID" })
  @ApiResponse({
    status: 200,
    description: "Locations retrieved successfully",
    type: [LocationResponseDto],
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  @ApiResponse({
    status: 404,
    description: "Customer not found",
  })
  @RequirePermission("Location", "READ")
  async listLocations(
    @Param("customerId") customerId: string,
    @CurrentUser() user: User,
  ): Promise<LocationResponseDto[]> {
    return this.locationService.findByCustomer(customerId, user);
  }

  // ... other endpoints
}
```

---

## 10. Task Management Endpoints (NEW)

**Updated:** 2025-01-28  
**Status:** Planned for implementation (Phase 1 - MVP)

### 9.1 UserTask Endpoints (Personal Todos)

User tasks are personal todo items accessible under user resource hierarchy.

---

#### 9.1.1 List User's Tasks

**GET** `/api/v1/users/{userId}/tasks`

Retrieves all tasks assigned to a specific user.

##### Request

**Path Parameters:**

- `userId` (string, required) - User ID

**Query Parameters:**

- `status` (string, optional) - Filter by status: 'open', 'in_progress', 'completed', 'cancelled'
- `priority` (string, optional) - Filter by priority: 'low', 'medium', 'high', 'urgent'
- `relatedTo` (string, optional) - Filter by related entity ID (customer/opportunity/project)
- `sort` (string, optional) - Sort field (default: 'dueDate')
- `order` (string, optional) - Sort order: 'asc' or 'desc' (default: 'asc')
- `overdue` (boolean, optional) - Show only overdue tasks

**Required Permission:** `UserTask.READ` (self for own tasks; GF for any user)

**Example Request:**

```http
GET /api/v1/users/user-abc123/tasks?status=open&priority=high&sort=dueDate&order=asc HTTP/1.1
Authorization: Bearer {jwt_token}
```

##### Response

**200 OK:**

```json
{
  "data": [
    {
      "_id": "usertask-12345",
      "_rev": "1-abc",
      "type": "user_task",
      "title": "Call Hofladen Müller about delivery timeline",
      "description": "Customer wants to confirm installation date for next month",
      "status": "open",
      "priority": "high",
      "dueDate": "2025-02-05T00:00:00Z",
      "assignedTo": "user-abc123",
      "relatedCustomerId": "customer-98765",
      "relatedCustomerName": "Hofladen Müller GmbH",
      "relatedOpportunityId": "opportunity-54321",
      "createdBy": "user-abc123",
      "createdAt": "2025-01-28T14:30:00Z",
      "modifiedBy": "user-abc123",
      "modifiedAt": "2025-01-28T14:30:00Z",
      "version": 1
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

**Possible Errors:**

- `401` - Unauthorized
- `403` - Forbidden (cannot view other users' tasks unless GF)
- `404` - User not found

---

#### 9.1.2 Get Single User Task

**GET** `/api/v1/users/{userId}/tasks/{taskId}`

Retrieves a specific user task by ID.

##### Request

**Path Parameters:**

- `userId` (string, required) - User ID
- `taskId` (string, required) - Task ID

**Required Permission:** `UserTask.READ` (own task or GF)

##### Response

**200 OK:**

```json
{
  "_id": "usertask-12345",
  "_rev": "1-abc",
  "type": "user_task",
  "title": "Call Hofladen Müller about delivery timeline",
  "description": "Customer wants to confirm installation date for next month",
  "status": "open",
  "priority": "high",
  "dueDate": "2025-02-05T00:00:00Z",
  "assignedTo": "user-abc123",
  "relatedCustomerId": "customer-98765",
  "relatedOpportunityId": "opportunity-54321",
  "createdBy": "user-abc123",
  "createdAt": "2025-01-28T14:30:00Z",
  "modifiedBy": "user-abc123",
  "modifiedAt": "2025-01-28T14:30:00Z",
  "version": 1
}
```

**Possible Errors:**

- `403` - Forbidden
- `404` - Task not found

---

#### 9.1.3 Create User Task

**POST** `/api/v1/users/{userId}/tasks`

Creates a new user task.

##### Request

**Path Parameters:**

- `userId` (string, required) - User ID

**Required Permission:** `UserTask.CREATE`

**Request Body:**

```json
{
  "title": "Follow up with customer about quote",
  "description": "Discuss delivery timeline and finalize pricing",
  "status": "open",
  "priority": "high",
  "dueDate": "2025-02-10T00:00:00Z",
  "assignedTo": "user-abc123",
  "relatedCustomerId": "customer-98765",
  "relatedOpportunityId": "opportunity-54321"
}
```

**Validation:**

- `title`: Required, 5-200 chars
- `status`: Required, enum ['open', 'in_progress', 'completed', 'cancelled']
- `priority`: Required, enum ['low', 'medium', 'high', 'urgent']
- `assignedTo`: Optional, defaults to current user; requires `ASSIGN_TO_OTHERS` permission if assigning to others
- `dueDate`: Optional, cannot be in past

##### Response

**201 Created:**

```json
{
  "_id": "usertask-12345",
  "_rev": "1-abc",
  "type": "user_task",
  "title": "Follow up with customer about quote",
  "description": "Discuss delivery timeline and finalize pricing",
  "status": "open",
  "priority": "high",
  "dueDate": "2025-02-10T00:00:00Z",
  "assignedTo": "user-abc123",
  "relatedCustomerId": "customer-98765",
  "relatedOpportunityId": "opportunity-54321",
  "createdBy": "user-abc123",
  "createdAt": "2025-01-28T15:00:00Z",
  "modifiedBy": "user-abc123",
  "modifiedAt": "2025-01-28T15:00:00Z",
  "version": 1
}
```

**Possible Errors:**

- `400` - Validation error
- `403` - Forbidden (trying to assign to other user without permission)
- `404` - Related entity not found

---

#### 9.1.4 Update User Task

**PUT** `/api/v1/users/{userId}/tasks/{taskId}`

Updates an existing user task (full replacement).

##### Request

**Path Parameters:**

- `userId` (string, required) - User ID
- `taskId` (string, required) - Task ID

**Required Permission:** `UserTask.UPDATE` (own task or GF)

**Request Body:**

```json
{
  "title": "Call Hofladen Müller - URGENT",
  "description": "Customer needs confirmation by EOD tomorrow",
  "status": "in_progress",
  "priority": "urgent",
  "dueDate": "2025-02-01T17:00:00Z"
}
```

##### Response

**200 OK:** (Returns updated task)

**Possible Errors:**

- `403` - Forbidden (cannot update other users' tasks)
- `404` - Task not found

---

#### 9.1.5 Update User Task Status Only

**PATCH** `/api/v1/users/{userId}/tasks/{taskId}/status`

Quick endpoint to update only task status (common operation).

##### Request

**Path Parameters:**

- `userId` (string, required) - User ID
- `taskId` (string, required) - Task ID

**Request Body:**

```json
{
  "status": "completed"
}
```

##### Response

**200 OK:**

```json
{
  "_id": "usertask-12345",
  "status": "completed",
  "completedAt": "2025-01-29T10:30:00Z",
  "completedBy": "user-abc123",
  "version": 2
}
```

**Notes:**

- Automatically sets `completedAt` and `completedBy` when marking completed
- Status transitions are validated

---

#### 9.1.6 Delete User Task

**DELETE** `/api/v1/users/{userId}/tasks/{taskId}`

Deletes a user task.

##### Request

**Path Parameters:**

- `userId` (string, required) - User ID
- `taskId` (string, required) - Task ID

**Required Permission:** `UserTask.DELETE` (own task or GF)

##### Response

**204 No Content**

**Possible Errors:**

- `403` - Forbidden
- `404` - Task not found

---

### 9.2 ProjectTask Endpoints (Project Work Items)

Project tasks are work items bound to projects, accessed under project resource hierarchy.

---

#### 9.2.1 List Project Tasks

**GET** `/api/v1/projects/{projectId}/tasks`

Retrieves all tasks for a specific project.

##### Request

**Path Parameters:**

- `projectId` (string, required) - Project ID

**Query Parameters:**

- `status` (string, optional) - Filter by status: 'todo', 'in_progress', 'review', 'done', 'blocked'
- `priority` (string, optional) - Filter by priority
- `phase` (string, optional) - Filter by phase: 'planning', 'execution', 'delivery', 'closure'
- `assignedTo` (string, optional) - Filter by assignee user ID
- `sort` (string, optional) - Sort field (default: 'priority')
- `order` (string, optional) - Sort order (default: 'desc')

**Required Permission:** `ProjectTask.READ` AND `Project.READ`

**Example Request:**

```http
GET /api/v1/projects/project-98765/tasks?status=in_progress&phase=planning&sort=dueDate&order=asc HTTP/1.1
Authorization: Bearer {jwt_token}
```

##### Response

**200 OK:**

```json
{
  "data": [
    {
      "_id": "projecttask-11111",
      "_rev": "2-def",
      "type": "project_task",
      "projectId": "project-98765",
      "projectName": "Hofladen Müller Ladenbau",
      "title": "Create technical drawings",
      "description": "Complete CAD drawings for store layout",
      "status": "in_progress",
      "priority": "high",
      "assignedTo": "user-plan-003",
      "assignedToName": "Anna Weber",
      "dueDate": "2025-02-15T00:00:00Z",
      "phase": "planning",
      "createdBy": "user-innen-001",
      "createdAt": "2025-01-28T09:00:00Z",
      "modifiedBy": "user-plan-003",
      "modifiedAt": "2025-01-29T11:00:00Z",
      "version": 2
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

**Possible Errors:**

- `403` - Forbidden (user cannot access this project)
- `404` - Project not found

---

#### 9.2.2 Get Single Project Task

**GET** `/api/v1/projects/{projectId}/tasks/{taskId}`

Retrieves a specific project task by ID.

##### Request

**Path Parameters:**

- `projectId` (string, required) - Project ID
- `taskId` (string, required) - Task ID

**Required Permission:** `ProjectTask.READ` AND `Project.READ`

##### Response

**200 OK:**

```json
{
  "_id": "projecttask-11111",
  "_rev": "2-def",
  "type": "project_task",
  "projectId": "project-98765",
  "projectName": "Hofladen Müller Ladenbau",
  "title": "Create technical drawings",
  "description": "Complete CAD drawings for store layout, include furniture placement and electrical plan",
  "status": "in_progress",
  "priority": "high",
  "assignedTo": "user-plan-003",
  "assignedToName": "Anna Weber",
  "dueDate": "2025-02-15T00:00:00Z",
  "phase": "planning",
  "milestone": null,
  "blockingReason": null,
  "completedAt": null,
  "createdBy": "user-innen-001",
  "createdAt": "2025-01-28T09:00:00Z",
  "modifiedBy": "user-plan-003",
  "modifiedAt": "2025-01-29T11:00:00Z",
  "version": 2
}
```

**Possible Errors:**

- `403` - Forbidden
- `404` - Task or Project not found

---

#### 9.2.3 Create Project Task

**POST** `/api/v1/projects/{projectId}/tasks`

Creates a new project task.

##### Request

**Path Parameters:**

- `projectId` (string, required) - Project ID

**Required Permission:** `ProjectTask.CREATE` AND `Project.READ`

**Request Body:**

```json
{
  "title": "Order custom furniture from supplier",
  "description": "Order items per approved design: counter units, shelving, checkout desk",
  "status": "todo",
  "priority": "critical",
  "assignedTo": "user-innen-001",
  "dueDate": "2025-02-20T00:00:00Z",
  "phase": "execution"
}
```

**Validation:**

- `title`: Required, 5-200 chars
- `status`: Required, enum ['todo', 'in_progress', 'review', 'done', 'blocked']
- `priority`: Required, enum ['low', 'medium', 'high', 'critical']
- `assignedTo`: Required, must have Project.READ permission
- `dueDate`: Optional, cannot be in past
- `phase`: Optional, enum ['planning', 'execution', 'delivery', 'closure']

##### Response

**201 Created:**

```json
{
  "_id": "projecttask-22222",
  "_rev": "1-ghi",
  "type": "project_task",
  "projectId": "project-98765",
  "title": "Order custom furniture from supplier",
  "description": "Order items per approved design: counter units, shelving, checkout desk",
  "status": "todo",
  "priority": "critical",
  "assignedTo": "user-innen-001",
  "dueDate": "2025-02-20T00:00:00Z",
  "phase": "execution",
  "createdBy": "user-innen-001",
  "createdAt": "2025-01-28T16:00:00Z",
  "modifiedBy": "user-innen-001",
  "modifiedAt": "2025-01-28T16:00:00Z",
  "version": 1
}
```

**Possible Errors:**

- `400` - Validation error (invalid assignee, missing required fields)
- `403` - Forbidden (cannot create tasks for this project)
- `404` - Project not found

---

#### 9.2.4 Update Project Task

**PUT** `/api/v1/projects/{projectId}/tasks/{taskId}`

Updates an existing project task (full replacement).

##### Request

**Path Parameters:**

- `projectId` (string, required) - Project ID
- `taskId` (string, required) - Task ID

**Required Permission:** `ProjectTask.UPDATE` AND `Project.READ`

**Request Body:**

```json
{
  "title": "Order custom furniture from supplier - BLOCKED",
  "description": "Order items per approved design: counter units, shelving, checkout desk",
  "status": "blocked",
  "priority": "critical",
  "assignedTo": "user-innen-001",
  "dueDate": "2025-02-20T00:00:00Z",
  "phase": "execution",
  "blockingReason": "Waiting for final approval from customer on wood finish selection"
}
```

**Validation:**

- `blockingReason`: Required if status = 'blocked', 10-500 chars

##### Response

**200 OK:** (Returns updated task)

**Possible Errors:**

- `400` - Validation error (e.g., missing blockingReason when blocked)
- `403` - Forbidden
- `404` - Task or Project not found

---

#### 9.2.5 Update Project Task Status Only

**PATCH** `/api/v1/projects/{projectId}/tasks/{taskId}/status`

Quick endpoint to update only task status.

##### Request

**Path Parameters:**

- `projectId` (string, required) - Project ID
- `taskId` (string, required) - Task ID

**Request Body:**

```json
{
  "status": "done",
  "blockingReason": null
}
```

##### Response

**200 OK:**

```json
{
  "_id": "projecttask-11111",
  "status": "done",
  "completedAt": "2025-02-14T16:45:00Z",
  "completedBy": "user-plan-003",
  "version": 3
}
```

**Notes:**

- Automatically sets `completedAt` and `completedBy` when marking done
- Validates status transitions

---

#### 9.2.6 Delete Project Task

**DELETE** `/api/v1/projects/{projectId}/tasks/{taskId}`

Deletes a project task.

##### Request

**Path Parameters:**

- `projectId` (string, required) - Project ID
- `taskId` (string, required) - Task ID

**Required Permission:** `ProjectTask.DELETE` AND `Project.READ`

##### Response

**204 No Content**

**Possible Errors:**

- `403` - Forbidden (INNEN/KALK can only delete own created tasks)
- `404` - Task or Project not found

---

#### 9.2.7 Group Project Tasks by Phase

**GET** `/api/v1/projects/{projectId}/tasks/by-phase`

Retrieves project tasks grouped by project phase.

##### Request

**Path Parameters:**

- `projectId` (string, required) - Project ID

**Required Permission:** `ProjectTask.READ` AND `Project.READ`

##### Response

**200 OK:**

```json
{
  "projectId": "project-98765",
  "projectName": "Hofladen Müller Ladenbau",
  "tasksByPhase": {
    "planning": [
      {
        "_id": "projecttask-11111",
        "title": "Create technical drawings",
        "status": "done",
        "priority": "high",
        "assignedTo": "user-plan-003",
        "dueDate": "2025-02-15T00:00:00Z"
      }
    ],
    "execution": [
      {
        "_id": "projecttask-22222",
        "title": "Order custom furniture",
        "status": "blocked",
        "priority": "critical",
        "assignedTo": "user-innen-001",
        "dueDate": "2025-02-20T00:00:00Z"
      }
    ],
    "delivery": [],
    "closure": []
  },
  "total": 2
}
```

---

#### 9.2.8 Group Project Tasks by Assignee

**GET** `/api/v1/projects/{projectId}/tasks/by-assignee`

Retrieves project tasks grouped by assigned user (workload view).

##### Request

**Path Parameters:**

- `projectId` (string, required) - Project ID

**Required Permission:** `ProjectTask.READ` AND `Project.READ`

##### Response

**200 OK:**

```json
{
  "projectId": "project-98765",
  "tasksByAssignee": {
    "user-plan-003": {
      "userName": "Anna Weber",
      "role": "PLAN",
      "tasks": [
        {
          "_id": "projecttask-11111",
          "title": "Create technical drawings",
          "status": "done",
          "priority": "high"
        }
      ],
      "taskCount": 1,
      "openTasks": 0,
      "completedTasks": 1
    },
    "user-innen-001": {
      "userName": "Michael Schmidt",
      "role": "INNEN",
      "tasks": [
        {
          "_id": "projecttask-22222",
          "title": "Order custom furniture",
          "status": "blocked",
          "priority": "critical"
        }
      ],
      "taskCount": 1,
      "openTasks": 1,
      "completedTasks": 0
    }
  },
  "total": 2
}
```

---

### 9.3 Cross-Entity Task Endpoints (Dashboard Views)

These endpoints aggregate tasks across multiple entities for dashboard views.

---

#### 9.3.1 Get My Tasks (Current User)

**GET** `/api/v1/tasks/my-tasks`

Retrieves all tasks (UserTask + ProjectTask) assigned to current user.

##### Request

**Query Parameters:**

- `status` (string, optional) - Filter by status
- `priority` (string, optional) - Filter by priority
- `overdue` (boolean, optional) - Show only overdue tasks
- `dueWithin` (number, optional) - Show tasks due within N days

**Required Permission:** Authenticated user (self)

**Example Request:**

```http
GET /api/v1/tasks/my-tasks?overdue=false&dueWithin=7 HTTP/1.1
Authorization: Bearer {jwt_token}
```

##### Response

**200 OK:**

```json
{
  "userTasks": [
    {
      "_id": "usertask-12345",
      "title": "Call Hofladen Müller",
      "status": "open",
      "priority": "high",
      "dueDate": "2025-02-05T00:00:00Z",
      "relatedCustomerName": "Hofladen Müller GmbH"
    }
  ],
  "projectTasks": [
    {
      "_id": "projecttask-11111",
      "title": "Create technical drawings",
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2025-02-15T00:00:00Z",
      "projectName": "Hofladen Müller Ladenbau",
      "phase": "planning"
    }
  ],
  "summary": {
    "totalOpen": 2,
    "totalInProgress": 1,
    "totalOverdue": 0,
    "totalDueToday": 0,
    "totalDueThisWeek": 2
  }
}
```

---

#### 9.3.2 Get Team Tasks

**GET** `/api/v1/tasks/team-tasks`

Retrieves tasks for user's team (filtered by role permissions).

##### Request

**Query Parameters:**

- `status` (string, optional) - Filter by status
- `priority` (string, optional) - Filter by priority

**Required Permission:** `ProjectTask.READ` (scope varies by role)

##### Response

**200 OK:**

```json
{
  "projectTasks": [
    {
      "_id": "projecttask-11111",
      "title": "Create technical drawings",
      "status": "in_progress",
      "priority": "high",
      "assignedTo": "user-plan-003",
      "assignedToName": "Anna Weber",
      "projectName": "Hofladen Müller Ladenbau",
      "dueDate": "2025-02-15T00:00:00Z"
    }
  ],
  "summary": {
    "totalTasks": 15,
    "byStatus": {
      "todo": 5,
      "in_progress": 7,
      "review": 2,
      "done": 1,
      "blocked": 0
    },
    "byPriority": {
      "low": 3,
      "medium": 6,
      "high": 4,
      "critical": 2
    }
  }
}
```

**Notes:**

- GF sees all project tasks across all projects
- PLAN sees tasks for assigned projects
- INNEN/KALK see all project tasks
- ADM sees tasks for own customer projects only
- BUCH sees all project tasks (read-only)

---

#### 9.3.3 Get Overdue Tasks

**GET** `/api/v1/tasks/overdue`

Retrieves all overdue tasks for current user (or team if GF/PLAN).

##### Request

**Required Permission:** Authenticated user

##### Response

**200 OK:**

```json
{
  "userTasks": [
    {
      "_id": "usertask-99999",
      "title": "Follow up on pending offer",
      "priority": "medium",
      "dueDate": "2025-01-25T00:00:00Z",
      "daysOverdue": 3
    }
  ],
  "projectTasks": [],
  "total": 1
}
```

---

### 9.4 Task DTOs

#### CreateUserTaskDto

```typescript
export class CreateUserTaskDto {
  @ApiProperty({
    description: "Task title",
    example: "Call Hofladen Müller about delivery",
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @Length(5, 200)
  @Matches(/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&(),!?]+$/)
  title: string;

  @ApiProperty({
    description: "Detailed description",
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({
    description: "Task status",
    enum: ["open", "in_progress", "completed", "cancelled"],
    default: "open",
  })
  @IsEnum(["open", "in_progress", "completed", "cancelled"])
  status: string;

  @ApiProperty({
    description: "Task priority",
    enum: ["low", "medium", "high", "urgent"],
  })
  @IsEnum(["low", "medium", "high", "urgent"])
  priority: string;

  @ApiProperty({
    description: "Due date",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty({
    description: "User ID to assign task to (defaults to current user)",
    required: false,
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({
    description: "Related customer ID",
    required: false,
  })
  @IsOptional()
  @IsString()
  relatedCustomerId?: string;

  @ApiProperty({
    description: "Related opportunity ID",
    required: false,
  })
  @IsOptional()
  @IsString()
  relatedOpportunityId?: string;

  @ApiProperty({
    description: "Related project ID",
    required: false,
  })
  @IsOptional()
  @IsString()
  relatedProjectId?: string;
}
```

#### CreateProjectTaskDto

```typescript
export class CreateProjectTaskDto {
  @ApiProperty({
    description: "Task title",
    example: "Create technical drawings",
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @Length(5, 200)
  @Matches(/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&(),!?]+$/)
  title: string;

  @ApiProperty({
    description: "Detailed description",
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({
    description: "Task status",
    enum: ["todo", "in_progress", "review", "done", "blocked"],
    default: "todo",
  })
  @IsEnum(["todo", "in_progress", "review", "done", "blocked"])
  status: string;

  @ApiProperty({
    description: "Task priority",
    enum: ["low", "medium", "high", "critical"],
  })
  @IsEnum(["low", "medium", "high", "critical"])
  priority: string;

  @ApiProperty({
    description: "User ID to assign task to (must have Project.READ)",
    required: true,
  })
  @IsString()
  assignedTo: string;

  @ApiProperty({
    description: "Due date",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty({
    description: "Project phase",
    enum: ["planning", "execution", "delivery", "closure"],
    required: false,
  })
  @IsOptional()
  @IsEnum(["planning", "execution", "delivery", "closure"])
  phase?: string;

  @ApiProperty({
    description: "Milestone ID",
    required: false,
  })
  @IsOptional()
  @IsString()
  milestone?: string;

  @ApiProperty({
    description: "Blocking reason (required if status = blocked)",
    required: false,
    minLength: 10,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(10, 500)
  blockingReason?: string;
}
```

#### UpdateTaskStatusDto

```typescript
export class UpdateTaskStatusDto {
  @ApiProperty({
    description: "New status",
    enum: {
      UserTask: ["open", "in_progress", "completed", "cancelled"],
      ProjectTask: ["todo", "in_progress", "review", "done", "blocked"],
    },
  })
  @IsString()
  status: string;

  @ApiProperty({
    description:
      "Blocking reason (required if status = blocked for ProjectTask)",
    required: false,
  })
  @IsOptional()
  @IsString()
  blockingReason?: string;
}
```

---

## 10. Future Endpoints (Placeholders)

The following endpoints will be documented in future iterations:

### Customer Management (TBD)

```
GET    /api/v1/customers               - List all customers
GET    /api/v1/customers/{id}          - Get customer by ID
POST   /api/v1/customers               - Create new customer
PUT    /api/v1/customers/{id}          - Update customer
DELETE /api/v1/customers/{id}          - Delete customer
GET    /api/v1/customers/{id}/contacts - List contacts for customer
```

### Contact Management (TBD)

```
GET    /api/v1/contacts                - List all contacts
GET    /api/v1/contacts/{id}           - Get contact by ID
POST   /api/v1/contacts                - Create new contact
PUT    /api/v1/contacts/{id}           - Update contact
DELETE /api/v1/contacts/{id}           - Delete contact
```

### Tour Planning & Expense Management (NEW - Phase 2)

**Added:** 2025-01-28  
**Status:** Planned for Phase 2 (Q3 2025)  
**Purpose:** Field sales tour planning, meeting scheduling, expense tracking with approval

#### Tour Management

```
GET    /api/v1/tours                           - List user's tours
POST   /api/v1/tours                           - Create new tour
GET    /api/v1/tours/{tourId}                  - Get tour details
PUT    /api/v1/tours/{tourId}                  - Update tour
DELETE /api/v1/tours/{tourId}                  - Delete tour (planned only)
POST   /api/v1/tours/{tourId}/complete         - Mark tour as completed
GET    /api/v1/tours/{tourId}/cost-summary     - Get tour cost breakdown
```

**Query Parameters (GET /api/v1/tours):**

- `status`: Filter by status (planned, active, completed, cancelled)
- `startDate`, `endDate`: Date range filters
- `userId`: Filter by user (GF/PLAN only)
- `page`, `limit`: Pagination
- `sort`, `order`: Sorting

**Business Rules:**

- ADM can only manage own tours
- PLAN/GF can manage all tours
- Cannot delete tour if expenses linked
- Complete requires all meetings attended/cancelled

#### Meeting Management

```
GET    /api/v1/meetings                        - List meetings
POST   /api/v1/meetings                        - Create meeting
GET    /api/v1/meetings/{meetingId}            - Get meeting details
PUT    /api/v1/meetings/{meetingId}            - Update meeting
DELETE /api/v1/meetings/{meetingId}            - Delete meeting (scheduled only)
POST   /api/v1/meetings/{meetingId}/check-in  - GPS check-in at location
PUT    /api/v1/meetings/{meetingId}/outcome   - Update meeting outcome
POST   /api/v1/meetings/{meetingId}/link-tour - Link meeting to tour
```

**Query Parameters (GET /api/v1/meetings):**

- `status`: Filter by status (scheduled, completed, cancelled)
- `scheduledFrom`, `scheduledTo`: Date range
- `customerId`, `tourId`: Relationship filters
- `userId`: Filter by user (GF/PLAN only)

**Business Rules:**

- Auto-suggests tours on meeting creation (same day, <50km)
- GPS check-in validates proximity (500m tolerance)
- Check-in auto-creates activity protocol
- Outcome required within 24h (ADM), anytime (PLAN/GF)

#### Hotel Stay Management

```
GET    /api/v1/tours/{tourId}/hotel-stays                 - List hotel stays for tour
POST   /api/v1/tours/{tourId}/hotel-stays                 - Add hotel stay
GET    /api/v1/tours/{tourId}/hotel-stays/{hotelStayId}  - Get hotel stay details
PUT    /api/v1/tours/{tourId}/hotel-stays/{hotelStayId}  - Update hotel stay
DELETE /api/v1/tours/{tourId}/hotel-stays/{hotelStayId}  - Delete hotel stay
GET    /api/v1/hotels/search                              - Search nearby hotels
GET    /api/v1/hotels/my-preferences                      - Get user's preferred hotels
```

**Query Parameters (GET /api/v1/hotels/search):**

- `latitude`, `longitude`: GPS coordinates (required)
- `radius`: Search radius in km (default: 10)
- `minRating`, `maxPrice`: Filtering
- `userPreferences`: Include past hotels (default: true)

**Business Rules:**

- Auto-creates expense entry for hotel
- Adds to preferences if rating ≥ 4
- Cannot delete if expense approved/paid
- Search integrates Google Places API

#### Expense Management

```
GET    /api/v1/expenses                                - List expenses
POST   /api/v1/expenses                                - Create expense
GET    /api/v1/expenses/{expenseId}                    - Get expense details
PUT    /api/v1/expenses/{expenseId}                    - Update expense (draft/rejected)
DELETE /api/v1/expenses/{expenseId}                    - Delete expense (draft only)
POST   /api/v1/expenses/{expenseId}/receipt           - Upload receipt image
POST   /api/v1/expenses/{expenseId}/submit            - Submit for approval
POST   /api/v1/expenses/{expenseId}/approve           - Approve expense (GF only)
POST   /api/v1/expenses/{expenseId}/reject            - Reject expense (GF only)
POST   /api/v1/expenses/{expenseId}/mark-paid         - Mark as paid (BUCH/GF)
POST   /api/v1/expenses/bulk-approve                   - Bulk approve (GF only)
GET    /api/v1/expenses/report                         - Generate expense report
```

**Query Parameters (GET /api/v1/expenses):**

- `status`: Filter by status (draft, submitted, approved, rejected, paid)
- `category`: Filter by category (mileage, hotel, meal, fuel, etc.)
- `userId`, `tourId`, `meetingId`, `projectId`: Relationship filters
- `expenseFrom`, `expenseTo`: Date range
- `page`, `limit`: Pagination

**Business Rules:**

- Receipt required for amounts > €25 (except mileage)
- OCR auto-extracts amount/vendor (user verifies)
- Approval workflow: draft → submitted → approved → paid
- GF-only approval for all expenses
- Rejection reason required (min 10 chars)
- Can resubmit after rejection
- Audit log for all status changes

**Expense Report Formats:**

- `format=json`: JSON response
- `format=pdf`: PDF download
- `format=csv`: CSV download

#### Mileage Log Management

```
GET    /api/v1/tours/{tourId}/mileage-logs                    - List mileage logs for tour
POST   /api/v1/tours/{tourId}/mileage-logs                    - Create mileage log
GET    /api/v1/tours/{tourId}/mileage-logs/{mileageLogId}    - Get mileage log details
PUT    /api/v1/tours/{tourId}/mileage-logs/{mileageLogId}    - Update mileage log
DELETE /api/v1/tours/{tourId}/mileage-logs/{mileageLogId}    - Delete mileage log
POST   /api/v1/mileage-logs/{mileageLogId}/override-distance - Override GPS distance (GF only)
GET    /api/v1/mileage-logs/{mileageLogId}/route             - Get GPS route audit trail
```

**Business Rules:**

- Auto-creates expense entry for mileage
- GPS distance vs. claimed distance validated (±5%)
- If outside tolerance, manual override required (GF + reason)
- Route stored as GeoJSON for audit
- Cannot edit/delete if expense approved/paid
- Standard rate: €0.30/km (Germany)

---

### Opportunity Management (TBD)

```
GET    /api/v1/opportunities           - List opportunities
POST   /api/v1/opportunities           - Create opportunity
PUT    /api/v1/opportunities/{id}      - Update opportunity
GET    /api/v1/opportunities/{id}/approval-check - Check if exceeds contact approval limits
```

### Project Management (TBD)

```
GET    /api/v1/projects                - List projects
POST   /api/v1/projects                - Create project
PUT    /api/v1/projects/{id}           - Update project
GET    /api/v1/projects/{id}/delivery-location - Get project delivery location
```

### Offer Management (Angebot)

**Note:** Invoicing is handled by Lexware, not KOMPASS. Offers are managed in KOMPASS for financial tracking only.

```
GET    /api/v1/customers/{customerId}/offers           - List offers for customer
POST   /api/v1/customers/{customerId}/offers           - Create new offer (with PDF upload)
GET    /api/v1/customers/{customerId}/offers/{id}      - Get offer details
PUT    /api/v1/customers/{customerId}/offers/{id}      - Update offer (metadata only)
DELETE /api/v1/customers/{customerId}/offers/{id}      - Delete offer (Draft only)
POST   /api/v1/customers/{customerId}/offers/{id}/convert-to-contract - Convert offer to contract
GET    /api/v1/customers/{customerId}/offers/{id}/pdf  - Download offer PDF
```

**Business Rules:**

- Offers can be created as PDF upload OR form-based entry
- Status: Draft → Sent → Accepted → Rejected
- Only Draft offers can be deleted
- Accepted offers can be converted to Contract

### Contract Management (Auftragsbestätigung)

**Note:** Contracts are GoBD-compliant after signing. Invoicing happens in Lexware.

```
GET    /api/v1/customers/{customerId}/contracts        - List contracts for customer
POST   /api/v1/customers/{customerId}/contracts        - Create new contract (with PDF upload)
GET    /api/v1/customers/{customerId}/contracts/{id}   - Get contract details
PUT    /api/v1/customers/{customerId}/contracts/{id}   - Update contract (metadata only, before Signed)
DELETE /api/v1/customers/{customerId}/contracts/{id}   - Delete contract (Draft only)
GET    /api/v1/customers/{customerId}/contracts/{id}/pdf - Download contract PDF
```

**Business Rules:**

- Contracts are **immutable after Signed status** (GoBD compliance)
- Status: Draft → Signed → InProgress → Completed
- Only Draft contracts can be deleted or modified
- Signed contracts can only have status updates (InProgress → Completed)
- Contract totalAmount is used for project budget tracking

### Lexware Integration (Phase 2+, Optional)

**Note:** Phase 1 has NO Lexware integration. Phase 2+ may add read-only API access.

```
GET    /api/v1/lexware/invoices/{invoiceId}/status    - Get invoice status from Lexware (Read-only)
GET    /api/v1/projects/{projectId}/lexware-invoices  - List Lexware invoices for project (Read-only)
```

**Business Rules:**

- Phase 1: No integration, manual workflows in Lexware
- Phase 2+: Read-only API to fetch invoice status (sent/paid) for project dashboards
- KOMPASS does NOT create invoices in Lexware via API
- Buchhaltung creates invoices directly in Lexware

---

## 11. Calendar & Export Endpoints (NEW)

**Added:** 2025-01-28  
**Status:** Planned for MVP - Calendar Views & Export  
**Purpose:** Unified calendar views and ICS export for tasks, projects, opportunities, and resource planning

### 10.1 Calendar Event Endpoints

#### 10.1.1 Get Calendar Events

**GET** `/api/v1/calendar/events`

Retrieves calendar events aggregated from multiple sources (tasks, projects, opportunities) for specified date range.

##### Query Parameters

| Parameter    | Type     | Required | Description                                                                          |
| ------------ | -------- | -------- | ------------------------------------------------------------------------------------ |
| `startDate`  | ISO 8601 | Yes      | Start date for event range (e.g., "2025-01-01T00:00:00Z")                            |
| `endDate`    | ISO 8601 | Yes      | End date for event range (e.g., "2025-01-31T23:59:59Z")                              |
| `types[]`    | string[] | No       | Filter by event types (user_task, project_task, project_deadline, opportunity_close) |
| `assignedTo` | string   | No       | Filter events assigned to specific user ID                                           |
| `status[]`   | string[] | No       | Filter by status (open, in_progress, completed, etc.)                                |
| `priority[]` | string[] | No       | Filter by priority (low, medium, high, urgent, critical)                             |

##### RBAC

- **All Roles**: Can view calendar events (filtered by permissions)
- **ADM**: Sees own UserTasks + ProjectTasks for assigned projects
- **PLAN/GF**: Sees all team events
- **BUCH/KALK**: Sees relevant project/financial events (read-only)

##### Response

**200 OK:**

```json
{
  "events": [
    {
      "id": "usertask-123",
      "type": "user_task",
      "title": "Follow up with Hofladen Müller",
      "description": "Discuss delivery timeline for Q2",
      "color": "#3B82F6",
      "icon": "CheckSquare",
      "startDate": "2025-02-05T00:00:00Z",
      "endDate": "2025-02-05T23:59:59Z",
      "allDay": true,
      "entityId": "usertask-123",
      "entityType": "UserTask",
      "status": "open",
      "priority": "high",
      "assignedTo": ["user-adm-001"],
      "url": "/tasks/usertask-123"
    },
    {
      "id": "project-456-end",
      "type": "project_deadline",
      "title": "Deadline: Hofladen Müller Ladenbau",
      "description": "Project completion deadline",
      "color": "#10B981",
      "icon": "Flag",
      "startDate": "2025-02-28T00:00:00Z",
      "endDate": "2025-02-28T23:59:59Z",
      "allDay": true,
      "entityId": "project-456",
      "entityType": "Project",
      "status": "in_progress",
      "url": "/projects/project-456"
    }
  ],
  "meta": {
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-01-31T23:59:59Z",
    "totalEvents": 2,
    "eventsByType": {
      "user_task": 1,
      "project_deadline": 1
    }
  }
}
```

**400 Bad Request:**

```json
{
  "type": "https://api.kompass.de/errors/validation-error",
  "title": "Validation Failed",
  "status": 400,
  "detail": "Date range exceeds maximum allowed (90 days)",
  "errors": [
    {
      "field": "endDate",
      "message": "Date range must be 90 days or less"
    }
  ]
}
```

##### Business Rules

- Maximum date range: 90 days per request
- Returns maximum 1000 events per request
- Events are filtered by user permissions (RBAC)
- Color coding follows CalendarEvent interface standards
- Events sorted by startDate ascending

---

#### 10.1.2 Get My Calendar Events

**GET** `/api/v1/calendar/my-events`

Retrieves calendar events for the current authenticated user only.

##### Query Parameters

Same as `/api/v1/calendar/events` but filters automatically to current user.

##### RBAC

- **All Roles**: Can view own events

##### Response

Same structure as `/api/v1/calendar/events` but filtered to current user's tasks and assigned projects.

---

#### 10.1.3 Get Team Calendar Events

**GET** `/api/v1/calendar/team-events`

Retrieves team-wide calendar events for management overview.

##### Query Parameters

| Parameter         | Type     | Required | Description                     |
| ----------------- | -------- | -------- | ------------------------------- |
| `startDate`       | ISO 8601 | Yes      | Start date for event range      |
| `endDate`         | ISO 8601 | Yes      | End date for event range        |
| `teamMemberIds[]` | string[] | No       | Filter to specific team members |
| `types[]`         | string[] | No       | Filter by event types           |

##### RBAC

- **GF, PLAN**: Full access
- **Other Roles**: 403 Forbidden

##### Response

```json
{
  "events": [
    /* CalendarEvent[] */
  ],
  "teamMembers": [
    {
      "userId": "user-plan-001",
      "displayName": "Anna Weber",
      "eventCount": 5,
      "overdueCount": 1
    }
  ],
  "meta": {
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-01-31T23:59:59Z",
    "totalEvents": 45,
    "totalTeamMembers": 8
  }
}
```

---

### 10.2 Calendar Export Endpoints

#### 10.2.1 Export Calendar (One-Time Download)

**GET** `/api/v1/calendar/export/ics`

Generates and downloads an ICS file for importing into Outlook, Google Calendar, Apple Calendar, etc.

##### Query Parameters

Same as `/api/v1/calendar/events` for filtering events to export.

##### RBAC

- **All Roles**: Can export own calendar
- **GF, PLAN**: Can export team calendar

##### Response

**200 OK:**

- **Content-Type**: `text/calendar; charset=utf-8`
- **Content-Disposition**: `attachment; filename="kompass-calendar-2025-01-28.ics"`

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KOMPASS CRM//Calendar Export//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:KOMPASS Kalender
X-WR-TIMEZONE:Europe/Berlin

BEGIN:VEVENT
UID:usertask-123@kompass.de
DTSTAMP:20250128T120000Z
DTSTART;VALUE=DATE:20250205
SUMMARY:Follow up with Hofladen Müller
DESCRIPTION:Discuss delivery timeline for Q2
STATUS:CONFIRMED
PRIORITY:5
END:VEVENT

BEGIN:VEVENT
UID:project-456-end@kompass.de
DTSTAMP:20250128T120000Z
DTSTART;VALUE=DATE:20250228
SUMMARY:Deadline: Hofladen Müller Ladenbau
DESCRIPTION:Project completion deadline
STATUS:CONFIRMED
END:VEVENT

END:VCALENDAR
```

##### Business Rules

- File naming: `kompass-calendar-{current-date}.ics`
- ICS format follows RFC 5545 (iCalendar)
- Events exported as-is (no real-time updates)
- One-time download (not a subscription)
- Maximum 1000 events per export

---

### 10.3 Calendar DTOs

#### CalendarEventDto

```typescript
export class CalendarEventDto {
  @ApiProperty({
    description: "Unique event ID",
    example: "usertask-123",
  })
  id: string;

  @ApiProperty({
    description: "Event type",
    enum: [
      "user_task",
      "project_task",
      "project_deadline",
      "project_start",
      "project_milestone",
      "opportunity_close",
      "invoice_due",
      "activity_scheduled",
      "user_vacation",
      "holiday",
    ],
  })
  type: CalendarEventType;

  @ApiProperty({
    description: "Event title",
    example: "Follow up with customer",
    maxLength: 200,
  })
  title: string;

  @ApiProperty({
    description: "Event description",
    required: false,
    maxLength: 2000,
  })
  description?: string;

  @ApiProperty({
    description: "Hex color for visual coding",
    example: "#3B82F6",
    pattern: "^#[0-9A-F]{6}$",
  })
  color: string;

  @ApiProperty({
    description: "Icon name for event type",
    example: "CheckSquare",
    required: false,
  })
  icon?: string;

  @ApiProperty({
    description: "Event start date/time",
    type: "string",
    format: "date-time",
    example: "2025-02-05T00:00:00Z",
  })
  startDate: Date;

  @ApiProperty({
    description: "Event end date/time",
    type: "string",
    format: "date-time",
    required: false,
  })
  endDate?: Date;

  @ApiProperty({
    description: "True if all-day event",
    example: true,
  })
  allDay: boolean;

  @ApiProperty({
    description: "Reference to source entity ID",
    example: "usertask-123",
  })
  entityId: string;

  @ApiProperty({
    description: "Source entity type",
    enum: [
      "UserTask",
      "ProjectTask",
      "Project",
      "Opportunity",
      "Invoice",
      "Activity",
      "User",
      "System",
    ],
  })
  entityType: CalendarEntityType;

  @ApiProperty({
    description: "Entity-specific status",
    example: "open",
  })
  status: string;

  @ApiProperty({
    description: "Priority level",
    enum: ["low", "medium", "high", "urgent", "critical"],
    required: false,
  })
  priority?: CalendarPriority;

  @ApiProperty({
    description: "User IDs assigned to event",
    type: [String],
    required: false,
  })
  assignedTo?: string[];

  @ApiProperty({
    description: "Physical location",
    required: false,
  })
  location?: string;

  @ApiProperty({
    description: "Custom tags for filtering",
    type: [String],
    required: false,
  })
  tags?: string[];

  @ApiProperty({
    description: "Deep link to entity detail page",
    example: "/tasks/usertask-123",
    required: false,
  })
  url?: string;
}
```

#### CalendarQueryDto

```typescript
export class CalendarQueryDto {
  @ApiProperty({
    description: "Start date for event range",
    type: "string",
    format: "date-time",
    example: "2025-01-01T00:00:00Z",
  })
  @IsISO8601()
  startDate: string;

  @ApiProperty({
    description: "End date for event range",
    type: "string",
    format: "date-time",
    example: "2025-01-31T23:59:59Z",
  })
  @IsISO8601()
  endDate: string;

  @ApiProperty({
    description: "Filter by event types",
    type: [String],
    required: false,
    enum: [
      "user_task",
      "project_task",
      "project_deadline",
      "opportunity_close",
    ],
  })
  @IsOptional()
  @IsArray()
  types?: CalendarEventType[];

  @ApiProperty({
    description: "Filter events assigned to specific user",
    required: false,
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({
    description: "Filter by status",
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  status?: string[];

  @ApiProperty({
    description: "Filter by priority",
    type: [String],
    required: false,
    enum: ["low", "medium", "high", "urgent", "critical"],
  })
  @IsOptional()
  @IsArray()
  priority?: CalendarPriority[];
}
```

---

### 10.4 Calendar Business Rules

**CR-001: Date Range Validation**

- Maximum date range: 90 days per request
- Dates must be in ISO 8601 format
- endDate must be >= startDate

**CR-002: Event Density Limits**

- Maximum 1000 events per API response
- If limit exceeded, return 413 Payload Too Large with suggestion to narrow date range
- Events sorted by startDate ascending, then by priority descending

**CR-003: RBAC Filtering**

- Events automatically filtered by user permissions
- ADM: Sees own tasks + assigned project tasks only
- PLAN/GF: Sees all team events
- Users never see events for entities they lack READ permission for

**CR-004: ICS Export Standards**

- Follows RFC 5545 (iCalendar) specification
- UTF-8 encoding required
- Timezone: Europe/Berlin (default)
- UID format: `{entityId}@kompass.de`
- DTSTAMP: Export generation time
- STATUS: CONFIRMED for all events

**CR-005: Color Accessibility**

- All colors meet WCAG AA contrast ratio (4.5:1)
- Color + icon combination (not color alone)
- Default colors defined in CalendarEvent interface (data-model.md Section 17)

---

### 10.5 Calendar Performance Considerations

**Caching:**

- Calendar event aggregation cached for 5 minutes (TTL: 300s)
- Cache key includes: userId, startDate, endDate, filters
- Cache invalidation on task/project/opportunity updates

**Query Optimization:**

- Use CouchDB Mango queries with date range indexes
- Parallel aggregation from UserTask, ProjectTask, Project, Opportunity collections
- Limit database queries to date range +/- 1 day buffer

**Export Performance:**

- ICS generation should complete in <2 seconds for 1000 events
- Stream large exports to avoid memory issues
- Consider background job for exports >5000 events (Phase 2)

---

## 12. Time Tracking Endpoints (NEW - Phase 1 MVP)

**Added:** 2025-01-28  
**Purpose:** Time entry management for project work tracking with timer and manual entry support

### 11.1 TimeEntry CRUD Operations

#### POST /api/v1/time-entries

Create a new time entry (start timer or manual entry).

**Request Body:**

```typescript
{
  "projectId": "project-abc123",
  "taskId": "project-task-xyz789",        // Optional
  "taskDescription": "Implemented customer authentication",
  "startTime": "2025-01-28T09:00:00Z",
  "endTime": null,                       // null = start timer, set value = manual entry
  "isManualEntry": false,
  "hourlyRateEur": 75.00                 // Optional, defaults to user's current rate
}
```

**Success Response (201 Created):**

```typescript
{
  "_id": "time-entry-550e8400-e29b-41d4-a716-446655440000",
  "type": "time_entry",
  "projectId": "project-abc123",
  "projectName": "Hofladen Müller - Shop System",
  "taskId": "project-task-xyz789",
  "taskDescription": "Implemented customer authentication",
  "userId": "user-123",
  "userName": "Michael Schmidt",
  "startTime": "2025-01-28T09:00:00Z",
  "endTime": null,
  "durationMinutes": 0,
  "status": "in_progress",
  "isManualEntry": false,
  "hourlyRateEur": 75.00,
  "totalCostEur": 0.00,
  "createdBy": "user-123",
  "createdAt": "2025-01-28T09:00:00Z",
  "modifiedBy": "user-123",
  "modifiedAt": "2025-01-28T09:00:00Z",
  "version": 1
}
```

**Error Responses:**

- `400 Bad Request` - Validation error (taskDescription too short, invalid projectId)
- `401 Unauthorized` - No authentication token
- `403 Forbidden` - User lacks CREATE permission for TimeEntry
- `409 Conflict` - User already has an active timer running

**RBAC:**

- PLAN: Can create time entries for assigned projects
- INNEN: Can create time entries for any project
- GF: Can create time entries for any project

---

#### GET /api/v1/time-entries

List time entries with filtering and sorting.

**Query Parameters:**

```typescript
?projectId=project-abc123           // Filter by project
&userId=user-123                    // Filter by user
&status=completed                   // Filter by status (in_progress|completed|approved|rejected)
&startDate=2025-01-01              // Filter entries starting from this date
&endDate=2025-01-31                // Filter entries ending before this date
&isManualEntry=false               // Filter by entry type
&sort=startTime                    // Sort field (startTime|durationMinutes|totalCostEur)
&order=desc                        // Sort order (asc|desc)
&page=1                            // Pagination page
&limit=50                          // Results per page (max 200)
```

**Success Response (200 OK):**

```typescript
{
  "data": [
    {
      "_id": "time-entry-550e8400-e29b-41d4-a716-446655440000",
      "projectId": "project-abc123",
      "projectName": "Hofladen Müller - Shop System",
      "taskDescription": "Implemented customer authentication",
      "userId": "user-123",
      "userName": "Michael Schmidt",
      "startTime": "2025-01-28T09:00:00Z",
      "endTime": "2025-01-28T12:30:00Z",
      "durationMinutes": 210,
      "status": "completed",
      "hourlyRateEur": 75.00,
      "totalCostEur": 262.50,
      "approvedBy": null,
      "approvedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 127,
    "totalPages": 3
  }
}
```

**RBAC:**

- PLAN: Can view own entries + all entries for assigned projects
- GF: Can view all entries
- KALK: Can view all entries (read-only for cost estimation)
- BUCH: Can view all entries (read-only for payroll)

---

#### GET /api/v1/time-entries/:id

Get specific time entry details.

**Success Response (200 OK):**

```typescript
{
  "_id": "time-entry-550e8400-e29b-41d4-a716-446655440000",
  "projectId": "project-abc123",
  "projectName": "Hofladen Müller - Shop System",
  "taskDescription": "Implemented customer authentication",
  "userId": "user-123",
  "userName": "Michael Schmidt",
  "startTime": "2025-01-28T09:00:00Z",
  "endTime": "2025-01-28T12:30:00Z",
  "durationMinutes": 210,
  "status": "approved",
  "isManualEntry": false,
  "hourlyRateEur": 75.00,
  "totalCostEur": 262.50,
  "approvedBy": "user-gf1",
  "approvedByName": "Anna Weber",
  "approvedAt": "2025-01-28T15:00:00Z",
  "createdBy": "user-123",
  "createdAt": "2025-01-28T09:00:00Z"
}
```

**Error Responses:**

- `404 Not Found` - Time entry does not exist

---

#### PUT /api/v1/time-entries/:id

Update time entry (editable fields depend on status).

**Request Body:**

```typescript
{
  "taskDescription": "Implemented and tested customer authentication",
  "startTime": "2025-01-28T09:15:00Z",     // Editable if status = completed
  "endTime": "2025-01-28T12:45:00Z",       // Editable if status = completed
  "hourlyRateEur": 80.00                   // Editable if status = in_progress/completed
}
```

**Business Rules:**

- `IN_PROGRESS`: Can edit taskDescription, hourlyRateEur
- `COMPLETED`: Can edit taskDescription, startTime, endTime
- `APPROVED`/`REJECTED`: Read-only, no edits allowed

**Error Responses:**

- `403 Forbidden` - Cannot edit approved/rejected entries
- `409 Conflict` - Invalid status transition

---

#### DELETE /api/v1/time-entries/:id

Delete time entry (only if status = IN_PROGRESS or COMPLETED).

**Success Response (204 No Content)**

**Error Responses:**

- `403 Forbidden` - Cannot delete approved entries (GoBD compliance)
- `404 Not Found` - Time entry does not exist

---

### 11.2 TimeEntry Timer Operations

#### POST /api/v1/time-entries/:id/stop

Stop running timer for a time entry.

**Request Body:**

```typescript
{
  "endTime": "2025-01-28T12:30:00Z"  // Optional, defaults to now
}
```

**Success Response (200 OK):**

```typescript
{
  "_id": "time-entry-550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "startTime": "2025-01-28T09:00:00Z",
  "endTime": "2025-01-28T12:30:00Z",
  "durationMinutes": 210,
  "hourlyRateEur": 75.00,
  "totalCostEur": 262.50
}
```

**Business Rules:**

- Automatically calculates durationMinutes
- Fetches user's current hourlyRateEur and caches it
- Calculates totalCostEur = (durationMinutes / 60) × hourlyRateEur
- Updates status to COMPLETED

**Error Responses:**

- `400 Bad Request` - Timer not running (status != IN_PROGRESS)
- `400 Bad Request` - endTime < startTime

---

#### GET /api/v1/time-entries/active

Get active timer for current user (if any).

**Success Response (200 OK):**

```typescript
{
  "_id": "time-entry-550e8400-e29b-41d4-a716-446655440000",
  "projectName": "Hofladen Müller - Shop System",
  "taskDescription": "Implementing customer authentication",
  "startTime": "2025-01-28T09:00:00Z",
  "status": "in_progress",
  "elapsedMinutes": 147           // Calculated: (now - startTime) in minutes
}
```

**Success Response (204 No Content)** - No active timer

---

### 11.3 TimeEntry Approval Workflow

#### POST /api/v1/time-entries/bulk-approve

Approve multiple time entries at once (GF/PLAN managers only).

**Request Body:**

```typescript
{
  "entryIds": [
    "time-entry-550e8400-e29b-41d4-a716-446655440000",
    "time-entry-987e6543-e89b-12d3-a456-426614174000"
  ]
}
```

**Success Response (200 OK):**

```typescript
{
  "approved": 2,
  "failed": 0,
  "results": [
    {
      "entryId": "time-entry-550e8400-e29b-41d4-a716-446655440000",
      "status": "approved",
      "approvedAt": "2025-01-28T15:00:00Z"
    },
    {
      "entryId": "time-entry-987e6543-e89b-12d3-a456-426614174000",
      "status": "approved",
      "approvedAt": "2025-01-28T15:00:00Z"
    }
  ]
}
```

**Business Rules:**

- All entries must belong to same project
- Requires APPROVE permission for TimeEntry
- Cannot mix entries from different users or projects
- Only COMPLETED entries can be approved

**RBAC:**

- PLAN: Can approve entries for assigned project team members
- GF: Can approve all entries

**Error Responses:**

- `400 Bad Request` - Entries from different projects
- `403 Forbidden` - User lacks APPROVE permission

---

#### POST /api/v1/time-entries/:id/reject

Reject a time entry (with mandatory reason).

**Request Body:**

```typescript
{
  "rejectionReason": "Task not part of project scope. Please revise."
}
```

**Success Response (200 OK):**

```typescript
{
  "_id": "time-entry-550e8400-e29b-41d4-a716-446655440000",
  "status": "rejected",
  "rejectionReason": "Task not part of project scope. Please revise.",
  "approvedBy": "user-gf1",
  "approvedAt": "2025-01-28T15:00:00Z"
}
```

**Error Responses:**

- `400 Bad Request` - rejectionReason required (10-500 chars)

---

### 11.4 Labor Cost Reporting

#### GET /api/v1/projects/:projectId/labor-costs

Calculate labor cost summary for a project.

**Success Response (200 OK):**

```typescript
{
  "projectId": "project-abc123",
  "totalHours": 142.5,
  "totalCostEur": 10687.50,
  "byUser": [
    {
      "userId": "user-123",
      "userName": "Michael Schmidt",
      "totalHours": 87.5,
      "averageHourlyRateEur": 75.00,
      "totalCostEur": 6562.50,
      "entryCount": 12
    },
    {
      "userId": "user-456",
      "userName": "Sarah Müller",
      "totalHours": 55.0,
      "averageHourlyRateEur": 75.00,
      "totalCostEur": 4125.00,
      "entryCount": 8
    }
  ],
  "byMonth": [
    {
      "year": 2025,
      "month": 1,
      "totalHours": 95.0,
      "totalCostEur": 7125.00,
      "entryCount": 14
    },
    {
      "year": 2025,
      "month": 2,
      "totalHours": 47.5,
      "totalCostEur": 3562.50,
      "entryCount": 6
    }
  ]
}
```

**Business Rules:**

- Only APPROVED time entries included in calculations
- Summary cached for 5 minutes (TTL: 300s)
- Cache invalidated when entries are approved/rejected

**RBAC:**

- PLAN: Can view labor costs for assigned projects
- GF: Can view labor costs for all projects
- KALK: Can view labor costs (read-only for cost estimation)
- BUCH: Can view labor costs (read-only for payroll)

---

#### GET /api/v1/time-entries/pending-approval

Get all time entries pending approval (for managers).

**Query Parameters:**

```typescript
?projectId=project-abc123        // Optional: Filter by project
&userId=user-123                // Optional: Filter by user
```

**Success Response (200 OK):**

```typescript
{
  "data": [
    {
      "_id": "time-entry-550e8400-e29b-41d4-a716-446655440000",
      "projectName": "Hofladen Müller - Shop System",
      "userName": "Michael Schmidt",
      "taskDescription": "Implemented customer authentication",
      "startTime": "2025-01-28T09:00:00Z",
      "endTime": "2025-01-28T12:30:00Z",
      "durationMinutes": 210,
      "totalCostEur": 262.50,
      "status": "completed"
    }
  ],
  "total": 12
}
```

**RBAC:**

- PLAN: Sees pending entries for assigned projects only
- GF: Sees all pending entries

---

## 13. Project Cost Management Endpoints (NEW - Phase 1 MVP)

**Added:** 2025-01-28  
**Purpose:** Non-labor project cost tracking (materials, contractors, services, equipment)

### 12.1 ProjectCost CRUD Operations

#### POST /api/v1/project-costs

Create a new project cost entry.

**Request Body:**

```typescript
{
  "projectId": "project-abc123",
  "costType": "material",
  "description": "Oak wood planks for shelving (50 pieces)",
  "supplierName": "Holz Schmidt GmbH",
  "quantity": 50,
  "unitPriceEur": 45.00,
  "taxRate": 0.19,                    // Optional, defaults to 0.19 (19% VAT)
  "invoiceNumber": "HS-2025-00123",   // Optional
  "invoiceDate": "2025-01-25",        // Optional
  "orderNumber": "PO-2025-00089",     // Optional
  "status": "ordered"
}
```

**Success Response (201 Created):**

```typescript
{
  "_id": "project-cost-550e8400-e29b-41d4-a716-446655440000",
  "type": "project_cost",
  "projectId": "project-abc123",
  "projectName": "Hofladen Müller - Shop System",
  "costType": "material",
  "description": "Oak wood planks for shelving (50 pieces)",
  "supplierName": "Holz Schmidt GmbH",
  "quantity": 50,
  "unitPriceEur": 45.00,
  "totalCostEur": 2250.00,           // Calculated: 50 × 45.00
  "taxRate": 0.19,
  "taxAmountEur": 427.50,            // Calculated: 2250.00 × 0.19
  "totalWithTaxEur": 2677.50,        // Calculated: 2250.00 + 427.50
  "invoiceNumber": "HS-2025-00123",
  "invoiceDate": "2025-01-25",
  "orderNumber": "PO-2025-00089",
  "status": "ordered",
  "paidAt": null,
  "approvedBy": null,
  "approvedAt": null,
  "createdBy": "user-plan1",
  "createdAt": "2025-01-28T10:00:00Z",
  "version": 1
}
```

**Error Responses:**

- `400 Bad Request` - Validation error (invalid costType, quantity <= 0)
- `403 Forbidden` - User lacks CREATE permission for ProjectCost

**RBAC:**

- PLAN: Can create costs for all projects
- KALK: Can create costs (for cost estimation)
- GF: Can create costs for all projects

---

#### GET /api/v1/project-costs

List project costs with filtering and sorting.

**Query Parameters:**

```typescript
?projectId=project-abc123           // Filter by project
&costType=material                  // Filter by type (material|contractor|external_service|equipment|other)
&status=invoiced                    // Filter by status (planned|ordered|received|invoiced|paid)
&supplierName=Holz Schmidt         // Filter by supplier (partial match)
&startDate=2025-01-01              // Filter costs from this date
&endDate=2025-01-31                // Filter costs before this date
&sort=totalCostEur                 // Sort field (totalCostEur|invoiceDate|createdAt)
&order=desc                        // Sort order (asc|desc)
&page=1                            // Pagination page
&limit=50                          // Results per page (max 200)
```

**Success Response (200 OK):**

```typescript
{
  "data": [
    {
      "_id": "project-cost-550e8400-e29b-41d4-a716-446655440000",
      "projectName": "Hofladen Müller - Shop System",
      "costType": "material",
      "description": "Oak wood planks for shelving (50 pieces)",
      "supplierName": "Holz Schmidt GmbH",
      "totalCostEur": 2250.00,
      "totalWithTaxEur": 2677.50,
      "status": "invoiced",
      "invoiceDate": "2025-01-25"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 89,
    "totalPages": 2
  }
}
```

**RBAC:**

- PLAN: Can view costs for assigned projects
- KALK: Can view all costs (read-only)
- GF: Can view all costs
- BUCH: Can view all costs (read-only)

---

#### GET /api/v1/project-costs/:id

Get specific project cost details.

**Success Response (200 OK):**

```typescript
{
  "_id": "project-cost-550e8400-e29b-41d4-a716-446655440000",
  "projectId": "project-abc123",
  "projectName": "Hofladen Müller - Shop System",
  "costType": "material",
  "description": "Oak wood planks for shelving (50 pieces)",
  "supplierName": "Holz Schmidt GmbH",
  "quantity": 50,
  "unitPriceEur": 45.00,
  "totalCostEur": 2250.00,
  "taxRate": 0.19,
  "taxAmountEur": 427.50,
  "totalWithTaxEur": 2677.50,
  "invoiceNumber": "HS-2025-00123",
  "invoiceDate": "2025-01-25",
  "invoicePdfUrl": "https://minio.kompass.de/invoices/HS-2025-00123.pdf",
  "orderNumber": "PO-2025-00089",
  "status": "invoiced",
  "paidAt": null,
  "approvedBy": "user-gf1",
  "approvedByName": "Anna Weber",
  "approvedAt": "2025-01-26T14:00:00Z",
  "createdBy": "user-plan1",
  "createdAt": "2025-01-28T10:00:00Z"
}
```

---

#### PUT /api/v1/project-costs/:id

Update project cost (editable fields depend on status).

**Request Body:**

```typescript
{
  "description": "Oak wood planks for shelving (55 pieces - updated)",
  "quantity": 55,
  "unitPriceEur": 45.00,
  "invoiceNumber": "HS-2025-00123",
  "invoiceDate": "2025-01-25",
  "invoicePdfUrl": "https://minio.kompass.de/invoices/HS-2025-00123.pdf",
  "status": "invoiced"
}
```

**Business Rules:**

- `PLANNED`: All fields editable
- `ORDERED`: Can edit status, invoiceNumber, invoiceDate
- `RECEIVED`/`INVOICED`: Can only update status and payment info
- `PAID`: Read-only (GoBD compliance)

**Error Responses:**

- `403 Forbidden` - Cannot edit paid costs (GoBD compliance)
- `409 Conflict` - Invalid status transition

---

#### DELETE /api/v1/project-costs/:id

Delete project cost (only if status = PLANNED or ORDERED).

**Success Response (204 No Content)**

**Error Responses:**

- `403 Forbidden` - Cannot delete received/invoiced/paid costs (GoBD compliance)
- `404 Not Found` - Project cost does not exist

---

### 12.2 ProjectCost Approval Workflow

#### POST /api/v1/project-costs/:id/approve

Approve a project cost (required before marking as PAID).

**Request Body:**

```typescript
{
} // Empty body
```

**Success Response (200 OK):**

```typescript
{
  "_id": "project-cost-550e8400-e29b-41d4-a716-446655440000",
  "status": "invoiced",
  "approvedBy": "user-gf1",
  "approvedByName": "Anna Weber",
  "approvedAt": "2025-01-26T14:00:00Z"
}
```

**Business Rules:**

- Costs < €500: PLAN can approve
- Costs >= €500: Requires GF approval (dual control)
- Approval required before status can move to PAID

**RBAC:**

- PLAN: Can approve costs < €500 for assigned projects
- GF: Can approve all costs

**Error Responses:**

- `403 Forbidden` - Cost >= €500 requires GF approval

---

### 12.3 Material Cost Reporting

#### GET /api/v1/projects/:projectId/material-costs

Calculate material cost summary for a project.

**Success Response (200 OK):**

```typescript
{
  "projectId": "project-abc123",
  "totalCostEur": 15240.00,
  "totalWithTaxEur": 18135.60,
  "pendingPaymentEur": 3240.00,        // Sum of INVOICED status costs
  "byCostType": [
    {
      "costType": "material",
      "totalCostEur": 8500.00,
      "totalWithTaxEur": 10115.00,
      "itemCount": 12
    },
    {
      "costType": "contractor",
      "totalCostEur": 4200.00,
      "totalWithTaxEur": 4998.00,
      "itemCount": 3
    },
    {
      "costType": "equipment",
      "totalCostEur": 2540.00,
      "totalWithTaxEur": 3022.60,
      "itemCount": 5
    }
  ],
  "byStatus": [
    {
      "status": "paid",
      "totalCostEur": 12000.00,
      "totalWithTaxEur": 14280.00,
      "itemCount": 15
    },
    {
      "status": "invoiced",
      "totalCostEur": 3240.00,
      "totalWithTaxEur": 3855.60,
      "itemCount": 5
    }
  ]
}
```

**Business Rules:**

- Summary cached for 5 minutes (TTL: 300s)
- Cache invalidated when costs are added/updated
- Pending payment includes all INVOICED status costs

**RBAC:**

- PLAN: Can view material costs for assigned projects
- GF: Can view material costs for all projects
- KALK: Can view material costs (read-only)
- BUCH: Can view material costs (read-only)

---

#### GET /api/v1/project-costs/pending-payment

Get all costs awaiting payment (INVOICED status).

**Query Parameters:**

```typescript
?projectId=project-abc123        // Optional: Filter by project
&supplierName=Holz Schmidt      // Optional: Filter by supplier
```

**Success Response (200 OK):**

```typescript
{
  "data": [
    {
      "_id": "project-cost-550e8400-e29b-41d4-a716-446655440000",
      "projectName": "Hofladen Müller - Shop System",
      "description": "Oak wood planks for shelving",
      "supplierName": "Holz Schmidt GmbH",
      "totalWithTaxEur": 2677.50,
      "invoiceNumber": "HS-2025-00123",
      "invoiceDate": "2025-01-25",
      "status": "invoiced"
    }
  ],
  "totalPendingEur": 8450.00
}
```

**RBAC:**

- GF: Can view all pending payments
- BUCH: Can view all pending payments (read-only)

---

### 12.4 ProjectCost DTOs

#### CreateProjectCostDto

```typescript
export class CreateProjectCostDto {
  @ApiProperty({ description: "Project ID", example: "project-abc123" })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: "Cost type",
    enum: ["material", "contractor", "external_service", "equipment", "other"],
  })
  @IsEnum(ProjectCostType)
  costType: ProjectCostType;

  @ApiProperty({
    description: "Cost description",
    example: "Oak wood planks for shelving",
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @Length(10, 500)
  description: string;

  @ApiProperty({ description: "Supplier name", required: false })
  @IsOptional()
  @IsString()
  @Length(2, 200)
  supplierName?: string;

  @ApiProperty({ description: "Quantity", example: 50 })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ description: "Unit price in EUR", example: 45.0 })
  @IsNumber()
  @Min(0)
  unitPriceEur: number;

  @ApiProperty({
    description: "Tax rate (0-1)",
    example: 0.19,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  taxRate?: number;

  @ApiProperty({ description: "Invoice number", required: false })
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @ApiProperty({ description: "Invoice date", required: false })
  @IsOptional()
  @IsISO8601()
  invoiceDate?: string;

  @ApiProperty({ description: "Purchase order number", required: false })
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @ApiProperty({
    description: "Cost status",
    enum: ["planned", "ordered", "received", "invoiced", "paid"],
  })
  @IsEnum(ProjectCostStatus)
  status: ProjectCostStatus;
}
```

---

## 13. Offer Management Endpoints (NEW - Phase 1 MVP)

Offer endpoints manage the Opportunity → Offer → Contract conversion workflow. Offers are formal price quotes sent to customers.

### POST /api/v1/offers

Create a new offer from an opportunity.

**Request Body:**

```typescript
{
  "opportunityId": "opportunity-abc123",
  "customerId": "customer-xyz789",
  "contactPersonId": "contact-person-456",
  "offerDate": "2025-01-28",
  "validityDays": 30,
  "lineItems": [
    {
      "position": 1,
      "description": "Ladeneinrichtung komplett",
      "quantity": 1,
      "unit": "Pauschal",
      "unitPriceEur": 50000.00,
      "taxRate": 0.19
    }
  ],
  "discountPercent": 0,
  "taxRate": 0.19,
  "paymentTermsDays": 30,
  "deliveryTimeDays": 60,
  "terms": "<p>Standard terms and conditions...</p>",
  "notes": "Internal notes for team"
}
```

**Response** (201 Created):

```typescript
{
  "_id": "offer-abc123",
  "offerNumber": "A-2025-00042",
  "status": "draft",
  "subtotalEur": 50000.00,
  "taxAmountEur": 9500.00,
  "totalEur": 59500.00,
  "validUntil": "2025-02-27",
  "pdfUrl": null,
  // ... full offer object
}
```

**Business Rules:**

- Only INNEN, GF, ADM (own customers), KALK can create offers
- Opportunity must exist and be in eligible status
- Line items must have at least 1 item
- Total calculations validated server-side

---

### GET /api/v1/offers

List offers with filtering and pagination.

**Query Parameters:**

- `customerId` - Filter by customer
- `opportunityId` - Filter by opportunity
- `status` - Filter by status (draft, sent, viewed, accepted, rejected, expired)
- `page` (default: 1)
- `pageSize` (default: 20)
- `sortBy` (default: offerDate, options: offerNumber, totalEur, validUntil)
- `sortOrder` (default: desc, options: asc, desc)

**RBAC Filtering:**

- INNEN, GF, KALK: All offers
- ADM: Only offers for own customers
- PLAN: Only offers related to their projects (post-acceptance)

---

### GET /api/v1/offers/:id

Get single offer by ID.

**Response** (200 OK):

```typescript
{
  "_id": "offer-abc123",
  "offerNumber": "A-2025-00042",
  "opportunityId": "opportunity-xyz",
  "customerId": "customer-123",
  "contactPersonId": "contact-456",
  "offerDate": "2025-01-28",
  "validUntil": "2025-02-27",
  "status": "sent",
  "lineItems": [...],
  "subtotalEur": 50000.00,
  "discountAmountEur": 0,
  "taxAmountEur": 9500.00,
  "totalEur": 59500.00,
  "pdfUrl": "https://minio.kompass.de/offers/A-2025-00042.pdf",
  "sentAt": "2025-01-28T14:30:00Z",
  "viewedAt": null,
  "finalized": true,
  "immutableHash": "a3b5c7d9...",
  "createdAt": "2025-01-28T10:15:00Z",
  "modifiedAt": "2025-01-28T14:30:00Z"
}
```

---

### PUT /api/v1/offers/:id

Update offer (only if status = draft or not finalized).

**Request Body:** Partial offer update (same structure as POST)

**Business Rules:**

- Cannot modify finalized offers (status >= sent)
- Line item changes recalculate totals
- INNEN/GF can update all fields
- ADM can only update own customer offers

---

### DELETE /api/v1/offers/:id

Delete offer (only drafts, requires GF approval for sent offers).

**Response** (204 No Content)

**Business Rules:**

- Draft offers: INNEN/GF/ADM (own) can delete
- Sent/Viewed offers: Only GF can delete with audit log
- Accepted offers: Cannot delete (linked to contract)

---

### POST /api/v1/offers/:id/send

Send offer to customer via email and finalize it (make immutable).

**Request Body:**

```typescript
{
  "recipientEmail": "customer@example.com",
  "ccEmails": ["sales@kompass.de"],
  "subject": "Angebot A-2025-00042 - Ladeneinrichtung",
  "message": "Sehr geehrter Herr Müller, anbei unser Angebot..."
}
```

**Response** (200 OK):

```typescript
{
  "success": true,
  "offerNumber": "A-2025-00042",
  "sentAt": "2025-01-28T15:00:00Z",
  "pdfUrl": "https://minio.kompass.de/offers/A-2025-00042.pdf",
  "status": "sent",
  "finalized": true
}
```

**Business Rules:**

- Offer must be in draft status
- System generates PDF if not exists
- Offer becomes finalized (immutable)
- immutableHash generated for GoBD compliance
- Tracking pixel embedded in PDF (optional)

---

### POST /api/v1/offers/:id/accept

Accept offer and create contract.

**Request Body:**

```typescript
{
  "acceptedByContactId": "contact-person-456",
  "contractStartDate": "2025-02-15",
  "projectManagerId": "user-plan-123",
  "notes": "Customer accepted via phone call"
}
```

**Response** (201 Created):

```typescript
{
  "offer": {
    "_id": "offer-abc123",
    "status": "accepted",
    "acceptedAt": "2025-01-29T10:00:00Z",
    "contractId": "contract-xyz789"
  },
  "contract": {
    "_id": "contract-xyz789",
    "contractNumber": "C-2025-00042",
    "status": "draft",
    "contractValueEur": 59500.00,
    // ... full contract object
  }
}
```

**Business Rules:**

- Only INNEN/GF can accept offers
- Offer must be in sent/viewed status
- Automatically creates Contract entity
- Links offer.contractId to new contract
- Updates original Opportunity status to "Won"

---

### POST /api/v1/offers/:id/reject

Reject offer (customer declined).

**Request Body:**

```typescript
{
  "rejectionReason": "Preis zu hoch, Konkurrenzangebot günstiger",
  "rejectedByContactId": "contact-person-456"
}
```

**Response** (200 OK):

```typescript
{
  "_id": "offer-abc123",
  "status": "rejected",
  "rejectedAt": "2025-01-29T11:00:00Z",
  "rejectionReason": "Preis zu hoch, Konkurrenzangebot günstiger"
}
```

**Business Rules:**

- Updates Opportunity status to "Lost"
- Requires rejection reason (min 10 characters)
- Only INNEN/GF can reject offers

---

### POST /api/v1/offers/:id/supersede

Create new offer version, marking current one as superseded.

**Request Body:** (Same as POST /api/v1/offers)

**Response** (201 Created):

```typescript
{
  "oldOffer": {
    "_id": "offer-abc123",
    "status": "superseded"
  },
  "newOffer": {
    "_id": "offer-def456",
    "offerNumber": "A-2025-00043",
    "status": "draft",
    // ... updated offer data
  }
}
```

**Business Rules:**

- Original offer marked as superseded
- New offer created with incremented number
- Line items copied and can be modified
- Used for customer negotiations

---

### GET /api/v1/offers/:id/pdf

Download offer PDF.

**Response** (200 OK): PDF file

**Business Rules:**

- Generates PDF on-the-fly if not cached
- Includes company branding, logo, terms
- Tracking pixel embedded if sent status
- Only accessible by INNEN/GF/ADM (own)/customer (via public link)

---

## 14. Contract Management Endpoints (NEW - Phase 1 MVP)

Contract endpoints manage signed agreements and project creation workflow.

### POST /api/v1/contracts

Create contract (typically from accepted offer).

**Request Body:**

```typescript
{
  "offerId": "offer-abc123",
  "opportunityId": "opportunity-xyz",
  "customerId": "customer-123",
  "contactPersonId": "contact-456",
  "contractDate": "2025-01-29",
  "startDate": "2025-02-15",
  "endDate": "2025-06-30",
  "contractValueEur": 59500.00,
  "paymentTermsDays": 30,
  "deliverySchedule": "<p>Milestone 1: Planning - Feb 15...</p>",
  "terms": "<p>Contract terms and conditions...</p>",
  "projectManagerId": "user-plan-123",
  "estimatedDuration": 90
}
```

**Response** (201 Created):

```typescript
{
  "_id": "contract-xyz789",
  "contractNumber": "C-2025-00042",
  "status": "draft",
  "finalized": false,
  // ... full contract object
}
```

**Business Rules:**

- Only INNEN/GF can create contracts
- Offer must be in accepted status
- Contract value must match offer total
- Sequential GoBD-compliant numbering

---

### GET /api/v1/contracts

List contracts with filtering.

**Query Parameters:**

- `customerId` - Filter by customer
- `offerId` - Filter by source offer
- `status` - Filter by status (draft, pending_signature, signed, active, completed, terminated)
- `projectManagerId` - Filter by assigned PLAN user
- `page`, `pageSize`, `sortBy`, `sortOrder`

**RBAC Filtering:**

- INNEN, GF: All contracts
- PLAN: All contracts (read-only, for project planning)
- ADM: Own customer contracts only

---

### GET /api/v1/contracts/:id

Get single contract by ID.

**Response** (200 OK): Full contract object with embedded offer reference

---

### PUT /api/v1/contracts/:id

Update contract (only if not finalized/signed).

**Request Body:** Partial contract update

**Business Rules:**

- Cannot modify signed contracts (finalized = true)
- GF can correct signed contracts with audit trail
- INNEN can edit draft contracts

---

### DELETE /api/v1/contracts/:id

Delete contract (drafts only).

**Response** (204 No Content)

**Business Rules:**

- Only draft contracts can be deleted
- GF approval required for pending_signature contracts
- Signed contracts cannot be deleted (GoBD)

---

### POST /api/v1/contracts/:id/sign

Mark contract as signed and finalize it (make immutable).

**Request Body:**

```typescript
{
  "customerSignature": "data:image/png;base64,iVBORw0KGgoAAAA...",
  "ourSignature": "data:image/png;base64,iVBORw0KGgoAAAA...",
  "signedPdfUrl": "https://minio.kompass.de/contracts/C-2025-00042-signed.pdf"
}
```

**Response** (200 OK):

```typescript
{
  "_id": "contract-xyz789",
  "status": "signed",
  "finalized": true,
  "immutableHash": "a3b5c7d9...",
  "customerSignature": "...",
  "signedPdfUrl": "..."
}
```

**Business Rules:**

- Contract becomes immutable (GoBD compliance)
- immutableHash generated from contract data
- Status changes to signed
- Notifies assigned project manager

---

### POST /api/v1/contracts/:id/create-project

Convert signed contract into active project.

**Request Body:**

```typescript
{
  "projectNumber": "P-2025-B042",
  "plannedStartDate": "2025-02-15",
  "plannedEndDate": "2025-06-30",
  "budget": 50000.00,
  "projectManagerId": "user-plan-123"
}
```

**Response** (201 Created):

```typescript
{
  "contract": {
    "_id": "contract-xyz789",
    "status": "active",
    "projectId": "project-p123",
    "projectCreatedAt": "2025-01-30T09:00:00Z"
  },
  "project": {
    "_id": "project-p123",
    "projectNumber": "P-2025-B042",
    "contractId": "contract-xyz789",
    "status": "Planning",
    "contractValue": 59500.00,
    // ... full project object
  }
}
```

**Business Rules:**

- Contract must be in signed status
- Only PLAN or GF can create projects
- Project linked back to contract (projectId)
- Contract status changes to active
- INNEN handover to PLAN complete

---

### POST /api/v1/contracts/:id/complete

Mark contract as completed (project delivered).

**Request Body:**

```typescript
{
  "completionDate": "2025-06-30",
  "completionNotes": "Project successfully delivered and accepted by customer"
}
```

**Response** (200 OK):

```typescript
{
  "_id": "contract-xyz789",
  "status": "completed",
  "endDate": "2025-06-30"
}
```

**Business Rules:**

- Contract must be in active status
- Project must be in completed/delivered status
- Only PLAN or GF can mark as completed

---

### POST /api/v1/contracts/:id/terminate

Terminate contract early (cancellation).

**Request Body:**

```typescript
{
  "terminationReason": "Customer requested cancellation",
  "terminationDate": "2025-05-15"
}
```

**Response** (200 OK):

```typescript
{
  "_id": "contract-xyz789",
  "status": "terminated",
  "endDate": "2025-05-15",
  "terminationReason": "Customer requested cancellation"
}
```

**Business Rules:**

- Requires GF approval
- Related project marked as cancelled
- Audit trail logged

---

### GET /api/v1/contracts/:id/pdf

Download signed contract PDF.

**Response** (200 OK): PDF file

---

### Workflow Summary: Opportunity → Offer → Contract → Project

```typescript
// 1. INNEN creates offer from opportunity
POST /api/v1/offers
{ opportunityId: "opp-123" }

// 2. INNEN sends offer to customer
POST /api/v1/offers/:id/send
{ recipientEmail: "customer@example.com" }

// 3. Customer accepts (tracked externally or via system)
// INNEN marks offer as accepted
POST /api/v1/offers/:id/accept
{ projectManagerId: "user-plan-123" }
// → Auto-creates Contract

// 4. Customer signs contract
// INNEN uploads signed PDF
POST /api/v1/contracts/:id/sign
{ signedPdfUrl: "..." }

// 5. PLAN user creates project from signed contract
POST /api/v1/contracts/:id/create-project
{ projectNumber: "P-2025-B042" }
// → Creates Project entity

// 6. PLAN manages project execution
// (ProjectTask, TimeEntry, ProjectCost APIs)

// 7. PLAN marks contract as completed
POST /api/v1/contracts/:id/complete
{ completionDate: "2025-06-30" }
```

---

## 16. Supplier Management Endpoints (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Status:** Critical - Addresses Pre-Mortem Danger #3  
**Priority:** Phase 1 MVP

### POST /api/v1/suppliers

Create new supplier.

**Auth:** INN, PLAN, KALK, GF  
**Permission:** Supplier.CREATE

**Request Body:**

```typescript
{
  "companyName": "Schreinerei Müller GmbH",
  "supplierType": "subcontractor",
  "serviceCategories": ["carpentry", "furniture", "installation"],
  "serviceDescription": "Spezialisiert auf hochwertige Ladeneinrichtungen...",
  "email": "info@mueller-schreinerei.de",
  "phone": "+49 89 1234567",
  "billingAddress": { "street": "Industriestr. 42", "zipCode": "80331", "city": "München", "country": "Deutschland" },
  "paymentTerms": { "paymentMethod": "Invoice", "daysUntilDue": 30, "discountPercentage": 2, "discountDays": 10, "partialPaymentAllowed": true },
  "accountManagerId": "user-inn-123"
}
```

**Response** (201 Created):

```typescript
{
  "_id": "supplier-abc123",
  "status": "PendingApproval",  // Awaits GF approval
  ...
}
```

### GET /api/v1/suppliers

List suppliers with filtering.

**Auth:** All authenticated users  
**Permission:** Supplier.READ

**Query Parameters:**

- `status` (string): 'Active' | 'Inactive' | 'Blacklisted' | 'PendingApproval'
- `supplierType` (string): Filter by type
- `serviceCategory` (string): Filter by service category
- `search` (string): Search name, city, service description
- `sort` (string): 'name' | 'rating' | 'activeProjects' | 'lastActivity'
- `order` ('asc' | 'desc'): Sort order

**Response** (200 OK):

```typescript
[
  {
    _id: "supplier-abc123",
    companyName: "Schreinerei Müller GmbH",
    supplierType: "subcontractor",
    rating: { overall: 4.8, reviewCount: 12 },
    activeProjectCount: 5,
    status: "Active",
  },
];
```

### GET /api/v1/suppliers/:id

Get supplier details.

**Auth:** All  
**Permission:** Supplier.READ

**Response** (200 OK): Full SupplierResponseDto

### PUT /api/v1/suppliers/:id

Update supplier.

**Auth:** INN, GF  
**Permission:** Supplier.UPDATE

### PUT /api/v1/suppliers/:id/approve

Approve pending supplier.

**Auth:** GF only  
**Permission:** Supplier.APPROVE

**Response** (200 OK):

```typescript
{
  "_id": "supplier-abc123",
  "status": "Active",
  "approvedBy": "user-gf-456",
  "approvedAt": "2025-11-12T10:30:00Z"
}
```

### PUT /api/v1/suppliers/:id/blacklist

Blacklist supplier.

**Auth:** GF only  
**Permission:** Supplier.BLACKLIST

**Request Body:**

```typescript
{
  "reason": "Multiple quality issues and missed deadlines"
}
```

### POST /api/v1/suppliers/:supplierId/contracts

Create supplier contract.

**Auth:** INN, PLAN, GF  
**Permission:** SupplierContract.CREATE

**Request Body:**

```typescript
{
  "projectId": "project-123",  // Optional, null for framework contract
  "contractType": "project",
  "title": "Elektrik Installation REWE München",
  "description": "Vollständige Elektroinstallation...",
  "scope": ["Verkabelung", "Steckdosen", "Beleuchtung"],
  "contractValue": 35000,
  "valueType": "Fixed",
  "startDate": "2025-02-01",
  "endDate": "2025-02-15",
  "paymentSchedule": [
    { "description": "50% Anzahlung", "percentage": 50, "amount": 17500, "dueCondition": "Bei Auftragserteilung" },
    { "description": "50% Restzahlung", "percentage": 50, "amount": 17500, "dueCondition": "Nach Abnahme" }
  ]
}
```

**Response** (201 Created): SupplierContractDto

### GET /api/v1/suppliers/:supplierId/contracts

List supplier contracts.

**Auth:** All  
**Permission:** SupplierContract.READ

---

## 17. Material Management Endpoints (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Status:** Critical - Addresses Pre-Mortem Danger #3  
**Priority:** Phase 1 MVP

### POST /api/v1/materials

Create new material in catalog.

**Auth:** INN, PLAN, KALK, GF  
**Permission:** Material.CREATE

**Request Body:**

```typescript
{
  "materialCode": "MAT-LED-001",
  "materialName": "LED-Panel 60x60cm warmweiß",
  "description": "Hochwertiges LED-Panel für abgehängte Decken...",
  "category": "ceiling_lights",
  "unit": "piece",
  "dimensions": { "length": 60, "width": 60, "height": 2, "unit": "cm" },
  "manufacturerName": "Osram",
  "manufacturerSKU": "LED-60X60-WW-40W",
  "supplierPrices": [
    {
      "supplierId": "supplier-123",
      "unitPrice": 145.00,
      "minimumOrderQuantity": 10,
      "leadTimeDays": 14,
      "isPreferred": true
    }
  ],
  "tags": ["LED", "Panel", "Decke", "warmweiß", "dimmbar"]
}
```

**Response** (201 Created):

```typescript
{
  "_id": "material-xyz123",
  "materialCode": "MAT-LED-001",
  "averagePrice": 145.00,
  "lowestPrice": 145.00,
  "status": "Active"
}
```

### GET /api/v1/materials

Search material catalog.

**Auth:** All  
**Permission:** Material.READ

**Query Parameters:**

- `category` (string): Filter by category
- `search` (string): Search name, description, tags
- `supplierId` (string): Materials from specific supplier
- `status` ('Active' | 'Discontinued'): Filter by status
- `sort` ('name' | 'price' | 'timesUsed'): Sort by
- `order` ('asc' | 'desc'): Sort order

**Response** (200 OK):

```typescript
[
  {
    _id: "material-xyz123",
    materialCode: "MAT-LED-001",
    materialName: "LED-Panel 60x60cm warmweiß",
    category: "ceiling_lights",
    unit: "piece",
    averagePrice: 145.0,
    lowestPrice: 138.0,
    supplierCount: 2,
    timesUsed: 12,
  },
];
```

### POST /api/v1/materials/:id/supplier-prices

Add or update supplier pricing.

**Auth:** INN, KALK, GF  
**Permission:** Material.UPDATE_PRICES

**Request Body:**

```typescript
{
  "supplierId": "supplier-456",
  "unitPrice": 138.00,
  "minimumOrderQuantity": 20,
  "leadTimeDays": 7,
  "bulkDiscounts": [
    { "quantityFrom": 50, "discountPercentage": 5, "unitPrice": 131.10 }
  ],
  "isPreferred": false,
  "notes": "Preis gültig bis 31.12.2025"
}
```

**Response** (200 OK): Updated MaterialDto with new price

---

## 18. Project Material Management Endpoints (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Priority:** Phase 1 MVP

### POST /api/v1/projects/:projectId/material-requirements

Add material to project BOM.

**Auth:** KALK (estimate), PLAN (planning), INN, GF  
**Permission:** ProjectMaterial.CREATE

**Request Body:**

```typescript
{
  "materialId": "material-xyz123",
  "phase": "installation",
  "estimatedQuantity": 24,
  "estimatedUnitPrice": 145.00,  // From material or specific supplier
  "workPackage": "Deckenbeleuchtung Verkaufsraum",
  "description": "LED-Panels für Hauptverkaufsfläche"
}
```

**Response** (201 Created): ProjectMaterialRequirementDto

### GET /api/v1/projects/:projectId/material-requirements

Get project BOM.

**Auth:** PLAN, INN, KALK, BUCH, GF  
**Permission:** ProjectMaterial.READ

**Query Parameters:**

- `phase` (string): Filter by project phase
- `status` (string): Filter by requirement status
- `supplierId` (string): Filter by supplier

**Response** (200 OK):

```typescript
[
  {
    _id: "project-material-123",
    materialId: "material-xyz123",
    materialName: "LED-Panel 60x60cm",
    phase: "installation",
    estimatedQuantity: 24,
    actualQuantity: 24,
    estimatedTotalCost: 3480.0,
    actualTotalCost: 3408.0,
    costVariance: -72.0,
    costVariancePercentage: -2.1,
    deliveryStatus: "delivered",
    requirementStatus: "delivered",
  },
];
```

### GET /api/v1/projects/:projectId/material-costs

Get material cost summary.

**Auth:** PLAN, KALK, BUCH, GF  
**Permission:** ProjectMaterial.READ

**Response** (200 OK):

```typescript
{
  "projectId": "project-123",
  "estimatedTotalCost": 125000.00,
  "actualTotalCost": 95200.00,
  "costVariance": -29800.00,
  "costVariancePercentage": -23.8,
  "materialCount": 12,
  "orderedCount": 8,
  "deliveredCount": 5,
  "notOrderedCount": 4,
  "byCategory": [
    { "category": "shelving", "estimated": 43000, "actual": 41200, "variance": -1800 },
    { "category": "lighting", "estimated": 35000, "actual": 33850, "variance": -1150 }
  ]
}
```

---

## 19. Purchase Order Endpoints (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Priority:** Phase 1 MVP

### POST /api/v1/purchase-orders

Create purchase order.

**Auth:** INN, PLAN (≤€10k), GF  
**Permission:** PurchaseOrder.CREATE

**Request Body:**

```typescript
{
  "projectId": "project-123",
  "supplierId": "supplier-abc123",
  "requiredByDate": "2025-02-15",
  "deliveryAddress": { /* project site address */ },
  "lineItems": [
    {
      "materialId": "material-xyz123",
      "description": "LED-Panel 60x60cm warmweiß",
      "quantity": 24,
      "unit": "piece",
      "unitPrice": 145.00,
      "taxRate": 19,
      "projectMaterialReqId": "project-material-123"
    }
  ],
  "shippingCost": 150.00
}
```

**Response** (201 Created):

```typescript
{
  "_id": "purchase-order-456",
  "poNumber": "PO-2025-00234",
  "totalAmount": 4274.60,
  "poStatus": "draft",  // or "pending_approval" if >€1k
  "approvalRequired": true
}
```

### PUT /api/v1/purchase-orders/:id/approve

Approve purchase order.

**Auth:** BUCH (≤€10k), GF (>€10k)  
**Permission:** PurchaseOrder.APPROVE

**Response** (200 OK):

```typescript
{
  "_id": "purchase-order-456",
  "poStatus": "approved",
  "approvedBy": "user-buch-789",
  "approvedAt": "2025-11-12T14:30:00Z"
}
```

### PUT /api/v1/purchase-orders/:id/send

Send PO to supplier.

**Auth:** INN, GF  
**Permission:** PurchaseOrder.SEND

**Request Body:**

```typescript
{
  "orderMethod": "Email",
  "orderDate": "2025-11-12"
}
```

**Response** (200 OK):

```typescript
{
  "_id": "purchase-order-456",
  "poStatus": "sent_to_supplier",
  "orderDate": "2025-11-12"
}
```

### PUT /api/v1/purchase-orders/:id/receive-delivery

Record material delivery.

**Auth:** INN, PLAN, GF  
**Permission:** PurchaseOrder.RECEIVE_DELIVERY

**Request Body:**

```typescript
{
  "lineItems": [
    {
      "materialId": "material-xyz123",
      "deliveredQuantity": 24,
      "deliveryDate": "2025-02-15"
    }
  ],
  "deliveryNotes": "Vollständige Lieferung, einwandfrei"
}
```

**Response** (200 OK):

```typescript
{
  "_id": "purchase-order-456",
  "poStatus": "delivered",
  "actualDeliveryDate": "2025-02-15",
  "projectCostsUpdated": true,
  "projectBudgetStatus": "OnTrack"
}
```

**Side Effects:**

- Updates ProjectMaterialRequirement.actualQuantity and actualTotalCost
- Recalculates project.actualMaterialCosts
- Triggers budget alert if project exceeds budget threshold

---

## 20. Supplier Invoice Endpoints (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Priority:** Phase 1 MVP

### POST /api/v1/supplier-invoices

Create supplier invoice record.

**Auth:** INN, BUCH, GF  
**Permission:** SupplierInvoice.CREATE

**Request Body:**

```typescript
{
  "invoiceNumber": "R-SUP-24-456",  // Supplier's invoice number
  "supplierId": "supplier-abc123",
  "projectId": "project-123",
  "invoiceDate": "2025-02-15",
  "dueDate": "2025-03-17",
  "lineItems": [
    { "description": "LED-Panel Installation", "quantity": 24, "unit": "piece", "unitPrice": 145.00, "taxRate": 19 }
  ],
  "netAmount": 3480.00,
  "taxRate": 19,
  "taxAmount": 661.20,
  "grossAmount": 4141.20
}
```

**Response** (201 Created):

```typescript
{
  "_id": "supplier-invoice-789",
  "paymentStatus": "Pending",  // or "Approved" if <€1k and 3-way match passes
  "approvalRequired": true
}
```

### PUT /api/v1/supplier-invoices/:id/approve

Approve invoice for payment.

**Auth:** BUCH (≤€10k), GF (>€10k)  
**Permission:** SupplierInvoice.APPROVE

**Response** (200 OK):

```typescript
{
  "_id": "supplier-invoice-789",
  "paymentStatus": "Approved",
  "approvedBy": "user-buch-101",
  "approvedAt": "2025-02-16T09:00:00Z"
}
```

### PUT /api/v1/supplier-invoices/:id/pay

Mark invoice as paid.

**Auth:** BUCH, GF  
**Permission:** SupplierInvoice.MARK_PAID

**Request Body:**

```typescript
{
  "paidDate": "2025-02-20",
  "paidAmount": 4141.20
}
```

**Response** (200 OK):

```typescript
{
  "_id": "supplier-invoice-789",
  "paymentStatus": "Paid",
  "paidDate": "2025-02-20",
  "paidAmount": 4141.20
}
```

**Side Effects:**

- Updates project.actualSupplierCosts
- Updates supplier.outstandingInvoices
- Syncs to Lexware (Phase 2+)

---

## 21. Supplier Communication Endpoints (NEW - Phase 1 MVP)

**Added:** 2025-11-12  
**Priority:** Phase 1 MVP

### POST /api/v1/suppliers/:supplierId/communications

Log communication with supplier.

**Auth:** INN, PLAN, GF  
**Permission:** Communication.CREATE

**Request Body:**

```typescript
{
  "projectId": "project-123",  // Optional
  "communicationType": "Email",
  "direction": "Outbound",
  "subject": "Angebot für Projekt REWE München",
  "content": "Sehr geehrter Herr Müller, hiermit senden wir Ihnen...",
  "communicationDate": "2025-11-12T14:00:00Z",
  "requiresFollowUp": true,
  "followUpDate": "2025-11-20"
}
```

**Response** (201 Created): SupplierCommunicationDto

### GET /api/v1/suppliers/:supplierId/communications

Get communication history.

**Auth:** INN, PLAN, GF  
**Permission:** Communication.READ

**Response** (200 OK): Array of SupplierCommunicationDto

---

## 22. Import/Export Endpoints (NEW - MVP)

**Added:** 2025-01-27  
**Priority:** MVP - Required for data migration and ongoing operations

### 22.1 Customer Import Endpoints

#### 22.1.1 Upload Customer Import File

**POST** `/api/v1/customers/import/upload`

Upload Excel/CSV file for customer import.

**Auth:** PLAN, ADM, GF  
**Permission:** Customer.IMPORT

**Request:**

- **Content-Type:** `multipart/form-data`
- **Body:** File (Excel `.xlsx`, `.xls` or CSV `.csv`)
- **Max file size:** 10 MB
- **Max rows:** 10,000

**Response (200 OK):**

```json
{
  "importId": "import-123",
  "filename": "customers.xlsx",
  "rowCount": 512,
  "headers": [
    "companyName",
    "vatNumber",
    "email",
    "phone",
    "address_street",
    "address_zip",
    "address_city"
  ],
  "status": "uploaded",
  "uploadedAt": "2025-01-27T10:00:00Z"
}
```

**Error Response (400 Bad Request):**

```json
{
  "type": "https://api.kompass.de/errors/validation-error",
  "title": "File Validation Failed",
  "status": 400,
  "detail": "Invalid file type. Supported formats: .xlsx, .xls, .csv",
  "instance": "/api/v1/customers/import/upload"
}
```

#### 22.1.2 Map Customer Import Fields

**POST** `/api/v1/customers/import/:importId/map`

Map CSV/Excel columns to internal fields. Supports automatic mapping with manual override.

**Auth:** PLAN, ADM, GF  
**Permission:** Customer.IMPORT

**Request Body:**

```typescript
{
  "mappings": {
    "company_name": "companyName",        // Required field
    "vat_number": "vatNumber",            // Optional field
    "email": "email",                     // Optional field
    "phone": "phone",                     // Optional field
    "address_street": "billingAddress.street",  // Required nested field
    "address_zip": "billingAddress.zipCode",    // Required nested field
    "address_city": "billingAddress.city"       // Required nested field
  },
  "autoDetect": true  // Try automatic mapping first
}
```

**Response (200 OK):**

```json
{
  "importId": "import-123",
  "mappings": {
    "company_name": "companyName",
    "vat_number": "vatNumber",
    "email": "email",
    "phone": "phone",
    "address_street": "billingAddress.street",
    "address_zip": "billingAddress.zipCode",
    "address_city": "billingAddress.city"
  },
  "unmappedColumns": ["custom_field_1", "notes"],
  "requiredFieldsMapped": true,
  "status": "mapped",
  "mappedAt": "2025-01-27T10:05:00Z"
}
```

**Error Response (400 Bad Request):**

```json
{
  "type": "https://api.kompass.de/errors/validation-error",
  "title": "Required Fields Not Mapped",
  "status": 400,
  "detail": "Required fields must be mapped: companyName, billingAddress.street, billingAddress.zipCode, billingAddress.city",
  "instance": "/api/v1/customers/import/import-123/map",
  "missingFields": ["companyName", "billingAddress.street"]
}
```

#### 22.1.3 Validate Customer Import

**POST** `/api/v1/customers/import/:importId/validate`

Validate imported data and check for duplicates.

**Auth:** PLAN, ADM, GF  
**Permission:** Customer.IMPORT

**Request Body:**

```typescript
{
  "checkDuplicates": true,        // Check for duplicate customers
  "duplicateMatchingFields": ["vatNumber", "email"]  // Fields to use for duplicate detection
}
```

**Response (200 OK):**

```json
{
  "importId": "import-123",
  "totalRows": 512,
  "validRows": 487,
  "invalidRows": 15,
  "duplicateRows": 10,
  "validationResults": [
    {
      "row": 2,
      "status": "error",
      "field": "vatNumber",
      "error": "Invalid VAT number format. Expected format: DE123456789",
      "value": "123456789",
      "suggestedValue": "DE123456789"
    },
    {
      "row": 5,
      "status": "warning",
      "field": "email",
      "error": "Invalid email format",
      "value": "test@",
      "suggestedValue": null
    },
    {
      "row": 12,
      "status": "error",
      "field": "companyName",
      "error": "Required field is missing",
      "value": "",
      "suggestedValue": null
    },
    {
      "row": 25,
      "status": "duplicate",
      "field": "vatNumber",
      "error": "Duplicate customer found",
      "value": "DE123456789",
      "existingCustomerId": "customer-456",
      "existingCustomerName": "Existing Customer GmbH"
    }
  ],
  "duplicates": [
    {
      "row": 25,
      "importData": {
        "companyName": "New Customer GmbH",
        "vatNumber": "DE123456789"
      },
      "existingCustomer": {
        "id": "customer-456",
        "companyName": "Existing Customer GmbH",
        "vatNumber": "DE123456789"
      },
      "matchConfidence": 0.95
    }
  ],
  "status": "validated",
  "validatedAt": "2025-01-27T10:10:00Z"
}
```

#### 22.1.4 Execute Customer Import

**POST** `/api/v1/customers/import/:importId/execute`

Execute customer import with specified options.

**Auth:** PLAN, ADM, GF  
**Permission:** Customer.IMPORT

**Request Body:**

```typescript
{
  "options": {
    "skipErrors": true,           // Skip rows with errors
    "skipDuplicates": true,       // Skip duplicate rows
    "updateDuplicates": false,    // Update existing customers if duplicate found
    "defaultOwner": "user-123"    // Default owner for imported customers (ADM only)
  }
}
```

**Response (200 OK):**

```json
{
  "importId": "import-123",
  "importedCount": 487,
  "skippedCount": 25,
  "errorCount": 15,
  "duplicateCount": 10,
  "updatedCount": 0,
  "importedCustomerIds": ["customer-789", "customer-790", "customer-791"],
  "status": "completed",
  "completedAt": "2025-01-27T10:15:00Z",
  "errorLogUrl": "/api/v1/customers/import/import-123/errors"
}
```

#### 22.1.5 Get Customer Import Errors

**GET** `/api/v1/customers/import/:importId/errors`

Get error log for customer import (CSV format for download).

**Auth:** PLAN, ADM, GF  
**Permission:** Customer.IMPORT

**Response (200 OK):**

- **Content-Type:** `text/csv`
- **Content-Disposition:** `attachment; filename="customer_import_errors_2025-01-27.csv"`
- **Body:** CSV file with columns: `row`, `field`, `error`, `value`, `suggestedValue`

### 22.2 Contact Protocol Import Endpoints

#### 22.2.1 Upload Protocol Import File

**POST** `/api/v1/protocols/import/upload`

Upload Word document for protocol import.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.IMPORT

**Request:**

- **Content-Type:** `multipart/form-data`
- **Body:** File (Word `.docx`, `.doc`)
- **Max file size:** 10 MB
- **Max protocols:** 1,000

**Response (200 OK):**

```json
{
  "importId": "import-456",
  "filename": "protocols.docx",
  "tableCount": 1,
  "rowCount": 150,
  "status": "uploaded",
  "uploadedAt": "2025-01-27T10:20:00Z"
}
```

**Error Response (400 Bad Request):**

```json
{
  "type": "https://api.kompass.de/errors/validation-error",
  "title": "File Validation Failed",
  "status": 400,
  "detail": "Invalid file type. Supported formats: .docx, .doc",
  "instance": "/api/v1/protocols/import/upload"
}
```

#### 22.2.2 Extract Protocol Table

**POST** `/api/v1/protocols/import/:importId/extract`

Extract table from Word document. Supports multiple tables - user selects which table to import.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.IMPORT

**Request Body:**

```typescript
{
  "tableIndex": 0,  // Index of table to extract (0-based)
  "columnMappings": {
    "date": 0,      // Column index for date (required)
    "note": 1,      // Column index for note (required)
    "action": 2     // Column index for action (optional)
  }
}
```

**Response (200 OK):**

```json
{
  "importId": "import-456",
  "tableIndex": 0,
  "headers": ["Date", "Note", "Action"],
  "rowCount": 150,
  "sampleRows": [
    {
      "rowIndex": 0,
      "date": "2024-01-15",
      "note": "Customer visit - discussed new project",
      "action": "Follow up next week"
    },
    {
      "rowIndex": 1,
      "date": "15.01.24",
      "note": "Phone call - confirmed delivery date",
      "action": "Send quote"
    },
    {
      "rowIndex": 2,
      "date": "15 Jan 24",
      "note": "Email sent - project proposal",
      "action": "Wait for response"
    }
  ],
  "status": "extracted",
  "extractedAt": "2025-01-27T10:25:00Z"
}
```

**Error Response (400 Bad Request):**

```json
{
  "type": "https://api.kompass.de/errors/validation-error",
  "title": "Table Extraction Failed",
  "status": 400,
  "detail": "No table found in document or table index out of range",
  "instance": "/api/v1/protocols/import/import-456/extract",
  "availableTables": 0
}
```

#### 22.2.3 Parse Protocol Dates

**POST** `/api/v1/protocols/import/:importId/parse-dates`

Parse dates from protocol import. Supports various date formats with fallback to manual entry.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.IMPORT

**Request Body:**

```typescript
{
  "dateFormats": [  // Optional: specify expected formats
    "DD.MM.YYYY",
    "DD.MM.YY",
    "YYYY-MM-DD",
    "DD MMM YY"
  ],
  "locale": "de-DE"  // Optional: locale for date parsing (default: de-DE)
}
```

**Response (200 OK):**

```json
{
  "importId": "import-456",
  "totalRows": 150,
  "parsedCount": 140,
  "failedCount": 10,
  "dateParsingResults": [
    {
      "rowIndex": 0,
      "originalValue": "2024-01-15",
      "parsedValue": "2024-01-15T00:00:00Z",
      "format": "YYYY-MM-DD",
      "status": "success",
      "confidence": 1.0
    },
    {
      "rowIndex": 1,
      "originalValue": "15.01.24",
      "parsedValue": "2024-01-15T00:00:00Z",
      "format": "DD.MM.YY",
      "status": "success",
      "confidence": 0.95
    },
    {
      "rowIndex": 2,
      "originalValue": "15 Jan 24",
      "parsedValue": "2024-01-15T00:00:00Z",
      "format": "DD MMM YY",
      "status": "success",
      "confidence": 0.9
    },
    {
      "rowIndex": 25,
      "originalValue": "invalid-date",
      "parsedValue": null,
      "format": null,
      "status": "failed",
      "confidence": 0.0,
      "requiresManualEntry": true,
      "suggestedFormats": ["DD.MM.YYYY", "YYYY-MM-DD", "DD MMM YYYY"]
    }
  ],
  "status": "parsed",
  "parsedAt": "2025-01-27T10:30:00Z"
}
```

#### 22.2.4 Correct Protocol Dates

**POST** `/api/v1/protocols/import/:importId/correct-dates`

Manually correct dates that failed to parse.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.IMPORT

**Request Body:**

```typescript
{
  "dateCorrections": [
    {
      "rowIndex": 25,
      "correctedDate": "2024-01-15T00:00:00Z",  // ISO 8601 format
      "originalValue": "invalid-date"
    },
    {
      "rowIndex": 30,
      "correctedDate": "2024-02-20T00:00:00Z",
      "originalValue": "20.02.2024"
    }
  ]
}
```

**Response (200 OK):**

```json
{
  "importId": "import-456",
  "correctedCount": 10,
  "status": "corrected",
  "correctedAt": "2025-01-27T10:35:00Z"
}
```

#### 22.2.5 Assign Protocol Customers

**POST** `/api/v1/protocols/import/:importId/assign-customers`

Assign customers to protocols. Supports single customer assignment or per-row assignment.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.IMPORT

**Request Body:**

```typescript
{
  "defaultCustomerId": "customer-123",  // Default customer for all protocols
  "customerAssignments": [               // Optional: per-row assignments
    {
      "rowIndex": 5,
      "customerId": "customer-123"
    },
    {
      "rowIndex": 12,
      "customerId": "customer-456"
    }
  ],
  "autoMatchCustomers": true  // Optional: try to match customers by name from note field
}
```

**Response (200 OK):**

```json
{
  "importId": "import-456",
  "assignedCount": 150,
  "autoMatchedCount": 45,
  "manualAssignedCount": 105,
  "unassignedCount": 0,
  "status": "assigned",
  "assignedAt": "2025-01-27T10:40:00Z"
}
```

#### 22.2.6 Validate Protocol Import

**POST** `/api/v1/protocols/import/:importId/validate`

Validate imported protocols.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.IMPORT

**Response (200 OK):**

```json
{
  "importId": "import-456",
  "totalRows": 150,
  "validRows": 140,
  "invalidRows": 10,
  "validationResults": [
    {
      "rowIndex": 25,
      "status": "error",
      "field": "date",
      "error": "Date is required",
      "value": null
    },
    {
      "rowIndex": 30,
      "status": "error",
      "field": "note",
      "error": "Note is required. Minimum length: 2 characters",
      "value": ""
    },
    {
      "rowIndex": 35,
      "status": "error",
      "field": "customerId",
      "error": "Customer is required",
      "value": null
    },
    {
      "rowIndex": 40,
      "status": "warning",
      "field": "date",
      "error": "Date is in the future",
      "value": "2026-01-15T00:00:00Z"
    }
  ],
  "status": "validated",
  "validatedAt": "2025-01-27T10:45:00Z"
}
```

#### 22.2.7 Execute Protocol Import

**POST** `/api/v1/protocols/import/:importId/execute`

Execute protocol import with specified options.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.IMPORT

**Request Body:**

```typescript
{
  "options": {
    "skipErrors": true,              // Skip rows with errors
    "defaultUserId": "user-123",     // Default user for imported protocols
    "defaultProtocolType": "visit",  // Default protocol type
    "defaultContactId": "contact-456" // Optional: default contact
  }
}
```

**Response (200 OK):**

```json
{
  "importId": "import-456",
  "importedCount": 140,
  "skippedCount": 10,
  "errorCount": 10,
  "importedProtocolIds": ["protocol-789", "protocol-790", "protocol-791"],
  "status": "completed",
  "completedAt": "2025-01-27T10:50:00Z",
  "errorLogUrl": "/api/v1/protocols/import/import-456/errors"
}
```

#### 22.2.8 Get Protocol Import Errors

**GET** `/api/v1/protocols/import/:importId/errors`

Get error log for protocol import (CSV format for download).

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.IMPORT

**Response (200 OK):**

- **Content-Type:** `text/csv`
- **Content-Disposition:** `attachment; filename="protocol_import_errors_2025-01-27.csv"`
- **Body:** CSV file with columns: `row`, `field`, `error`, `value`, `suggestedValue`

### 22.3 Customer Export Endpoints

#### 22.3.1 Export Customers

**GET** `/api/v1/customers/export`

Export customers to CSV/Excel/JSON/DATEV format.

**Auth:** PLAN, ADM, GF, BUCH  
**Permission:** Customer.EXPORT

**Query Parameters:**

- `format` (string, required): `csv` | `excel` | `json` | `datev`
- `dateRange` (string, optional): `all` | `last30days` | `last90days` | `custom`
- `startDate` (string, optional): ISO date (required if `dateRange=custom`)
- `endDate` (string, optional): ISO date (required if `dateRange=custom`)
- `fields` (string, optional): Comma-separated field list (default: all fields)
- `filters` (string, optional): JSON-encoded filters
  - `owner` (string): Filter by owner ID
  - `rating` (string): Filter by rating (`A`, `B`, `C`)
  - `status` (string): Filter by status

**Response (200 OK):**

- **Content-Type:**
  - `text/csv` (CSV format)
  - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (Excel format)
  - `application/json` (JSON format)
  - `text/csv` (DATEV format - GoBD-compliant)
- **Content-Disposition:** `attachment; filename="customers_export_2025-01-27.csv"`

**Example Request:**

```
GET /api/v1/customers/export?format=csv&dateRange=last30days&fields=companyName,vatNumber,email,phone
```

**Example Response (CSV):**

```csv
companyName,vatNumber,email,phone
Hofladen Müller GmbH,DE123456789,info@hofladen-mueller.de,+49-89-1234567
REWE Store München,DE987654321,store@rewe.de,+49-89-9876543
```

**Error Response (400 Bad Request):**

```json
{
  "type": "https://api.kompass.de/errors/validation-error",
  "title": "Invalid Export Format",
  "status": 400,
  "detail": "Invalid format. Supported formats: csv, excel, json, datev",
  "instance": "/api/v1/customers/export"
}
```

### 22.4 Contact Protocol Export Endpoints

#### 22.4.1 Export Contact Protocols

**GET** `/api/v1/protocols/export`

Export contact protocols to CSV/Excel/Word/JSON format.

**Auth:** PLAN, ADM, GF  
**Permission:** Protocol.EXPORT

**Query Parameters:**

- `format` (string, required): `csv` | `excel` | `word` | `json`
- `customerId` (string, optional): Filter by customer ID
- `contactId` (string, optional): Filter by contact ID
- `dateRange` (string, optional): `all` | `last30days` | `last90days` | `custom`
- `startDate` (string, optional): ISO date (required if `dateRange=custom`)
- `endDate` (string, optional): ISO date (required if `dateRange=custom`)
- `protocolType` (string, optional): Filter by protocol type (`visit`, `call`, `email`, `meeting`)
- `fields` (string, optional): Comma-separated field list (default: all fields)

**Response (200 OK):**

- **Content-Type:**
  - `text/csv` (CSV format)
  - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (Excel format)
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (Word format)
  - `application/json` (JSON format)
- **Content-Disposition:** `attachment; filename="protocols_export_2025-01-27.docx"`

**Example Request:**

```
GET /api/v1/protocols/export?format=word&customerId=customer-123&dateRange=last30days
```

**Word Export Format:**

- Table structure with headers: Date, Note, Action, Customer, Contact, User
- Date format: `DD.MM.YYYY` (German format)
- Professional table styling with headers
- Supports multiple pages if needed

**Error Response (400 Bad Request):**

```json
{
  "type": "https://api.kompass.de/errors/validation-error",
  "title": "Invalid Export Format",
  "status": 400,
  "detail": "Invalid format. Supported formats: csv, excel, word, json",
  "instance": "/api/v1/protocols/export"
}
```

### 22.5 Import/Export DTOs

#### 22.5.1 Customer Import DTOs

```typescript
// Upload Response
interface CustomerImportUploadDto {
  importId: string;
  filename: string;
  rowCount: number;
  headers: string[];
  status: "uploaded";
  uploadedAt: Date;
}

// Map Request
interface CustomerImportMapDto {
  mappings: Record<string, string>; // CSV column -> internal field
  autoDetect?: boolean;
}

// Map Response
interface CustomerImportMapResponseDto {
  importId: string;
  mappings: Record<string, string>;
  unmappedColumns: string[];
  requiredFieldsMapped: boolean;
  status: "mapped";
  mappedAt: Date;
}

// Validate Response
interface CustomerImportValidateDto {
  importId: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  validationResults: ValidationResult[];
  duplicates?: DuplicateMatch[];
  status: "validated";
  validatedAt: Date;
}

interface ValidationResult {
  row: number;
  status: "valid" | "warning" | "error" | "duplicate";
  field: string;
  error: string;
  value: unknown;
  suggestedValue?: unknown;
}

interface DuplicateMatch {
  row: number;
  importData: Partial<Customer>;
  existingCustomer: Customer;
  matchConfidence: number;
}

// Execute Request
interface CustomerImportExecuteDto {
  options: {
    skipErrors?: boolean;
    skipDuplicates?: boolean;
    updateDuplicates?: boolean;
    defaultOwner?: string;
  };
}

// Execute Response
interface CustomerImportExecuteResponseDto {
  importId: string;
  importedCount: number;
  skippedCount: number;
  errorCount: number;
  duplicateCount: number;
  updatedCount: number;
  importedCustomerIds: string[];
  status: "completed";
  completedAt: Date;
  errorLogUrl: string;
}
```

#### 22.5.2 Protocol Import DTOs

```typescript
// Upload Response
interface ProtocolImportUploadDto {
  importId: string;
  filename: string;
  tableCount: number;
  rowCount: number;
  status: "uploaded";
  uploadedAt: Date;
}

// Extract Request
interface ProtocolImportExtractDto {
  tableIndex: number;
  columnMappings: {
    date: number;
    note: number;
    action?: number;
  };
}

// Extract Response
interface ProtocolImportExtractResponseDto {
  importId: string;
  tableIndex: number;
  headers: string[];
  rowCount: number;
  sampleRows: ProtocolImportRow[];
  status: "extracted";
  extractedAt: Date;
}

interface ProtocolImportRow {
  rowIndex: number;
  date: string;
  note: string;
  action?: string;
}

// Parse Dates Request
interface ProtocolImportParseDatesDto {
  dateFormats?: string[];
  locale?: string;
}

// Parse Dates Response
interface ProtocolImportParseDatesResponseDto {
  importId: string;
  totalRows: number;
  parsedCount: number;
  failedCount: number;
  dateParsingResults: DateParsingResult[];
  status: "parsed";
  parsedAt: Date;
}

interface DateParsingResult {
  rowIndex: number;
  originalValue: string;
  parsedValue: string | null;
  format: string | null;
  status: "success" | "failed";
  confidence: number;
  requiresManualEntry?: boolean;
  suggestedFormats?: string[];
}

// Correct Dates Request
interface ProtocolImportCorrectDatesDto {
  dateCorrections: DateCorrection[];
}

interface DateCorrection {
  rowIndex: number;
  correctedDate: string; // ISO 8601 format
  originalValue: string;
}

// Assign Customers Request
interface ProtocolImportAssignCustomersDto {
  defaultCustomerId: string;
  customerAssignments?: CustomerAssignment[];
  autoMatchCustomers?: boolean;
}

interface CustomerAssignment {
  rowIndex: number;
  customerId: string;
}

// Assign Customers Response
interface ProtocolImportAssignCustomersResponseDto {
  importId: string;
  assignedCount: number;
  autoMatchedCount: number;
  manualAssignedCount: number;
  unassignedCount: number;
  status: "assigned";
  assignedAt: Date;
}

// Validate Response
interface ProtocolImportValidateDto {
  importId: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  validationResults: ValidationResult[];
  status: "validated";
  validatedAt: Date;
}

// Execute Request
interface ProtocolImportExecuteDto {
  options: {
    skipErrors?: boolean;
    defaultUserId?: string;
    defaultProtocolType?: string;
    defaultContactId?: string;
  };
}

// Execute Response
interface ProtocolImportExecuteResponseDto {
  importId: string;
  importedCount: number;
  skippedCount: number;
  errorCount: number;
  importedProtocolIds: string[];
  status: "completed";
  completedAt: Date;
  errorLogUrl: string;
}
```

### 22.6 Import/Export Business Rules

#### 22.6.1 Customer Import Business Rules

1. **File Validation:**
   - Maximum file size: 10 MB
   - Maximum rows: 10,000
   - Supported formats: `.xlsx`, `.xls`, `.csv`
   - Encoding: UTF-8 (preferred), ISO-8859-1 (fallback)

2. **Field Mapping:**
   - Automatic mapping: Try exact match, fuzzy match, synonym matching
   - Manual mapping: User can override automatic mapping
   - Required fields: `companyName`, `billingAddress.street`, `billingAddress.zipCode`, `billingAddress.city`
   - Optional fields: All other fields can be skipped

3. **Validation:**
   - Field-level validation: Validate each field against business rules
   - Row-level validation: Validate entire row for consistency
   - Duplicate detection: Check for duplicates using VAT number, email, or company name + address

4. **Error Handling:**
   - Skip errors: Import valid rows, skip invalid rows
   - Abort on error: Stop import on first error
   - Log errors: Generate error log CSV file

5. **Duplicate Handling:**
   - Skip duplicates: Don't import duplicate rows (default)
   - Update duplicates: Update existing customers with new data
   - Ask user: Show duplicate dialog for user decision

#### 22.6.2 Protocol Import Business Rules

1. **File Validation:**
   - Maximum file size: 10 MB
   - Maximum protocols: 1,000
   - Supported formats: `.docx`, `.doc`
   - Table structure: Must contain table with date, note, action columns

2. **Table Extraction:**
   - Detect tables: System detects all tables in Word document
   - Select table: User selects which table to import (if multiple tables)
   - Column mapping: Automatic mapping with manual override

3. **Date Parsing:**
   - Supported formats: ISO, German, text, numeric, mixed formats
   - Parsing order: Try common formats first, then text, then numeric, then fuzzy
   - Fallback: Manual entry via date picker if parsing fails
   - Validation: Validate parsed dates (not in future, not too far in past)

4. **Customer Assignment:**
   - Single customer: User can assign one customer to all protocols
   - Multiple customers: User can assign different customers to different protocols
   - Auto-match: System can attempt to match customers by name from note field

5. **Validation:**
   - Field-level validation: Validate date, note, customer
   - Row-level validation: Validate entire protocol for consistency
   - Date validation: Date must be valid, not in future (warning), not too far in past (warning)

6. **Error Handling:**
   - Skip errors: Import valid protocols, skip invalid protocols
   - Abort on error: Stop import on first error
   - Log errors: Generate error log CSV file

#### 22.6.3 Export Business Rules

1. **Customer Export:**
   - Format selection: CSV, Excel, JSON, DATEV
   - Field selection: All fields or custom selection
   - Date range filtering: All, last 30 days, last 90 days, custom range
   - Customer filtering: By owner, by rating, by status
   - RBAC: ADM can only export own customers, GF/PLAN can export all customers

2. **Protocol Export:**
   - Format selection: CSV, Excel, Word, JSON
   - Field selection: All fields or custom selection
   - Date range filtering: All, last 30 days, last 90 days, custom range
   - Customer filtering: By customer ID, by contact ID
   - Protocol type filtering: By protocol type (visit, call, email, meeting)
   - RBAC: ADM can only export own protocols, GF/PLAN can export all protocols

3. **Performance:**
   - Large exports: Process in chunks (1000 rows at a time)
   - Progress tracking: Show progress bar for long-running exports
   - Background jobs: Use background jobs for exports >5000 rows
   - Rate limiting: Limit export requests to prevent abuse

### 22.7 Import/Export Performance Considerations

1. **File Processing:**
   - Large files: Process files in chunks (1000 rows at a time)
   - Progress tracking: Show progress bar for long-running imports
   - Background jobs: Use background jobs for imports >5000 rows
   - Memory management: Stream file processing to avoid memory issues

2. **Date Parsing:**
   - Caching: Cache parsed dates to avoid re-parsing
   - Batch processing: Process dates in batches for better performance
   - Parallel processing: Parse dates in parallel for large imports

3. **Export Generation:**
   - Streaming: Stream export generation to avoid memory issues
   - Compression: Compress large export files
   - Caching: Cache export results for repeated requests

4. **Error Handling:**
   - Error logging: Log errors to file for large imports
   - Error reporting: Generate error reports for user review
   - Error recovery: Allow user to retry import with corrections

---

## 23. AI Proxy Endpoints (NEW)

**Added:** 2025-02-21
**Priority:** Phase 1 - Enables AI-assisted workflows with safe fallbacks

### 23.1 Scope and Versioned Path

- All AI proxy endpoints are versioned and **must** live under `/api/v1/ai/*`.
- The proxy encapsulates provider-specific behavior and returns normalized envelopes, ensuring backward compatibility across AI model upgrades.

### 23.2 Shared Response Envelope

```typescript
interface AiResponseEnvelope<TData = any> {
  status: "success" | "clarification_needed" | "error";
  correlationId: string; // echo from request header or generated server-side
  conversationId?: string; // present when conversational state is maintained
  operationId?: string; // BullMQ jobId for long-running operations
  message?: string; // human-readable summary
  data?: TData; // primary payload for success
  clarification?: {
    // required when status === 'clarification_needed'
    prompt: string;
    missingFields?: string[];
    suggestedQuestions?: string[];
  };
  errors?: Array<{
    code: AiErrorCode;
    message: string;
    target?: string; // field or section name
  }>;
}

type AiErrorCode =
  | "ai_request_invalid_input"
  | "ai_provider_unavailable"
  | "ai_provider_error"
  | "ai_rate_limited"
  | "ai_conversation_not_found"
  | "ai_operation_not_found"
  | "ai_operation_expired";
```

**Status semantics:**

- `success` → Data is complete; the caller can render or persist the payload.
- `clarification_needed` → Additional input is required; clients must call `POST /api/v1/ai/conversation/{conversationId}/message` with the provided `conversationId`.
- `error` → One or more `errors` are present; retry and escalation logic is client-driven.

### 23.3 Correlation & Conversation Identifiers

- **Correlation ID:**
  - Accepted from `X-Correlation-Id`; generated if absent and echoed in every response.
  - Logged across HTTP handlers and BullMQ processors for end-to-end tracing.
- **Conversation ID:**
  - Established on the first AI interaction that requires context preservation (e.g., clarifications or multi-turn conversations).
  - Clients must supply it in subsequent conversation messages to maintain continuity.

### 23.4 Error Codes

| Code                        | Description                                        | Recommended Client Action                    |
| --------------------------- | -------------------------------------------------- | -------------------------------------------- |
| `ai_request_invalid_input`  | Request payload failed schema or safety validation | Fix inputs and retry                         |
| `ai_provider_unavailable`   | Upstream AI provider not reachable or degraded     | Retry with backoff or fall back to cached UI |
| `ai_provider_error`         | Provider returned an unexpected failure            | Retry with backoff; capture correlation ID   |
| `ai_rate_limited`           | Provider or proxy rate limit exceeded              | Apply exponential backoff                    |
| `ai_conversation_not_found` | Conversation ID is unknown or expired              | Restart flow with a new message              |
| `ai_operation_not_found`    | Polling for a job that does not exist              | Validate operationId before polling          |
| `ai_operation_expired`      | Long-running job exceeded retention window         | Re-run the analysis request                  |

### 23.5 Core Endpoints

#### 23.5.1 POST /api/v1/ai/analyze-text

Runs synchronous or queued AI analysis on freeform text.

**Request Body:**

```json
{
  "text": "Summarize the meeting notes and list risks.",
  "task": "summary", // summary | classification | extraction
  "language": "de-DE",
  "context": {
    "customerId": "customer-123",
    "projectId": "project-456"
  }
}
```

**Response (200 OK — success):**

```json
{
  "status": "success",
  "correlationId": "a1b2c3",
  "conversationId": "conv-789",
  "data": {
    "summary": "Meeting agreed on rollout in Q2.",
    "risks": ["Pending budget approval", "Vendor SLA unconfirmed"]
  }
}
```

**Response (206 Partial — clarification_needed):**

```json
{
  "status": "clarification_needed",
  "correlationId": "a1b2c3",
  "conversationId": "conv-789",
  "clarification": {
    "prompt": "Please specify which risk categories to extract.",
    "missingFields": ["riskCategories"],
    "suggestedQuestions": ["Security?", "Timeline?"]
  }
}
```

**Response (202 Accepted — queued):**

```json
{
  "status": "success",
  "correlationId": "a1b2c3",
  "operationId": "job-456",
  "message": "Analysis queued; poll operations endpoint for completion."
}
```

#### 23.5.2 POST /api/v1/ai/conversation/{conversationId}/message

Continues a multi-turn AI dialogue to resolve clarifications or ask follow-up questions.

**Request Body:**

```json
{
  "message": "Extract only timeline risks",
  "context": {
    "projectId": "project-456"
  }
}
```

**Response (200 OK):** Uses the shared envelope; typically returns `success` with the resolved payload or `clarification_needed` with updated prompts.

#### 23.5.3 GET /api/v1/ai/operations/{jobId}

Polls BullMQ-backed long-running operations created by `/analyze-text` (and future AI tasks).

- **Query Params:** none.
- **Response (200 OK):**

```json
{
  "status": "success",
  "correlationId": "a1b2c3",
  "operationId": "job-456",
  "data": {
    "state": "completed", // waiting | active | completed | failed | delayed
    "progress": 100,
    "result": {
      "summary": "...",
      "risks": ["..."]
    }
  }
}
```

- **Response (200 OK — still running):**

```json
{
  "status": "success",
  "correlationId": "a1b2c3",
  "operationId": "job-456",
  "data": {
    "state": "active",
    "progress": 45
  }
}
```

### 23.6 Multi-Turn Clarification Workflow

1. Client sends initial request to `/api/v1/ai/analyze-text` with optional `X-Correlation-Id`.
2. If `clarification_needed`, the response includes `conversationId` and a targeted prompt.
3. Client displays the prompt to the user and submits the user's answer to `/api/v1/ai/conversation/{conversationId}/message`, including the correlation ID.
4. The proxy maintains conversation state and merges prior context to produce the next response.
5. Flow ends when the proxy returns `success` or an unrecoverable `error`.

### 23.7 Long-Running Operations & BullMQ Polling

- Large inputs or provider-triggered throttling move work to a BullMQ queue.
- `/api/v1/ai/analyze-text` immediately returns `202 Accepted` with `operationId` and `correlationId`.
- Workers update job `progress` (0-100) and attach the final AI result to the job when completed.
- Clients poll `GET /api/v1/ai/operations/{jobId}` every 2-5 seconds until `state === "completed"` or `state === "failed"`.
- Failed jobs return `status: "error"` with `ai_provider_error` or `ai_operation_expired` codes; clients may re-run the request with a fresh correlation ID.

### 23.8 Streaming Delivery (SSE/WebSocket)

#### Message Envelope (applies to SSE `data:` payloads and WebSocket frames)

```jsonc
{
  "status": "streaming" | "success" | "clarification_needed" | "error", // streaming is used for incremental tokens
  "correlationId": "a1b2c3", // required in every frame
  "conversationId": "conv-789", // present when conversation context exists
  "chunk": { // optional; only present for streaming payloads
    "content": "partial text", // streamed token buffer
    "metadata": { "tokenCount": 32, "provider": "openai" }
  },
  "isFinal": false, // true only on the terminal frame
  "usage": { // only on final frame when available
    "promptTokens": 128,
    "completionTokens": 256,
    "totalTokens": 384,
    "billingCurrency": "EUR"
  },
  "errors": [
    { "code": "ai_provider_error", "message": "..." }
  ] // present when status === "error"
}
```

- `status: "streaming"` is emitted for incremental frames; the final frame reverts to `success`, `clarification_needed`, or `error` and **must** set `isFinal: true`.
- Clarification prompts are only sent on the terminal frame (`status: "clarification_needed"`) and **never** mixed into partial chunks.

#### Heartbeats and Timeouts

- **Heartbeat cadence:** server sends an SSE comment (`:ping`) or WebSocket text frame `{ "type": "heartbeat" }` every 15 seconds when no tokens are produced.
- **Client timeout:** clients abort the stream if no data **and** no heartbeat is received for 30 seconds, then apply retry/backoff rules.
- **Server idle timeout:** server closes the stream after 2 minutes of inactivity or when upstream provider signals completion.

#### Retry and Backoff

- Idempotent retries reuse the same `X-Correlation-Id` if the prior attempt returned no `isFinal: true` frame; otherwise generate a new one.
- Recommended backoff: exponential starting at 1s, capped at 30s, with a maximum of 3 reconnect attempts before surfacing an error to the user.
- When reconnecting mid-stream, clients should:
  - Reopen the SSE/WebSocket connection with the last received `correlationId`.
  - Include `Last-Event-Id` (SSE) or a `resumeFromToken` hint when supported; otherwise restart the request and allow the proxy to replay from cached partials if available.

#### Sample Flows

**SSE client happy path:**

1. Client POSTs `/api/v1/ai/analyze-text?stream=true` with `X-Correlation-Id`.
2. Server responds `200` and begins SSE stream.
3. Client receives multiple `status: "streaming"` frames with `chunk.content` and `isFinal: false`.
4. Terminal frame returns `status: "success"`, `isFinal: true`, `usage`, and optional `conversationId`.

**WebSocket with clarification:**

1. Client opens `/ws/ai` with `X-Correlation-Id` and sends a message envelope identical to the HTTP body.
2. Server streams `status: "streaming"` chunks.
3. Final frame returns `status: "clarification_needed"`, `isFinal: true`, `clarification` payload (non-streamed), and `conversationId`.
4. Client renders prompt and submits the user's reply via `POST /api/v1/ai/conversation/{conversationId}/message` (HTTP) or a WebSocket message; streaming resumes using the same conversation.

**Failure and fallback to queued jobs:**

1. If provider backpressure or payload size prohibits streaming, the proxy returns `202 Accepted` with `operationId` and closes the stream after an initial informative frame.
2. Clients pivot to polling `GET /api/v1/ai/operations/{jobId}` (Section 23.7) until completion, then optionally request a streamed follow-up using the resulting `conversationId`.

#### Interaction with Clarification States

- Streaming is used only for model output; clarification prompts are delivered once on the terminal frame to avoid partial UX states.
- When a clarification response is streamed, the subsequent user reply must reference the `conversationId`; the proxy may continue streaming the follow-up answer if `stream=true` is requested.
- If a clarification turn times out (no user reply within client-defined SLA), clients should cancel the conversation and reissue the task, potentially falling back to queued processing when deterministic completion is required.

---

## Document History

| Version | Date       | Author | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | 2025-01-28 | System | Initial specification: RESTful conventions, versioning, RFC 7807 errors, Location management endpoints, Contact decision authority endpoints, complete DTOs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 1.1     | 2025-01-27 | System | Added User Role Management endpoints (assign/revoke roles), Role Configuration endpoints (view/update role permissions), Permission Matrix endpoints (manage runtime permissions), updated section numbering                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 1.2     | 2025-01-28 | System | Added Task Management endpoints (UserTask and ProjectTask): CRUD operations, status updates, dashboard views (my-tasks, team-tasks, overdue), project task grouping (by-phase, by-assignee), cross-entity task queries, complete DTOs with validation decorators                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 1.3     | 2025-01-28 | System | **Added Tour Planning & Expense Management endpoints (Phase 2)**: Tour management (CRUD, completion, cost summary), Meeting management (CRUD, GPS check-in, outcome tracking, tour auto-suggestion), Hotel Stay management (nested under tours, search with Google Places API, preferences), Expense management (CRUD, receipt upload with OCR, approval workflow with GF-only approval, bulk operations, report generation in JSON/PDF/CSV), Mileage Log management (nested under tours, GPS tracking, distance validation, GF override with audit trail), complete query parameters, business rules, nested resource patterns                                                                                                                                                                                                                                           |
| 1.4     | 2025-01-28 | System | **Added Calendar & Export Endpoints (MVP)**: Get calendar events (unified view of tasks, projects, opportunities), My calendar events (user-specific), Team calendar events (GF/PLAN only), ICS export (one-time download for Outlook/Google/Apple Calendar), complete CalendarEvent and CalendarQuery DTOs, business rules (date range validation, event density limits, RBAC filtering, ICS standards, color accessibility), performance considerations (caching, query optimization, export performance)                                                                                                                                                                                                                                                                                                                                                               |
| 1.5     | 2025-01-28 | System | **Added Time Tracking & Project Cost Management Endpoints (Phase 1 MVP)**: TimeEntry endpoints (CRUD, timer start/stop, bulk approve/reject, labor cost reports, pending approval queue) with complete DTOs; ProjectCost endpoints (CRUD, approval workflow, material cost summaries, pending payment tracking) with complete DTOs. Includes comprehensive RBAC permissions, business rules, status lifecycle transitions, cost calculations, and GoBD compliance for approved/paid entries                                                                                                                                                                                                                                                                                                                                                                               |
| 1.6     | 2025-11-12 | System | **CRITICAL UPDATE - Added Supplier & Material Management Endpoints (Phase 1 MVP)**: Complete REST API for Supplier management (CRUD, approval, blacklist, contracts), Material catalog (CRUD, multi-supplier pricing, search), Project Material Requirements (BOM management, cost tracking), Purchase Orders (CRUD, approval workflow, delivery recording with real-time project cost updates), Supplier Invoices (CRUD, 3-way match, approval workflow, payment tracking), Supplier Communications (logging). Addresses Pre-Mortem Danger #3 (Critical Workflow Gaps). See [Supplier Management Spec](./SUPPLIER_SUBCONTRACTOR_MANAGEMENT_SPEC.md) and [Material Management Spec](./MATERIAL_INVENTORY_MANAGEMENT_SPEC.md) for complete business logic.                                                                                                                 |
| 1.7     | 2025-01-27 | System | **Added Import/Export Endpoints (MVP)**: Customer import endpoints (upload Excel/CSV, map fields, validate, execute, error log) with automatic/manual field mapping, duplicate detection, and validation; Protocol import endpoints (upload Word document, extract table, parse dates with fallback to manual entry, assign customers, validate, execute, error log) with table extraction, date parsing (multiple formats), and customer assignment; Customer export endpoints (CSV/Excel/JSON/DATEV) with field selection and filtering; Protocol export endpoints (CSV/Excel/Word/JSON) with customer/protocol type filtering. Includes complete DTOs, business rules, performance considerations, and RBAC permissions. Required for data migration and ongoing operations. See [Import/Export Specification](./IMPORT_EXPORT_SPECIFICATION.md) for complete details. |
| 1.8     | 2025-02-21 | System | **Added AI Proxy Endpoints**: Versioned `/api/v1/ai/*` surface with shared response envelope, correlation/conversation IDs, clarification workflow, BullMQ-backed long-running jobs with polling endpoint, and documented core routes (`/analyze-text`, `/conversation/{id}/message`, `/operations/{jobId}`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

---

**End of API_SPECIFICATION.md v1.8**
