import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

/**
 * DTO for updating an existing user
 *
 * @see docs/specifications/reviews/API_SPECIFICATION.md#user-management-endpoints
 */
export class UpdateUserDto {
  @ApiProperty({
    description: 'User email address (used as username)',
    example: 'user@example.com',
    required: false,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'User display name',
    example: 'Max Mustermann',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Display name must be at least 2 characters' })
  @MaxLength(100, { message: 'Display name must not exceed 100 characters' })
  displayName?: string;

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
    description: 'Whether user is active',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
