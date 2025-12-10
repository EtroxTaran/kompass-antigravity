import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { InventoryMovementRepository } from './inventory.repository';
import { MaterialRepository } from '../material/material.repository';
import { CreateInventoryMovementDto } from './inventory.dto';
import { MovementType, InventoryUnitOfMeasure } from '@kompass/shared';

const mockInventoryRepo = {
    create: jest.fn(),
    findByMaterial: jest.fn(),
};

const mockMaterialRepo = {
    findById: jest.fn(),
    update: jest.fn(),
};

describe('InventoryService', () => {
    let service: InventoryService;
    let inventoryRepo: any;
    let materialRepo: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InventoryService,
                { provide: InventoryMovementRepository, useValue: mockInventoryRepo },
                { provide: MaterialRepository, useValue: mockMaterialRepo },
            ],
        }).compile();

        service = module.get<InventoryService>(InventoryService);
        inventoryRepo = module.get<InventoryMovementRepository>(InventoryMovementRepository);
        materialRepo = module.get<MaterialRepository>(MaterialRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('recordMovement', () => {
        it('should create a movement and update material stock (incoming)', async () => {
            const dto: CreateInventoryMovementDto = {
                materialId: 'mat-1',
                movementType: MovementType.PURCHASE_RECEIPT,
                quantity: 10,
                unit: InventoryUnitOfMeasure.PIECE,
                movementDate: new Date().toISOString(),
                reason: 'Test Receipt',
            };

            const userId = 'user-1';
            const mockMaterial = {
                _id: 'mat-1',
                currentStock: 5,
                timesUsed: 0,
            };

            mockMaterialRepo.findById.mockResolvedValue(mockMaterial);
            mockInventoryRepo.create.mockResolvedValue({ ...dto, _id: 'inv-1' });
            mockMaterialRepo.update.mockResolvedValue({ ...mockMaterial, currentStock: 15 });

            const result = await service.recordMovement(dto, userId);

            expect(materialRepo.findById).toHaveBeenCalledWith('mat-1');
            expect(inventoryRepo.create).toHaveBeenCalledWith(expect.objectContaining({
                materialId: 'mat-1',
                quantity: 10,
            }), userId);
            // It should update stock: 5 + 10 = 15
            expect(materialRepo.update).toHaveBeenCalledWith('mat-1', expect.objectContaining({
                currentStock: 15
            }), userId);
            expect(result).toBeDefined();
        });

        it('should create a movement and update material stock and stats (outgoing)', async () => {
            const dto: CreateInventoryMovementDto = {
                materialId: 'mat-1',
                movementType: MovementType.PROJECT_ALLOCATION,
                quantity: -5,
                unit: InventoryUnitOfMeasure.PIECE,
                movementDate: new Date().toISOString(),
                reason: 'Project Use',
            };

            const userId = 'user-1';
            const mockMaterial = {
                _id: 'mat-1',
                currentStock: 20,
                timesUsed: 10,
            };

            mockMaterialRepo.findById.mockResolvedValue(mockMaterial);
            mockInventoryRepo.create.mockResolvedValue({ ...dto, _id: 'inv-2' });
            mockMaterialRepo.update.mockResolvedValue({ ...mockMaterial, currentStock: 15 });

            await service.recordMovement(dto, userId);

            // It should update stock: 20 + (-5) = 15
            // And update stats because quantity < 0
            expect(materialRepo.update).toHaveBeenCalledWith('mat-1', expect.objectContaining({
                currentStock: 15,
                timesUsed: 11,
            }), userId);
        });

        it('should throw error if material not found', async () => {
            mockMaterialRepo.findById.mockResolvedValue(null);
            const dto: CreateInventoryMovementDto = {
                materialId: 'mat-unknown',
                movementType: MovementType.PURCHASE_RECEIPT,
                quantity: 1,
                unit: InventoryUnitOfMeasure.PIECE,
                movementDate: new Date().toISOString(),
                reason: 'Fail',
            };

            await expect(service.recordMovement(dto, 'u1')).rejects.toThrow('Material not found');
        });
    });

    describe('getHistory', () => {
        it('should return movement history', async () => {
            const mockMovements = [{ _id: '1' }, { _id: '2' }];
            mockInventoryRepo.findByMaterial.mockResolvedValue(mockMovements);

            const result = await service.getHistory('mat-1');
            expect(result).toEqual(mockMovements);
            expect(inventoryRepo.findByMaterial).toHaveBeenCalledWith('mat-1');
        });
    });
});
