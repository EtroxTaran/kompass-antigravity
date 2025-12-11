import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository, BaseEntity } from '../../shared/base.repository';
import * as Nano from 'nano';

export interface Address {
  street: string;
  streetNumber?: string;
  addressLine2?: string;
  zipCode: string;
  city: string;
  state?: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface Location extends BaseEntity {
  type: 'location';

  // Parent reference
  customerId?: string;
  isInternal?: boolean;

  // Location identity
  locationName: string;
  locationType:
    | 'headquarter'
    | 'branch'
    | 'warehouse'
    | 'project_site'
    | 'other';
  isActive: boolean;

  // Delivery address
  deliveryAddress: Address;

  // Contacts
  primaryContactPersonId?: string;
  contactPersons: string[];

  // Operational
  deliveryNotes?: string;
  openingHours?: string;
  parkingInstructions?: string;
}

@Injectable()
export class LocationRepository extends BaseRepository<Location> {
  protected readonly entityType = 'location';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Location>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  /**
   * Find locations for a specific customer
   */
  async findByCustomer(
    customerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ customerId }, options);
  }

  /**
   * Find locations by type
   */
  async findByType(
    locationType: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ locationType }, options);
  }

  /**
   * Find active locations
   */
  async findActive(options: { page?: number; limit?: number } = {}) {
    return this.findBySelector({ isActive: true }, options);
  }

  /**
   * Search locations by name
   */
  async searchByName(
    searchTerm: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector(
      {
        locationName: { $regex: `(?i)${searchTerm}` },
      },
      options,
    );
  }

  /**
   * Delete all locations for a specific customer (cascade delete)
   */
  async deleteByCustomer(
    customerId: string,
    userId: string,
    userEmail?: string,
  ): Promise<number> {
    const result = await this.findByCustomer(customerId, { limit: 1000 });
    let deletedCount = 0;

    for (const location of result.data) {
      await this.delete(location._id, userId, userEmail);
      deletedCount++;
    }

    return deletedCount;
  }
}
