import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  MinLength,
  MaxLength,
  Min,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import type {
  SupplierContractType,
  ValueType,
  PaymentMilestone,
} from '@kompass/shared';

export class PaymentMilestoneDto {
  @IsString()
  @MinLength(1)
  description: string;

  @IsNumber()
  @Min(0)
  percentage: number;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  dueCondition: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

export class CreateSupplierContractDto {
  @IsString()
  @MinLength(1)
  supplierId: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsEnum(['framework', 'project', 'service_agreement', 'purchase_order'])
  contractType: SupplierContractType;

  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsArray()
  @IsString({ each: true })
  scope: string[];

  @IsNumber()
  @Min(0)
  contractValue: number;

  @IsString()
  @IsOptional()
  currency?: string = 'EUR';

  @IsEnum(['Fixed', 'TimeAndMaterial', 'UnitPrice', 'CostPlus'])
  valueType: ValueType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentMilestoneDto)
  @IsOptional()
  paymentSchedule?: PaymentMilestoneDto[];

  @IsNumber()
  @IsOptional()
  retentionPercentage?: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @IsOptional()
  noticePeriod?: number;

  // Terms
  @IsBoolean()
  termsAccepted: boolean;

  @IsBoolean()
  insuranceRequired: boolean;

  @IsNumber()
  @IsOptional()
  minimumInsuranceAmount?: number;
}

export class UpdateSupplierContractDto {
  @IsString()
  @IsOptional()
  title?: string;

  // ... Simplified update DTO for MVP - practically same as Create but optional
  @IsString()
  @IsOptional()
  description?: string;
}
