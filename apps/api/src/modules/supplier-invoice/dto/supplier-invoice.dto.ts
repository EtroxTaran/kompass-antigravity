
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SupplierInvoiceLineItem } from '../supplier-invoice.entity';

export class SupplierInvoiceLineItemDto implements SupplierInvoiceLineItem {
    @IsString()
    description: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    unitPrice: number;

    @IsNumber()
    totalPrice: number;

    @IsOptional()
    @IsString()
    purchaseOrderItemId?: string;
}

export class CreateSupplierInvoiceDto {
    @IsString()
    invoiceNumber: string;

    @IsString()
    supplierId: string;

    @IsOptional()
    @IsString()
    contractId?: string;

    @IsString()
    projectId: string;

    @IsDateString()
    invoiceDate: string;

    @IsDateString()
    dueDate: string;

    @IsNumber()
    netAmount: number;

    @IsNumber()
    taxRate: number;

    @IsNumber()
    taxAmount: number;

    @IsNumber()
    grossAmount: number;

    @ValidateNested({ each: true })
    @Type(() => SupplierInvoiceLineItemDto)
    lineItems: SupplierInvoiceLineItemDto[];

    @IsOptional()
    @IsString()
    invoiceDocument?: string;
}

export class UpdateSupplierInvoiceDto extends CreateSupplierInvoiceDto { }

export class ApproveInvoiceDto {
    @IsString()
    approvedBy: string;
}
