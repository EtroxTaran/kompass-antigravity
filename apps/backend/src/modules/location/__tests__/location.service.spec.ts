/**
 * Location Service Unit Tests
 *
 * Tests business logic for Location management
 */

import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { UserRole } from '@kompass/shared/constants/rbac.constants';
import { LocationType } from '@kompass/shared/types/enums';

import { LocationService } from '../location.service';

import type { CreateLocationDto } from '../dto/create-location.dto';
import type { UpdateLocationDto } from '../dto/update-location.dto';
import type { ILocationRepository } from '../location.repository.interface';
import type { Location } from '@kompass/shared/types/entities/location';
import type { User } from '@kompass/shared/types/entities/user';
import type { TestingModule } from '@nestjs/testing';

describe('LocationService', () => {
  let service: LocationService;
  let repository: jest.Mocked<ILocationRepository>;
  let customerService: jest.Mocked<any>;

  const mockUser: User = {
    _id: 'user-adm-001',
    _rev: '1-abc',
    type: 'user',
    email: 'adm@example.com',
    displayName: 'Test ADM User',
    roles: [UserRole.ADM],
    primaryRole: UserRole.ADM,
    active: true,
    createdBy: 'system',
    createdAt: new Date(),
    modifiedBy: 'system',
    modifiedAt: new Date(),
    version: 1,
  };

  const mockGFUser: User = {
    _id: 'user-gf-001',
    _rev: '1-def',
    type: 'user',
    email: 'gf@example.com',
    displayName: 'Test GF User',
    roles: [UserRole.GF],
    primaryRole: UserRole.GF,
    active: true,
    createdBy: 'system',
    createdAt: new Date(),
    modifiedBy: 'system',
    modifiedAt: new Date(),
    version: 1,
  };

  const mockCustomer = {
    _id: 'customer-123',
    owner: 'user-adm-001',
  };

  const mockLocation: Location = {
    _id: 'location-456',
    _rev: '1-abc',
    type: 'location',
    customerId: 'customer-123',
    locationName: 'Filiale München',
    locationType: LocationType.BRANCH,
    isActive: true,
    deliveryAddress: {
      street: 'Teststraße',
      zipCode: '80331',
      city: 'München',
      country: 'Deutschland',
    },
    contactPersons: [],
    createdBy: 'user-adm-001',
    createdAt: new Date(),
    modifiedBy: 'user-adm-001',
    modifiedAt: new Date(),
    version: 1,
  };

  beforeEach(async () => {
    // Mock repository
    repository = {
      findById: jest.fn(),
      findByCustomer: jest.fn(),
      findByCustomerAndName: jest.fn(),
      findActive: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      isLocationInUse: jest.fn(),
    } as any;

    // Mock customer service
    customerService = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: 'ILocationRepository',
          useValue: repository,
        },
        {
          provide: 'ICustomerService',
          useValue: customerService,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  describe('create', () => {
    const createDto: CreateLocationDto = {
      locationName: 'Filiale München Süd',
      locationType: LocationType.BRANCH,
      deliveryAddress: {
        street: 'Lindwurmstraße',
        zipCode: '80337',
        city: 'München',
        country: 'Deutschland',
      },
      isActive: true,
    };

    it('should create location successfully', async () => {
      customerService.findById.mockResolvedValue(mockCustomer);
      repository.findByCustomerAndName.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockLocation);

      const result = await service.create('customer-123', createDto, mockUser);

      expect(result).toBeDefined();
      expect(result.locationName).toBe(mockLocation.locationName);
      expect(repository.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if customer not found', async () => {
      customerService.findById.mockResolvedValue(null);

      await expect(
        service.create('customer-999', createDto, mockUser)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if ADM tries to create location for non-owned customer', async () => {
      customerService.findById.mockResolvedValue({
        ...mockCustomer,
        owner: 'other-user',
      });

      await expect(
        service.create('customer-123', createDto, mockUser)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow GF to create location for any customer', async () => {
      customerService.findById.mockResolvedValue({
        ...mockCustomer,
        owner: 'other-user',
      });
      repository.findByCustomerAndName.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockLocation);

      await expect(
        service.create('customer-123', createDto, mockGFUser)
      ).resolves.toBeDefined();
    });

    it('should throw ConflictException if location name already exists', async () => {
      customerService.findById.mockResolvedValue(mockCustomer);
      repository.findByCustomerAndName.mockResolvedValue(mockLocation);

      await expect(
        service.create('customer-123', createDto, mockUser)
      ).rejects.toThrow(ConflictException);
    });

    it('should validate primary contact is in contactPersons array', async () => {
      customerService.findById.mockResolvedValue(mockCustomer);
      repository.findByCustomerAndName.mockResolvedValue(null);

      const invalidDto: CreateLocationDto = {
        ...createDto,
        primaryContactPersonId: 'contact-111',
        contactPersons: ['contact-222'], // Different contact!
      };

      await expect(
        service.create('customer-123', invalidDto, mockUser)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByCustomer', () => {
    it('should return all locations for customer', async () => {
      customerService.findById.mockResolvedValue(mockCustomer);
      repository.findByCustomer.mockResolvedValue([mockLocation]);

      const result = await service.findByCustomer('customer-123', mockUser);

      expect(result).toHaveLength(1);
      expect(result[0]!.locationName).toBe(mockLocation.locationName);
    });

    it('should verify customer access first', async () => {
      customerService.findById.mockResolvedValue(null);

      await expect(
        service.findByCustomer('customer-999', mockUser)
      ).rejects.toThrow();
      expect(repository.findByCustomer).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateDto: UpdateLocationDto = {
      locationName: 'Filiale München Süd (Hauptfiliale)',
      deliveryNotes: 'Neue Notizen',
    };

    it('should update location successfully', async () => {
      customerService.findById.mockResolvedValue(mockCustomer);
      repository.findById.mockResolvedValue(mockLocation);
      repository.findByCustomerAndName.mockResolvedValue(null);
      repository.update.mockResolvedValue({ ...mockLocation, ...updateDto });

      const result = await service.update(
        'customer-123',
        'location-456',
        updateDto,
        mockUser
      );

      expect(result.locationName).toBe(updateDto.locationName);
      expect(repository.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if ADM tries to update non-owned customer location', async () => {
      customerService.findById.mockResolvedValue({
        ...mockCustomer,
        owner: 'other-user',
      });

      await expect(
        service.update('customer-123', 'location-456', updateDto, mockUser)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ConflictException if new name already exists', async () => {
      customerService.findById.mockResolvedValue(mockCustomer);
      repository.findById.mockResolvedValue(mockLocation);
      repository.findByCustomerAndName.mockResolvedValue({
        ...mockLocation,
        _id: 'location-999',
      });

      await expect(
        service.update('customer-123', 'location-456', updateDto, mockUser)
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should throw ForbiddenException if ADM tries to delete', async () => {
      await expect(
        service.delete('customer-123', 'location-456', mockUser)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow GF to delete location', async () => {
      customerService.findById.mockResolvedValue(mockCustomer);
      repository.findById.mockResolvedValue(mockLocation);
      repository.isLocationInUse.mockResolvedValue(false);
      repository.delete.mockResolvedValue();

      await expect(
        service.delete('customer-123', 'location-456', mockGFUser)
      ).resolves.toBeUndefined();
    });

    it('should throw ConflictException if location is in use', async () => {
      customerService.findById.mockResolvedValue(mockCustomer);
      repository.findById.mockResolvedValue(mockLocation);
      repository.isLocationInUse.mockResolvedValue(true);

      await expect(
        service.delete('customer-123', 'location-456', mockGFUser)
      ).rejects.toThrow(ConflictException);
    });
  });
});
