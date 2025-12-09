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
  MaxLength,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OfferLineItemDto } from '../../offer/dto/offer.dto';

export class CreateContractDto {
  @IsString()
  offerId: string;

  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  contactPersonId?: string;

  @IsDateString()
  contractDate: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(['draft', 'signed', 'in_progress', 'completed', 'cancelled'])
  status?: 'draft' | 'signed' | 'in_progress' | 'completed' | 'cancelled';

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Contract must have at least one line item' })
  @Type(() => OfferLineItemDto)
  lineItems: OfferLineItemDto[];

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
}

export class UpdateContractDto {
  @IsOptional()
  @IsString()
  contactPersonId?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(['draft', 'signed', 'in_progress', 'completed', 'cancelled'])
  status?: 'draft' | 'signed' | 'in_progress' | 'completed' | 'cancelled';

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
  signedBy?: string;
}

export class UpdateContractStatusDto {
  @IsEnum(['draft', 'signed', 'in_progress', 'completed', 'cancelled'])
  status: 'draft' | 'signed' | 'in_progress' | 'completed' | 'cancelled';

  @IsOptional()
  @IsString()
  signedBy?: string;
}

export class CreateContractFromOfferDto {
  @IsString()
  offerId: string;

  @IsOptional()
  @IsDateString()
  contractDate?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
