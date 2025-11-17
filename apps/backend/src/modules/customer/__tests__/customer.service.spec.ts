/**
 * Customer Service Unit Tests
 *
 * Tests business logic for Customer management
 * Focus on validation, RBAC, duplicate detection, and field filtering
 */

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';

import { UserRole } from '@kompass/shared/constants/rbac.constants';
import { CustomerType } from '@kompass/shared/types/enums';

import { CustomerService } from '../customer.service';

import type { ICustomerRepository } from '../customer.repository.interface';
import type { CreateCustomerDto } from '../dto/create-customer.dto';
import type { UpdateCustomerDto } from '../dto/update-customer.dto';
import type { Customer } from '@kompass/shared/types/entities/customer';
import type { User } from '@kompass/shared/types/entities/user';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: jest.Mocked<ICustomerRepository>;
  let auditService: jest.Mocked<any>;

  const mockADMUser: User = {
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

  const mockPLANUser: User = {
    _id: 'user-plan-001',
    _rev: '1-def',
    type: 'user',
    email: 'plan@example.com',
    displayName: 'Test PLAN User',
    roles: [UserRole.PLAN],
    primaryRole: UserRole.PLAN,
    active: true,
    createdBy: 'system',
    createdAt: new Date(),
    modifiedBy: 'system',
    modifiedAt: new Date(),
    version: 1,
  };

  const mockGFUser: User = {
    _id: 'user-gf-001',
    _rev: '1-ghi',
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

  const mockCustomer: Customer = {
    _id: 'customer-123',
    _rev: '1-abc',
    type: 'customer',
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
      findByOwner: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByVatNumber: jest.fn(),
      findByCompanyName: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<ICustomerRepository>;

    // Mock audit service
    auditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: 'ICustomerRepository',
          useValue: repository,
        },
        {
          provide: 'IAuditService',
          useValue: auditService,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
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

    it('should create customer for ADM user', async () => {
      repository.findByVatNumber.mockResolvedValue(null);
      repository.findByCompanyName.mockResolvedValue([]);
      repository.create.mockResolvedValue({
        ...mockCustomer,
        companyName: 'New Customer GmbH',
      });

      const result = await service.create(createDto, mockADMUser);

      expect(result).toBeDefined();
      expect(result.companyName).toBe('New Customer GmbH');
      expect(repository.create).toHaveBeenCalled();
      expect(auditService.log).toHaveBeenCalled();
    });

    it('should set owner to current user for ADM', async () => {
      repository.findByVatNumber.mockResolvedValue(null);
      repository.findByCompanyName.mockResolvedValue([]);
      repository.create.mockImplementation((customer) => {
        expect(customer.owner).toBe(mockADMUser._id);
        return Promise.resolve({ ...customer, _rev: '1-xyz' });
      });

      await service.create(createDto, mockADMUser);
    });

    it('should throw ConflictException for duplicate VAT number', async () => {
      const duplicateCustomer = {
        ...mockCustomer,
        vatNumber: 'DE123456789',
      };
      repository.findByVatNumber.mockResolvedValue(duplicateCustomer);
      repository.findByCompanyName.mockResolvedValue([]);

      const dtoWithVat: CreateCustomerDto = {
        ...createDto,
        vatNumber: 'DE123456789',
      };

      await expect(service.create(dtoWithVat, mockADMUser)).rejects.toThrow(
        ConflictException
      );
    });

    it('should throw ConflictException for similar company name', async () => {
      const similarCustomer = {
        ...mockCustomer,
        companyName: 'New Customer GMBH', // Similar but different case
      };
      repository.findByVatNumber.mockResolvedValue(null);
      repository.findByCompanyName.mockResolvedValue([similarCustomer]);

      await expect(service.create(createDto, mockADMUser)).rejects.toThrow(
        ConflictException
      );
    });

    it('should throw BadRequestException for validation errors', async () => {
      repository.findByVatNumber.mockResolvedValue(null);
      repository.findByCompanyName.mockResolvedValue([]);

      const invalidDto: CreateCustomerDto = {
        companyName: 'A', // Too short
        billingAddress: {
          street: 'Hauptstraße',
          zipCode: '80331',
          city: 'München',
          country: 'Deutschland',
        },
        customerType: CustomerType.ACTIVE,
      };

      await expect(service.create(invalidDto, mockADMUser)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('findAll', () => {
    it('should return own customers for ADM user with pagination', async () => {
      const customers = [mockCustomer];
      repository.findByOwner.mockResolvedValue(customers);
      repository.count.mockResolvedValue(1);

      const result = await service.findAll(mockADMUser, undefined, 1, 20);

      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.pageSize).toBe(20);
      expect(repository.findByOwner).toHaveBeenCalledWith(
        mockADMUser._id,
        expect.objectContaining({
          pagination: expect.objectContaining({
            page: 1,
            pageSize: 20,
          }),
        })
      );
      expect(repository.count).toHaveBeenCalledWith(mockADMUser._id, undefined);
    });

    it('should return all customers for PLAN user with pagination', async () => {
      const customers = [mockCustomer];
      repository.findAll.mockResolvedValue(customers);
      repository.count.mockResolvedValue(1);

      const result = await service.findAll(mockPLANUser, undefined, 1, 20);

      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(repository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: expect.objectContaining({
            page: 1,
            pageSize: 20,
          }),
        })
      );
      expect(repository.count).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should apply sorting when provided', async () => {
      const customers = [mockCustomer];
      repository.findByOwner.mockResolvedValue(customers);
      repository.count.mockResolvedValue(1);

      const result = await service.findAll(
        mockADMUser,
        undefined,
        1,
        20,
        'companyName',
        'desc'
      );

      expect(result.data).toHaveLength(1);
      expect(repository.findByOwner).toHaveBeenCalledWith(
        mockADMUser._id,
        expect.objectContaining({
          sort: expect.objectContaining({
            sortBy: 'companyName',
            sortOrder: 'desc',
          }),
        })
      );
    });

    it('should filter financial fields for ADM user', async () => {
      const customerWithFinancial = {
        ...mockCustomer,
        creditLimit: 50000,
        paymentTerms: 30,
      };
      repository.findByOwner.mockResolvedValue([customerWithFinancial]);
      repository.count.mockResolvedValue(1);

      const result = await service.findAll(mockADMUser);

      expect(result.data[0]?.creditLimit).toBeUndefined();
      expect(result.data[0]?.paymentTerms).toBeUndefined();
    });

    it('should include financial fields for GF user', async () => {
      const customerWithFinancial = {
        ...mockCustomer,
        creditLimit: 50000,
        paymentTerms: 30,
      };
      repository.findAll.mockResolvedValue([customerWithFinancial]);
      repository.count.mockResolvedValue(1);

      const result = await service.findAll(mockGFUser);

      expect(result.data[0]?.creditLimit).toBe(50000);
      expect(result.data[0]?.paymentTerms).toBe(30);
    });

    it('should calculate pagination metadata correctly', async () => {
      const customers = Array.from({ length: 10 }, (_, i) => ({
        ...mockCustomer,
        _id: `customer-${i}`,
      }));
      repository.findByOwner.mockResolvedValue(customers);
      repository.count.mockResolvedValue(45); // Total 45 customers

      const result = await service.findAll(mockADMUser, undefined, 2, 10);

      expect(result.data).toHaveLength(10);
      expect(result.pagination.total).toBe(45);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.pageSize).toBe(10);
      expect(result.pagination.totalPages).toBe(5);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPreviousPage).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return customer when found and user has access', async () => {
      repository.findById.mockResolvedValue(mockCustomer);

      const result = await service.findById('customer-123', mockADMUser);

      expect(result).toBeDefined();
      expect(result.id).toBe('customer-123');
    });

    it('should throw NotFoundException when customer not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.findById('customer-999', mockADMUser)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when ADM tries to access other user customer', async () => {
      const otherCustomer = {
        ...mockCustomer,
        owner: 'user-adm-002', // Different owner
      };
      repository.findById.mockResolvedValue(otherCustomer);

      await expect(
        service.findById('customer-123', mockADMUser)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow PLAN user to access any customer', async () => {
      const otherCustomer = {
        ...mockCustomer,
        owner: 'user-adm-002',
      };
      repository.findById.mockResolvedValue(otherCustomer);

      const result = await service.findById('customer-123', mockPLANUser);

      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    const updateDto: UpdateCustomerDto = {
      companyName: 'Updated GmbH',
    };

    it('should update customer when user has access', async () => {
      repository.findById.mockResolvedValue(mockCustomer);
      repository.findByVatNumber.mockResolvedValue(null);
      repository.findByCompanyName.mockResolvedValue([]);
      repository.update.mockResolvedValue({
        ...mockCustomer,
        companyName: 'Updated GmbH',
        _rev: '2-xyz',
      });

      const result = await service.update(
        'customer-123',
        updateDto,
        mockADMUser
      );

      expect(result.companyName).toBe('Updated GmbH');
      expect(repository.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when ADM tries to update other user customer', async () => {
      const otherCustomer = {
        ...mockCustomer,
        owner: 'user-adm-002',
      };
      repository.findById.mockResolvedValue(otherCustomer);

      await expect(
        service.update('customer-123', updateDto, mockADMUser)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should check for duplicates when company name changes', async () => {
      repository.findById.mockResolvedValue(mockCustomer);
      repository.findByVatNumber.mockResolvedValue(null);
      const duplicate = {
        ...mockCustomer,
        _id: 'customer-456',
        companyName: 'Updated GMBH',
      };
      repository.findByCompanyName.mockResolvedValue([duplicate]);

      await expect(
        service.update('customer-123', updateDto, mockADMUser)
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should delete customer when user has permission', async () => {
      repository.findById.mockResolvedValue(mockCustomer);
      repository.delete.mockResolvedValue(undefined);

      await service.delete('customer-123', mockGFUser);

      expect(repository.delete).toHaveBeenCalledWith('customer-123');
      expect(auditService.log).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when ADM tries to delete', async () => {
      repository.findById.mockResolvedValue(mockCustomer);

      await expect(service.delete('customer-123', mockADMUser)).rejects.toThrow(
        ForbiddenException
      );
    });
  });
});
