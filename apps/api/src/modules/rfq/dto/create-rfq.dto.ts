import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsDateString,
  Min,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRfqDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  specifications: string;

  @IsString()
  projectId: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  unit: string;

  @IsDateString()
  responseDeadline: string;

  @IsArray()
  @IsString({ each: true })
  invitedSuppliers: string[];
}

export class RecordQuoteDto {
  @IsString()
  supplierId: string;

  @IsNumber()
  @Min(0)
  quotedPrice: number;

  @IsNumber()
  @Min(0)
  deliveryDays: number;

  @IsDateString()
  validUntil: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  document?: string;
}
