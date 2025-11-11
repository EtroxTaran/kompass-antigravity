/**
 * Custom Hook Template for KOMPASS
 * 
 * Features:
 * - React Query for server state
 * - PouchDB for offline data
 * - Automatic sync when online
 * - Conflict detection
 * 
 * Usage: Replace {{ENTITY_NAME}} with your entity name
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOfflineStore } from '@/lib/store/offline-store';
import { {{ENTITY_NAME_LOWER}}Api } from '../services/{{ENTITY_NAME_LOWER}}.service';
import type { {{ENTITY_NAME}} } from '@kompass/shared';
import type { Create{{ENTITY_NAME}}Dto, Update{{ENTITY_NAME}}Dto } from '../types/{{ENTITY_NAME_LOWER}}.types';

/**
 * Hook for fetching a single {{ENTITY_NAME}}
 * 
 * Implements offline-first pattern:
 * - Tries local PouchDB first
 * - Falls back to API if online
 * - Syncs in background
 * 
 * @param id - {{ENTITY_NAME}} ID
 * @returns Query result with data, loading, error states
 * 
 * @example
 * ```tsx
 * const { data: {{ENTITY_NAME_LOWER}}, isLoading, error } = use{{ENTITY_NAME}}('{{ENTITY_NAME_LOWER}}-123');
 * 
 * if (isLoading) return <Skeleton />;
 * if (error) return <ErrorMessage error={error} />;
 * return <{{ENTITY_NAME}}Detail {{ENTITY_NAME_LOWER}}={{ENTITY_NAME_LOWER}} />;
 * ```
 */
