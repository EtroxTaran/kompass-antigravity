import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@kompass/shared/constants/rbac.constants';

/**
 * DTO for updating a user's primary role
 * The new primary role must already be assigned to the user.
 * 
 * @see docs/specifications/reviews/API_SPECIFICATION.md#user-role-management-endpoints
 */
export class UpdatePrimaryRoleDto {
  @ApiProperty({
    description: 'New primary role for the user (must be in user.roles array)',
    example: 'INNEN',
    enum: UserRole,
  })
  @IsEnum(UserRole, { message: 'Invalid primary role' })
  primaryRole: UserRole;

  @ApiProperty({
    description: 'Reason for primary role change (audit trail)',
    example: 'User now primarily focuses on inside sales',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;
}

