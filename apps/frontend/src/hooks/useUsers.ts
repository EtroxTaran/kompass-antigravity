import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/user.service';

import type {
  CreateUserRequest,
  UpdateUserRequest,
  AssignRolesRequest,
  UpdatePrimaryRoleRequest,
  UserFilters,
} from '@/services/user.service';
import type { UserRole } from '@kompass/shared/constants/rbac.constants';
import type { PaginatedResponse } from '@kompass/shared/types/dtos/paginated-response.dto';
import type { User } from '@kompass/shared/types/entities/user';

/**
 * Query keys for user queries
 */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (options?: {
    filters?: UserFilters;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => [...userKeys.lists(), options] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  roles: (id: string) => [...userKeys.detail(id), 'roles'] as const,
};

/**
 * Options for useUsers hook
 */
export interface UseUsersOptions {
  filters?: UserFilters;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Hook to get all users (with pagination and sorting)
 */
export function useUsers(options?: UseUsersOptions) {
  return useQuery<PaginatedResponse<User>, Error>({
    queryKey: userKeys.list(options),
    queryFn: () =>
      userService.getAll(
        options?.filters,
        options?.page,
        options?.pageSize,
        options?.sortBy,
        options?.sortOrder
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a single user by ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get user roles
 */
export function useUserRoles(id: string) {
  return useQuery({
    queryKey: userKeys.roles(id),
    queryFn: () => userService.getRoles(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.create(data),
    onSuccess: (newUser: User) => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      toast({
        title: 'Benutzer erstellt',
        description: `Benutzer ${newUser.displayName} wurde erfolgreich erstellt.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Fehler',
        description: `Fehler beim Erstellen des Benutzers: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userService.update(id, data),
    onSuccess: (updatedUser: User) => {
      // Invalidate user detail and list
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(updatedUser._id),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      toast({
        title: 'Benutzer aktualisiert',
        description: `Benutzer ${updatedUser.displayName} wurde erfolgreich aktualisiert.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Fehler',
        description: `Fehler beim Aktualisieren des Benutzers: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      toast({
        title: 'Benutzer gelöscht',
        description: 'Benutzer wurde erfolgreich gelöscht.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Fehler',
        description: `Fehler beim Löschen des Benutzers: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to assign roles to a user
 */
export function useAssignRoles() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignRolesRequest }) =>
      userService.assignRoles(id, data),
    onSuccess: (updatedUser: User) => {
      // Invalidate user detail, roles, and list
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(updatedUser._id),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.roles(updatedUser._id),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      toast({
        title: 'Rollen zugewiesen',
        description: `Rollen für ${updatedUser.displayName} wurden erfolgreich zugewiesen.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Fehler',
        description: `Fehler beim Zuweisen der Rollen: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to revoke a role from a user
 */
export function useRevokeRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, roleId }: { id: string; roleId: UserRole }) =>
      userService.revokeRole(id, roleId),
    onSuccess: (updatedUser: User) => {
      // Invalidate user detail, roles, and list
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(updatedUser._id),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.roles(updatedUser._id),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      toast({
        title: 'Rolle entfernt',
        description: `Rolle wurde erfolgreich von ${updatedUser.displayName} entfernt.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Fehler',
        description: `Fehler beim Entfernen der Rolle: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update user's primary role
 */
export function useUpdatePrimaryRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdatePrimaryRoleRequest;
    }) => userService.updatePrimaryRole(id, data),
    onSuccess: (updatedUser: User) => {
      // Invalidate user detail, roles, and list
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(updatedUser._id),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.roles(updatedUser._id),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      toast({
        title: 'Hauptrolle aktualisiert',
        description: `Hauptrolle für ${updatedUser.displayName} wurde erfolgreich aktualisiert.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Fehler',
        description: `Fehler beim Aktualisieren der Hauptrolle: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}
