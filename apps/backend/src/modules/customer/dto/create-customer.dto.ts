import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsNumber,
  Length,
  Min,
  Max,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Address DTO
 */
class AddressDto {
  @ApiProperty({ example: 'Hauptstraße 15' })
  @IsString()
  street: string;

  @ApiProperty({ example: '80331' })
  @IsString()
  @Matches(/^\d{5}$/, { message: 'ZIP code must be 5 digits' })
  zipCode: string;

  @ApiProperty({ example: 'München' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Bayern', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'Deutschland', default: 'Deutschland' })
  @IsString()
  @IsOptional()
  country?: string;
}

/**
 * DTO for creating a new Customer
 * 
 * Validation rules from DATA_MODEL_SPECIFICATION.md §2.1
 */
export class CreateCustomerDto {
  @ApiProperty({
    description: 'Company name',
    example: 'Hofladen Müller GmbH',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @Length(2, 200, {
    message: 'Company name must be 2-200 characters',
  })
  @Matches(/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/, {
    message: 'Company name must contain only letters, numbers, and basic punctuation',
  })
  companyName: string;

  @ApiProperty({
    description: 'German VAT number',
    example: 'DE123456789',
    pattern: '^DE\\d{9}$',
    required: false,
  })
  @Matches(/^DE\d{9}$/, {
    message: 'VAT number must be format: DE123456789',
  })
  @IsOptional()
  vatNumber?: string;

  @ApiProperty({
    description: 'Primary billing address (UPDATED: renamed from "address")',
    type: AddressDto,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  billingAddress: AddressDto;

  @ApiProperty({
    description: 'Phone number',
    example: '+49-89-1234567',
    required: false,
  })
  @Matches(/^[\+]?[0-9\s\-()]+$/, {
    message: 'Invalid phone number format',
  })
  @Length(7, 20)
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'info@hofladen-mueller.de',
    required: false,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Website URL',
    example: 'https://hofladen-mueller.de',
    required: false,
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({
    description: 'Credit limit in EUR',
    example: 50000,
    minimum: 0,
    maximum: 1000000,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(1000000, {
    message: 'Credit limit must be between €0 and €1,000,000',
  })
  @IsOptional()
  creditLimit?: number;

  @ApiProperty({
    description: 'Payment terms in days',
    example: 30,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(90)
  @IsOptional()
  paymentTerms?: number;

  @ApiProperty({
    description: 'Customer tier',
    enum: ['A', 'B', 'C'],
    example: 'B',
    required: false,
  })
  @IsEnum(['A', 'B', 'C'])
  @IsOptional()
  rating?: 'A' | 'B' | 'C';

  @ApiProperty({
    description: 'Customer status',
    enum: ['prospect', 'active', 'inactive', 'archived'],
    example: 'active',
  })
  @IsEnum(['prospect', 'active', 'inactive', 'archived'])
  customerType: 'prospect' | 'active' | 'inactive' | 'archived';

  @ApiProperty({
    description: 'Industry/sector',
    example: 'Einzelhandel',
    required: false,
  })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({
    description: 'Tags',
    type: [String],
    example: ['VIP', 'Referral'],
    required: false,
  })
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'Notes (markdown supported)',
    example: 'Important customer with multiple locations',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

