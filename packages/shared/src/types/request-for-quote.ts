
import { BaseEntity } from "./base";

export enum RfqStatus {
    DRAFT = 'Draft',
    SENT = 'Sent',
    QUOTES_RECEIVED = 'QuotesReceived',
    AWARDED = 'Awarded',
    CANCELLED = 'Cancelled',
}

export enum QuoteStatus {
    RECEIVED = 'Received',
    EXPIRED = 'Expired',
    AWARDED = 'Awarded',
    REJECTED = 'Rejected',
}

export interface SupplierQuote {
    id: string; // uuid
    supplierId: string;
    quotedPrice: number;
    deliveryDays: number;
    validUntil: Date | string; // Dates are often strings in JSON
    notes?: string;
    document?: string; // ID or URL of the uploaded quote document
    receivedAt: Date | string;
    status: QuoteStatus;
}

export interface RequestForQuote extends BaseEntity {
    type: 'request_for_quote';

    rfqNumber: string; // "RFQ-2025-00123"
    projectId: string; // Link to Project

    // RFQ Details
    title: string;
    description: string;
    specifications: string;
    quantity: number;
    unit: string;
    responseDeadline: Date | string;

    // Status
    status: RfqStatus;

    // Suppliers
    invitedSuppliers: string[]; // List of Supplier IDs invited to quote

    // Quotes
    quotes: SupplierQuote[];

    // Award
    awardedSupplierId?: string;
    awardedQuoteId?: string;
}
