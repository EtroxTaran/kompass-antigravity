import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, Logger } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerRepository, Customer } from './customer.repository';
import { SearchService } from '../search/search.service';
import { ContactRepository } from '../contact/contact.repository';
import { LocationRepository } from '../location/location.repository';
import { ProtocolRepository } from '../protocol/protocol.repository';
import { ProjectRepository } from '../project/project.repository';

// Mock Repositories
const mockCustomerRepository = {
  findById: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
};

const mockContactRepository = {
  deleteByCustomer: jest.fn(),
};

const mockLocationRepository = {
  deleteByCustomer: jest.fn(),
};

const mockProtocolRepository = {
  unlinkFromCustomer: jest.fn(),
};

const mockProjectRepository = {
  unlinkFromCustomer: jest.fn(),
};

const mockSearchService = {
  search: jest.fn(),
  addDocuments: jest.fn(),
  deleteDocument: jest.fn(),
};

describe('CustomerService Cascading Deletes', () => {
  let service: CustomerService;

  beforeEach(async () => {
    // Suppress logger output during tests
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => { });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: CustomerRepository, useValue: mockCustomerRepository },
        { provide: SearchService, useValue: mockSearchService },
        { provide: ContactRepository, useValue: mockContactRepository },
        { provide: LocationRepository, useValue: mockLocationRepository },
        { provide: ProtocolRepository, useValue: mockProtocolRepository },
        { provide: ProjectRepository, useValue: mockProjectRepository },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkDuplicates', () => {
    it('should return duplicates found in search', async () => {
      const mockHits = [
        { id: '1', companyName: 'Acme Corp', _matchesPosition: {} },
      ];
      mockSearchService.search.mockResolvedValue({ hits: mockHits });

      const result = await service.checkDuplicates({ name: 'Acme' });

      expect(mockSearchService.search).toHaveBeenCalledWith(
        'customers',
        'Acme',
        expect.any(Object),
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should exclude specified ID', async () => {
      const mockHits = [
        { id: '1', companyName: 'Acme Corp', _matchesPosition: {} },
      ];
      mockSearchService.search.mockResolvedValue({ hits: mockHits });

      const result = await service.checkDuplicates({ name: 'Acme' }, '1');

      expect(result).toHaveLength(0);
    });
  });

  describe('delete', () => {
    const mockCustomer: Partial<Customer> = {
      _id: 'customer-123',
      type: 'customer',
      companyName: 'Test Company',
      createdBy: 'user-1',
      createdAt: '2024-01-01',
      modifiedBy: 'user-1',
      modifiedAt: '2024-01-01',
      version: 1,
    };

    const mockUser = { id: 'user-1', email: 'test@example.com' };

    it('should delete all contacts for the customer', async () => {
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockContactRepository.deleteByCustomer.mockResolvedValue(3);
      mockLocationRepository.deleteByCustomer.mockResolvedValue(2);
      mockProtocolRepository.unlinkFromCustomer.mockResolvedValue(5);
      mockProjectRepository.unlinkFromCustomer.mockResolvedValue(1);
      mockCustomerRepository.delete.mockResolvedValue(undefined);
      mockSearchService.deleteDocument.mockResolvedValue(undefined);

      await service.delete('customer-123', mockUser);

      expect(mockContactRepository.deleteByCustomer).toHaveBeenCalledWith(
        'customer-123',
        'user-1',
        'test@example.com',
      );
    });

    it('should remove customer from search index', async () => {
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockContactRepository.deleteByCustomer.mockResolvedValue(3);
      mockLocationRepository.deleteByCustomer.mockResolvedValue(2);
      mockProtocolRepository.unlinkFromCustomer.mockResolvedValue(5);
      mockProjectRepository.unlinkFromCustomer.mockResolvedValue(1);
      mockCustomerRepository.delete.mockResolvedValue(undefined);
      mockSearchService.deleteDocument.mockResolvedValue(undefined);

      await service.delete('customer-123', mockUser);

      expect(mockSearchService.deleteDocument).toHaveBeenCalledWith(
        'customers',
        'customer-123',
      );
    });

    it('should delete all locations for the customer', async () => {
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockContactRepository.deleteByCustomer.mockResolvedValue(3);
      mockLocationRepository.deleteByCustomer.mockResolvedValue(2);
      mockProtocolRepository.unlinkFromCustomer.mockResolvedValue(5);
      mockProjectRepository.unlinkFromCustomer.mockResolvedValue(1);
      mockCustomerRepository.delete.mockResolvedValue(undefined);

      await service.delete('customer-123', mockUser);

      expect(mockLocationRepository.deleteByCustomer).toHaveBeenCalledWith(
        'customer-123',
        'user-1',
        'test@example.com',
      );
    });

    it('should unlink all protocols from the customer', async () => {
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockContactRepository.deleteByCustomer.mockResolvedValue(3);
      mockLocationRepository.deleteByCustomer.mockResolvedValue(2);
      mockProtocolRepository.unlinkFromCustomer.mockResolvedValue(5);
      mockProjectRepository.unlinkFromCustomer.mockResolvedValue(1);
      mockCustomerRepository.delete.mockResolvedValue(undefined);

      await service.delete('customer-123', mockUser);

      expect(mockProtocolRepository.unlinkFromCustomer).toHaveBeenCalledWith(
        'customer-123',
        'user-1',
      );
    });

    it('should unlink all projects from the customer', async () => {
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockContactRepository.deleteByCustomer.mockResolvedValue(3);
      mockLocationRepository.deleteByCustomer.mockResolvedValue(2);
      mockProtocolRepository.unlinkFromCustomer.mockResolvedValue(5);
      mockProjectRepository.unlinkFromCustomer.mockResolvedValue(1);
      mockCustomerRepository.delete.mockResolvedValue(undefined);

      await service.delete('customer-123', mockUser);

      expect(mockProjectRepository.unlinkFromCustomer).toHaveBeenCalledWith(
        'customer-123',
        'user-1',
        'test@example.com',
      );
    });

    it('should delete the customer after cascading operations', async () => {
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockContactRepository.deleteByCustomer.mockResolvedValue(3);
      mockLocationRepository.deleteByCustomer.mockResolvedValue(2);
      mockProtocolRepository.unlinkFromCustomer.mockResolvedValue(5);
      mockProjectRepository.unlinkFromCustomer.mockResolvedValue(1);
      mockCustomerRepository.delete.mockResolvedValue(undefined);

      await service.delete('customer-123', mockUser);

      expect(mockCustomerRepository.delete).toHaveBeenCalledWith(
        'customer-123',
        'user-1',
        'test@example.com',
      );
    });

    it('should throw NotFoundException if customer does not exist', async () => {
      mockCustomerRepository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent', mockUser)).rejects.toThrow(
        NotFoundException,
      );

      // Verify no cascade operations were called
      expect(mockContactRepository.deleteByCustomer).not.toHaveBeenCalled();
      expect(mockLocationRepository.deleteByCustomer).not.toHaveBeenCalled();
      expect(mockProtocolRepository.unlinkFromCustomer).not.toHaveBeenCalled();
      expect(mockProjectRepository.unlinkFromCustomer).not.toHaveBeenCalled();
      expect(mockCustomerRepository.delete).not.toHaveBeenCalled();
    });

    it('should call cascading operations in correct order', async () => {
      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockContactRepository.deleteByCustomer.mockResolvedValue(0);
      mockLocationRepository.deleteByCustomer.mockResolvedValue(0);
      mockProtocolRepository.unlinkFromCustomer.mockResolvedValue(0);
      mockProjectRepository.unlinkFromCustomer.mockResolvedValue(0);
      mockCustomerRepository.delete.mockResolvedValue(undefined);

      const callOrder: string[] = [];
      mockContactRepository.deleteByCustomer.mockImplementation(() => {
        callOrder.push('contact');
        return Promise.resolve(0);
      });
      mockLocationRepository.deleteByCustomer.mockImplementation(() => {
        callOrder.push('location');
        return Promise.resolve(0);
      });
      mockProtocolRepository.unlinkFromCustomer.mockImplementation(() => {
        callOrder.push('protocol');
        return Promise.resolve(0);
      });
      mockProjectRepository.unlinkFromCustomer.mockImplementation(() => {
        callOrder.push('project');
        return Promise.resolve(0);
      });
      mockCustomerRepository.delete.mockImplementation(() => {
        callOrder.push('customer');
        return Promise.resolve(undefined);
      });

      await service.delete('customer-123', mockUser);

      expect(callOrder).toEqual([
        'contact',
        'location',
        'protocol',
        'project',
        'customer',
      ]);
    });
  });
});
