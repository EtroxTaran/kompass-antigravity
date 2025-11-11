/**
 * TEMPLATE: Create DTO (Data Transfer Object)
 * 
 * Usage: Copy this template for entity creation endpoints
 * Replace {{EntityName}} with your entity name
 * 
 * CRITICAL REQUIREMENTS:
 * 1. DTOs MUST use class-validator decorators
 * 2. DTOs MUST have OpenAPI documentation
 * 3. DTOs MUST NOT include internal fields (_id, _rev, audit fields)
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDate,
  Length,
  Min,
  Max,
  Matches,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for creating a new {{EntityName}}
 * 
 * @description Data required to create a {{entityName}}
 * @validation All fields validated according to DATA_MODEL_SPECIFICATION.md
 */
export class Create{{EntityName}}Dto {
  // ============================================================================
  // REQUIRED FIELDS
  // ============================================================================

  @ApiProperty({
    description: '[Field description]',
    example: '[Example value]',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @Length(2, 200, {
    message: 'Field must be between 2 and 200 characters',
  })
  @Matches(/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&()]+$/, {
    message: 'Field contains invalid characters',
  })
  exampleField: string;

  // ============================================================================
  // OPTIONAL FIELDS
  // ============================================================================

  @ApiPropertyOptional({
    description: '[Optional field description]',
    example: '[Example value]',
  })
  @IsString()
  @IsOptional()
  optionalField?: string;

  // ============================================================================
  // EMAIL VALIDATION EXAMPLE
  // ============================================================================

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'info@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  // ============================================================================
  // NUMBER VALIDATION EXAMPLE
  // ============================================================================

  @ApiPropertyOptional({
    description: 'Numeric value',
    example: 10000,
    minimum: 0,
    maximum: 10000000,
  })
  @IsNumber()
  @Min(0, { message: 'Value must be at least 0' })
  @Max(10000000, { message: 'Value must not exceed €10,000,000' })
  @IsOptional()
  numericField?: number;

  // ============================================================================
  // ENUM VALIDATION EXAMPLE
  // ============================================================================

  @ApiPropertyOptional({
    description: 'Status value',
    enum: ['New', 'Active', 'Inactive'],
    example: 'Active',
  })
  @IsEnum(['New', 'Active', 'Inactive'], {
    message: 'Status must be one of: New, Active, Inactive',
  })
  @IsOptional()
  status?: 'New' | 'Active' | 'Inactive';

  // ============================================================================
  // DATE VALIDATION EXAMPLE
  // ============================================================================

  @ApiPropertyOptional({
    description: 'Date field',
    example: '2024-12-31',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateField?: Date;

  // ============================================================================
  // NESTED OBJECT VALIDATION EXAMPLE
  // ============================================================================

  @ApiProperty({
    description: 'Address information',
    type: () => AddressDto,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  // ============================================================================
  // GERMAN VAT NUMBER VALIDATION EXAMPLE
  // ============================================================================

  @ApiPropertyOptional({
    description: 'German VAT number',
    example: 'DE123456789',
    pattern: '^DE\\d{9}$',
  })
  @IsString()
  @Matches(/^DE\d{9}$/, {
    message: 'German VAT number must be format: DE123456789',
  })
  @IsOptional()
  vatNumber?: string;

  // ============================================================================
  // PHONE NUMBER VALIDATION EXAMPLE
  // ============================================================================

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+49-89-1234567',
  })
  @IsString()
  @Matches(/^[\+]?[0-9\s\-()]+$/, {
    message: 'Invalid phone number format',
  })
  @Length(7, 20)
  @IsOptional()
  phone?: string;
}

/**
 * Nested DTO example: Address
 */
export class AddressDto {
  @ApiProperty({ example: 'Hauptstraße 15' })
  @IsString()
  @Length(1, 200)
  street: string;

  @ApiProperty({ example: '80331' })
  @IsString()
  @Matches(/^\d{5}$/, { message: 'ZIP code must be 5 digits' })
  zipCode: string;

  @ApiProperty({ example: 'München' })
  @IsString()
  @Length(1, 100)
  city: string;

  @ApiPropertyOptional({ example: 'Bayern' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'Deutschland', default: 'Deutschland' })
  @IsString()
  country: string = 'Deutschland';
}

