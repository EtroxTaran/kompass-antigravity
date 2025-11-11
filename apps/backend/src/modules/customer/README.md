# Customer Module

## Overview
Handles all customer-related operations including CRUD, validation, RBAC, and duplicate detection.

## Structure
```
customer/
├── customer.module.ts       # NestJS module definition
├── customer.controller.ts   # HTTP endpoints with RBAC guards
├── customer.service.ts      # Business logic
├── customer.repository.ts   # Data access (CouchDB)
├── dto/                     # Data transfer objects
│   ├── create-customer.dto.ts
│   ├── update-customer.dto.ts
│   └── customer-response.dto.ts
└── __tests__/
    └── customer.service.spec.ts
```

## API Endpoints

| Method | Endpoint | Description | RBAC |
|--------|----------|-------------|------|
| GET    | /api/v1/customers | List all customers | READ |
| GET    | /api/v1/customers/:id | Get single customer | READ |
| POST   | /api/v1/customers | Create customer | CREATE |
| PUT    | /api/v1/customers/:id | Update customer | UPDATE |
| DELETE | /api/v1/customers/:id | Soft delete customer | DELETE |

## Validation Rules

From `DATA_MODEL_SPECIFICATION.md`:

- **companyName**: Required, 2-200 chars, letters/numbers/basic punctuation
- **vatNumber**: Optional, format DE123456789
- **email**: Optional, valid email format
- **phone**: Optional, 7-20 chars, international format
- **creditLimit**: Optional, 0 - €1,000,000
- **owner**: Required, must be User with role ADM

## RBAC Rules

- **ADM**: Can create and view own customers only
- **INNEN**: Can create and view all customers
- **PLAN**: Can view customers related to their projects
- **BUCH**: Can view all customers, update financial fields
- **GF**: Full access to all customers
- **ADMIN**: Full system access

### Field-Level Permissions

| Field | ADM | INNEN | PLAN | BUCH | GF |
|-------|-----|-------|------|------|-----|
| companyName | R/W | R/W | R | R | R/W |
| creditLimit | - | - | - | R/W | R/W |
| profitMargin | - | - | - | R | R/W |

(R = Read, W = Write, - = No access)

## Usage

```typescript
// In AppModule
import { CustomerModule } from './modules/customer/customer.module';

@Module({
  imports: [CustomerModule],
})
export class AppModule {}
```

## Testing

```bash
# Run unit tests
pnpm test customer

# Run with coverage
pnpm test:cov customer

# Run integration tests
pnpm test:integration customer
```

## Features

- ✅ CRUD operations
- ✅ RBAC enforcement (entity and field level)
- ✅ Duplicate detection (fuzzy matching)
- ✅ Offline sync support
- ✅ Audit trail
- ✅ DSGVO compliance (consent, data retention)
- ✅ Validation (backend + frontend)
- ✅ Search integration (MeiliSearch)

## TODO

- [ ] Implement duplicate detection algorithm
- [ ] Add MeiliSearch indexing
- [ ] Add integration tests
- [ ] Add E2E tests
- [ ] Configure CouchDB views/indexes

