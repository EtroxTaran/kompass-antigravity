import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';

import { customerService } from '@/services/customer.service';
import {
  useDuplicateDetection,
  useDebouncedCompanyNameDuplicate,
} from '../useDuplicateDetection';

import type { Customer } from '@kompass/shared/types/entities/customer';

/**
 * Test wrapper with QueryClientProvider
 */
function TestWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        cacheTime: 0,
        staleTime: 0,
      },
    },
  });

  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children
  );
}

// Mock customer service
vi.mock('@/services/customer.service', () => ({
  customerService: {
    checkDuplicateCompanyName: vi.fn(),
    checkDuplicateVatNumber: vi.fn(),
  },
}));

const mockCustomerService = customerService as {
  checkDuplicateCompanyName: ReturnType<typeof vi.fn>;
  checkDuplicateVatNumber: ReturnType<typeof vi.fn>;
};

describe('useDuplicateDetection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkCompanyNameDuplicate', () => {
    it('should return empty array for short company names', async () => {
      const { result } = renderHook(() => useDuplicateDetection(), {
        wrapper: TestWrapper,
      });

      const duplicates = await result.current.checkCompanyNameDuplicate('A');
      expect(duplicates).toEqual([]);
      expect(
        mockCustomerService.checkDuplicateCompanyName
      ).not.toHaveBeenCalled();
    });

    it('should return duplicates when found', async () => {
      const mockCustomers: Customer[] = [
        {
          _id: 'customer-1',
          _rev: '1-abc',
          type: 'customer',
          companyName: 'Müller GmbH',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
          locations: [],
          tags: [],
          createdBy: 'user-1',
          createdAt: new Date(),
          modifiedBy: 'user-1',
          modifiedAt: new Date(),
          version: 1,
        },
      ];

      mockCustomerService.checkDuplicateCompanyName.mockResolvedValue(
        mockCustomers
      );

      const { result } = renderHook(() => useDuplicateDetection(), {
        wrapper: TestWrapper,
      });

      let duplicates: Awaited<
        ReturnType<typeof result.current.checkCompanyNameDuplicate>
      >;
      await act(async () => {
        duplicates =
          await result.current.checkCompanyNameDuplicate('Mueller GmbH');
      });

      await waitFor(() => {
        expect(duplicates!.length).toBeGreaterThan(0);
      });

      expect(
        mockCustomerService.checkDuplicateCompanyName
      ).toHaveBeenCalledWith('Mueller GmbH', undefined);
      expect(duplicates![0]?.customer.companyName).toBe('Müller GmbH');
      expect(duplicates![0]?.similarity).toBeGreaterThan(0.8);
    });

    it('should exclude customer ID in edit mode', async () => {
      const mockCustomers: Customer[] = [
        {
          _id: 'customer-1',
          _rev: '1-abc',
          type: 'customer',
          companyName: 'Müller GmbH',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
          locations: [],
          tags: [],
          createdBy: 'user-1',
          createdAt: new Date(),
          modifiedBy: 'user-1',
          modifiedAt: new Date(),
          version: 1,
        },
      ];

      mockCustomerService.checkDuplicateCompanyName.mockResolvedValue(
        mockCustomers
      );

      const { result } = renderHook(() => useDuplicateDetection('customer-1'), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        await result.current.checkCompanyNameDuplicate('Mueller GmbH');
      });

      expect(
        mockCustomerService.checkDuplicateCompanyName
      ).toHaveBeenCalledWith('Mueller GmbH', 'customer-1');
    });

    it('should cache results', async () => {
      const mockCustomers: Customer[] = [
        {
          _id: 'customer-1',
          _rev: '1-abc',
          type: 'customer',
          companyName: 'Test GmbH',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
          locations: [],
          tags: [],
          createdBy: 'user-1',
          createdAt: new Date(),
          modifiedBy: 'user-1',
          modifiedAt: new Date(),
          version: 1,
        },
      ];

      mockCustomerService.checkDuplicateCompanyName.mockResolvedValue(
        mockCustomers
      );

      const { result } = renderHook(() => useDuplicateDetection(), {
        wrapper: TestWrapper,
      });

      // First call
      await act(async () => {
        await result.current.checkCompanyNameDuplicate('Test GmbH');
      });
      expect(
        mockCustomerService.checkDuplicateCompanyName
      ).toHaveBeenCalledTimes(1);

      // Second call (should use cache)
      await act(async () => {
        await result.current.checkCompanyNameDuplicate('Test GmbH');
      });
      expect(
        mockCustomerService.checkDuplicateCompanyName
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkVatNumberDuplicate', () => {
    it('should return null for empty VAT number', async () => {
      const { result } = renderHook(() => useDuplicateDetection(), {
        wrapper: TestWrapper,
      });

      const duplicate = await result.current.checkVatNumberDuplicate('');
      expect(duplicate).toBeNull();
      expect(
        mockCustomerService.checkDuplicateVatNumber
      ).not.toHaveBeenCalled();
    });

    it('should return customer when duplicate found', async () => {
      const mockCustomer: Customer = {
        _id: 'customer-1',
        _rev: '1-abc',
        type: 'customer',
        companyName: 'Test GmbH',
        vatNumber: 'DE123456789',
        billingAddress: {
          street: 'Test',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
        customerType: 'active',
        locations: [],
        tags: [],
        createdBy: 'user-1',
        createdAt: new Date(),
        modifiedBy: 'user-1',
        modifiedAt: new Date(),
        version: 1,
      };

      mockCustomerService.checkDuplicateVatNumber.mockResolvedValue(
        mockCustomer
      );

      const { result } = renderHook(() => useDuplicateDetection(), {
        wrapper: TestWrapper,
      });

      let duplicate: Awaited<
        ReturnType<typeof result.current.checkVatNumberDuplicate>
      >;
      await act(async () => {
        duplicate = await result.current.checkVatNumberDuplicate('DE123456789');
      });

      await waitFor(() => {
        expect(duplicate!).not.toBeNull();
      });

      expect(mockCustomerService.checkDuplicateVatNumber).toHaveBeenCalledWith(
        'DE123456789',
        undefined
      );
      expect(duplicate?.vatNumber).toBe('DE123456789');
    });

    it('should return null when no duplicate found', async () => {
      mockCustomerService.checkDuplicateVatNumber.mockResolvedValue(null);

      const { result } = renderHook(() => useDuplicateDetection(), {
        wrapper: TestWrapper,
      });

      let duplicate: Awaited<
        ReturnType<typeof result.current.checkVatNumberDuplicate>
      >;
      await act(async () => {
        duplicate = await result.current.checkVatNumberDuplicate('DE999999999');
      });

      await waitFor(() => {
        expect(duplicate!).toBeNull();
      });
    });

    it('should exclude customer ID in edit mode', async () => {
      const mockCustomer: Customer = {
        _id: 'customer-1',
        _rev: '1-abc',
        type: 'customer',
        companyName: 'Test GmbH',
        vatNumber: 'DE123456789',
        billingAddress: {
          street: 'Test',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
        customerType: 'active',
        locations: [],
        tags: [],
        createdBy: 'user-1',
        createdAt: new Date(),
        modifiedBy: 'user-1',
        modifiedAt: new Date(),
        version: 1,
      };

      mockCustomerService.checkDuplicateVatNumber.mockResolvedValue(
        mockCustomer
      );

      const { result } = renderHook(() => useDuplicateDetection('customer-1'), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        await result.current.checkVatNumberDuplicate('DE123456789');
      });

      expect(mockCustomerService.checkDuplicateVatNumber).toHaveBeenCalledWith(
        'DE123456789',
        'customer-1'
      );
    });

    it('should cache results', async () => {
      const mockCustomer: Customer = {
        _id: 'customer-1',
        _rev: '1-abc',
        type: 'customer',
        companyName: 'Test GmbH',
        vatNumber: 'DE123456789',
        billingAddress: {
          street: 'Test',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
        customerType: 'active',
        locations: [],
        tags: [],
        createdBy: 'user-1',
        createdAt: new Date(),
        modifiedBy: 'user-1',
        modifiedAt: new Date(),
        version: 1,
      };

      mockCustomerService.checkDuplicateVatNumber.mockResolvedValue(
        mockCustomer
      );

      const { result } = renderHook(() => useDuplicateDetection(), {
        wrapper: TestWrapper,
      });

      // First call
      await act(async () => {
        await result.current.checkVatNumberDuplicate('DE123456789');
      });
      expect(mockCustomerService.checkDuplicateVatNumber).toHaveBeenCalledTimes(
        1
      );

      // Second call (should use cache)
      await act(async () => {
        await result.current.checkVatNumberDuplicate('DE123456789');
      });
      expect(mockCustomerService.checkDuplicateVatNumber).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('clearCache', () => {
    it('should clear all caches', async () => {
      const mockCustomers: Customer[] = [
        {
          _id: 'customer-1',
          _rev: '1-abc',
          type: 'customer',
          companyName: 'Test GmbH',
          billingAddress: {
            street: 'Test',
            zipCode: '80331',
            city: 'München',
            country: 'Deutschland',
          },
          customerType: 'active',
          locations: [],
          tags: [],
          createdBy: 'user-1',
          createdAt: new Date(),
          modifiedBy: 'user-1',
          modifiedAt: new Date(),
          version: 1,
        },
      ];

      mockCustomerService.checkDuplicateCompanyName.mockResolvedValue(
        mockCustomers
      );

      const { result } = renderHook(() => useDuplicateDetection(), {
        wrapper: TestWrapper,
      });

      // First call
      await act(async () => {
        await result.current.checkCompanyNameDuplicate('Test GmbH');
      });
      expect(
        mockCustomerService.checkDuplicateCompanyName
      ).toHaveBeenCalledTimes(1);

      // Clear cache
      act(() => {
        result.current.clearCache();
      });

      // Second call (should make new API call after cache clear)
      await act(async () => {
        await result.current.checkCompanyNameDuplicate('Test GmbH');
      });
      expect(
        mockCustomerService.checkDuplicateCompanyName
      ).toHaveBeenCalledTimes(2);
    });
  });
});

describe('useDebouncedCompanyNameDuplicate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should debounce company name input', async () => {
    const mockCustomers: Customer[] = [
      {
        _id: 'customer-1',
        _rev: '1-abc',
        type: 'customer',
        companyName: 'Müller GmbH',
        billingAddress: {
          street: 'Test',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
        customerType: 'active',
        locations: [],
        tags: [],
        createdBy: 'user-1',
        createdAt: new Date(),
        modifiedBy: 'user-1',
        modifiedAt: new Date(),
        version: 1,
      },
    ];

    mockCustomerService.checkDuplicateCompanyName.mockResolvedValue(
      mockCustomers
    );

    const { result, rerender } = renderHook(
      ({ companyName }: { companyName: string }) =>
        useDebouncedCompanyNameDuplicate(companyName, undefined, 300),
      {
        wrapper: TestWrapper,
        initialProps: { companyName: 'M' },
      }
    );

    // Change value multiple times quickly
    rerender({ companyName: 'Mu' });
    rerender({ companyName: 'Mue' });
    rerender({ companyName: 'Müller GmbH' }); // Use exact match to ensure similarity >= 0.8

    // Should not have called API immediately (debounced)
    expect(
      mockCustomerService.checkDuplicateCompanyName
    ).not.toHaveBeenCalled();

    // Wait for debounce delay + API call + state update
    await waitFor(
      () => {
        expect(
          mockCustomerService.checkDuplicateCompanyName
        ).toHaveBeenCalled();
        expect(result.current.duplicates.length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );

    // Verify the duplicate was found
    expect(result.current.duplicates[0]?.customer.companyName).toBe(
      'Müller GmbH'
    );
    expect(result.current.duplicates[0]?.similarity).toBeGreaterThanOrEqual(
      0.8
    );
  });

  it('should return empty array for short names', () => {
    const { result } = renderHook(() => useDebouncedCompanyNameDuplicate('A'), {
      wrapper: TestWrapper,
    });

    expect(result.current.duplicates).toEqual([]);
    expect(
      mockCustomerService.checkDuplicateCompanyName
    ).not.toHaveBeenCalled();
  });
});
