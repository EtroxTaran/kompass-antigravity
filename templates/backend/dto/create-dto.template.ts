import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsNumber,
  IsDate,
  IsBoolean,
  IsArray,
  IsUUID,
  Length,
  Min,
  Max,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for creating a new {{ENTITY_NAME}}
 * 
 * Includes:
 * - Validation decorators (class-validator)
 * - OpenAPI documentation (Swagger)
 * - Transformation rules (class-transformer)
 */
export class Create{{ENTITY_NAME}}Dto {
  // ==================== Example Fields ====================
  // TODO: Replace with your actual entity fields
  
  /**
   * Example string field with validation
   */
  @ApiProperty({
    description: 'Name of the {{ENTITY_NAME}}',
    example: 'Example Name',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @Length(2, 200)
  name: string;

  /**
   * Example optional string field
   */
  @ApiProperty({
    description: 'Description of the {{ENTITY_NAME}}',
    example: 'This is an example description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * Example email field
   */
  @ApiProperty({
    description: 'Email address',
    example: 'example@company.de',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  /**
   * Example enum field
   */
  @ApiProperty({
    description: 'Status of the {{ENTITY_NAME}}',
    enum: ['active', 'inactive', 'archived'],
    example: 'active',
  })
  @IsEnum(['active', 'inactive', 'archived'])
  status: 'active' | 'inactive' | 'archived';

  /**
   * Example number field
   */
  @ApiProperty({
    description: 'Priority level',
    example: 1,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  priority: number;

  /**
   * Example date field
   */
  @ApiProperty({
    description: 'Due date',
    example: '2024-12-31T23:59:59.999Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDate?: Date;

  /**
   * Example boolean field
   */
  @ApiProperty({
    description: 'Whether this {{ENTITY_NAME}} is featured',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  /**
   * Example array field
   */
  @ApiProperty({
    description: 'Tags associated with this {{ENTITY_NAME}}',
    example: ['tag1', 'tag2'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  /**
   * Example UUID reference field
   */
  @ApiProperty({
    description: 'Owner user ID',
    example: 'user-uuid-here',
  })
  @IsUUID()
  ownerId: string;

  /**
   * Example nested object field
   */
  @ApiProperty({
    description: 'Address information',
    type: () => AddressDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  // ==================== German-specific validations ====================
  
  /**
   * Example German VAT number
   */
  @ApiProperty({
    description: 'German VAT number',
    example: 'DE123456789',
    pattern: '^DE\\d{9}$',
    required: false,
  })
  @Matches(/^DE\d{9}$/, {
    message: 'VAT number must be in format: DE123456789',
  })
  @IsOptional()
  vatNumber?: string;

  /**
   * Example German phone number
   */
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
}

/**
 * Example nested DTO for address
 */
class AddressDto {
  @ApiProperty({ example: 'Hauptstraße 15' })
  @IsString()
  street: string;

  @ApiProperty({ example: '80331' })
  @IsString()
  @Matches(/^\d{5}$/)
  zipCode: string;

  @ApiProperty({ example: 'München' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Deutschland', default: 'Deutschland' })
  @IsString()
  @IsOptional()
  country?: string;
}

