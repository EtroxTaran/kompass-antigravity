import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

import { UserRole } from '@kompass/shared/constants/rbac.constants';

/**
 * DTO for creating a new user
 *
 * @see docs/specifications/reviews/API_SPECIFICATION.md#user-management-endpoints
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'User email address (used as username)',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @ApiProperty({
    description: 'User display name',
    example: 'Max Mustermann',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2, { message: 'Display name must be at least 2 characters' })
  @MaxLength(100, { message: 'Display name must not exceed 100 characters' })
  displayName!: string;

  @ApiProperty({
    description: 'User password (will be set in Keycloak)',
    example: 'SecurePassword123!',
    minLength: 12,
  })
  @IsString()
  @MinLength(12, { message: 'Password must be at least 12 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
    {
      message:
        'Password must contain uppercase, lowercase, number, and special character',
    }
  )
  password!: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+49-89-1234567',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^[+]?[0-9\s\-()]+$/, {
    message: 'Invalid phone number format',
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Initial roles to assign to the user',
    example: ['ADM'],
    enum: UserRole,
    isArray: true,
    minItems: 1,
  })
  @IsArray()
  @IsEnum(UserRole, { each: true, message: 'Invalid role' })
  roles!: UserRole[];

  @ApiProperty({
    description: 'Primary role for the user (must be in roles array)',
    example: 'ADM',
    enum: UserRole,
  })
  @IsEnum(UserRole, { message: 'Invalid primary role' })
  primaryRole!: UserRole;

  @ApiProperty({
    description: 'Whether user is active (default: true)',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  active?: boolean;
}
