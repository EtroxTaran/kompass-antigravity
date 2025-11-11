/**
 * Location Repository Implementation (CouchDB)
 * 
 * Handles Location CRUD operations with CouchDB
 * Implements ILocationRepository interface for dependency inversion
 */

import { Injectable, Logger } from '@nestjs/common';
import { ILocationRepository } from './location.repository.interface';
import type { Location } from '@kompass/shared/types/entities/location';
import { DocumentScope, ServerScope } from 'nano';

@Injectable()
export class LocationRepository implements ILocationRepository {
  private readonly logger = new Logger(LocationRepository.name);
  private db: DocumentScope<Location>;

  constructor(
    // Inject CouchDB connection - actual injection happens in module
    // For now, this is a placeholder pattern
  ) {
    // TODO: Inject Nano instance and get database
    // this.db = nano.use<Location>('kompass');
  }

  /**
   * Find location by ID
   */
  async findById(id: string): Promise<Location | null> {
    try {
      const location = await this.db.get(id);
      
      if (location.type !== 'location') {
        this.logger.warn(`Document ${id} is not a location (type: ${location.type})`);
        return null;
      }
      
      return location;
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      this.logger.error(`Error finding location ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find all locations for a customer
   */
  async findByCustomer(customerId: string): Promise<Location[]> {
    try {
      // Use Mango query selector
      const result = await this.db.find({
        selector: {
          type: 'location',
          customerId: customerId,
        },
        limit: 1000, // Reasonable limit for locations per customer
      });

      return result.docs;
    } catch (error) {
      this.logger.error(`Error finding locations for customer ${customerId}:`, error);
      throw error;
    }
  }

  /**
   * Find location by customer and name (for uniqueness check)
   */
  async findByCustomerAndName(
    customerId: string,
    locationName: string,
  ): Promise<Location | null> {
    try {
      const result = await this.db.find({
        selector: {
          type: 'location',
          customerId: customerId,
          locationName: locationName,
        },
        limit: 1,
      });

      return result.docs.length > 0 ? result.docs[0] : null;
    } catch (error) {
      this.logger.error(`Error finding location by name for customer ${customerId}:`, error);
      throw error;
    }
  }

  /**
   * Find active locations from a list of IDs
   */
  async findActive(locationIds: string[]): Promise<Location[]> {
    if (locationIds.length === 0) {
      return [];
    }

    try {
      const result = await this.db.find({
        selector: {
          type: 'location',
          _id: { $in: locationIds },
          isActive: true,
        },
        limit: locationIds.length,
      });

      return result.docs;
    } catch (error) {
      this.logger.error(`Error finding active locations:`, error);
      throw error;
    }
  }

  /**
   * Create a new location
   */
  async create(location: Location): Promise<Location> {
    try {
      const response = await this.db.insert(location);
      
      if (!response.ok) {
        throw new Error('Failed to create location');
      }

      return {
        ...location,
        _rev: response.rev,
      };
    } catch (error) {
      this.logger.error(`Error creating location:`, error);
      throw error;
    }
  }

  /**
   * Update an existing location
   */
  async update(id: string, updates: Partial<Location>): Promise<Location> {
    try {
      // Get current version
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error(`Location ${id} not found`);
      }

      // Merge updates
      const updated: Location = {
        ...existing,
        ...updates,
        _id: existing._id,
        _rev: existing._rev,
        type: 'location',
        modifiedAt: new Date(),
        version: existing.version + 1,
      };

      // Save
      const response = await this.db.insert(updated);
      
      if (!response.ok) {
        throw new Error('Failed to update location');
      }

      return {
        ...updated,
        _rev: response.rev,
      };
    } catch (error) {
      this.logger.error(`Error updating location ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a location
   */
  async delete(id: string): Promise<void> {
    try {
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error(`Location ${id} not found`);
      }

      await this.db.destroy(existing._id, existing._rev);
    } catch (error) {
      this.logger.error(`Error deleting location ${id}:`, error);
      throw error;
    }
  }

  /**
   * Check if location is referenced in any projects/quotes
   */
  async isLocationInUse(locationId: string): Promise<boolean> {
    try {
      // Check if any projects reference this location
      const projectResult = await this.db.find({
        selector: {
          type: 'project',
          deliveryLocationId: locationId,
        },
        limit: 1,
      });

      if (projectResult.docs.length > 0) {
        return true;
      }

      // Check if any quotes reference this location
      const quoteResult = await this.db.find({
        selector: {
          type: 'quote',
          deliveryLocationId: locationId,
        },
        limit: 1,
      });

      return quoteResult.docs.length > 0;
    } catch (error) {
      this.logger.error(`Error checking location usage ${locationId}:`, error);
      throw error;
    }
  }
}

