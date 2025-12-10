import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSubcontractorService } from './project-subcontractor.service';
import { ProjectSubcontractorRepository } from './project-subcontractor.repository';
import { ProjectService } from '../project/project.service';
import { SupplierService } from '../supplier/supplier.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BudgetStatus, SubcontractorStatus } from '@kompass/shared';

describe('ProjectSubcontractorService', () => {
  let service: ProjectSubcontractorService;
  let repository: Partial<ProjectSubcontractorRepository>;
  let projectService: Partial<ProjectService>;
  let supplierService: Partial<SupplierService>;

  const mockUser = { id: 'user-1', email: 'test@example.com' };

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findByProject: jest.fn(),
    };

    projectService = {
      findById: jest.fn(),
    };

    supplierService = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectSubcontractorService,
        { provide: ProjectSubcontractorRepository, useValue: repository },
        { provide: ProjectService, useValue: projectService },
        { provide: SupplierService, useValue: supplierService },
      ],
    }).compile();

    service = module.get<ProjectSubcontractorService>(
      ProjectSubcontractorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('assign', () => {
    const dto = {
      projectId: 'proj-1',
      supplierId: 'supp-1',
      workPackage: 'Electrical',
      serviceCategory: 'Installation' as any,
      description: 'Wiring',
      plannedStartDate: '2025-01-01',
      plannedEndDate: '2025-01-10',
      estimatedCost: 1000,
    };

    it('should assign successfully within budget', async () => {
      (supplierService.findById as jest.Mock).mockResolvedValue({
        _id: 'supp-1',
        status: 'Active',
        activeProjectCount: 0,
      });
      (projectService.findById as jest.Mock).mockResolvedValue({
        _id: 'proj-1',
        budget: 5000,
        actualTotalCost: 0,
      });
      (repository.create as jest.Mock).mockResolvedValue({
        _id: 'sub-1',
        ...dto,
        status: 'Planned',
      });

      await service.assign(dto, mockUser);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          budgetStatus: BudgetStatus.OnTrack,
        }),
        mockUser.id,
        mockUser.email,
      );
    });

    it('should assign with warning if over budget', async () => {
      (supplierService.findById as jest.Mock).mockResolvedValue({
        _id: 'supp-1',
        status: 'Active',
      });
      (projectService.findById as jest.Mock).mockResolvedValue({
        _id: 'proj-1',
        budget: 500,
        actualTotalCost: 0,
      });
      (repository.create as jest.Mock).mockResolvedValue({
        _id: 'sub-1',
        ...dto,
      });

      await service.assign(dto, mockUser);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          budgetStatus: BudgetStatus.Warning,
        }),
        mockUser.id,
        mockUser.email,
      );
    });

    it('should fail if supplier not active', async () => {
      (supplierService.findById as jest.Mock).mockResolvedValue({
        _id: 'supp-1',
        status: 'Blacklisted',
      });

      await expect(service.assign(dto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
