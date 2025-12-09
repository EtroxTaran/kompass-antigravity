import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  Max,
  Length,
  MaxLength,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OfferLineItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @Length(3, 500)
  description: string;

  @IsNumber()
  @Min(0.01)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPrice?: number;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  unit?: string;
}

export class OfferMaterialDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  materialId?: string;

  @IsString()
  @Length(3, 500)
  description: string;

  @IsNumber()
  @Min(0.01)
  quantity: number;

  @IsString()
  @Length(1, 50)
  unit: string;
}

export class CreateOfferDto {
  @IsString()
  opportunityId: string;

  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  contactPersonId?: string;

  @IsDateString()
  offerDate: string;

  @IsDateString()
  validUntil: string;

  @IsOptional()
  @IsEnum([
    'draft',
    'sent',
    'viewed',
    'accepted',
    'rejected',
    'expired',
    'superseded',
  ])
  status?:
    | 'draft'
    | 'sent'
    | 'viewed'
    | 'accepted'
    | 'rejected'
    | 'expired'
    | 'superseded';

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Offer must have at least one line item' })
  @Type(() => OfferLineItemDto)
  lineItems: OfferLineItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfferMaterialDto)
  materials?: OfferMaterialDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  taxRate?: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  paymentTerms?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  deliveryTerms?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}

export class UpdateOfferDto {
  @IsOptional()
  @IsString()
  contactPersonId?: string;

  @IsOptional()
  @IsDateString()
  offerDate?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsEnum([
    'draft',
    'sent',
    'viewed',
    'accepted',
    'rejected',
    'expired',
    'superseded',
  ])
  status?:
    | 'draft'
    | 'sent'
    | 'viewed'
    | 'accepted'
    | 'rejected'
    | 'expired'
    | 'superseded';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Offer must have at least one line item' })
  @Type(() => OfferLineItemDto)
  lineItems?: OfferLineItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OfferMaterialDto)
  materials?: OfferMaterialDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  taxRate?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  paymentTerms?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  deliveryTerms?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @IsOptional()
  @IsString()
  pdfUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  rejectionReason?: string;
}

export class UpdateOfferStatusDto {
  @IsEnum([
    'draft',
    'sent',
    'viewed',
    'accepted',
    'rejected',
    'expired',
    'superseded',
  ])
  status:
    | 'draft'
    | 'sent'
    | 'viewed'
    | 'accepted'
    | 'rejected'
    | 'expired'
    | 'superseded';

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  rejectionReason?: string;
}
