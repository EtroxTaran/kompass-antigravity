import { Test, TestingModule } from '@nestjs/testing';
import { ProjectMaterialService } from './project-material.service';
import { ProjectMaterialRepository } from './project-material.repository';
import { OfferService } from '../offer/offer.service';

const mockRepository = {
    create: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    findByProject: jest.fn(),
    delete: jest.fn(),
};

const mockOfferService = {
    findById: jest.fn(),
};

describe('ProjectMaterialService', () => {
    let service: ProjectMaterialService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectMaterialService,
                { provide: ProjectMaterialRepository, useValue: mockRepository },
                { provide: OfferService, useValue: mockOfferService },
            ],
        }).compile();

        service = module.get<ProjectMaterialService>(ProjectMaterialService);
    });

    it('should create material requirement with calculated cost', async () => {
        mockRepository.create.mockResolvedValue({ id: '1' });

        await service.create({
            projectId: 'p1',
            quantity: 10,
            estimatedUnitPrice: 5,
            description: 'Item 1',
            unit: 'pc'
        }, { id: 'user1' });

        expect(mockRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                estimatedTotalCost: 50,
                status: 'planned'
            }),
            'user1',
            undefined
        );
    });

    it('should update cost when quantity changes', async () => {
        mockRepository.findById.mockResolvedValue({
            id: '1',
            quantity: 10,
            estimatedUnitPrice: 5,
            estimatedTotalCost: 50
        });
        mockRepository.update.mockResolvedValue({ id: '1' });

        await service.update('1', { quantity: 20 }, { id: 'user1' });

        expect(mockRepository.update).toHaveBeenCalledWith(
            '1',
            expect.objectContaining({
                estimatedTotalCost: 100 // 20 * 5
            }),
            'user1',
            undefined
        );
    });
});
