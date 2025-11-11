import { PartialType } from '@nestjs/swagger';
import { Create{{ENTITY_NAME}}Dto } from './create-{{ENTITY_NAME_LOWER}}.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

/**
 * DTO for updating an existing {{ENTITY_NAME}}
 * 
 * Extends Create{{ENTITY_NAME}}Dto with all fields optional
 * Adds CouchDB revision field for optimistic locking
 */
export class Update{{ENTITY_NAME}}Dto extends PartialType(Create{{ENTITY_NAME}}Dto) {
  /**
   * CouchDB revision for optimistic locking
   * 
   * Required for offline sync conflict detection
   */
  @ApiProperty({
    description: 'CouchDB revision (for optimistic locking)',
    example: '1-abc123def456',
    required: false,
  })
  @IsString()
  @IsOptional()
  _rev?: string;

  /**
   * Reason for correction (required for GoBD immutable entities)
   * 
   * Only needed when modifying finalized/immutable records
   */
  @ApiProperty({
    description: 'Reason for correction (GoBD compliance for immutable records)',
    example: 'Correcting invoice amount per customer request',
    required: false,
  })
  @IsString()
  @IsOptional()
  _correctionReason?: string;
}