export function use{{ENTITY_NAME}}(id: string) {
  const { isOnline } = useOfflineStore();

  return useQuery({
    queryKey: ['{{ENTITY_NAME_LOWER}}', id],
    queryFn: async () => {
      // Try local first (offline-first)
      const local = await {{ENTITY_NAME_LOWER}}Api.getFromLocal(id);
      
      if (local) {
        // Found in local DB
        if (isOnline) {
          // Sync in background
          {{ENTITY_NAME_LOWER}}Api.syncOne(id).catch(console.error);
        }
        return local;
      }

      // Not in local, fetch from API (requires online)
      if (!isOnline) {
        throw new Error('{{ENTITY_NAME}} not available offline');
      }

      const remote = await {{ENTITY_NAME_LOWER}}Api.getById(id);
      
      // Save to local for offline access
      await {{ENTITY_NAME_LOWER}}Api.saveToLocal(remote);
      
      return remote;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: isOnline ? 3 : 0,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook for fetching all {{ENTITY_NAME}}s
 * 
 * @returns Query result with array of {{ENTITY_NAME}}s
 */
export function use{{ENTITY_NAME}}List() {
  const { isOnline } = useOfflineStore();

  return useQuery({
    queryKey: ['{{ENTITY_NAME_PLURAL_LOWER}}'],
    queryFn: async () => {
      // Try local first
      const local = await {{ENTITY_NAME_LOWER}}Api.getAllFromLocal();
      
      if (local.length > 0 || !isOnline) {
        // Use local data
        if (isOnline) {
          // Sync in background
          {{ENTITY_NAME_LOWER}}Api.syncAll().catch(console.error);
        }
        return local;
      }

      // Fetch from API
      const remote = await {{ENTITY_NAME_LOWER}}Api.getAll();
      
      // Save to local
      await {{ENTITY_NAME_LOWER}}Api.saveAllToLocal(remote);
      
      return remote;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for creating a new {{ENTITY_NAME}}
 * 
 * Supports offline mode with automatic sync when online
 * 
 * @returns Mutation object with mutate function
 * 
 * @example
 * ```tsx
 * const create{{ENTITY_NAME}} = useCreate{{ENTITY_NAME}}();
 * 
 * const handleSubmit = (data: Create{{ENTITY_NAME}}Dto) => {
 *   create{{ENTITY_NAME}}.mutate(data, {
 *     onSuccess: () => toast({ title: 'Created!' }),
 *     onError: (error) => toast({ title: 'Error', variant: 'destructive' }),
 *   });
 * };
 * ```
 */
export function useCreate{{ENTITY_NAME}}() {
  const queryClient = useQueryClient();
  const { isOnline, queueOfflineChange } = useOfflineStore();

  return useMutation({
    mutationFn: async (data: Create{{ENTITY_NAME}}Dto) => {
      if (isOnline) {
        // Create via API
        const created = await {{ENTITY_NAME_LOWER}}Api.create(data);
        
        // Save to local
        await {{ENTITY_NAME_LOWER}}Api.saveToLocal(created);
        
        return created;
      } else {
        // Create locally with temporary ID
        const local = await {{ENTITY_NAME_LOWER}}Api.createLocal(data);
        
        // Queue for sync when online
        await queueOfflineChange({
          id: local._id,
          entity: '{{ENTITY_NAME_LOWER}}',
          operation: 'CREATE',
          data: local,
          timestamp: new Date(),
        });
        
        return local;
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['{{ENTITY_NAME_PLURAL_LOWER}}'] });
      queryClient.setQueryData(['{{ENTITY_NAME_LOWER}}', data._id], data);
    },
    onError: (error) => {
      console.error('Failed to create {{ENTITY_NAME}}:', error);
    },
  });
}

/**
 * Hook for updating an existing {{ENTITY_NAME}}
 * 
 * Handles optimistic locking and conflict detection
 */
export function useUpdate{{ENTITY_NAME}}() {
  const queryClient = useQueryClient();
  const { isOnline, queueOfflineChange } = useOfflineStore();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Update{{ENTITY_NAME}}Dto;
    }) => {
      if (isOnline) {
        // Update via API
        const updated = await {{ENTITY_NAME_LOWER}}Api.update(id, data);
        
        // Update local
        await {{ENTITY_NAME_LOWER}}Api.saveToLocal(updated);
        
        return updated;
      } else {
        // Update locally
        const local = await {{ENTITY_NAME_LOWER}}Api.updateLocal(id, data);
        
        // Queue for sync
        await queueOfflineChange({
          id,
          entity: '{{ENTITY_NAME_LOWER}}',
          operation: 'UPDATE',
          data: local,
          timestamp: new Date(),
        });
        
        return local;
      }
    },
    onSuccess: (data) => {
      // Update cache
      queryClient.invalidateQueries({ queryKey: ['{{ENTITY_NAME_PLURAL_LOWER}}'] });
      queryClient.setQueryData(['{{ENTITY_NAME_LOWER}}', data._id], data);
    },
    onError: (error) => {
      console.error('Failed to update {{ENTITY_NAME}}:', error);
      
      // Handle conflict errors
      if (error.response?.status === 409) {
        // Show conflict resolution UI
        queryClient.invalidateQueries({ queryKey: ['{{ENTITY_NAME_PLURAL_LOWER}}'] });
      }
    },
  });
}

/**
 * Hook for deleting a {{ENTITY_NAME}}
 */
export function useDelete{{ENTITY_NAME}}() {
  const queryClient = useQueryClient();
  const { isOnline, queueOfflineChange } = useOfflineStore();

  return useMutation({
    mutationFn: async (id: string) => {
      if (isOnline) {
        // Delete via API
        await {{ENTITY_NAME_LOWER}}Api.delete(id);
        
        // Remove from local
        await {{ENTITY_NAME_LOWER}}Api.deleteFromLocal(id);
      } else {
        // Mark for deletion locally (tombstone)
        await {{ENTITY_NAME_LOWER}}Api.markForDeletion(id);
        
        // Queue for sync
        await queueOfflineChange({
          id,
          entity: '{{ENTITY_NAME_LOWER}}',
          operation: 'DELETE',
          data: { _id: id },
          timestamp: new Date(),
        });
      }
    },
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.invalidateQueries({ queryKey: ['{{ENTITY_NAME_PLURAL_LOWER}}'] });
      queryClient.removeQueries({ queryKey: ['{{ENTITY_NAME_LOWER}}', id] });
    },
  });
}

/**
 * Hook for checking offline sync status
 */
export function use{{ENTITY_NAME}}SyncStatus(id: string) {
  return useQuery({
    queryKey: ['{{ENTITY_NAME_LOWER}}-sync-status', id],
    queryFn: async () => {
      const status = await {{ENTITY_NAME_LOWER}}Api.getSyncStatus(id);
      return status;
    },
    refetchInterval: 5000, // Check every 5 seconds
  });
}
