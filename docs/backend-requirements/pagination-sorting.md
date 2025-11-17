# Backend Pagination & Sorting Requirements

## Current Status

**Backend API Status (as of 2025-01-28):**

### Customer API (`/api/v1/customers`)

- ✅ **Filtering**: Supports `search`, `rating`, `customerType`, `vatNumber` query parameters
- ❌ **Pagination**: Query parameters `page` and `pageSize` are defined but **NOT implemented** in service layer (TODO comment present)
- ❌ **Sorting**: No sorting parameters supported

### User API (`/api/v1/users`)

- ✅ **Filtering**: Supports `search`, `email`, `role`, `active` query parameters
- ❌ **Pagination**: No pagination parameters
- ❌ **Sorting**: No sorting parameters

## Implementation Decision

**Current Approach: Client-Side Pagination & Sorting**

Due to backend limitations, the frontend currently implements:

- **Client-side pagination** using `paginateData()` utility
- **Client-side sorting** using `sortData()` utility
- **Client-side filtering** (in addition to backend search)

This is a **temporary solution** until backend pagination and sorting are implemented.

## Backend Requirements for Future Implementation

### Pagination

**Query Parameters:**

- `page` (number, 1-based): Page number
- `pageSize` (number, default: 20): Items per page
- `limit` (number, optional): Alternative to pageSize

**Response Format:**

```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
```

### Sorting

**Query Parameters:**

- `sortBy` (string): Column name to sort by
- `sortOrder` ('asc' | 'desc'): Sort direction

**Response:**

- Same as current response, but sorted server-side

### Combined Example

```
GET /api/v1/customers?page=2&pageSize=20&sortBy=companyName&sortOrder=asc&search=test&rating=A
```

## Migration Path

When backend pagination/sorting is implemented:

1. **Update API clients** to pass pagination/sorting parameters
2. **Remove client-side utilities** from list pages
3. **Update tests** to mock paginated responses
4. **Update documentation** to reflect server-side implementation

## References

- Frontend Implementation: `apps/frontend/src/utils/table-utils.ts`
- Customer Controller: `apps/backend/src/modules/customer/customer.controller.ts`
- User Controller: `apps/backend/src/modules/user/user.controller.ts`
