/**
 * Response DTO for Contact Decision Authority
 *
 * Returns decision-making role and authority information
 */

import { ApiProperty } from '@nestjs/swagger';

import {
  DecisionMakingRole,
  FunctionalRole,
  type AuthorityLevel,
} from '@kompass/shared/types/enums';

/**
 * Decision Authority Response DTO
 */
export class DecisionAuthorityResponseDto {
  @ApiProperty({
    description: 'Contact ID',
    example: 'contact-111',
  })
  contactId!: string;

  @ApiProperty({
    description: 'Contact full name',
    example: 'Thomas Schmidt',
  })
  contactName!: string;

  @ApiProperty({
    description: 'Decision-making role',
    enum: DecisionMakingRole,
  })
  decisionMakingRole!: DecisionMakingRole;

  @ApiProperty({
    description: 'Authority level',
    enum: ['low', 'medium', 'high', 'final_authority'],
  })
  authorityLevel!: AuthorityLevel;

  @ApiProperty({
    description: 'Can approve orders',
  })
  canApproveOrders!: boolean;

  @ApiProperty({
    description: 'Approval limit in EUR',
    required: false,
  })
  approvalLimitEur?: number;

  @ApiProperty({
    description: 'Functional roles',
    type: [String],
    enum: FunctionalRole,
  })
  functionalRoles!: FunctionalRole[];

  @ApiProperty({
    description: 'Department influence',
    type: [String],
  })
  departmentInfluence!: string[];

  @ApiProperty({
    description: 'Assigned location IDs',
    type: [String],
  })
  assignedLocationIds!: string[];

  @ApiProperty({
    description: 'Primary contact for locations',
    type: [String],
  })
  isPrimaryContactForLocations!: string[];

  @ApiProperty({
    description: 'Last updated timestamp',
  })
  lastUpdated!: Date;

  @ApiProperty({
    description: 'User who last updated',
  })
  updatedBy!: string;
}
