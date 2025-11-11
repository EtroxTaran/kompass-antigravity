# KOMPASS API Updates

## New Endpoints (2025-01-27)

### Location Management

#### Create Location
```http
POST /api/v1/customers/{customerId}/locations
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
  "deliveryNotes": "Hintereingang nutzen",
  "openingHours": "Mo-Fr 8:00-18:00"
}

Response 201:
{
  "_id": "location-550e8400-e29b-41d4-a716-446655440000",
  "customerId": "customer-12345",
  "locationName": "Filiale München Süd",
  ...
}
```

**Permissions**: `Location.CREATE` (GF, PLAN, ADM for own customers)

#### List Locations
```http
GET /api/v1/customers/{customerId}/locations?locationType=branch&isActive=true&sort=locationName&order=asc
Authorization: Bearer {jwt_token}

Response 200:
[
  {
    "_id": "location-111",
    "locationName": "Filiale München Süd",
    "locationType": "branch",
    "isActive": true,
    ...
  }
]
```

**Permissions**: `Location.READ` (All roles)

#### Get Single Location
```http
GET /api/v1/customers/{customerId}/locations/{locationId}
Authorization: Bearer {jwt_token}

Response 200: { ... }
```

#### Update Location
```http
PUT /api/v1/customers/{customerId}/locations/{locationId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "locationName": "Filiale München Süd (Hauptfiliale)",
  "deliveryNotes": "Neue Hinweise"
}

Response 200: { ... }
```

**Permissions**: `Location.UPDATE` (GF, PLAN, ADM for own customers)

#### Delete Location
```http
DELETE /api/v1/customers/{customerId}/locations/{locationId}
Authorization: Bearer {jwt_token}

Response 204: No Content
```

**Permissions**: `Location.DELETE` (GF, PLAN only)

**Note**: Cannot delete if location is referenced in active projects/quotes (returns 409 Conflict)

---

### Contact Decision Authority

#### Get Decision Authority
```http
GET /api/v1/contacts/{contactId}/decision-authority
Authorization: Bearer {jwt_token}

Response 200:
{
  "contactId": "contact-111",
  "contactName": "Thomas Schmidt",
  "decisionMakingRole": "key_influencer",
  "authorityLevel": "high",
  "canApproveOrders": true,
  "approvalLimitEur": 50000,
  "functionalRoles": ["purchasing_manager"],
  "departmentInfluence": ["purchasing", "operations"],
  "assignedLocationIds": ["location-111"],
  "isPrimaryContactForLocations": [],
  "lastUpdated": "2025-01-27T10:30:00Z",
  "updatedBy": "user-plan-001"
}
```

**Permissions**: `Contact.VIEW_AUTHORITY_LEVELS` (All roles)

#### Update Decision Authority (RESTRICTED)
```http
PUT /api/v1/contacts/{contactId}/decision-authority
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

Response 200: { ... }

Response 403 (if ADM user):
{
  "type": "https://api.kompass.de/errors/forbidden",
  "title": "Forbidden",
  "status": 403,
  "detail": "Only ADM+ users (PLAN, GF) can update contact decision-making roles",
  "requiredPermission": "Contact.UPDATE_DECISION_ROLE",
  "userRole": "ADM"
}
```

**Permissions**: `Contact.UPDATE_DECISION_ROLE` (PLAN, GF only - RESTRICTED)

---

### Updated Endpoints

#### Customer Response Structure (BREAKING)

```http
GET /api/v1/customers/{customerId}

Response 200 (OLD):
{
  "_id": "customer-123",
  "companyName": "Hofladen Müller GmbH",
  "address": { ... },  // ❌ DEPRECATED
  ...
}

Response 200 (NEW):
{
  "_id": "customer-123",
  "companyName": "Hofladen Müller GmbH",
  "billingAddress": { ... },  // ✅ RENAMED
  "locations": ["location-111", "location-222"],  // ✅ NEW
  "contactPersons": ["contact-111"],  // ✅ NEW
  "defaultDeliveryLocationId": "location-111",  // ✅ NEW
  "customerBusinessType": "direct_marketer",  // ✅ NEW
  ...
}
```

#### Customer with Locations (Query Parameter)

```http
GET /api/v1/customers/{customerId}?includeLocations=true

Response 200:
{
  "_id": "customer-123",
  "companyName": "Hofladen Müller GmbH",
  "billingAddress": { ... },
  "locations": ["location-111"],
  "_embedded": {
    "locations": [
      {
        "_id": "location-111",
        "locationName": "Hauptstandort",
        "locationType": "headquarter",
        ...
      }
    ]
  }
}
```

---

## Migration Timeline

### Phase 1: Database Migration (30-60 minutes)
1. Backup database (5 min)
2. Run customer migration (10-20 min)
3. Run contact migration (10-20 min)
4. Create views/indexes (5 min)
5. Validate data model (5 min)

### Phase 2: Application Deployment (15-30 minutes)
1. Deploy updated backend (5 min)
2. Deploy updated frontend (5 min)
3. Smoke tests (5 min)
4. Monitor for errors (10 min)

### Phase 3: Post-Migration (1-2 hours)
1. Review contact-migration-report.csv (30 min)
2. Manually adjust misclassified contact roles (30 min)
3. Create Location records for existing customers (1 hour)
4. Verify all features working (30 min)

## API Client Updates

### JavaScript/TypeScript

```typescript
// OLD
const customer = await customerApi.get(id);
console.log(customer.address.city);

// NEW
const customer = await customerApi.get(id);
console.log(customer.billingAddress.city);

// NEW: Fetch locations
const locations = await locationApi.getLocations(customer._id);
```

### Python

```python
# OLD
customer = api.get_customer(customer_id)
print(customer['address']['city'])

# NEW
customer = api.get_customer(customer_id)
print(customer['billingAddress']['city'])

# NEW: Fetch locations
locations = api.get_locations(customer_id)
```

## Error Codes

### New Error Responses

#### Location Name Conflict (409)
```json
{
  "type": "https://api.kompass.de/errors/conflict",
  "title": "Conflict",
  "status": 409,
  "detail": "Location name 'Hauptstandort' already exists for this customer"
}
```

#### Decision Authority Forbidden (403)
```json
{
  "type": "https://api.kompass.de/errors/forbidden",
  "title": "Forbidden",
  "status": 403,
  "detail": "Only ADM+ users (PLAN, GF) can update contact decision-making roles",
  "requiredPermission": "Contact.UPDATE_DECISION_ROLE"
}
```

#### Approval Limit Validation (400)
```json
{
  "type": "https://api.kompass.de/errors/validation-error",
  "title": "Validation Failed",
  "status": 400,
  "detail": "Contacts who can approve orders must have an approval limit > 0",
  "errors": [
    {
      "field": "approvalLimitEur",
      "message": "Approval limit required when canApproveOrders is true"
    }
  ]
}
```

## Deprecation Notice

### Deprecated Fields

| Field | Entity | Status | Replacement | Removal Date |
|-------|--------|--------|-------------|--------------|
| `address` | Customer | Deprecated | `billingAddress` | Q3 2025 |

### Deprecated Endpoints

None at this time.

## Support

For API questions or migration issues:
- API Specification: `docs/reviews/API_SPECIFICATION.md`
- GitHub Issues: https://github.com/kompass/kompass/issues
- Email: dev@kompass.de

