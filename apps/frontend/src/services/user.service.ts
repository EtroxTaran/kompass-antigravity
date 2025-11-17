import apiClient from '@/lib/api-client';

import type { UserRole } from '@kompass/shared/constants/rbac.constants';
import type { PaginatedResponse } from '@kompass/shared/types/dtos/paginated-response.dto';
import type { User } from '@kompass/shared/types/entities/user';

/**
 * Create User DTO
 */
export interface CreateUserRequest {
  email: string;
  displayName: string;
  password: string;
  phoneNumber?: string;
  roles: UserRole[];
  primaryRole: UserRole;
  active?: boolean;
}

/**
 * Update User DTO
 */
export interface UpdateUserRequest {
  email?: string;
  displayName?: string;
  phoneNumber?: string;
  active?: boolean;
}

/**
 * Assign Roles DTO
 */
export interface AssignRolesRequest {
  roles: UserRole[];
  primaryRole: UserRole;
  reason?: string;
}

/**
 * Update Primary Role DTO
 */
export interface UpdatePrimaryRoleRequest {
  primaryRole: UserRole;
  reason?: string;
}

/**
 * User Filters
 */
export interface UserFilters {
  email?: string;
  role?: UserRole;
  active?: boolean;
  search?: string;
}

/**
 * User API Service
 *
 * Handles all user-related API calls.
 * Follows RESTful conventions and uses the shared User type.
 */
export const userService = {
  /**
   * Get all users (with pagination and sorting)
   *
   * @param filters - Optional filters (email, role, active, search)
   * @param page - Page number (1-based, default: 1)
   * @param pageSize - Items per page (default: 20, max: 100)
   * @param sortBy - Sort field (default: 'displayName')
   * @param sortOrder - Sort direction (default: 'asc')
   * @returns Promise resolving to paginated response with users
   */
  async getAll(
    filters?: UserFilters,
    page?: number,
    pageSize?: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();

    if (filters?.email) {
      params.append('email', filters.email);
    }

    if (filters?.role) {
      params.append('role', filters.role);
    }

    if (filters?.active !== undefined) {
      params.append('active', String(filters.active));
    }

    if (filters?.search) {
      params.append('search', filters.search);
    }

    if (page !== undefined) {
      params.append('page', String(page));
    }

    if (pageSize !== undefined) {
      params.append('pageSize', String(pageSize));
    }

    if (sortBy) {
      params.append('sortBy', sortBy);
    }

    if (sortOrder) {
      params.append('sortOrder', sortOrder);
    }

    const queryString = params.toString();
    const url = queryString ? `/api/v1/users?${queryString}` : '/api/v1/users';

    const response = await apiClient.get<PaginatedResponse<User>>(url);
    return response.data;
  },

  /**
   * Get user by ID
   *
   * @param id - User ID
   * @returns Promise resolving to user
   */
  async getById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/api/v1/users/${id}`);
    return response.data;
  },

  /**
   * Create a new user
   *
   * @param data - User data
   * @returns Promise resolving to created user
   */
  async create(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>('/api/v1/users', data);
    return response.data;
  },

  /**
   * Update user
   *
   * @param id - User ID
   * @param data - Updated user data
   * @returns Promise resolving to updated user
   */
  async update(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(`/api/v1/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete user (soft delete)
   *
   * @param id - User ID
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/users/${id}`);
  },

  /**
   * Assign roles to user
   *
   * @param id - User ID
   * @param data - Role assignment data
   * @returns Promise resolving to updated user
   */
  async assignRoles(id: string, data: AssignRolesRequest): Promise<User> {
    const response = await apiClient.put<User>(
      `/api/v1/users/${id}/roles`,
      data
    );
    return response.data;
  },

  /**
   * Revoke role from user
   *
   * @param id - User ID
   * @param roleId - Role to revoke
   * @returns Promise resolving to updated user
   */
  async revokeRole(id: string, roleId: UserRole): Promise<User> {
    const response = await apiClient.delete<User>(
      `/api/v1/users/${id}/roles/${roleId}`
    );
    return response.data;
  },

  /**
   * Update user's primary role
   *
   * @param id - User ID
   * @param data - Primary role update data
   * @returns Promise resolving to updated user
   */
  async updatePrimaryRole(
    id: string,
    data: UpdatePrimaryRoleRequest
  ): Promise<User> {
    const response = await apiClient.put<User>(
      `/api/v1/users/${id}/primary-role`,
      data
    );
    return response.data;
  },

  /**
   * Get user roles
   *
   * @param id - User ID
   * @returns Promise resolving to user roles
   */
  async getRoles(id: string): Promise<{
    roles: UserRole[];
    primaryRole: UserRole;
  }> {
    const response = await apiClient.get<{
      roles: UserRole[];
      primaryRole: UserRole;
    }>(`/api/v1/users/${id}/roles`);
    return response.data;
  },
};
