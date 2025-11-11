# KOMPASS API Specification

**Version:** 1.0  
**Last Updated:** 2025-01-28  
**Status:** Draft

## Cross-References

- **Data Model:** `docs/reviews/DATA_MODEL_SPECIFICATION.md` - Entity definitions and validation rules
- **RBAC Matrix:** `docs/reviews/RBAC_PERMISSION_MATRIX.md` - Permission requirements for endpoints
- **Test Strategy:** `docs/reviews/TEST_STRATEGY_DOCUMENT.md` - API test scenarios
- **Architecture Rules:** `.cursorrules` - API design patterns and OpenAPI standards

---

## Table of Contents

1. [API Design Principles](#1-api-design-principles)
2. [Versioning Strategy](#2-versioning-strategy)
3. [Error Response Format](#3-error-response-format-rfc-7807)
4. [Location Management Endpoints](#4-location-management-endpoints-new)
5. [Contact Decision Authority Endpoints](#5-contact-decision-authority-endpoints-new)
6. [Request/Response DTOs](#6-requestresponse-dtos)
7. [OpenAPI Documentation Patterns](#7-openapi-documentation-patterns)
8. [Future Endpoints (Placeholders)](#8-future-endpoints-placeholders)

---

## 1. API Design Principles

### RESTful Conventions

KOMPASS follows RESTful API design principles as defined in `.cursorrules`:

#### HTTP Methods

| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| GET | Retrieve resource(s) | ✅ | ✅ |
| POST | Create new resource | ❌ | ❌ |
| PUT | Update entire resource (full replacement) | ✅ | ❌ |
| PATCH | Update partial resource | ❌ | ❌ |
| DELETE | Remove resource | ✅ | ❌ |

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

## 2. Versioning Strategy

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

## 3. Error Response Format (RFC 7807)

KOMPASS follows **RFC 7807 Problem Details for HTTP APIs** for consistent error responses.

### Error Response Schema

```typescript
interface ProblemDetails {
  type: string;        // URI reference to problem type
  title: string;       // Human-readable summary
  status: number;      // HTTP status code
  detail?: string;     // Human-readable explanation
  instance?: string;   // URI reference to specific occurrence
  [key: string]: any;  // Additional context-specific fields
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

## 4. Location Management Endpoints (NEW)

### 4.1 Create Location

**POST** `/api/v1/customers/{customerId}/locations`

Creates a new delivery location for a customer.

#### Request

**Path Parameters:**
- `customerId` (string, required) - Customer ID (format: `customer-{uuid}`)

**Request Body:**
```typescript
CreateLocationDto
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
    "longitude": 11.5820
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

### 4.4 Update Location

**PUT** `/api/v1/customers/{customerId}/locations/{locationId}`

Updates an existing location (full replacement).

#### Request

**Path Parameters:**
- `customerId` (string, required) - Customer ID
- `locationId` (string, required) - Location ID

**Request Body:**
```typescript
UpdateLocationDto
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

### 4.5 Delete Location

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
    {"type": "project", "id": "project-111"},
    {"type": "project", "id": "project-222"},
    {"type": "quote", "id": "quote-333"}
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
UpdateDecisionAuthorityDto
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
import { IsString, IsEnum, IsBoolean, IsOptional, Length, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({
    description: 'Descriptive name for the location',
    example: 'Filiale München Süd',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @Length(2, 100)
  @Matches(/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/, {
    message: 'Location name can only contain letters, numbers, and basic punctuation'
  })
  locationName: string;

  @ApiProperty({
    description: 'Type of location',
    enum: ['headquarter', 'branch', 'warehouse', 'project_site', 'other'],
    example: 'branch'
  })
  @IsEnum(['headquarter', 'branch', 'warehouse', 'project_site', 'other'])
  locationType: string;

  @ApiProperty({
    description: 'Delivery address for this location',
    type: () => AddressDto
  })
  @ValidateNested()
  @Type(() => AddressDto)
  deliveryAddress: AddressDto;

  @ApiProperty({
    description: 'Whether the location is currently operational',
    example: true
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Primary contact person ID for this location',
    example: 'contact-111',
    required: false
  })
  @IsOptional()
  @IsString()
  primaryContactPersonId?: string;

  @ApiProperty({
    description: 'Array of contact person IDs assigned to this location',
    type: [String],
    example: ['contact-111', 'contact-112'],
    required: false
  })
  @IsOptional()
  @IsString({ each: true })
  contactPersons?: string[];

  @ApiProperty({
    description: 'Special delivery instructions',
    example: 'Hintereingang nutzen, Parkplatz vorhanden',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  deliveryNotes?: string;

  @ApiProperty({
    description: 'Operating hours',
    example: 'Mo-Fr 8:00-18:00, Sa 9:00-14:00',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  openingHours?: string;

  @ApiProperty({
    description: 'Parking and access instructions',
    example: 'Parkplätze vor dem Gebäude',
    required: false
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
  @IsEnum(['headquarter', 'branch', 'warehouse', 'project_site', 'other'])
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
    description: 'Street name',
    example: 'Lindwurmstraße'
  })
  @IsString()
  @Length(2, 100)
  street: string;

  @ApiProperty({
    description: 'House/building number',
    example: '85',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  streetNumber?: string;

  @ApiProperty({
    description: 'Additional address information',
    example: 'Hintereingang, 2. Stock',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  addressLine2?: string;

  @ApiProperty({
    description: 'Postal code',
    example: '80337'
  })
  @IsString()
  @Matches(/^\d{5}$/, { message: 'German postal code must be 5 digits' })
  zipCode: string;

  @ApiProperty({
    description: 'City name',
    example: 'München'
  })
  @IsString()
  @Length(2, 100)
  city: string;

  @ApiProperty({
    description: 'State/Bundesland',
    example: 'Bayern',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  state?: string;

  @ApiProperty({
    description: 'Country name',
    example: 'Deutschland',
    default: 'Deutschland'
  })
  @IsString()
  @Length(2, 100)
  country: string;

  @ApiProperty({
    description: 'GPS latitude',
    example: 48.1351,
    required: false
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: 'GPS longitude',
    example: 11.5820,
    required: false
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
  type: 'location';

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
    description: 'Decision-making role',
    enum: ['decision_maker', 'key_influencer', 'recommender', 'gatekeeper', 'operational_contact', 'informational']
  })
  @IsEnum(['decision_maker', 'key_influencer', 'recommender', 'gatekeeper', 'operational_contact', 'informational'])
  decisionMakingRole: string;

  @ApiProperty({
    description: 'Authority level',
    enum: ['low', 'medium', 'high', 'final_authority']
  })
  @IsEnum(['low', 'medium', 'high', 'final_authority'])
  authorityLevel: string;

  @ApiProperty({
    description: 'Can approve orders/quotes'
  })
  @IsBoolean()
  canApproveOrders: boolean;

  @ApiProperty({
    description: 'Maximum order value they can approve (EUR)',
    example: 50000,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000000)
  approvalLimitEur?: number;

  @ApiProperty({
    description: 'Functional roles',
    type: [String],
    enum: ['owner_ceo', 'purchasing_manager', 'facility_manager', 'store_manager', 'project_coordinator', 'financial_controller', 'operations_manager', 'administrative']
  })
  @IsString({ each: true })
  functionalRoles: string[];

  @ApiProperty({
    description: 'Departments this contact influences',
    type: [String],
    example: ['purchasing', 'operations']
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
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard, RbacGuard } from '@/guards';
import { RequirePermission } from '@/decorators';
import { CurrentUser } from '@/decorators';
import { User } from '@/types';

@Controller('api/v1/customers/:customerId/locations')
@ApiTags('Locations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
export class LocationController {
  
  @Post()
  @ApiOperation({ 
    summary: 'Create new location for customer',
    description: 'Creates a new delivery location with address and operational details. Location names must be unique within a customer.'
  })
  @ApiParam({ 
    name: 'customerId', 
    description: 'Customer ID',
    example: 'customer-12345'
  })
  @ApiBody({ type: CreateLocationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Location created successfully',
    type: LocationResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Validation error - invalid input data'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - insufficient permissions'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Customer not found'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - location name already exists for this customer'
  })
  @RequirePermission('Location', 'CREATE')
  async createLocation(
    @Param('customerId') customerId: string,
    @Body() createLocationDto: CreateLocationDto,
    @CurrentUser() user: User
  ): Promise<LocationResponseDto> {
    return this.locationService.create(customerId, createLocationDto, user);
  }

  @Get()
  @ApiOperation({ 
    summary: 'List all locations for customer',
    description: 'Retrieves all delivery locations for a specific customer with optional filtering.'
  })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Locations retrieved successfully',
    type: [LocationResponseDto]
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - insufficient permissions'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Customer not found'
  })
  @RequirePermission('Location', 'READ')
  async listLocations(
    @Param('customerId') customerId: string,
    @CurrentUser() user: User
  ): Promise<LocationResponseDto[]> {
    return this.locationService.findByCustomer(customerId, user);
  }

  // ... other endpoints
}
```

---

## 8. Future Endpoints (Placeholders)

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

---

## Document History

| Version | Date       | Author | Changes |
|---------|------------|--------|---------|
| 1.0     | 2025-01-28 | System | Initial specification: RESTful conventions, versioning, RFC 7807 errors, Location management endpoints, Contact decision authority endpoints, complete DTOs |

---

**End of API_SPECIFICATION.md**

