
// This should ideally be in packages/shared, but for now I will put it in apps/web/src/types/supplier-invoice.ts
// matching the backend entity structure.

export interface SupplierInvoice {
    _id: string;
    type: 'supplier-invoice';
    invoiceNumber: string;
    supplierId: string;
    contractId?: string;
    projectId: string;
    invoiceDate: string;
    dueDate: string;
    netAmount: number;
    taxRate: number;
    taxAmount: number;
    grossAmount: number;
    lineItems: SupplierInvoiceLineItem[];
    paymentStatus: 'Pending' | 'Approved' | 'Paid' | 'Disputed';
    approvedBy?: string;
    approvedAt?: string;
    paidDate?: string;
    paidAmount?: number;
    invoiceDocument?: string;
    matchValidation?: MatchValidationResult;
    createdAt: string;
    modifiedAt: string;
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
    amountVariance: number;
    autoApproved: boolean;
    flags: string[];
    lastCheckedAt: string;
}

export type CreateSupplierInvoiceDto = Omit<SupplierInvoice, '_id' | 'type' | 'paymentStatus' | 'approvedBy' | 'approvedAt' | 'paidDate' | 'paidAmount' | 'matchValidation' | 'createdAt' | 'modifiedAt'>;
