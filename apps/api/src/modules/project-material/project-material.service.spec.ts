import { Test, TestingModule } from '@nestjs/testing';
import { ProjectMaterialService } from './project-material.service';
import { ProjectMaterialRepository } from './project-material.repository';
import { OfferService } from '../offer/offer.service';

describe('ProjectMaterialService', () => {
    let service: ProjectMaterialService;
    let repository: ProjectMaterialRepository;
    let offerService: OfferService;

    const mockUser = { id: 'user-1', email: 'test@example.com' };
    const mockOffer = {
        _id: 'offer-1',
        materials: [
            { materialId: 'mat-1', description: 'Material 1', quantity: 10, unit: 'pcs' }
        ]
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectMaterialService,
                {
                    provide: ProjectMaterialRepository,
                    useValue: {
                        create: jest.fn().mockImplementation((data) => Promise.resolve({ ...data, _id: 'new-id' })),
                        findByProject: jest.fn(),
                    },
                },
                {
                    provide: OfferService,
                    useValue: {
                        findById: jest.fn().mockResolvedValue(mockOffer),
                    },
                },
            ],
        }).compile();

        service = module.get<ProjectMaterialService>(ProjectMaterialService);
        repository = module.get<ProjectMaterialRepository>(ProjectMaterialRepository);
        offerService = module.get<OfferService>(OfferService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('copyFromOffer', () => {
        it('should copy materials from offer to project', async () => {
            const result = await service.copyFromOffer('offer-1', 'proj-1', mockUser);

            expect(offerService.findById).toHaveBeenCalledWith('offer-1');
            expect(repository.create).toHaveBeenCalledTimes(1);
            expect(repository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    projectId: 'proj-1',
                    sourceOfferId: 'offer-1',
                    materialId: 'mat-1',
                    quantity: 10
                }),
                mockUser.id,
                mockUser.email
            );
            expect(result).toHaveLength(1);
        });

        it('should return empty array if no materials in offer', async () => {
            (offerService.findById as jest.Mock).mockResolvedValue({ ...mockOffer, materials: [] });
            const result = await service.copyFromOffer('offer-1', 'proj-1', mockUser);
            expect(result).toEqual([]);
            expect(repository.create).not.toHaveBeenCalled();
        });
    });
});
