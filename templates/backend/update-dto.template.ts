/**
 * TEMPLATE: Update DTO (Data Transfer Object)
 * 
 * Usage: Copy this template for entity update endpoints
 * Replace {{EntityName}} with your entity name
 * 
 * CRITICAL REQUIREMENTS:
 * 1. Update DTOs typically make most fields optional
 * 2. Maintain same validation rules as Create DTO
 * 3. Add _correctionReason field for GoBD corrections
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType, OmitType } from '@nestjs/swagger';
import { Create{{EntityName}}Dto } from './create-{{entity-name}}.dto';
import { IsString, IsOptional, Length } from 'class-validator';

/**
 * DTO for updating an existing {{EntityName}}
 * 
 * @description Partial update of {{entityName}} fields
 * @validation All fields optional, same rules as Create DTO
 */
export class Update{{EntityName}}Dto extends PartialType(Create{{EntityName}}Dto) {
  /**
   * Correction reason (required for GoBD immutable entity corrections)
   * 
   * @description If updating finalized/immutable entity, provide reason
   * @example "Correcting VAT number as per customer request"
   */
  @ApiPropertyOptional({
    description: 'Reason for correction (required for finalized entities)',
    example: 'Correcting invoice amount per customer email',
    minLength: 10,
  })
  @IsString()
  @Length(10, 500, {
    message: 'Correction reason must be 10-500 characters',
  })
  @IsOptional()
  _correctionReason?: string;
}

