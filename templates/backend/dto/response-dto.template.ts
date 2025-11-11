import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * Response DTO for {{ENTITY_NAME}}
 * 
 * Exposes only public fields, hides internal CouchDB fields
 * Used for API responses to clients
 */
export class {{ENTITY_NAME}}ResponseDto {
  /**
   * {{ENTITY_NAME}} ID (without CouchDB prefix)
   */
  @ApiProperty({
    description: '{{ENTITY_NAME}} ID',
    example: '{{ENTITY_NAME_LOWER}}-uuid-here',
  })
  @Expose()
  id: string;

  // ==================== Your Entity Fields ====================
  // TODO: Add your entity fields here (mapped from entity)
  
  @ApiProperty({
    description: 'Name of the {{ENTITY_NAME}}',
    example: 'Example Name',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Description',
    example: 'Example description',
    required: false,
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Status',
    enum: ['active', 'inactive', 'archived'],
    example: 'active',
  })
  @Expose()
  status: string;

  // ==================== Audit Trail ====================
  
  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last modification timestamp',
    example: '2024-01-16T14:20:00.000Z',
  })
  @Expose()
  modifiedAt: Date;

  @ApiProperty({
    description: 'Created by user ID',
    example: 'user-uuid-here',
  })
  @Expose()
  createdBy: string;

  @ApiProperty({
    description: 'Last modified by user ID',
    example: 'user-uuid-here',
  })
  @Expose()
  modifiedBy: string;

  // ==================== Optional Fields ====================
  
  /**
   * Include for finalized/immutable entities
   */
  @ApiProperty({
    description: 'Whether this record is finalized (GoBD locked)',
    example: false,
    required: false,
  })
  @Expose()
  finalized?: boolean;

  @ApiProperty({
    description: 'When the record became immutable',
    example: '2024-01-20T00:00:00.000Z',
    required: false,
  })
  @Expose()
  immutableAt?: Date;

  /**
   * Offline sync status
   */
  @ApiProperty({
    description: 'Whether there are pending offline changes',
    example: false,
    required: false,
  })
  @Expose()
  hasPendingSync?: boolean;

  @ApiProperty({
    description: 'Whether there are unresolved conflicts',
    example: false,
    required: false,
  })
  @Expose()
  hasConflicts?: boolean;

  // Note: _rev, _conflicts, and other internal CouchDB fields are NOT exposed
  // These are handled internally for offline sync
}

