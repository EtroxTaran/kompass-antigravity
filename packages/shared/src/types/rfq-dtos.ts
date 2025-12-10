
export interface CreateRfqDto {
    title: string;
    description: string;
    specifications: string;
    projectId: string;
    quantity: number;
    unit: string;
    responseDeadline: string;
    invitedSuppliers: string[];
}

export interface RecordQuoteDto {
    supplierId: string;
    quotedPrice: number;
    deliveryDays: number;
    validUntil: string;
    notes?: string;
    document?: string;
}
