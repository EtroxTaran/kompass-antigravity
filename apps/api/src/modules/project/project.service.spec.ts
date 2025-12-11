import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectRepository } from './project.repository';
import { SearchService } from '../search/search.service';
import { Project } from './project.repository';

// Mock Repository
const mockProjectRepository = {
  findById: jest.fn(),
  update: jest.fn(),
  getNextProjectNumber: jest.fn(),
  create: jest.fn(),
};

// Mock Search Service
const mockSearchService = {
  addDocuments: jest.fn(),
};

describe('ProjectService Cost Tracking', () => {
  let service: ProjectService;
  let repository: typeof mockProjectRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: ProjectRepository, useValue: mockProjectRepository },
        { provide: SearchService, useValue: mockSearchService },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    repository = module.get(ProjectRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update labor cost and calculate totals', async () => {
    const mockProject: Partial<Project> = {
      _id: '1',
      budget: 1000,
      actualMaterialCost: 0,
      actualLaborCost: 0,
      actualSubcontractorCost: 0,
      actualExpenses: 0,
      actualTotalCost: 0,
      budgetStatus: 'OnTrack',
    };

    repository.findById.mockResolvedValue(mockProject);
    repository.update.mockImplementation((id, proj) => Promise.resolve(proj));

    // First update: 5 hours * 60 = 300
    await service.updateActualCost('1', 'labor', 300, 'user1');

    expect(repository.update).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        actualLaborCost: 300,
        actualTotalCost: 300,
        budgetStatus: 'OnTrack', // 300/1000 = 30%
      }),
      'user1',
    );
  });

  it('should update status to Warning when > 80%', async () => {
    const mockProject: Partial<Project> = {
      _id: '2',
      budget: 1000,
      actualMaterialCost: 500,
      actualTotalCost: 500,
    };
    repository.findById.mockResolvedValue(mockProject);
    repository.update.mockImplementation((id, proj) => Promise.resolve(proj));

    // Add 350 -> Total 850 (85%)
    await service.updateActualCost('2', 'material', 350, 'user1');

    expect(repository.update).toHaveBeenCalledWith(
      '2',
      expect.objectContaining({
        actualTotalCost: 850,
        budgetStatus: 'Warning',
      }),
      'user1',
    );
  });

  it('should update status to Exceeded when > 100%', async () => {
    const mockProject: Partial<Project> = {
      _id: '3',
      budget: 1000,
      actualTotalCost: 900,
      actualLaborCost: 900,
    };
    repository.findById.mockResolvedValue(mockProject);
    repository.update.mockImplementation((id, proj) => Promise.resolve(proj));

    // Add 200 -> Total 1100 (110%)
    await service.updateActualCost('3', 'labor', 200, 'user1');

    expect(repository.update).toHaveBeenCalledWith(
      '3',
      expect.objectContaining({
        actualTotalCost: 1100,
        budgetStatus: 'Exceeded',
      }),
      'user1',
    );
  });

  describe('findSimilar', () => {
    it('should calculate similarity based on tags, budget, and customer', async () => {
      const sourceProject = {
        _id: '1',
        customerId: 'cust1',
        tags: ['construction', 'large'],
        budget: 100000,
        name: 'Source Project',
      } as Project;

      const candidates = [
        // Candidate 1: Same Customer + 1 Tag Match (score: 2 + 5 = 7)
        { _id: '2', customerId: 'cust1', tags: ['construction'], budget: 50000, name: 'C1' },
        // Candidate 2: Different Customer + 2 Tags + Budget (score: 10 + 3 = 13)
        { _id: '3', customerId: 'cust2', tags: ['construction', 'large'], budget: 105000, name: 'C2' },
        // Candidate 3: No match
        { _id: '4', customerId: 'cust3', tags: ['other'], budget: 1000, name: 'C3' },
      ] as Project[];

      repository.findById.mockResolvedValue(sourceProject);
      (repository as any).findByCustomer = jest.fn().mockResolvedValue({ data: [] }); // Not used for direct logic anymore but needed for execution
      (repository as any).findAll = jest.fn().mockResolvedValue({ data: candidates });

      const results = await service.findSimilar('1');

      expect(results).toHaveLength(2);
      expect(results[0]._id).toBe('3'); // Score 13
      expect(results[1]._id).toBe('2'); // Score 7
    });

    it('should throw NotFoundException if source project not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.findSimilar('999')).rejects.toThrow(NotFoundException);
    });
  });
});
