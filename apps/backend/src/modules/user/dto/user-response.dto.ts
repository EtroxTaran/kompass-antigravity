import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '@kompass/shared/constants/rbac.constants';

import type { User } from '@kompass/shared/types/entities/user';

/**
 * User Response DTO
 *
 * Excludes sensitive fields like password and internal CouchDB fields.
 * Used for API responses.
 *
 * @see docs/specifications/reviews/API_SPECIFICATION.md#user-management-endpoints
 */
export class UserResponseDto implements Omit<User, '_rev' | 'password'> {
  @ApiProperty({
    description: 'User ID',
    example: 'user-f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  _id!: string;

  @ApiProperty({
    description: 'Document type (always "user")',
    example: 'user',
  })
  type!: 'user';

  @ApiProperty({
    description: 'User email address (used as username)',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'User display name',
    example: 'Max Mustermann',
  })
  displayName!: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+49-89-1234567',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'User roles',
    example: ['ADM', 'INNEN'],
    enum: UserRole,
    isArray: true,
  })
  roles!: UserRole[];

  @ApiProperty({
    description: 'Primary role for the user',
    example: 'ADM',
    enum: UserRole,
  })
  primaryRole!: UserRole;

  @ApiProperty({
    description: 'Whether user is active',
    example: true,
  })
  active!: boolean;

  @ApiProperty({
    description: 'User who created this user',
    example: 'user-123',
  })
  createdBy!: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-27T10:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'User who last modified this user',
    example: 'user-123',
  })
  modifiedBy!: string;

  @ApiProperty({
    description: 'Last modification timestamp',
    example: '2024-01-27T10:00:00.000Z',
  })
  modifiedAt!: Date;

  @ApiProperty({
    description: 'Optimistic locking version',
    example: 1,
  })
  version!: number;
}
