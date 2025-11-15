/**
 * useLocation Hook
 *
 * React Query hook for fetching a single location
 */

import { useQuery } from '@tanstack/react-query';

import type { Location } from '@kompass/shared';

import { locationApi } from '../services/location-api';

/**
 * Fetch a single location by ID
 */
export function useLocation(
  customerId: string,
  locationId: string
): ReturnType<typeof useQuery<Location>> {
  return useQuery({
    queryKey: ['location', customerId, locationId],
    queryFn: () => locationApi.getLocation(customerId, locationId),
    enabled: !!customerId && !!locationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
