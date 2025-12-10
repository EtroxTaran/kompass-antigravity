import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { InventoryMovementRepository } from './inventory.repository';
import { MaterialRepository } from '../material/material.repository';
import { MailService } from '../mail/mail.service';
import { NotFoundException } from '@nestjs/common';

describe('InventoryService', () => {
  let service: InventoryService;
  let movementRepo: Partial<InventoryMovementRepository>;
  let materialRepo: Partial<MaterialRepository>;
  let mailService: Partial<MailService>;

  const mockUser = 'user-1';

  beforeEach(async () => {
    movementRepo = {
      create: jest.fn(),
      findByMaterial: jest.fn(),
    };

    materialRepo = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    mailService = {
      sendMail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: InventoryMovementRepository, useValue: movementRepo },
        { provide: MaterialRepository, useValue: materialRepo },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recordMovement', () => {
    const dto = {
      materialId: 'mat-1',
      quantity: -5,
      projectId: 'proj-1',
      date: '2025-01-01',
      type: 'project_usage' as const,
      movementType: 'OUT' as any,
      unit: 'pc' as any,
      movementDate: '2025-01-01',
      reason: 'Project Usage',
    };

    it('should record movement and update stock', async () => {
      (materialRepo.findById as jest.Mock).mockResolvedValue({
        _id: 'mat-1',
        currentStock: 10,
        unit: 'pc' as any,
        minimumStock: 2,
      });
      (movementRepo.create as jest.Mock).mockResolvedValue({
        _id: 'mov-1',
        ...dto,
      });

      await service.recordMovement(dto, mockUser);

      expect(materialRepo.update).toHaveBeenCalledWith(
        'mat-1',
        expect.objectContaining({ currentStock: 5 }),
        mockUser,
      );
      expect(mailService.sendMail).not.toHaveBeenCalled();
    });

    it('should alert if stock drops below minimum', async () => {
      (materialRepo.findById as jest.Mock).mockResolvedValue({
        _id: 'mat-1',
        currentStock: 6,
        unit: 'pc' as any,
        minimumStock: 5,
        name: 'Test Material',
        itemNumber: '123',
      });
      (movementRepo.create as jest.Mock).mockResolvedValue({
        _id: 'mov-1',
        ...dto,
      });

      // Drop from 6 to 1 (quantity -5)
      await service.recordMovement(dto, mockUser);

      expect(materialRepo.update).toHaveBeenCalledWith(
        'mat-1',
        expect.objectContaining({ currentStock: 1 }),
        mockUser,
      );
      expect(mailService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('Low Stock Alert'),
        }),
      );
    });

    it('should NOT alert if already below minimum', async () => {
      (materialRepo.findById as jest.Mock).mockResolvedValue({
        _id: 'mat-1',
        currentStock: 4, // Already below 5
        unit: 'pc' as any,
        minimumStock: 5,
      });
      (movementRepo.create as jest.Mock).mockResolvedValue({
        _id: 'mov-1',
        ...dto,
      });

      await service.recordMovement(dto, mockUser);

      expect(mailService.sendMail).not.toHaveBeenCalled();
    });
  });
});
