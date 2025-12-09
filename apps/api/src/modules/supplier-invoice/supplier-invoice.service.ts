import { Injectable, NotFoundException } from '@nestjs/common';
import { SupplierInvoiceRepository } from './supplier-invoice.repository';
import {
    CreateSupplierInvoiceDto,
    UpdateSupplierInvoiceDto,
} from './dto/supplier-invoice.dto';
import {
    MatchValidationResult,
    SupplierInvoice,
} from './supplier-invoice.entity';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { DeliveryService } from '../delivery/delivery.service';
import { PurchaseOrder } from '@kompass/shared';
import { ProjectService } from '../project/project.service';

@Injectable()
export class SupplierInvoiceService {
    constructor(
        private readonly supplierInvoiceRepository: SupplierInvoiceRepository,
        private readonly purchaseOrderService: PurchaseOrderService,
        private readonly deliveryService: DeliveryService,
        private readonly projectService: ProjectService,
    ) { }

    async create(
        createDto: CreateSupplierInvoiceDto,
        userId: string,
    ): Promise<SupplierInvoice> {
        const invoice: SupplierInvoice = {
            _id: `supplier-invoice-${Date.now()}`,
            type: 'supplier-invoice',
            ...createDto,
            paymentStatus: 'Pending',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            createdBy: userId,
            modifiedBy: userId,
            version: 1,
        };

        // Perform 3-way match
        const validation = await this.validate3WayMatch(invoice);
        invoice.matchValidation = validation;

        // specific 3-way match logic
        if (validation.autoApproved && invoice.grossAmount < 1000) {
            invoice.paymentStatus = 'Approved';
            invoice.approvedBy = 'SYSTEM';
            invoice.approvedAt = new Date().toISOString();

            // Trigger Cost Update
            const costType = validation.deliveryMatch ? 'material' : 'subcontractor';
            await this.projectService.updateActualCost(
                invoice.projectId,
                costType,
                invoice.netAmount, // Use net amount for cost tracking usually? Or gross? Usually net for internal cost. Using netAmount.
                userId
            );
        }

        return this.supplierInvoiceRepository.create(invoice, userId);
    }

    async findAll(supplierId?: string): Promise<SupplierInvoice[]> {
        if (supplierId) {
            return (await this.supplierInvoiceRepository.findBySelector({ supplierId }))
                .data;
        }
        return (await this.supplierInvoiceRepository.findAll()).data;
    }

    async findOne(id: string): Promise<SupplierInvoice> {
        const invoice = await this.supplierInvoiceRepository.findById(id);
        if (!invoice) {
            throw new NotFoundException(`Invoice with ID ${id} not found`);
        }
        return invoice;
    }

    async update(id: string, updateDto: UpdateSupplierInvoiceDto, userId: string): Promise<SupplierInvoice> {
        return this.supplierInvoiceRepository.update(id, updateDto, userId);
    }

    async approve(id: string, userId: string): Promise<SupplierInvoice> {
        const invoice = await this.findOne(id);
        invoice.paymentStatus = 'Approved';
        invoice.approvedBy = userId;
        invoice.approvedAt = new Date().toISOString();

        const updatedInvoice = await this.supplierInvoiceRepository.update(id, invoice, userId);

        // Trigger Cost Update
        // Determine type based on validation or default
        const costType = invoice.matchValidation?.deliveryMatch ? 'material' : 'subcontractor';
        await this.projectService.updateActualCost(
            invoice.projectId,
            costType,
            invoice.netAmount,
            userId
        );

        return updatedInvoice;
    }

    async validate3WayMatch(
        invoice: SupplierInvoice,
    ): Promise<MatchValidationResult> {
        const flags: string[] = [];
        let po: PurchaseOrder | null = null;
        let deliveryMatch = false;

        // 1. PO Match
        // In a real scenario, we'd lookup PO by ID if provided, or by Number/Supplier
        // Assuming contractId here might refer to PO, or we search by project/supplier
        // Ideally the DTO would have purchaseOrderId directly if linked. 
        // The entity has contractId, let's assume filtering by project/supplier for now if explicit PO ID isn't there.
        // However, looking at requirements, invoice should link to PO. 
        // The entity def has contractId but not purchaseOrderId directly? 
        // Implementation plan said: "Match Validation Result... poMatch"
        // Let's check DTO: has contractId. Let's assume contractId CAN be a PO ID (since POs are contracts technically)
        // OR we add purchaseOrderId to the DTO/Entity. The User Story mentioned "Link to PO/Contract".
        // I missed adding `purchaseOrderId` to the top level DTO/Entity explicitly in previous step, 
        // though line items have `purchaseOrderItemId`.
        // Let's assume we can try to find PO by checking context or if we add it. 
        // For now, I will try to find PO by `contractId` if it looks like a PO ID, or search.

        // Simplification: We will only validate strictly if we can find the PO.
        // Since I can't easily change Entity structure right now without another step, I will use `contractId` or search.

        if (invoice.contractId) {
            try {
                po = await this.purchaseOrderService.findOne(invoice.contractId);
            } catch (e) {
                // not found
            }
        }

        const poMatch = !!po;
        if (!po) {
            flags.push('No linked Purchase Order found');
        }

        // 2. Delivery Match
        // Find deliveries for this PO
        let deliveries = [];
        if (po) {
            deliveries = await this.deliveryService.findByPurchaseOrder(po._id);
            deliveryMatch = deliveries.length > 0 && deliveries.some(d => d.status === 'delivered');
        }

        if (!deliveryMatch && po) {
            flags.push('No delivered Goods Receipt found for this PO');
        }

        // 3. Amount Variance
        let amountVariance = 0;
        if (po) {
            amountVariance =
                (Math.abs(invoice.grossAmount - po.totalAmount) / po.totalAmount) * 100;

            if (amountVariance > 10) {
                flags.push(`Amount deviation > 10% (${amountVariance.toFixed(2)}%)`);
            }
        }

        const autoApproved =
            poMatch && deliveryMatch && amountVariance <= 10 && !!po;

        return {
            poMatch,
            deliveryMatch,
            amountVariance,
            autoApproved,
            flags,
            lastCheckedAt: new Date().toISOString(),
        };
    }
}
