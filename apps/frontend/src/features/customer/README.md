# Customer Feature

## Overview
Frontend feature for customer management with offline-first support.

## Components

- **CustomerList** - Displays list of customers with search
- **CustomerCard** - Individual customer card (shadcn/ui)
- **CustomerForm** - Create/edit form (react-hook-form + shadcn)
- **CustomerDetail** - Detailed customer view

## Hooks

- **useCustomer(id)** - Fetch single customer (offline-first)
- **useCustomerList()** - Fetch all accessible customers
- **useCreateCustomer()** - Create mutation with offline queue
- **useUpdateCustomer()** - Update mutation with conflict detection
- **useDeleteCustomer()** - Soft delete mutation

## State Management

- **Redux Toolkit Slice** - Global customer state
- **Zustand Store** - Local UI state (filters, selection)
- **React Query** - Server state caching

## Offline Support

All hooks support offline mode:
1. Try local PouchDB first
2. Fall back to API if online
3. Queue changes when offline
4. Auto-sync when back online
5. Handle conflicts with resolution UI

## Usage

```tsx
import { CustomerList, useCustomer } from '@/features/customer';

// List all customers
function CustomersPage() {
  return <CustomerList />;
}

// Single customer
function CustomerDetailPage({ id }) {
  const { data: customer, isLoading } = useCustomer(id);
  
  if (isLoading) return <Skeleton />;
  return <div>{customer.companyName}</div>;
}

// Create customer
function CreateCustomerPage() {
  const createCustomer = useCreateCustomer();
  
  const handleSubmit = (data) => {
    createCustomer.mutate(data, {
      onSuccess: () => navigate('/customers'),
    });
  };
  
  return <CustomerForm onSubmit={handleSubmit} />;
}
```

## Testing

See `__tests__/` directory for component tests.

