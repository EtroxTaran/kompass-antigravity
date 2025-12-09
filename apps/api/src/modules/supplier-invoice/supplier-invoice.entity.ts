import { BaseEntity } from '../../shared/base.repository';

export interface SupplierInvoice extends BaseEntity {
    invoiceNumber: string;          // Supplier's invoice number
    supplierId: string;
    contractId?: string;
    projectId: string;
    invoiceDate: string; // ISO Date
    dueDate: string; // ISO Date
    netAmount: number;
    taxRate: number;                // 19 or 7
    taxAmount: number;
    grossAmount: number;
    lineItems: SupplierInvoiceLineItem[];
    paymentStatus: 'Pending' | 'Approved' | 'Paid' | 'Disputed';
    approvedBy?: string;
    approvedAt?: string;
    paidDate?: string;
    paidAmount?: number;
    invoiceDocument?: string;        // File reference path or ID
    matchValidation?: MatchValidationResult;
}

export interface SupplierInvoiceLineItem {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    purchaseOrderItemId?: string;
}

export interface MatchValidationResult {
    poMatch: boolean;
    deliveryMatch: boolean;
    amountVariance: number;         // % difference from PO
    autoApproved: boolean;
    flags: string[];                // Discrepancy descriptions
    lastCheckedAt: string;
}
