import { useQuery } from '@tanstack/react-query';

import { customerService } from '@/services/customer.service';

import type { PaginatedResponse } from '@kompass/shared/types/dtos/paginated-response.dto';
import type { Customer } from '@kompass/shared/types/entities/customer';

/**
 * Query keys for customer queries
 */
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (options?: {
    filters?: {
      search?: string;
      rating?: string;
      customerType?: string;
      vatNumber?: string;
    };
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => [...customerKeys.lists(), options] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

/**
 * Options for useCustomers hook
 */
export interface UseCustomersOptions {
  filters?: {
    search?: string;
    rating?: string;
    customerType?: string;
    vatNumber?: string;
  };
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Hook to get all customers (with pagination and sorting)
 */
export function useCustomers(options?: UseCustomersOptions) {
  return useQuery<PaginatedResponse<Customer>, Error>({
    queryKey: customerKeys.list(options),
    queryFn: () =>
      customerService.getAll(
        options?.filters,
        options?.page,
        options?.pageSize,
        options?.sortBy,
        options?.sortOrder
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
