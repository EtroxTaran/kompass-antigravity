import { Test, TestingModule } from '@nestjs/testing';
import { SupplierInvoiceService } from './supplier-invoice.service';
import { SupplierInvoiceRepository } from './supplier-invoice.repository';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { DeliveryService } from '../delivery/delivery.service';
import { CreateSupplierInvoiceDto } from './dto/supplier-invoice.dto';

describe('SupplierInvoiceService', () => {
    let service: SupplierInvoiceService;
    let repo: Partial<SupplierInvoiceRepository>;
    let poService: Partial<PurchaseOrderService>;
    let deliveryService: Partial<DeliveryService>;

    beforeEach(async () => {
        repo = {
            create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...dto, _id: '1', version: 1 })) as any,
        };
        poService = {
            findOne: jest.fn(),
        };
        deliveryService = {
            findByPurchaseOrder: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SupplierInvoiceService,
                { provide: SupplierInvoiceRepository, useValue: repo },
                { provide: PurchaseOrderService, useValue: poService },
                { provide: DeliveryService, useValue: deliveryService },
            ],
        }).compile();

        service = module.get<SupplierInvoiceService>(SupplierInvoiceService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validate3WayMatch', () => {
        it('should fail if no PO found', async () => {
            const invoice: any = { contractId: 'po-1', grossAmount: 1000 };
            (poService.findOne as jest.Mock).mockRejectedValue(new Error('Not found'));

            const result = await service.validate3WayMatch(invoice);
            expect(result.poMatch).toBe(false);
            expect(result.autoApproved).toBe(false);
            expect(result.flags).toContain('No linked Purchase Order found');
        });

        it('should pass if PO matches, delivery exists, and variance <= 10%', async () => {
            const invoice: any = { contractId: 'po-1', grossAmount: 1000 };
            const po: any = { _id: 'po-1', totalAmount: 1000 };
            const deliveries: any[] = [{ status: 'delivered' }];

            (poService.findOne as jest.Mock).mockResolvedValue(po);
            (deliveryService.findByPurchaseOrder as jest.Mock).mockResolvedValue(deliveries);

            const result = await service.validate3WayMatch(invoice);
            expect(result.poMatch).toBe(true);
            expect(result.deliveryMatch).toBe(true);
            expect(result.amountVariance).toBe(0);
            expect(result.autoApproved).toBe(true);
        });

        it('should fail auto-approval if variance > 10%', async () => {
            const invoice: any = { contractId: 'po-1', grossAmount: 1200 }; // 20% variance
            const po: any = { _id: 'po-1', totalAmount: 1000 };
            const deliveries: any[] = [{ status: 'delivered' }];

            (poService.findOne as jest.Mock).mockResolvedValue(po);
            (deliveryService.findByPurchaseOrder as jest.Mock).mockResolvedValue(deliveries);

            const result = await service.validate3WayMatch(invoice);
            expect(result.amountVariance).toBe(20);
            expect(result.autoApproved).toBe(false);
            expect(result.flags[0]).toContain('Amount deviation > 10%');
        });

        it('should fail auto-approval if no delivery', async () => {
            const invoice: any = { contractId: 'po-1', grossAmount: 1000 };
            const po: any = { _id: 'po-1', totalAmount: 1000 };
            const deliveries: any[] = [];

            (poService.findOne as jest.Mock).mockResolvedValue(po);
            (deliveryService.findByPurchaseOrder as jest.Mock).mockResolvedValue(deliveries);

            const result = await service.validate3WayMatch(invoice);
            expect(result.deliveryMatch).toBe(false);
            expect(result.autoApproved).toBe(false);
            expect(result.flags).toContain('No delivered Goods Receipt found for this PO');
        });
    });

    describe('create', () => {
        it('should auto-approve if valid and < 1000', async () => {
            const dto: CreateSupplierInvoiceDto = {
                grossAmount: 500,
                // other fields...
                contractId: 'po-1',
            } as any;

            // Mock perfect match
            const po: any = { _id: 'po-1', totalAmount: 500 };
            const deliveries: any[] = [{ status: 'delivered' }];
            (poService.findOne as jest.Mock).mockResolvedValue(po);
            (deliveryService.findByPurchaseOrder as jest.Mock).mockResolvedValue(deliveries);

            const result = await service.create(dto, 'user-1');
            expect(result.paymentStatus).toBe('Approved');
            expect(result.matchValidation.autoApproved).toBe(true);
        });

        it('should set status Pending if > 1000 even if valid', async () => {
            const dto: CreateSupplierInvoiceDto = {
                grossAmount: 1500,
                contractId: 'po-1',
            } as any;

            // Mock perfect match
            const po: any = { _id: 'po-1', totalAmount: 1500 };
            const deliveries: any[] = [{ status: 'delivered' }];
            (poService.findOne as jest.Mock).mockResolvedValue(po);
            (deliveryService.findByPurchaseOrder as jest.Mock).mockResolvedValue(deliveries);

            const result = await service.create(dto, 'user-1');
            expect(result.paymentStatus).toBe('Pending');
            expect(result.matchValidation.autoApproved).toBe(true);
        });
    });
});
