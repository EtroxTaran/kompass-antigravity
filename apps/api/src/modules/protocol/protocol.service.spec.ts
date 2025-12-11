import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolService } from './protocol.service';
import { ProtocolRepository } from './protocol.repository';
import { NotFoundException } from '@nestjs/common';
import { Protocol } from '@kompass/shared';

const mockProtocol: Partial<Protocol> = {
  _id: 'protocol-1',
  type: 'protocol',
  title: 'Test Protocol',
  date: '2025-12-11',
  customerId: 'customer-1',
  projectId: 'project-1',
  summary: 'Test summary',
  participants: ['User 1'],
  createdBy: 'user-1',
  createdAt: '2025-12-11T10:00:00Z',
  modifiedBy: 'user-1',
  modifiedAt: '2025-12-11T10:00:00Z',
  version: 1,
};

const mockProtocol2: Partial<Protocol> = {
  ...mockProtocol,
  _id: 'protocol-2',
  customerId: 'customer-2',
};

const mockProtocolRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findBySelector: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ProtocolService', () => {
  let service: ProtocolService;
  let repository: typeof mockProtocolRepository;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProtocolService,
        { provide: ProtocolRepository, useValue: mockProtocolRepository },
      ],
    }).compile();

    service = module.get<ProtocolService>(ProtocolService);
    repository = mockProtocolRepository;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all protocols when no params provided', async () => {
      const mockPaginatedResult = {
        data: [mockProtocol, mockProtocol2],
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
      repository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll();

      expect(result).toEqual([mockProtocol, mockProtocol2]);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(repository.findBySelector).not.toHaveBeenCalled();
    });

    it('should filter by customerId when provided', async () => {
      const mockPaginatedResult = {
        data: [mockProtocol],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
      repository.findBySelector.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll({ customerId: 'customer-1' });

      expect(result).toEqual([mockProtocol]);
      expect(repository.findBySelector).toHaveBeenCalledWith({
        customerId: 'customer-1',
      });
      expect(repository.findAll).not.toHaveBeenCalled();
    });

    it('should filter by projectId when provided', async () => {
      const mockPaginatedResult = {
        data: [mockProtocol],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
      repository.findBySelector.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll({ projectId: 'project-1' });

      expect(result).toEqual([mockProtocol]);
      expect(repository.findBySelector).toHaveBeenCalledWith({
        projectId: 'project-1',
      });
      expect(repository.findAll).not.toHaveBeenCalled();
    });

    it('should filter by both customerId and projectId when provided', async () => {
      const mockPaginatedResult = {
        data: [mockProtocol],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
      repository.findBySelector.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll({
        customerId: 'customer-1',
        projectId: 'project-1',
      });

      expect(result).toEqual([mockProtocol]);
      expect(repository.findBySelector).toHaveBeenCalledWith({
        customerId: 'customer-1',
        projectId: 'project-1',
      });
      expect(repository.findAll).not.toHaveBeenCalled();
    });

    it('should return all protocols when params are undefined values', async () => {
      const mockPaginatedResult = {
        data: [mockProtocol, mockProtocol2],
        total: 2,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
      repository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll({
        customerId: undefined,
        projectId: undefined,
      });

      expect(result).toEqual([mockProtocol, mockProtocol2]);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(repository.findBySelector).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a protocol by id', async () => {
      repository.findById.mockResolvedValue(mockProtocol);

      const result = await service.findOne('protocol-1');

      expect(result).toEqual(mockProtocol);
      expect(repository.findById).toHaveBeenCalledWith('protocol-1');
    });

    it('should throw NotFoundException if protocol not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new protocol', async () => {
      const createDto = {
        title: 'New Protocol',
        date: '2025-12-11',
        customerId: 'customer-1',
        summary: 'New summary',
        participants: ['User 1'],
      };
      const createdProtocol = { ...mockProtocol, ...createDto };
      repository.create.mockResolvedValue(createdProtocol);

      const result = await service.create(createDto, 'user-1');

      expect(result).toEqual(createdProtocol);
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a protocol', async () => {
      const updateDto = { title: 'Updated Title' };
      const updatedProtocol = { ...mockProtocol, ...updateDto };
      repository.update.mockResolvedValue(updatedProtocol);

      const result = await service.update('protocol-1', updateDto, 'user-1');

      expect(result).toEqual(updatedProtocol);
      expect(repository.update).toHaveBeenCalledWith(
        'protocol-1',
        updateDto,
        'user-1',
      );
    });
  });

  describe('delete', () => {
    it('should delete a protocol', async () => {
      repository.delete.mockResolvedValue(undefined);

      await service.delete('protocol-1', 'user-1');

      expect(repository.delete).toHaveBeenCalledWith('protocol-1', 'user-1');
    });
  });
});
