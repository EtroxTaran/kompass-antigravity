/**
 * useLocationMutations Hook
 *
 * React Query mutations for Location CRUD operations
 * Includes optimistic updates and error handling
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  locationApi,
  type CreateLocationRequest,
  type UpdateLocationRequest,
} from '../services/location-api';

import { useToast } from '@/hooks/use-toast';

/**
 * Location mutations hook
 */
export function useLocationMutations(customerId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  /**
   * Create location mutation
   */
  const createLocation = useMutation({
    mutationFn: (data: CreateLocationRequest) =>
      locationApi.createLocation(customerId, data),
    onSuccess: () => {
      // Invalidate locations query to refetch
      queryClient.invalidateQueries({ queryKey: ['locations', customerId] });

      toast({
        title: 'Erfolg',
        description: 'Standort erfolgreich erstellt',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler',
        description:
          error.response?.data?.detail ||
          'Standort konnte nicht erstellt werden',
        variant: 'destructive',
      });
    },
  });

  /**
   * Update location mutation
   */
  const updateLocation = useMutation({
    mutationFn: ({
      locationId,
      data,
    }: {
      locationId: string;
      data: UpdateLocationRequest;
    }) => locationApi.updateLocation(customerId, locationId, data),
    onMutate: async ({ locationId, data }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: ['location', customerId, locationId],
      });

      // Get previous value
      const previousLocation = queryClient.getQueryData([
        'location',
        customerId,
        locationId,
      ]);

      // Optimistic update
      if (previousLocation) {
        queryClient.setQueryData(['location', customerId, locationId], {
          ...previousLocation,
          ...data,
        });
      }

      return { previousLocation };
    },
    onError: (error: any, variables, context) => {
      // Rollback optimistic update
      if (context?.previousLocation) {
        queryClient.setQueryData(
          ['location', customerId, variables.locationId],
          context.previousLocation
        );
      }

      toast({
        title: 'Fehler',
        description:
          error.response?.data?.detail ||
          'Standort konnte nicht aktualisiert werden',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations', customerId] });

      toast({
        title: 'Erfolg',
        description: 'Standort erfolgreich aktualisiert',
      });
    },
  });

  /**
   * Delete location mutation
   */
  const deleteLocation = useMutation({
    mutationFn: (locationId: string) =>
      locationApi.deleteLocation(customerId, locationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations', customerId] });

      toast({
        title: 'Erfolg',
        description: 'Standort erfolgreich gelöscht',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler',
        description:
          error.response?.data?.detail ||
          'Standort konnte nicht gelöscht werden',
        variant: 'destructive',
      });
    },
  });

  return {
    createLocation,
    updateLocation,
    deleteLocation,
  };
}
