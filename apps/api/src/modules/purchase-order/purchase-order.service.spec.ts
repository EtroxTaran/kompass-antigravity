
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderRepository } from './purchase-order.repository';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../pdf/pdf.service';
import { SearchService } from '../search/search.service';
import { SupplierService } from '../supplier/supplier.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('PurchaseOrderService', () => {
    let service: PurchaseOrderService;
    let repository: PurchaseOrderRepository;

    const mockRepository = {
        create: jest.fn(),
        update: jest.fn(),
        findById: jest.fn(),
        findBySelector: jest.fn(),
        findAll: jest.fn(),
        delete: jest.fn(),
    };

    const mockSupplierService = {
        findById: jest.fn(),
    };

    const mockMailService = {
        sendMail: jest.fn(),
    };

    const mockPdfService = {
        generatePdf: jest.fn(),
    };

    const mockSearchService = {
        addDocuments: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PurchaseOrderService,
                { provide: PurchaseOrderRepository, useValue: mockRepository },
                { provide: SupplierService, useValue: mockSupplierService },
                { provide: MailService, useValue: mockMailService },
                { provide: PdfService, useValue: mockPdfService },
                { provide: SearchService, useValue: mockSearchService },
            ],
        }).compile();

        service = module.get<PurchaseOrderService>(PurchaseOrderService);
        repository = module.get<PurchaseOrderRepository>(PurchaseOrderRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should auto-approve order <= 1000', async () => {
            mockSupplierService.findById.mockResolvedValue({ status: 'Active' });
            mockRepository.create.mockImplementation((dto) => Promise.resolve({ ...dto, _id: '1' }));

            const dto = {
                supplierId: 'sup1',
                items: [],
                totalAmount: 500,
                currency: 'EUR',
                status: 'draft',
                date: new Date().toISOString(),
                orderNumber: 'PO-1'
            };

            await service.create(dto as any, 'user1');
            expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                approvalStatus: 'approved',
                approvedBy: 'SYSTEM',
                status: 'ordered'
            }), 'user1');
        });

        it('should NOT auto-approve order > 1000', async () => {
            mockSupplierService.findById.mockResolvedValue({ status: 'Active' });
            mockRepository.create.mockImplementation((dto) => Promise.resolve({ ...dto, _id: '2' }));

            const dto = {
                supplierId: 'sup1',
                items: [],
                totalAmount: 1500,
                currency: 'EUR',
                status: 'draft',
                date: new Date().toISOString(),
                orderNumber: 'PO-2'
            };

            await service.create(dto as any, 'user1');
            expect(mockRepository.create).toHaveBeenCalledWith(expect.not.objectContaining({
                approvalStatus: 'approved'
            }), 'user1');
        });
    });

    describe('submitForApproval', () => {
        it('should return error if not draft', async () => {
            mockRepository.findById.mockResolvedValue({ status: 'ordered' });
            await expect(service.submitForApproval('1', 'user1')).rejects.toThrow(BadRequestException);
        });

        it('should set status to pending for > 1000', async () => {
            mockRepository.findById.mockResolvedValue({ status: 'draft', totalAmount: 2000 });
            mockRepository.update.mockResolvedValue({});

            await service.submitForApproval('1', 'user1');
            expect(mockRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({
                approvalStatus: 'pending'
            }), 'user1');
        });
    });

    describe('approve', () => {
        it('should approve > 1000 if BUCH role present', async () => {
            mockRepository.findById.mockResolvedValue({ status: 'draft', totalAmount: 5000, approvalStatus: 'pending' });
            mockRepository.update.mockResolvedValue({});

            await service.approve('1', 'buch_user', ['BUCH']);
            expect(mockRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({
                approvalStatus: 'approved',
                approvedBy: 'buch_user'
            }), 'buch_user');
        });

        it('should fail > 1000 if NO BUCH/GF role', async () => {
            mockRepository.findById.mockResolvedValue({ status: 'draft', totalAmount: 5000, approvalStatus: 'pending' });

            await expect(service.approve('1', 'user', ['USER'])).rejects.toThrow(ForbiddenException);
        });

        it('should fail > 10000 if BUCH role', async () => {
            mockRepository.findById.mockResolvedValue({ status: 'draft', totalAmount: 15000, approvalStatus: 'pending' });

            await expect(service.approve('1', 'buch', ['BUCH'])).rejects.toThrow(ForbiddenException);
        });

        it('should approve > 10000 if GF role', async () => {
            mockRepository.findById.mockResolvedValue({ status: 'draft', totalAmount: 15000, approvalStatus: 'pending' });
            mockRepository.update.mockResolvedValue({});

            await service.approve('1', 'gf', ['GF']);
            expect(mockRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({
                approvalStatus: 'approved',
                approvedBy: 'gf'
            }), 'gf');
        });
    });

});
