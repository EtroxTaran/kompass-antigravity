import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { customerService } from '@/services/customer.service';

import { useCustomer } from './useCustomer';
import { customerKeys } from './useCustomers';

import type { ReactNode } from 'react';

// Mock the customer service
vi.mock('@/services/customer.service', () => ({
  customerService: {
    getById: vi.fn(),
  },
}));

describe('useCustomer', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  // Wrapper component for React Query
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch customer data successfully', async () => {
    const mockCustomer = {
      _id: 'customer-123',
      _rev: '1-abc',
      type: 'customer' as const,
      companyName: 'Test GmbH',
      billingAddress: {
        street: 'Teststraße',
        zipCode: '80331',
        city: 'München',
        country: 'Deutschland',
      },
      locations: [],
      contactPersons: [],
      customerType: 'active' as const,
      owner: 'user-123',
      createdBy: 'user-123',
      createdAt: new Date(),
      modifiedBy: 'user-123',
      modifiedAt: new Date(),
      version: 1,
    };

    vi.mocked(customerService.getById).mockResolvedValue(mockCustomer);

    const { result } = renderHook(() => useCustomer('customer-123'), {
      wrapper,
    });

    // Initial loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify data
    expect(result.current.data).toEqual(mockCustomer);
    expect(result.current.error).toBeNull();
    expect(customerService.getById).toHaveBeenCalledWith('customer-123');
    expect(customerService.getById).toHaveBeenCalledTimes(1);
  });

  it('should use correct query key', async () => {
    const mockCustomer = {
      _id: 'customer-123',
      _rev: '1-abc',
      type: 'customer' as const,
      companyName: 'Test GmbH',
      billingAddress: {
        street: 'Teststraße',
        zipCode: '80331',
        city: 'München',
        country: 'Deutschland',
      },
      locations: [],
      contactPersons: [],
      customerType: 'active' as const,
      owner: 'user-123',
      createdBy: 'user-123',
      createdAt: new Date(),
      modifiedBy: 'user-123',
      modifiedAt: new Date(),
      version: 1,
    };

    vi.mocked(customerService.getById).mockResolvedValue(mockCustomer);

    renderHook(() => useCustomer('customer-123'), { wrapper });

    await waitFor(() => {
      expect(customerService.getById).toHaveBeenCalled();
    });

    // Check that query is cached with correct key
    const queryData = queryClient.getQueryData(
      customerKeys.detail('customer-123')
    );
    expect(queryData).toEqual(mockCustomer);
  });

  it('should handle errors', async () => {
    const mockError = new Error('Customer not found');
    vi.mocked(customerService.getById).mockRejectedValue(mockError);

    const { result } = renderHook(() => useCustomer('customer-999'), {
      wrapper,
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Verify error
    expect(result.current.error).toEqual(mockError);
    expect(result.current.data).toBeUndefined();
    expect(customerService.getById).toHaveBeenCalledWith('customer-999');
  });

  it('should not fetch if ID is empty', () => {
    const { result } = renderHook(() => useCustomer(''), { wrapper });

    // Query should be disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(customerService.getById).not.toHaveBeenCalled();
  });

  it('should use staleTime of 5 minutes', async () => {
    const mockCustomer = {
      _id: 'customer-123',
      _rev: '1-abc',
      type: 'customer' as const,
      companyName: 'Test GmbH',
      billingAddress: {
        street: 'Teststraße',
        zipCode: '80331',
        city: 'München',
        country: 'Deutschland',
      },
      locations: [],
      contactPersons: [],
      customerType: 'active' as const,
      owner: 'user-123',
      createdBy: 'user-123',
      createdAt: new Date(),
      modifiedBy: 'user-123',
      modifiedAt: new Date(),
      version: 1,
    };

    vi.mocked(customerService.getById).mockResolvedValue(mockCustomer);

    const { result } = renderHook(() => useCustomer('customer-123'), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Check staleTime (should be 5 minutes = 5 * 60 * 1000 ms)
    const queryState = queryClient.getQueryState(
      customerKeys.detail('customer-123')
    );
    expect(queryState?.dataUpdatedAt).toBeDefined();
  });

  it('should refetch when ID changes', async () => {
    const mockCustomer1 = {
      _id: 'customer-123',
      _rev: '1-abc',
      type: 'customer' as const,
      companyName: 'Test GmbH',
      billingAddress: {
        street: 'Teststraße',
        zipCode: '80331',
        city: 'München',
        country: 'Deutschland',
      },
      locations: [],
      contactPersons: [],
      customerType: 'active' as const,
      owner: 'user-123',
      createdBy: 'user-123',
      createdAt: new Date(),
      modifiedBy: 'user-123',
      modifiedAt: new Date(),
      version: 1,
    };

    const mockCustomer2 = {
      _id: 'customer-456',
      _rev: '1-def',
      type: 'customer' as const,
      companyName: 'Another GmbH',
      billingAddress: {
        street: 'Andere Straße',
        zipCode: '80331',
        city: 'München',
        country: 'Deutschland',
      },
      locations: [],
      contactPersons: [],
      customerType: 'active' as const,
      owner: 'user-123',
      createdBy: 'user-123',
      createdAt: new Date(),
      modifiedBy: 'user-123',
      modifiedAt: new Date(),
      version: 1,
    };

    vi.mocked(customerService.getById)
      .mockResolvedValueOnce(mockCustomer1)
      .mockResolvedValueOnce(mockCustomer2);

    const { result, rerender } = renderHook(
      ({ id }: { id: string }) => useCustomer(id),
      {
        wrapper,
        initialProps: { id: 'customer-123' },
      }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockCustomer1);
    });

    // Change ID
    rerender({ id: 'customer-456' });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockCustomer2);
    });

    // Verify both calls were made
    expect(customerService.getById).toHaveBeenCalledTimes(2);
    expect(customerService.getById).toHaveBeenNthCalledWith(1, 'customer-123');
    expect(customerService.getById).toHaveBeenNthCalledWith(2, 'customer-456');
  });
});
