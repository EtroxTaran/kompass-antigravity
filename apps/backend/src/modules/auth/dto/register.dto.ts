import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

/**
 * DTO for user registration
 *
 * Public endpoint - no authentication required.
 * Creates user with default ADM role.
 */
export class RegisterDto {
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
    description: 'User password (must meet security requirements)',
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
}
