/**
 * Location Controller Unit Tests
 *
 * Tests HTTP request handling for Location endpoints
 */

import { Test } from '@nestjs/testing';

import { UserRole } from '@kompass/shared/constants/rbac.constants';
import { LocationType } from '@kompass/shared/types/enums';
import type { User } from '@kompass/shared/types/entities/user';

import { LocationController } from '../location.controller';
import { LocationService } from '../location.service';

import type { CreateLocationDto } from '../dto/create-location.dto';
import type { LocationResponseDto } from '../dto/location-response.dto';
import type { UpdateLocationDto } from '../dto/update-location.dto';
import type { TestingModule } from '@nestjs/testing';

describe('LocationController', () => {
  let controller: LocationController;
  let service: jest.Mocked<LocationService>;

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

  const mockLocationResponse: LocationResponseDto = {
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
    // Mock service
    service = {
      create: jest.fn(),
      findByCustomer: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: LocationService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  describe('createLocation', () => {
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

    it('should create location and return 201', async () => {
      service.create.mockResolvedValue(mockLocationResponse);

      const result = await controller.createLocation(
        'customer-123',
        createDto,
        mockUser
      );

      expect(result).toEqual(mockLocationResponse);
      expect(service.create).toHaveBeenCalledWith(
        'customer-123',
        createDto,
        mockUser
      );
    });
  });

  describe('listLocations', () => {
    it('should return all locations for customer', async () => {
      service.findByCustomer.mockResolvedValue([mockLocationResponse]);

      const result = await controller.listLocations(
        'customer-123',
        undefined,
        undefined,
        undefined,
        undefined,
        mockUser
      );

      expect(result).toHaveLength(1);
      expect(service.findByCustomer).toHaveBeenCalledWith(
        'customer-123',
        mockUser
      );
    });

    it('should filter by locationType', async () => {
      service.findByCustomer.mockResolvedValue([
        mockLocationResponse,
        {
          ...mockLocationResponse,
          _id: 'location-789',
          locationType: LocationType.WAREHOUSE,
        },
      ]);

      const result = await controller.listLocations(
        'customer-123',
        LocationType.BRANCH,
        undefined,
        undefined,
        undefined,
        mockUser
      );

      expect(result).toHaveLength(1);
      expect(result[0]!.locationType).toBe(LocationType.BRANCH);
    });

    it('should filter by isActive', async () => {
      service.findByCustomer.mockResolvedValue([
        mockLocationResponse,
        { ...mockLocationResponse, _id: 'location-789', isActive: false },
      ]);

      const result = await controller.listLocations(
        'customer-123',
        undefined,
        true,
        undefined,
        undefined,
        mockUser
      );

      expect(result).toHaveLength(1);
      expect(result[0]!.isActive).toBe(true);
    });

    it('should sort locations by name', async () => {
      service.findByCustomer.mockResolvedValue([
        { ...mockLocationResponse, locationName: 'Zebra' },
        { ...mockLocationResponse, _id: 'location-789', locationName: 'Alpha' },
      ]);

      const result = await controller.listLocations(
        'customer-123',
        undefined,
        undefined,
        'locationName',
        'asc',
        mockUser
      );

      expect(result[0]!.locationName).toBe('Alpha');
      expect(result[1]!.locationName).toBe('Zebra');
    });
  });

  describe('getLocation', () => {
    it('should return single location', async () => {
      service.findOne.mockResolvedValue(mockLocationResponse);

      const result = await controller.getLocation(
        'customer-123',
        'location-456',
        mockUser
      );

      expect(result).toEqual(mockLocationResponse);
    });
  });

  describe('updateLocation', () => {
    const updateDto: UpdateLocationDto = {
      locationName: 'Updated Name',
    };

    it('should update location successfully', async () => {
      service.update.mockResolvedValue({
        ...mockLocationResponse,
        locationName: 'Updated Name',
      });

      const result = await controller.updateLocation(
        'customer-123',
        'location-456',
        updateDto,
        mockUser
      );

      expect(result.locationName).toBe('Updated Name');
      expect(service.update).toHaveBeenCalledWith(
        'customer-123',
        'location-456',
        updateDto,
        mockUser
      );
    });
  });

  describe('deleteLocation', () => {
    it('should delete location successfully', async () => {
      service.delete.mockResolvedValue();

      await expect(
        controller.deleteLocation('customer-123', 'location-456', mockUser)
      ).resolves.toBeUndefined();

      expect(service.delete).toHaveBeenCalledWith(
        'customer-123',
        'location-456',
        mockUser
      );
    });
  });
});
