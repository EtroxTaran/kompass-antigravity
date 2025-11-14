/**
 * Location Repository Interface
 *
 * Defines contract for Location data access
 * Following Clean Architecture pattern - service layer depends on interface, not implementation
 */

import type { Location } from '@kompass/shared/types/entities/location';

/**
 * Location repository interface
 */
export interface ILocationRepository {
  /**
   * Find location by ID
   */
  findById(id: string): Promise<Location | null>;

  /**
   * Find all locations for a customer
   */
  findByCustomer(customerId: string): Promise<Location[]>;

  /**
   * Find location by customer and name (for uniqueness check)
   */
  findByCustomerAndName(
    customerId: string,
    locationName: string
  ): Promise<Location | null>;

  /**
   * Find active locations from a list of IDs
   */
  findActive(locationIds: string[]): Promise<Location[]>;

  /**
   * Create a new location
   */
  create(location: Omit<Location, '_rev'>): Promise<Location>;

  /**
   * Update an existing location
   */
  update(id: string, updates: Partial<Location>): Promise<Location>;

  /**
   * Delete a location
   */
  delete(id: string): Promise<void>;

  /**
   * Check if location is referenced in any projects/quotes
   */
  isLocationInUse(locationId: string): Promise<boolean>;
}
