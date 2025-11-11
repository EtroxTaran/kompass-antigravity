/**
 * DTO for updating Contact Decision Authority
 * 
 * RESTRICTED: Only PLAN and GF roles can use this endpoint
 * Based on API_SPECIFICATION.md Section 5.2
 */

import { IsEnum, IsBoolean, IsOptional, IsNumber, IsString, IsArray, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DecisionMakingRole, FunctionalRole, type AuthorityLevel } from '@kompass/shared/types/enums';

/**
 * Update Decision Authority DTO
 */
export class UpdateDecisionAuthorityDto {
  @ApiProperty({
    description: 'Decision-making role',
    enum: DecisionMakingRole,
    example: DecisionMakingRole.KEY_INFLUENCER,
  })
  @IsEnum(DecisionMakingRole)
  decisionMakingRole: DecisionMakingRole;

  @ApiProperty({
    description: 'Authority level',
    enum: ['low', 'medium', 'high', 'final_authority'],
    example: 'high',
  })
  @IsEnum(['low', 'medium', 'high', 'final_authority'])
  authorityLevel: AuthorityLevel;

  @ApiProperty({
    description: 'Can approve orders/quotes',
    example: true,
  })
  @IsBoolean()
  canApproveOrders: boolean;

  @ApiProperty({
    description: 'Maximum order value they can approve (EUR). Required if canApproveOrders=true.',
    example: 50000,
    required: false,
    minimum: 0,
    maximum: 10000000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000000)
  approvalLimitEur?: number;

  @ApiProperty({
    description: 'Functional roles',
    type: [String],
    enum: FunctionalRole,
    example: [FunctionalRole.PURCHASING_MANAGER, FunctionalRole.OPERATIONS_MANAGER],
  })
  @IsArray()
  @IsEnum(FunctionalRole, { each: true })
  functionalRoles: FunctionalRole[];

  @ApiProperty({
    description: 'Departments this contact influences',
    type: [String],
    example: ['purchasing', 'operations'],
  })
  @IsArray()
  @IsString({ each: true })
  departmentInfluence: string[];
}

