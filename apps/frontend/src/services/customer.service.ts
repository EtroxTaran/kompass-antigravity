import apiClient from '@/lib/api-client';

import type { Customer } from '@kompass/shared/types/entities/customer';

/**
 * Customer API Service
 *
 * Handles all customer-related API calls.
 * Follows RESTful conventions and uses the shared Customer type.
 */
export const customerService = {
  /**
   * Get all customers
   *
   * @param filters - Optional filters (search, rating, etc.)
   * @returns Promise resolving to array of customers
   */
  async getAll(filters?: {
    search?: string;
    rating?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Customer[]> {
    const params = new URLSearchParams();

    if (filters?.search) {
      params.append('search', filters.search);
    }

    if (filters?.rating) {
      params.append('rating', filters.rating);
    }

    if (filters?.sortBy) {
      params.append('sortBy', filters.sortBy);
    }

    if (filters?.sortOrder) {
      params.append('sortOrder', filters.sortOrder);
    }

    const queryString = params.toString();
    const url = queryString
      ? `/api/v1/customers?${queryString}`
      : '/api/v1/customers';

    const response = await apiClient.get<Customer[]>(url);
    return response.data;
  },

  /**
   * Get customer by ID
   *
   * @param id - Customer ID
   * @returns Promise resolving to customer
   */
  async getById(id: string): Promise<Customer> {
    const response = await apiClient.get<Customer>(`/api/v1/customers/${id}`);
    return response.data;
  },
};

