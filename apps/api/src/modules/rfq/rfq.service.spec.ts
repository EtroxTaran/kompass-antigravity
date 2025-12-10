
import { Test, TestingModule } from '@nestjs/testing';
import { RfqService } from './rfq.service';
import { RfqRepository } from './rfq.repository';
import { PdfService } from '../pdf/pdf.service';
import { MailService } from '../mail/mail.service';
import { SupplierService } from '../supplier/supplier.service';
import { ContractService } from '../contract/contract.service';
import { RequestForQuote, RfqStatus, QuoteStatus, SupplierQuote } from '@kompass/shared';

describe('RfqService', () => {
    let service: RfqService;
    let repository: RfqRepository;
    let pdfService: PdfService;
    let mailService: MailService;
    let supplierService: SupplierService;
    let contractService: ContractService;

    const mockRepository = {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        generateRfqNumber: jest.fn().mockResolvedValue('RFQ-001'),
    };

    const mockPdfService = {
        generatePdf: jest.fn(),
    };

    const mockMailService = {
        sendMail: jest.fn(),
    };

    const mockSupplierService = {
        findById: jest.fn(),
    };

    const mockContractService = {
        createFromOffer: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RfqService,
                { provide: RfqRepository, useValue: mockRepository },
                { provide: PdfService, useValue: mockPdfService },
                { provide: MailService, useValue: mockMailService },
                { provide: SupplierService, useValue: mockSupplierService },
                { provide: ContractService, useValue: mockContractService },
            ],
        }).compile();

        service = module.get<RfqService>(RfqService);
        repository = module.get<RfqRepository>(RfqRepository);
        pdfService = module.get<PdfService>(PdfService);
        mailService = module.get<MailService>(MailService);
        supplierService = module.get<SupplierService>(SupplierService);
        contractService = module.get<ContractService>(ContractService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new RFQ', async () => {
            const dto = {
                title: 'Test RFQ',
                description: 'Test Description',
                specifications: 'Specs',
                quantity: 10,
                unit: 'pcs',
                responseDeadline: '2023-12-31',
                invitedSuppliers: ['sup1'],
                projectId: 'proj1',
            };

            const createdRfq = { ...dto, _id: 'rfq1', status: RfqStatus.DRAFT, quotes: [], rfqNumber: 'RFQ-001' };
            mockRepository.create.mockResolvedValue(createdRfq);

            const result = await service.create(dto, { id: 'user1' } as any);
            expect(result).toEqual(createdRfq);
            expect(repository.create).toHaveBeenCalledWith(expect.any(Object), 'user1');
        });
    });

    describe('send', () => {
        it('should send RFQ to suppliers', async () => {
            const rfq = {
                _id: 'rfq1',
                status: RfqStatus.DRAFT,
                invitedSuppliers: ['sup1'],
                quotes: [],
                title: 'Test RFQ',
                rfqNumber: 'RFQ-001',
                responseDeadline: '2023-12-31'
            } as unknown as RequestForQuote;

            const supplier = { _id: 'sup1', email: 'sup@example.com', companyName: 'Sup Co' };

            mockRepository.findById.mockResolvedValue(rfq);
            mockSupplierService.findById.mockResolvedValue(supplier);
            mockPdfService.generatePdf.mockResolvedValue(Buffer.from('pdf'));
            mockMailService.sendMail.mockResolvedValue(undefined);
            mockRepository.update.mockResolvedValue({ ...rfq, status: RfqStatus.SENT });

            const result = await service.send('rfq1');

            expect(result.status).toBe(RfqStatus.SENT);
            expect(pdfService.generatePdf).toHaveBeenCalled();
            expect(mailService.sendMail).toHaveBeenCalledWith(
                expect.objectContaining({ to: 'sup@example.com', attachments: expect.any(Array) })
            );
        });
    });

    describe('recordQuote', () => {
        it('should record a quote', async () => {
            const rfq = { _id: 'rfq1', quotes: [], status: RfqStatus.SENT } as unknown as RequestForQuote;
            mockRepository.findById.mockResolvedValue(rfq);
            const updatedRfq = { ...rfq, status: RfqStatus.QUOTES_RECEIVED, quotes: [{ id: 'q1', quotedPrice: 100 }] };
            mockRepository.update.mockResolvedValue(updatedRfq);

            const dto = { supplierId: 'sup1', quotedPrice: 100, deliveryDays: 5, validUntil: '2024-01-01' };
            const result = await service.recordQuote('rfq1', dto);

            expect(result.status).toBe(RfqStatus.QUOTES_RECEIVED);
            expect(repository.update).toHaveBeenCalled();
        });
    });

    describe('awardQuote', () => {
        it('should award a quote and create contract', async () => {
            const quote1 = { id: 'q1', supplierId: 'sup1', quotedPrice: 100, status: QuoteStatus.RECEIVED } as SupplierQuote;
            const quote2 = { id: 'q2', supplierId: 'sup2', quotedPrice: 150, status: QuoteStatus.RECEIVED } as SupplierQuote;
            const rfq = { _id: 'rfq1', quotes: [quote1, quote2], status: RfqStatus.QUOTES_RECEIVED } as unknown as RequestForQuote;

            mockRepository.findById.mockResolvedValue(rfq);
            mockRepository.update.mockImplementation((id, data) => Promise.resolve({ ...rfq, ...data }));
            mockContractService.createFromOffer.mockResolvedValue({ _id: 'contract1' });

            const result = await service.awardQuote('rfq1', 'q1', { id: 'user1', email: 'u@e.com' } as any);

            expect(result.status).toBe(RfqStatus.AWARDED);
            // expect(result.awardedQuoteId).toBe('q1'); 

            // Verify update call
            expect(repository.update).toHaveBeenCalledWith(
                'rfq1',
                expect.objectContaining({ status: RfqStatus.AWARDED, awardedQuoteId: 'q1' }),
                'user1',
                'u@e.com'
            );
        });
    });

});
