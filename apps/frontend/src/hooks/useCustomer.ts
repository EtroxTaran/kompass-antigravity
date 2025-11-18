import { useQuery } from '@tanstack/react-query';

import { customerService } from '@/services/customer.service';

import { customerKeys } from './useCustomers';

import type { Customer } from '@kompass/shared/types/entities/customer';

/**
 * Hook to get a single customer by ID
 *
 * @param id - Customer ID
 * @returns React Query result with customer data, loading state, and error
 */
export function useCustomer(
  id: string
): ReturnType<typeof useQuery<Customer, Error>> {
  return useQuery<Customer, Error>({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes (consistent with useCustomers)
    enabled: !!id, // Only run query if ID is provided
  });
}
