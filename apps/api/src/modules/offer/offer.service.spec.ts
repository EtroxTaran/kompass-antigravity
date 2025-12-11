import { Test, TestingModule } from '@nestjs/testing';
import { OfferService } from './offer.service';
import { OfferRepository } from './offer.repository';
import { PdfService } from '../pdf/pdf.service';
import { MailService } from '../mail/mail.service';
import { SearchService } from '../search/search.service';
import { ProjectService } from '../project/project.service';

// Actually checking offer.service.ts constructor: private readonly offerRepository: OfferRepository
// So we should mock OfferRepository directly.

const mockOfferRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByCustomer: jest.fn(),
    findByOpportunity: jest.fn(),
};

const mockProjectService = {
    findBySimilarity: jest.fn(),
};

const mockPdfService = {
    generatePdf: jest.fn(),
};

const mockMailService = {
    sendMail: jest.fn(),
};

const mockSearchService = {
    addDocuments: jest.fn(),
    search: jest.fn(),
};

describe('OfferService', () => {
    let service: OfferService;
    let projectService: typeof mockProjectService;
    let offerRepository: typeof mockOfferRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OfferService,
                { provide: OfferRepository, useValue: mockOfferRepository },
                { provide: ProjectService, useValue: mockProjectService },
                { provide: PdfService, useValue: mockPdfService },
                { provide: MailService, useValue: mockMailService },
                { provide: SearchService, useValue: mockSearchService },
            ],
        }).compile();

        service = module.get<OfferService>(OfferService);
        projectService = module.get(ProjectService);
        offerRepository = module.get(OfferRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getRecommendations', () => {
        it('should return empty list if no similar projects found', async () => {
            projectService.findBySimilarity.mockResolvedValue([]);

            const result = await service.getRecommendations({ tags: ['test'] });

            expect(result).toEqual([]);
            expect(projectService.findBySimilarity).toHaveBeenCalledWith({
                tags: ['test'],
                customerId: undefined,
                budget: undefined,
            });
        });

        it('should return recommended offers from similar projects', async () => {
            const similarProjects = [
                { _id: 'p1', name: 'Project 1', offerId: 'o1', tags: ['tag1'] },
                { _id: 'p2', name: 'Project 2', offerId: 'o2', tags: ['tag2'] },
            ];
            const offers = [
                { _id: 'o1', totalEur: 1000, lineItems: [{}, {}], status: 'accepted' },
                { _id: 'o2', totalEur: 2000, lineItems: [{}], status: 'sent' },
            ];

            projectService.findBySimilarity.mockResolvedValue(similarProjects);
            offerRepository.findById.mockImplementation((id) => {
                return Promise.resolve(offers.find((o) => o._id === id));
            });

            const result = await service.getRecommendations({ tags: ['tag1'] });

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('o1');
            expect(result[0].description).toContain('Project 1');
            expect(result[0].lineItemCount).toBe(2);
            expect(result[1].id).toBe('o2');
        });

        it('should filter out projects with no associated offers or invalid offer IDs', async () => {
            const similarProjects = [
                { _id: 'p1', name: 'Project 1', offerId: 'o1' },
                { _id: 'p2', name: 'Project 2', offerId: null }, // No offer
                { _id: 'p3', name: 'Project 3', offerId: 'o3' }, // Offer not found
            ];
            const offers = [
                { _id: 'o1', totalEur: 1000, lineItems: [] },
            ];

            projectService.findBySimilarity.mockResolvedValue(similarProjects);
            offerRepository.findById.mockImplementation((id) => {
                if (id === 'o1') return Promise.resolve(offers[0]);
                return Promise.resolve(null);
            });

            const result = await service.getRecommendations({ tags: ['tag1'] });

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('o1');
        });
    });
});
