import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsDate,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Length,
} from 'class-validator';

import { ExpenseCategory } from '@kompass/shared/types/entities/expense';

/**
 * Re-export ExpenseCategory from shared for DTO usage
 * This ensures enum values always match between DTO and entity
 */
export { ExpenseCategory };

/**
 * Expense Status Enum
 */
export enum ExpenseStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

/**
 * Create Expense DTO
 */
export class CreateExpenseDto {
  @ApiProperty({
    description: 'Expense date',
    example: '2025-06-15',
  })
  @IsDate()
  @Type(() => Date)
  expenseDate: Date;

  @ApiProperty({
    description: 'Expense category',
    enum: ExpenseCategory,
    example: ExpenseCategory.MEAL,
  })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty({
    description: 'Amount in EUR',
    example: 45.5,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Currency code (ISO 4217)',
    example: 'EUR',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Expense description',
    example: 'Mittagessen bei Kundenbesuch',
    minLength: 3,
    maxLength: 500,
  })
  @IsString()
  @Length(3, 500)
  description: string;

  @ApiPropertyOptional({
    description: 'Tour ID (if part of a tour)',
    example: 'tour-789',
  })
  @IsString()
  @IsOptional()
  tourId?: string;

  @ApiPropertyOptional({
    description: 'Meeting ID (if part of a meeting)',
    example: 'meeting-111',
  })
  @IsString()
  @IsOptional()
  meetingId?: string;

  @ApiPropertyOptional({
    description: 'Project ID (if part of a project)',
    example: 'project-999',
  })
  @IsString()
  @IsOptional()
  projectId?: string;
}
