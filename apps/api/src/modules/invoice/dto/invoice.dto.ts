import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  ValidateNested,
  MinLength,
  MaxLength,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

const invoiceStatuses = [
  'draft',
  'sent',
  'paid',
  'overdue',
  'cancelled',
] as const;

class InvoicePositionDto {
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  description: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  unit: string;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  vatRate: number;

  @IsNumber()
  @Min(0)
  totalNet: number;
}

export class CreateInvoiceDto {
  @IsString()
  customerId: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  date: string;

  @IsString()
  dueDate: string;

  @IsEnum(invoiceStatuses, {
    message: `status must be one of: ${invoiceStatuses.join(', ')}`,
  })
  @IsOptional()
  status?: (typeof invoiceStatuses)[number] = 'draft';

  @ValidateNested({ each: true })
  @Type(() => InvoicePositionDto)
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one position is required' })
  positions: InvoicePositionDto[];

  @IsNumber()
  @Min(0)
  totalNet: number;

  @IsNumber()
  @Min(0)
  vatAmount: number;

  @IsNumber()
  @Min(0)
  totalGross: number;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  notes?: string;
}

export class UpdateInvoiceDto {
  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsEnum(invoiceStatuses, {
    message: `status must be one of: ${invoiceStatuses.join(', ')}`,
  })
  @IsOptional()
  status?: (typeof invoiceStatuses)[number];

  @ValidateNested({ each: true })
  @Type(() => InvoicePositionDto)
  @IsArray()
  @IsOptional()
  positions?: InvoicePositionDto[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalNet?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  vatAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalGross?: number;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  notes?: string;
}
