import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { LocationRepository, Location } from './location.repository';
import { CreateLocationDto, UpdateLocationDto } from './dto/location.dto';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  async findAll(
    options: {
      page?: number;
      limit?: number;
      search?: string;
      locationType?: string;
    } = {},
  ) {
    if (options.search) {
      return this.locationRepository.searchByName(options.search, options);
    }
    if (options.locationType) {
      return this.locationRepository.findByType(options.locationType, options);
    }
    return this.locationRepository.findAll(options);
  }

  async findById(id: string): Promise<Location> {
    const location = await this.locationRepository.findById(id);
    if (!location) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Location with ID '${id}' not found`,
        resourceType: 'Location',
        resourceId: id,
      });
    }
    return location;
  }

  async findByCustomer(
    customerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.locationRepository.findByCustomer(customerId, options);
  }

  async create(
    dto: CreateLocationDto,
    user: { id: string; email?: string },
  ): Promise<Location> {
    // Validate unique location name per customer (if customerId provided)
    if (dto.customerId) {
      await this.validateUniqueLocationName(dto.customerId, dto.locationName);
    }

    const locationData = {
      ...dto,
      contactPersons: dto.contactPersons || [],
      deliveryAddress: {
        ...dto.deliveryAddress,
        country: dto.deliveryAddress.country || 'Deutschland',
      },
    };

    return this.locationRepository.create(
      locationData as Partial<Location>,
      user.id,
      user.email,
    );
  }

  async update(
    id: string,
    dto: UpdateLocationDto,
    user: { id: string; email?: string },
  ): Promise<Location> {
    // Ensure location exists
    const existing = await this.findById(id);

    // Validate unique location name per customer (if changing name)
    if (dto.locationName && dto.locationName !== existing.locationName) {
      const customerId = dto.customerId || existing.customerId;
      if (customerId) {
        await this.validateUniqueLocationName(customerId, dto.locationName, id);
      }
    }

    return this.locationRepository.update(
      id,
      dto as Partial<Location>,
      user.id,
      user.email,
    );
  }

  async delete(
    id: string,
    user: { id: string; email?: string },
  ): Promise<void> {
    // Ensure location exists
    await this.findById(id);

    return this.locationRepository.delete(id, user.id, user.email);
  }

  /**
   * Validate that location name is unique within a customer
   */
  private async validateUniqueLocationName(
    customerId: string,
    locationName: string,
    excludeId?: string,
  ): Promise<void> {
    const result = await this.locationRepository.findByCustomer(customerId, {
      limit: 1000,
    });
    const duplicate = result.data.find(
      (loc) =>
        loc.locationName.toLowerCase() === locationName.toLowerCase() &&
        loc._id !== excludeId,
    );

    if (duplicate) {
      throw new ConflictException({
        type: 'https://api.kompass.de/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail: `Location name '${locationName}' already exists for this customer`,
        conflictType: 'duplicate_location_name',
        existingResourceId: duplicate._id,
      });
    }
  }
}
