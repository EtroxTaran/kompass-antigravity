/**
 * TEMPLATE: Response DTO
 * 
 * Usage: Copy this template for entity API responses
 * Replace {{EntityName}} with your entity name
 * 
 * CRITICAL REQUIREMENTS:
 * 1. Response DTOs MUST NOT include internal fields (_rev, _conflicts)
 * 2. Response DTOs SHOULD use cleaner field names (id instead of _id)
 * 3. Response DTOs MUST have OpenAPI documentation
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for {{EntityName}} API responses
 * 
 * @description Clean response format for API consumers
 * @note Internal fields like _rev removed for cleaner API
 */
export class {{EntityName}}ResponseDto {
  @ApiProperty({
    description: '{{EntityName}} ID',
    example: '{{entityName}}-f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  id: string; // Mapped from _id

  // ============================================================================
  // BUSINESS FIELDS
  // ============================================================================

  @ApiProperty({
    description: '[Field description]',
    example: '[Example value]',
  })
  exampleField: string;

  @ApiPropertyOptional({
    description: '[Optional field description]',
    example: '[Example value]',
  })
  optionalField?: string;

  // ============================================================================
  // AUDIT FIELDS (Always included for transparency)
  // ============================================================================

  @ApiProperty({
    description: 'User ID who created this {{entityName}}',
    example: 'user-123',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Timestamp when {{entityName}} was created',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User ID who last modified this {{entityName}}',
    example: 'user-456',
  })
  modifiedBy: string;

  @ApiProperty({
    description: 'Timestamp when {{entityName}} was last modified',
    example: '2024-01-16T14:45:00Z',
  })
  modifiedAt: Date;

  // ============================================================================
  // GOBD COMPLIANCE (If applicable)
  // ============================================================================

  @ApiPropertyOptional({
    description: 'Finalization status (GoBD)',
    example: true,
  })
  finalized?: boolean;

  @ApiPropertyOptional({
    description: 'Timestamp when entity was finalized (GoBD)',
    example: '2024-01-15T16:00:00Z',
  })
  immutableAt?: Date;

  // ============================================================================
  // OFFLINE SYNC STATUS
  // ============================================================================

  @ApiPropertyOptional({
    description: 'Offline sync status',
    example: true,
  })
  hasConflicts?: boolean;

  @ApiPropertyOptional({
    description: 'Last successful sync timestamp',
    example: '2024-01-16T09:00:00Z',
  })
  lastSyncedAt?: Date;
}

/**
 * Paginated response wrapper
 * 
 * @description Standard format for list endpoints
 */
export class Paginated{{EntityName}}ResponseDto {
  @ApiProperty({
    description: 'Total count of {{entityName}}s',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Current page offset',
    example: 0,
  })
  offset: number;

  @ApiProperty({
    description: 'Page size',
    example: 50,
  })
  limit: number;

  @ApiProperty({
    description: 'Array of {{entityName}}s',
    type: [{{EntityName}}ResponseDto],
  })
  data: {{EntityName}}ResponseDto[];

  @ApiPropertyOptional({
    description: 'Next page URL',
    example: '/api/v1/{{entity-names}}?offset=50&limit=50',
  })
  nextPage?: string;

  @ApiPropertyOptional({
    description: 'Previous page URL',
    example: '/api/v1/{{entity-names}}?offset=0&limit=50',
  })
  previousPage?: string;
}

