import { Test, TestingModule } from '@nestjs/testing';
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
});
