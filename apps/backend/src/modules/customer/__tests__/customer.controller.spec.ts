/**
 * Customer Controller Unit Tests
 *
 * Tests HTTP layer for Customer endpoints
 * Focus on request/response mapping, guards, and error handling
 */

import { Test } from '@nestjs/testing';

import { UserRole } from '@kompass/shared/constants/rbac.constants';
import { type PaginatedResponse } from '@kompass/shared/types/dtos/paginated-response.dto';
import { CustomerType } from '@kompass/shared/types/enums';

import { CustomerController } from '../customer.controller';
import { CustomerService } from '../customer.service';

import type { CreateCustomerDto } from '../dto/create-customer.dto';
import type { CustomerResponseDto } from '../dto/customer-response.dto';
import type { UpdateCustomerDto } from '../dto/update-customer.dto';
import type { User } from '@kompass/shared/types/entities/user';
import type { ExecutionContext } from '@nestjs/common';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: jest.Mocked<CustomerService>;

  const mockUser: User = {
    _id: 'user-adm-001',
    _rev: '1-abc',
    type: 'user',
    email: 'adm@example.com',
    displayName: 'Test User',
    roles: [UserRole.ADM],
    primaryRole: UserRole.ADM,
    active: true,
    createdBy: 'system',
    createdAt: new Date(),
    modifiedBy: 'system',
    modifiedAt: new Date(),
    version: 1,
  };

  const mockCustomerResponse: CustomerResponseDto = {
    id: 'customer-123',
    companyName: 'Test GmbH',
    billingAddress: {
      street: 'Teststraße',
      zipCode: '80331',
      city: 'München',
      country: 'Deutschland',
    },
    locations: [],
    contactPersons: [],
    owner: 'user-adm-001',
    customerType: CustomerType.ACTIVE,
    createdAt: new Date(),
    modifiedAt: new Date(),
    createdBy: 'user-adm-001',
    modifiedBy: 'user-adm-001',
  };

  beforeEach(async () => {
    // Mock service
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<CustomerService>;

    const module = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: service,
        },
      ],
    })
      .overrideGuard('JwtAuthGuard')
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = mockUser;
          return true;
        },
      })
      .overrideGuard('RbacGuard')
      .useValue({
        canActivate: () => true,
      })
      .compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  describe('create', () => {
    const createDto: CreateCustomerDto = {
      companyName: 'New Customer GmbH',
      billingAddress: {
        street: 'Hauptstraße',
        zipCode: '80331',
        city: 'München',
        country: 'Deutschland',
      },
      customerType: CustomerType.ACTIVE,
    };

    it('should create customer and return 201', async () => {
      service.create.mockResolvedValue(mockCustomerResponse);

      const result = await controller.create(createDto, mockUser);

      expect(result).toEqual(mockCustomerResponse);
      expect(service.create).toHaveBeenCalledWith(createDto, mockUser);
    });
  });

  describe('findAll', () => {
    it('should return paginated list of customers', async () => {
      const customers = [mockCustomerResponse];
      const paginatedResponse: PaginatedResponse<CustomerResponseDto> = {
        data: customers,
        pagination: {
          page: 1,
          pageSize: 20,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      service.findAll.mockResolvedValue(paginatedResponse);

      const result = await controller.findAll(
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        20,
        'companyName',
        'asc',
        mockUser
      );

      expect(result).toEqual(paginatedResponse);
      expect(service.findAll).toHaveBeenCalledWith(
        mockUser,
        {},
        1,
        20,
        'companyName',
        'asc'
      );
    });

    it('should pass filters and pagination to service', async () => {
      const customers = [mockCustomerResponse];
      const paginatedResponse: PaginatedResponse<CustomerResponseDto> = {
        data: customers,
        pagination: {
          page: 1,
          pageSize: 20,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      service.findAll.mockResolvedValue(paginatedResponse);

      await controller.findAll(
        'Müller',
        'A',
        'active',
        undefined,
        1,
        20,
        'companyName',
        'asc',
        mockUser
      );

      expect(service.findAll).toHaveBeenCalledWith(
        mockUser,
        {
          search: 'Müller',
          rating: 'A',
          customerType: CustomerType.ACTIVE,
        },
        1,
        20,
        'companyName',
        'asc'
      );
    });
  });

  describe('findOne', () => {
    it('should return customer by ID', async () => {
      service.findById.mockResolvedValue(mockCustomerResponse);

      const result = await controller.findOne('customer-123', mockUser);

      expect(result).toEqual(mockCustomerResponse);
      expect(service.findById).toHaveBeenCalledWith('customer-123', mockUser);
    });
  });

  describe('update', () => {
    const updateDto: UpdateCustomerDto = {
      companyName: 'Updated GmbH',
    };

    it('should update customer', async () => {
      const updated = { ...mockCustomerResponse, companyName: 'Updated GmbH' };
      service.update.mockResolvedValue(updated);

      const result = await controller.update(
        'customer-123',
        updateDto,
        mockUser
      );

      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(
        'customer-123',
        updateDto,
        mockUser
      );
    });
  });

  describe('remove', () => {
    it('should delete customer and return 204', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.remove('customer-123', mockUser);

      expect(service.delete).toHaveBeenCalledWith('customer-123', mockUser);
    });
  });
});
