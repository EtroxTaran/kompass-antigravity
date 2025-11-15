/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/**
 * Location API Client
 *
 * Handles HTTP requests to Location endpoints
 * Base URL: /api/v1/customers/{customerId}/locations
 */

import axios from 'axios';

import type { Location, LocationType } from '@kompass/shared';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

/**
 * Create Location Request DTO
 */
export interface CreateLocationRequest {
  locationName: string;
  locationType: LocationType;
  deliveryAddress: {
    street: string;
    streetNumber?: string;
    addressLine2?: string;
    zipCode: string;
    city: string;
    state?: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  isActive: boolean;
  primaryContactPersonId?: string;
  contactPersons?: string[];
  deliveryNotes?: string;
  openingHours?: string;
  parkingInstructions?: string;
}

/**
 * Update Location Request DTO
 */
export type UpdateLocationRequest = Partial<CreateLocationRequest>;

/**
 * Location Response DTO
 */
export interface LocationResponse extends Location {}

/**
 * Location API service
 */
export const locationApi = {
  /**
   * Get all locations for a customer
   */
  async getLocations(
    customerId: string,
    filters?: {
      locationType?: LocationType;
      isActive?: boolean;
      sort?: string;
      order?: 'asc' | 'desc';
    }
  ): Promise<LocationResponse[]> {
    const params = new URLSearchParams();
    if (filters?.locationType)
      params.append('locationType', filters.locationType);
    if (filters?.isActive !== undefined)
      params.append('isActive', filters.isActive.toString());
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.order) params.append('order', filters.order);

    const response = await axios.get<LocationResponse[]>(
      `${API_BASE_URL}/api/v1/customers/${customerId}/locations?${params}`
    );
    return response.data;
  },

  /**
   * Get a single location
   */
  async getLocation(
    customerId: string,
    locationId: string
  ): Promise<LocationResponse> {
    const response = await axios.get<LocationResponse>(
      `${API_BASE_URL}/api/v1/customers/${customerId}/locations/${locationId}`
    );
    return response.data;
  },

  /**
   * Create a new location
   */
  async createLocation(
    customerId: string,
    data: CreateLocationRequest
  ): Promise<LocationResponse> {
    const response = await axios.post<LocationResponse>(
      `${API_BASE_URL}/api/v1/customers/${customerId}/locations`,
      data
    );
    return response.data;
  },

  /**
   * Update an existing location
   */
  async updateLocation(
    customerId: string,
    locationId: string,
    data: UpdateLocationRequest
  ): Promise<LocationResponse> {
    const response = await axios.put<LocationResponse>(
      `${API_BASE_URL}/api/v1/customers/${customerId}/locations/${locationId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a location
   */
  async deleteLocation(customerId: string, locationId: string): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/api/v1/customers/${customerId}/locations/${locationId}`
    );
  },
};
