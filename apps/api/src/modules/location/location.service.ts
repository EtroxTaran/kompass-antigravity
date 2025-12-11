import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { LocationRepository } from './location.repository';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from '@kompass/shared';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) { }

  async create(createLocationDto: CreateLocationDto, userId: string, userEmail?: string): Promise<Location> {
    await this.validateUniqueName(createLocationDto.customerId, createLocationDto.locationName);

    return this.locationRepository.create(createLocationDto as any, userId, userEmail);
  }

  async findAll(customerId?: string): Promise<any> {
    if (customerId) {
      return this.locationRepository.findByCustomerId(customerId);
    }
    return this.locationRepository.findAll();
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepository.findById(id);
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto, userId: string, userEmail?: string): Promise<Location> {
    const existing = await this.findOne(id);

    if (updateLocationDto.locationName && updateLocationDto.locationName !== existing.locationName) {
      await this.validateUniqueName(existing.customerId, updateLocationDto.locationName, id);
    }

    return this.locationRepository.update(id, updateLocationDto as any, userId, userEmail);
  }

  async remove(id: string, userId: string, userEmail?: string): Promise<void> {
    await this.locationRepository.delete(id, userId, userEmail);
  }

  private async validateUniqueName(customerId: string, name: string, excludeId?: string) {
    const locations = await this.locationRepository.findByCustomerId(customerId);
    const duplicate = locations.find(l => l.locationName === name && l._id !== excludeId);
    if (duplicate) {
      throw new BadRequestException(`Location with name "${name}" already exists for this customer`);
    }
  }
}
