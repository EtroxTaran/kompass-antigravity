import { Test, TestingModule } from '@nestjs/testing';
import { OpportunityService } from './opportunity.service';
import { OpportunityRepository } from './opportunity.repository';
import { ProjectService } from '../project/project.service';
import { OfferService } from '../offer/offer.service';
import { ProjectMaterialService } from '../project-material/project-material.service';

describe('OpportunityService', () => {
    let service: OpportunityService;
    let repository: OpportunityRepository;
    let projectService: ProjectService;
    let offerService: OfferService;
    let projectMaterialService: ProjectMaterialService;

    const mockOpportunity = {
        _id: 'opp-1',
        title: 'Test Opp',
        customerId: 'cust-1',
        owner: 'user-1',
        expectedValue: 1000,
        description: 'Test Desc',
        stage: 'negotiation',
        probability: 50,
    };

    const mockProject = {
        _id: 'proj-1',
        name: 'Test Opp',
        status: 'planning'
    };

    const mockUser = { id: 'user-1', email: 'test@example.com' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OpportunityService,
                {
                    provide: OpportunityRepository,
                    useValue: {
                        findById: jest.fn().mockResolvedValue(mockOpportunity),
                        update: jest.fn().mockResolvedValue({ ...mockOpportunity, stage: 'closed_won', probability: 100 }),
                        delete: jest.fn(),
                        create: jest.fn(),
                        findByOwner: jest.fn(),
                        findAll: jest.fn(),
                    },
                },
                {
                    provide: ProjectService,
                    useValue: {
                        create: jest.fn().mockResolvedValue(mockProject),
                    },
                },
                {
                    provide: OfferService,
                    useValue: {
                        findById: jest.fn(),
                        findByOpportunity: jest.fn().mockResolvedValue({ data: [] }),
                    },
                },
                {
                    provide: ProjectMaterialService,
                    useValue: {
                        copyFromOffer: jest.fn(),
                    }
                }
            ],
        }).compile();

        service = module.get<OpportunityService>(OpportunityService);
        repository = module.get<OpportunityRepository>(OpportunityRepository);
        projectService = module.get<ProjectService>(ProjectService);
        offerService = module.get<OfferService>(OfferService);
        projectMaterialService = module.get<ProjectMaterialService>(ProjectMaterialService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('markAsWon', () => {
        it('should mark opportunity as won, create project, and return both', async () => {
            const dto = { startDate: '2023-01-01', projectManagerId: 'pm-1' };

            const result = await service.markAsWon('opp-1', dto, mockUser);

            // Update verification
            expect(repository.update).toHaveBeenCalled();

            // Project creation verification
            expect(projectService.create).toHaveBeenCalledWith(expect.objectContaining({
                name: mockOpportunity.title,
                customerId: mockOpportunity.customerId,
                projectManagerId: dto.projectManagerId,
                startDate: dto.startDate,
                opportunityId: 'opp-1'
            }), mockUser);

            expect(result.opportunity.stage).toBe('closed_won');
            expect(result.project).toBeDefined();
        });

        it('should copy materials if offer exists', async () => {
            const dto = { startDate: '2023-01-01', projectManagerId: 'pm-1', offerId: 'offer-1' };
            const mockOffer = { _id: 'offer-1' };

            (offerService.findById as jest.Mock).mockResolvedValue(mockOffer);

            await service.markAsWon('opp-1', dto, mockUser);

            expect(offerService.findById).toHaveBeenCalledWith('offer-1');
            expect(projectMaterialService.copyFromOffer).toHaveBeenCalledWith('offer-1', 'proj-1', mockUser);
        });
    });
});
