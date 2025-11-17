import apiClient from '@/lib/api-client';

import type { PaginatedResponse } from '@kompass/shared/types/dtos/paginated-response.dto';
import type { Customer } from '@kompass/shared/types/entities/customer';

/**
 * Customer API Service
 *
 * Handles all customer-related API calls.
 * Follows RESTful conventions and uses the shared Customer type.
 */
export const customerService = {
  /**
   * Get all customers (with pagination and sorting)
   *
   * @param filters - Optional filters (search, rating, etc.)
   * @param page - Page number (1-based, default: 1)
   * @param pageSize - Items per page (default: 20, max: 100)
   * @param sortBy - Sort field (default: 'companyName')
   * @param sortOrder - Sort direction (default: 'asc')
   * @returns Promise resolving to paginated response with customers
   */
  async getAll(
    filters?: {
      search?: string;
      rating?: string;
      customerType?: string;
      vatNumber?: string;
    },
    page?: number,
    pageSize?: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<PaginatedResponse<Customer>> {
    const params = new URLSearchParams();

    if (filters?.search) {
      params.append('search', filters.search);
    }

    if (filters?.rating) {
      params.append('rating', filters.rating);
    }

    if (filters?.customerType) {
      params.append('customerType', filters.customerType);
    }

    if (filters?.vatNumber) {
      params.append('vatNumber', filters.vatNumber);
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
    const url = queryString
      ? `/api/v1/customers?${queryString}`
      : '/api/v1/customers';

    const response = await apiClient.get<PaginatedResponse<Customer>>(url);
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
