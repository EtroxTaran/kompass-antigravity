import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseService } from './expense.service';
import { ExpenseRepository } from './expense.repository';
import { MileageRepository } from './mileage.repository';
import { ProjectService } from '../project/project.service';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '@kompass/shared';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let expenseRepository: Partial<Record<keyof ExpenseRepository, jest.Mock>>;
  let mileageRepository: Partial<Record<keyof MileageRepository, jest.Mock>>;
  let projectService: Partial<Record<keyof ProjectService, jest.Mock>>;

  const mockExpense = {
    _id: 'exp123',
    amount: 200,
    projectId: 'proj123',
    status: 'submitted',
    userId: 'user123',
  };

  beforeEach(async () => {
    expenseRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    };
    mileageRepository = {
      create: jest.fn(),
    };
    projectService = {
      updateActualCost: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        { provide: ExpenseRepository, useValue: expenseRepository },
        { provide: MileageRepository, useValue: mileageRepository },
        { provide: ProjectService, useValue: projectService },
      ],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an expense if valid', async () => {
      expenseRepository.create.mockResolvedValue(mockExpense);
      const dto = { amount: 100, description: 'Lunch' };
      const result = await service.create(dto as any, 'user1');
      expect(result).toEqual(mockExpense);
      expect(expenseRepository.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if amount > 150 and no receipt', async () => {
      const dto = {
        amount: 160,
        description: 'Expensive Lunch',
        receiptUrl: undefined,
      };
      await expect(service.create(dto as any, 'user1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create expense > 150 if receipt provided', async () => {
      expenseRepository.create.mockResolvedValue(mockExpense);
      const dto = {
        amount: 160,
        description: 'Expensive Lunch',
        receiptUrl: 'http://url',
      };
      const result = await service.create(dto as any, 'user1');
      expect(result).toEqual(mockExpense);
    });
  });

  describe('approve', () => {
    it('should approve expense and update project cost', async () => {
      expenseRepository.findById.mockResolvedValue(mockExpense);
      expenseRepository.update.mockResolvedValue({
        ...mockExpense,
        status: 'approved',
      });

      const result = await service.approve('exp123', 'admin');

      expect(expenseRepository.update).toHaveBeenCalledWith(
        'exp123',
        {
          status: 'approved',
          approvedBy: 'admin',
          approvedAt: expect.any(String),
        },
        'admin',
      );
      expect(projectService.updateActualCost).toHaveBeenCalledWith(
        'proj123',
        'expenses',
        200,
        'admin',
      );
      expect(result.status).toBe('approved');
    });

    it('should throw NotFoundException if expense not found', async () => {
      expenseRepository.findById.mockResolvedValue(null);
      await expect(service.approve('badId', 'admin')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('reject', () => {
    it('should reject expense', async () => {
      expenseRepository.findById.mockResolvedValue(mockExpense);
      expenseRepository.update.mockResolvedValue({
        ...mockExpense,
        status: 'rejected',
      });

      const result = await service.reject('exp123', 'Too vague', 'admin');

      expect(expenseRepository.update).toHaveBeenCalledWith(
        'exp123',
        {
          status: 'rejected',
          rejectionReason: 'Too vague',
          rejectedBy: 'admin',
          rejectedAt: expect.any(String),
        },
        'admin',
      );
      expect(result.status).toBe('rejected');
    });
  });
});
