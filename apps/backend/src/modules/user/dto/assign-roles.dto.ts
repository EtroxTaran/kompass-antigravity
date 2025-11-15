import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  ArrayMinSize,
  IsString,
  IsOptional,
} from 'class-validator';

import { UserRole } from '@kompass/shared/constants/rbac.constants';

/**
 * DTO for assigning multiple roles to a user
 *
 * @see docs/specifications/reviews/API_SPECIFICATION.md#user-role-management-endpoints
 */
export class AssignRolesDto {
  @ApiProperty({
    description: 'Array of roles to assign to the user',
    example: ['ADM', 'INNEN'],
    enum: UserRole,
    isArray: true,
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'User must have at least one role' })
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
    description: 'Reason for role assignment (audit trail)',
    example: 'User promoted to team lead',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;
}
