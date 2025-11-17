/**
 * Location Service
 *
 * Business logic for Location management
 *
 * Responsibilities:
 * - Validate location data and business rules
 * - Check RBAC permissions
 * - Orchestrate repository calls
 * - Log audit trail
 *
 * Business Rules:
 * - LR-001: Location names must be unique per customer
 * - LR-002: Primary contact must be in contactPersons array
 * - ADM can only manage locations for their own customers
 * - PLAN/GF can manage all locations
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';

import {
  createLocation,
  validateLocation,
} from '@kompass/shared/types/entities/location';

import { ILocationRepository } from './location.repository.interface';

import type { CreateLocationDto } from './dto/create-location.dto';
import type { LocationResponseDto } from './dto/location-response.dto';
import type { UpdateLocationDto } from './dto/update-location.dto';
import type { Customer } from '@kompass/shared/types/entities/customer';
import type { Location } from '@kompass/shared/types/entities/location';
import type { User } from '@kompass/shared/types/entities/user';

/**
 * Placeholder CustomerService - should be injected
 */
interface ICustomerService {
  findById(id: string, user: User): Promise<Customer | null>;
}

/**
 * Location Service
 */
@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(
    @Inject('ILocationRepository')
    private readonly locationRepository: ILocationRepository,
    @Inject('ICustomerService')
    private readonly customerService: ICustomerService
  ) {}

  /**
   * Create a new location for a customer
   *
   * RBAC: ADM (own customers only), PLAN, GF
   */
  async create(
    customerId: string,
    dto: CreateLocationDto,
    user: User
  ): Promise<LocationResponseDto> {
    // Check if user can access parent customer
    const customer = await this.customerService.findById(customerId, user);
    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }

    // RBAC: ADM can only create locations for their own customers
    if (user.primaryRole === 'ADM' && customer.owner !== user._id) {
      throw new ForbiddenException(
        'You can only create locations for your own customers'
      );
    }

    // Business rule LR-001: Check location name uniqueness per customer
    const existingLocation =
      await this.locationRepository.findByCustomerAndName(
        customerId,
        dto.locationName
      );

    if (existingLocation) {
      throw new ConflictException(
        `Location name "${dto.locationName}" already exists for this customer`
      );
    }

    // Create location entity
    const locationData: Omit<
      Location,
      | '_id'
      | '_rev'
      | 'type'
      | 'createdBy'
      | 'createdAt'
      | 'modifiedBy'
      | 'modifiedAt'
      | 'version'
    > = {
      customerId,
      locationName: dto.locationName,
      locationType: dto.locationType,
      isActive: dto.isActive,
      deliveryAddress: dto.deliveryAddress,
      primaryContactPersonId: dto.primaryContactPersonId,
      contactPersons: dto.contactPersons || [],
      deliveryNotes: dto.deliveryNotes,
      openingHours: dto.openingHours,
      parkingInstructions: dto.parkingInstructions,
    };

    const location = createLocation(locationData, user._id);

    // Validate location data
    const validationErrors = validateLocation(location);
    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Business rule LR-002: Validate primary contact is in contactPersons
    if (location.primaryContactPersonId && location.contactPersons) {
      if (!location.contactPersons.includes(location.primaryContactPersonId)) {
        throw new BadRequestException(
          'Primary contact must be in the list of assigned contact persons'
        );
      }
    }

    // Save to database
    const created = await this.locationRepository.create(location);

    this.logger.log('Location created', {
      locationId: created._id,
      customerId,
      userId: user._id,
    });

    return this.mapToResponseDto(created);
  }

  /**
   * Get all locations for a customer
   *
   * RBAC: All roles can READ
   */
  async findByCustomer(
    customerId: string,
    user: User
  ): Promise<LocationResponseDto[]> {
    // Verify customer access
    const customer = await this.customerService.findById(customerId, user);
    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }

    const locations = await this.locationRepository.findByCustomer(customerId);
    return locations.map((loc) => this.mapToResponseDto(loc));
  }

  /**
   * Get a single location
   *
   * RBAC: All roles can READ
   */
  async findOne(
    customerId: string,
    locationId: string,
    user: User
  ): Promise<LocationResponseDto> {
    // Verify customer access
    await this.customerService.findById(customerId, user);

    const location = await this.locationRepository.findById(locationId);

    if (!location) {
      throw new NotFoundException(`Location ${locationId} not found`);
    }

    // Verify location belongs to customer
    if (location.customerId !== customerId) {
      throw new NotFoundException(
        `Location ${locationId} not found for customer ${customerId}`
      );
    }

    return this.mapToResponseDto(location);
  }

  /**
   * Update a location
   *
   * RBAC: ADM (own customers only), PLAN, GF
   */
  async update(
    customerId: string,
    locationId: string,
    dto: UpdateLocationDto,
    user: User
  ): Promise<LocationResponseDto> {
    // Check customer access
    const customer = await this.customerService.findById(customerId, user);
    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }

    // RBAC: ADM can only update locations for their own customers
    if (user.primaryRole === 'ADM' && customer.owner !== user._id) {
      throw new ForbiddenException(
        'You can only update locations for your own customers'
      );
    }

    // Get existing location
    const existing = await this.locationRepository.findById(locationId);
    if (!existing) {
      throw new NotFoundException(`Location ${locationId} not found`);
    }

    // Verify location belongs to customer
    if (existing.customerId !== customerId) {
      throw new NotFoundException(
        `Location ${locationId} not found for customer ${customerId}`
      );
    }

    // Business rule LR-001: Check name uniqueness if name is being changed
    if (dto.locationName && dto.locationName !== existing.locationName) {
      const duplicate = await this.locationRepository.findByCustomerAndName(
        customerId,
        dto.locationName
      );

      if (duplicate) {
        throw new ConflictException(
          `Location name "${dto.locationName}" already exists for this customer`
        );
      }
    }

    // Business rule LR-002: Validate primary contact if being updated
    if (dto.primaryContactPersonId) {
      const contactPersons = dto.contactPersons || existing.contactPersons;
      if (!contactPersons.includes(dto.primaryContactPersonId)) {
        throw new BadRequestException(
          'Primary contact must be in the list of assigned contact persons'
        );
      }
    }

    // Update
    const updates: Partial<Location> = {
      ...dto,
      modifiedBy: user._id,
      modifiedAt: new Date(),
    };

    const updated = await this.locationRepository.update(locationId, updates);

    this.logger.log('Location updated', {
      locationId,
      customerId,
      userId: user._id,
    });

    return this.mapToResponseDto(updated);
  }

  /**
   * Delete a location
   *
   * RBAC: PLAN, GF only
   * Cannot delete if location is in use by projects/quotes
   */
  async delete(
    customerId: string,
    locationId: string,
    user: User
  ): Promise<void> {
    // RBAC: Only PLAN and GF can delete
    if (user.primaryRole !== 'PLAN' && user.primaryRole !== 'GF') {
      throw new ForbiddenException(
        'Only PLAN and GF users can delete locations'
      );
    }

    // Check customer access
    await this.customerService.findById(customerId, user);

    // Get existing location
    const existing = await this.locationRepository.findById(locationId);
    if (!existing) {
      throw new NotFoundException(`Location ${locationId} not found`);
    }

    // Verify location belongs to customer
    if (existing.customerId !== customerId) {
      throw new NotFoundException(
        `Location ${locationId} not found for customer ${customerId}`
      );
    }

    // Business rule: Cannot delete if in use
    const inUse = await this.locationRepository.isLocationInUse(locationId);
    if (inUse) {
      throw new ConflictException(
        'Cannot delete location: it is referenced in active projects or quotes'
      );
    }

    await this.locationRepository.delete(locationId);

    this.logger.log('Location deleted', {
      locationId,
      customerId,
      userId: user._id,
    });
  }

  /**
   * Map Location entity to response DTO
   */
  private mapToResponseDto(location: Location): LocationResponseDto {
    return {
      _id: location._id,
      _rev: location._rev,
      type: location.type,
      customerId: location.customerId,
      locationName: location.locationName,
      locationType: location.locationType,
      isActive: location.isActive,
      deliveryAddress: location.deliveryAddress,
      primaryContactPersonId: location.primaryContactPersonId,
      contactPersons: location.contactPersons,
      deliveryNotes: location.deliveryNotes,
      openingHours: location.openingHours,
      parkingInstructions: location.parkingInstructions,
      createdBy: location.createdBy,
      createdAt: location.createdAt,
      modifiedBy: location.modifiedBy,
      modifiedAt: location.modifiedAt,
      version: location.version,
    };
  }
}
