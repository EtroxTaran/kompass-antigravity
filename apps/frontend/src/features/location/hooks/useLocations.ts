/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/**
 * useLocations Hook
 *
 * React Query hook for fetching locations for a customer
 */

import { useQuery } from '@tanstack/react-query';

import type { LocationType } from '@kompass/shared';

import { locationApi, type LocationResponse } from '../services/location-api';

interface UseLocationsOptions {
  locationType?: LocationType;
  isActive?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Fetch all locations for a customer
 */
export function useLocations(
  customerId: string,
  options?: UseLocationsOptions
) {
  return useQuery({
    queryKey: ['locations', customerId, options],
    queryFn: () => locationApi.getLocations(customerId, options),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}
