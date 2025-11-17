/**
 * Customer Repository Unit Tests
 *
 * Tests CouchDB data access operations for Customer entities
 */

import { Test } from '@nestjs/testing';

import { CustomerType } from '@kompass/shared/types/enums';

import { CustomerRepository } from '../customer.repository';

import type { CustomerFilters } from '../customer.repository.interface';
import type { Customer } from '@kompass/shared/types/entities/customer';
import type { ServerScope as Nano } from 'nano';

describe('CustomerRepository', () => {
  let repository: CustomerRepository;
  let mockNano: jest.Mocked<Nano>;
  let mockDb: {
    get: jest.Mock;
    find: jest.Mock;
    insert: jest.Mock;
    destroy: jest.Mock;
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
    // Mock CouchDB database operations
    mockDb = {
      get: jest.fn(),
      find: jest.fn(),
      insert: jest.fn(),
      destroy: jest.fn(),
    };

    // Mock NANO client
    mockNano = {
      use: jest.fn().mockReturnValue(mockDb),
    } as unknown as jest.Mocked<Nano>;

    const module = await Test.createTestingModule({
      providers: [
        CustomerRepository,
        {
          provide: 'NANO',
          useValue: mockNano,
        },
      ],
    }).compile();

    repository = module.get<CustomerRepository>(CustomerRepository);
  });

  describe('findById', () => {
    it('should return customer when found', async () => {
      mockDb.get.mockResolvedValue(mockCustomer);

      const result = await repository.findById('customer-123');

      expect(result).toEqual(mockCustomer);
      expect(mockNano.use).toHaveBeenCalledWith('kompass');
      expect(mockDb.get).toHaveBeenCalledWith('customer-123');
    });

    it('should return null when customer not found', async () => {
      const error: Error & { statusCode: number } = Object.assign(
        new Error('not found'),
        { statusCode: 404 }
      );
      mockDb.get.mockRejectedValue(error);

      const result = await repository.findById('customer-999');

      expect(result).toBeNull();
    });

    it('should return null when document type is not customer', async () => {
      const wrongDoc = { ...mockCustomer, type: 'location' };
      mockDb.get.mockResolvedValue(wrongDoc);

      const result = await repository.findById('customer-123');

      expect(result).toBeNull();
    });

    it('should throw error for non-404 errors', async () => {
      const serverError: Error & { statusCode: number } = Object.assign(
        new Error('database error'),
        { statusCode: 500 }
      );
      mockDb.get.mockRejectedValue(serverError);

      await expect(repository.findById('customer-123')).rejects.toThrow(
        'database error'
      );
    });
  });

  describe('findByOwner', () => {
    it('should return customers for owner', async () => {
      const customers = [mockCustomer];
      mockDb.find.mockResolvedValue({ docs: customers });

      const result = await repository.findByOwner('user-adm-001');

      expect(result).toEqual(customers);
      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            type: 'customer',
            owner: 'user-adm-001',
          }),
        })
      );
    });

    it('should apply filters when provided', async () => {
      const filters: CustomerFilters = {
        rating: 'A',
        customerType: CustomerType.ACTIVE,
        search: 'Test',
      };
      mockDb.find.mockResolvedValue({ docs: [mockCustomer] });

      await repository.findByOwner('user-adm-001', { filters });

      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            type: 'customer',
            owner: 'user-adm-001',
            rating: 'A',
            customerType: CustomerType.ACTIVE,
            companyName: expect.objectContaining({
              $regex: expect.stringContaining('Test'),
            }),
          }),
        })
      );
    });

    it('should apply pagination when provided', async () => {
      const customers = [mockCustomer];
      mockDb.find.mockResolvedValue({ docs: customers });

      await repository.findByOwner('user-adm-001', {
        pagination: { page: 2, pageSize: 10 },
      });

      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // (page - 1) * pageSize = (2 - 1) * 10
          limit: 10,
        })
      );
    });

    it('should apply sorting when provided', async () => {
      const customers = [mockCustomer];
      mockDb.find.mockResolvedValue({ docs: customers });

      await repository.findByOwner('user-adm-001', {
        sort: { sortBy: 'companyName', sortOrder: 'desc' },
      });

      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          sort: [{ companyName: 'desc' }],
        })
      );
    });

    it('should apply pagination and sorting together', async () => {
      const customers = [mockCustomer];
      mockDb.find.mockResolvedValue({ docs: customers });

      await repository.findByOwner('user-adm-001', {
        pagination: { page: 1, pageSize: 20 },
        sort: { sortBy: 'createdAt', sortOrder: 'asc' },
      });

      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          limit: 20,
          sort: [{ createdAt: 'asc' }],
        })
      );
    });
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
      const customers = [mockCustomer];
      mockDb.find.mockResolvedValue({ docs: customers });

      const result = await repository.findAll();

      expect(result).toEqual(customers);
      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            type: 'customer',
          }),
        })
      );
    });

    it('should apply filters when provided', async () => {
      const filters: CustomerFilters = {
        rating: 'B',
        search: 'GmbH',
      };
      mockDb.find.mockResolvedValue({ docs: [mockCustomer] });

      await repository.findAll({ filters });

      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            type: 'customer',
            rating: 'B',
            companyName: expect.objectContaining({
              $regex: expect.stringContaining('GmbH'),
            }),
          }),
        })
      );
    });

    it('should apply pagination when provided', async () => {
      const customers = [mockCustomer];
      mockDb.find.mockResolvedValue({ docs: customers });

      await repository.findAll({
        pagination: { page: 3, pageSize: 15 },
      });

      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 30, // (page - 1) * pageSize = (3 - 1) * 15
          limit: 15,
        })
      );
    });

    it('should apply sorting when provided', async () => {
      const customers = [mockCustomer];
      mockDb.find.mockResolvedValue({ docs: customers });

      await repository.findAll({
        sort: { sortBy: 'rating', sortOrder: 'asc' },
      });

      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          sort: [{ rating: 'asc' }],
        })
      );
    });
  });

  describe('count', () => {
    it('should return total count of customers', async () => {
      mockDb.find.mockResolvedValue({ docs: [mockCustomer, mockCustomer] });

      const result = await repository.count();

      expect(result).toBe(2);
      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            type: 'customer',
          }),
          limit: 10000,
        })
      );
    });

    it('should return count with owner filter', async () => {
      mockDb.find.mockResolvedValue({ docs: [mockCustomer] });

      const result = await repository.count('user-adm-001');

      expect(result).toBe(1);
      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            type: 'customer',
            owner: 'user-adm-001',
          }),
        })
      );
    });

    it('should return count with filters', async () => {
      const filters: CustomerFilters = {
        rating: 'A',
        search: 'Test',
      };
      mockDb.find.mockResolvedValue({ docs: [mockCustomer] });

      const result = await repository.count(undefined, filters);

      expect(result).toBe(1);
      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            type: 'customer',
            rating: 'A',
            companyName: expect.objectContaining({
              $regex: expect.stringContaining('Test'),
            }),
          }),
        })
      );
    });
  });

  describe('create', () => {
    it('should create customer and return with _rev', async () => {
      const newCustomer = { ...mockCustomer, _rev: undefined } as Omit<
        Customer,
        '_rev'
      >;
      mockDb.insert.mockResolvedValue({ rev: '1-xyz', id: 'customer-123' });

      const result = await repository.create(newCustomer);

      expect(result).toEqual({
        ...newCustomer,
        _rev: '1-xyz',
      });
      expect(mockDb.insert).toHaveBeenCalledWith(newCustomer);
    });
  });

  describe('update', () => {
    it('should update customer and return with new _rev', async () => {
      const updatedCustomer = {
        ...mockCustomer,
        companyName: 'Updated GmbH',
      };
      mockDb.insert.mockResolvedValue({ rev: '2-abc', id: 'customer-123' });

      const result = await repository.update(updatedCustomer);

      expect(result).toEqual({
        ...updatedCustomer,
        _rev: '2-abc',
      });
      expect(mockDb.insert).toHaveBeenCalledWith(updatedCustomer);
    });

    it('should throw error on conflict (409)', async () => {
      const conflictError: Error & { statusCode: number } = Object.assign(
        new Error('conflict'),
        { statusCode: 409 }
      );
      mockDb.insert.mockRejectedValue(conflictError);

      await expect(repository.update(mockCustomer)).rejects.toThrow(
        'Conflict: Customer customer-123 was modified by another user'
      );
    });
  });

  describe('delete', () => {
    it('should delete customer', async () => {
      mockDb.get.mockResolvedValue(mockCustomer);
      mockDb.destroy.mockResolvedValue({
        ok: true,
        id: 'customer-123',
        rev: '2-abc',
      });

      await repository.delete('customer-123');

      expect(mockDb.destroy).toHaveBeenCalledWith('customer-123', '1-abc');
    });

    it('should throw error if customer not found', async () => {
      const error: Error & { statusCode: number } = Object.assign(
        new Error('not found'),
        { statusCode: 404 }
      );
      mockDb.get.mockRejectedValue(error);

      await expect(repository.delete('customer-999')).rejects.toThrow(
        'Customer customer-999 not found'
      );
    });
  });

  describe('findByVatNumber', () => {
    it('should return customer with matching VAT number', async () => {
      const customerWithVat = {
        ...mockCustomer,
        vatNumber: 'DE123456789',
      };
      mockDb.find.mockResolvedValue({ docs: [customerWithVat] });

      const result = await repository.findByVatNumber('DE123456789');

      expect(result).toEqual(customerWithVat);
      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            type: 'customer',
            vatNumber: 'DE123456789',
          }),
        })
      );
    });

    it('should return null when no customer found', async () => {
      mockDb.find.mockResolvedValue({ docs: [] });

      const result = await repository.findByVatNumber('DE999999999');

      expect(result).toBeNull();
    });
  });

  describe('findByCompanyName', () => {
    it('should return customers with similar company names', async () => {
      const customers = [
        mockCustomer,
        {
          ...mockCustomer,
          _id: 'customer-456',
          companyName: 'Test Company GmbH',
        },
      ];
      mockDb.find.mockResolvedValue({ docs: customers });

      const result = await repository.findByCompanyName('Test');

      expect(result).toEqual(customers);
      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            type: 'customer',
            companyName: expect.objectContaining({
              $regex: expect.stringContaining('Test'),
            }),
          }),
        })
      );
    });

    it('should escape special regex characters', async () => {
      mockDb.find.mockResolvedValue({ docs: [] });

      await repository.findByCompanyName('Test (GmbH)');

      expect(mockDb.find).toHaveBeenCalledWith(
        expect.objectContaining({
          selector: expect.objectContaining({
            companyName: expect.objectContaining({
              $regex: expect.stringContaining('Test \\(GmbH\\)'),
            }),
          }),
        })
      );
    });
  });
});
