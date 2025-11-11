/**
 * Contact Controller
 * 
 * Handles HTTP requests for Contact management
 * Includes decision authority endpoints (RESTRICTED)
 * 
 * All endpoints require:
 * - JwtAuthGuard: User must be authenticated
 * - RbacGuard: User must have required permissions
 * 
 * Permissions:
 * - Contact.CREATE: GF, PLAN, ADM (own customers)
 * - Contact.READ: All roles
 * - Contact.UPDATE: GF, PLAN, ADM (own customers, basic info only)
 * - Contact.DELETE: GF, PLAN
 * - Contact.UPDATE_DECISION_ROLE: GF, PLAN ONLY (RESTRICTED)
 * - Contact.VIEW_AUTHORITY_LEVELS: All roles
 */

import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { UpdateDecisionAuthorityDto } from './dto/update-decision-authority.dto';
import { DecisionAuthorityResponseDto } from './dto/decision-authority-response.dto';

/**
 * Placeholder guards and decorators
 */
interface User {
  id: string;
  role: 'GF' | 'PLAN' | 'ADM' | 'KALK' | 'BUCH';
}

const CurrentUser = () => (target: any, propertyKey: string, parameterIndex: number) => {};
const RequirePermission = (entity: string, action: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {};
const JwtAuthGuard = class {};
const RbacGuard = class {};

/**
 * Contact Controller
 */
@Controller('api/v1/contacts')
@ApiTags('Contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /**
   * Get decision authority for a contact
   */
  @Get(':contactId/decision-authority')
  @ApiOperation({
    summary: 'Get contact decision authority',
    description:
      'Retrieves decision-making role and authority information for a contact. ' +
      'All roles can view this information.',
  })
  @ApiParam({
    name: 'contactId',
    description: 'Contact ID',
    example: 'contact-111',
  })
  @ApiResponse({
    status: 200,
    description: 'Decision authority retrieved successfully',
    type: DecisionAuthorityResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Contact not found',
  })
  @RequirePermission('Contact', 'VIEW_AUTHORITY_LEVELS')
  async getDecisionAuthority(
    @Param('contactId') contactId: string,
    @CurrentUser() user: User,
  ): Promise<DecisionAuthorityResponseDto> {
    return this.contactService.getDecisionAuthority(contactId, user);
  }

  /**
   * Update decision authority for a contact
   * 
   * RESTRICTED: Only PLAN and GF roles
   */
  @Put(':contactId/decision-authority')
  @ApiOperation({
    summary: 'Update contact decision authority',
    description:
      'Updates decision-making role and authority for a contact. ' +
      'RESTRICTED: Only PLAN and GF users can perform this action due to significant business impact. ' +
      'All changes are logged in the audit trail.',
  })
  @ApiParam({
    name: 'contactId',
    description: 'Contact ID',
    example: 'contact-111',
  })
  @ApiBody({ type: UpdateDecisionAuthorityDto })
  @ApiResponse({
    status: 200,
    description: 'Decision authority updated successfully',
    type: DecisionAuthorityResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error - missing approval limit when canApproveOrders=true',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - only ADM+ (PLAN, GF) can update decision-making roles',
    schema: {
      example: {
        type: 'https://api.kompass.de/errors/forbidden',
        title: 'Forbidden',
        status: 403,
        detail: 'Only ADM+ users (PLAN, GF) can update contact decision-making roles',
        instance: '/api/v1/contacts/contact-111/decision-authority',
        requiredPermission: 'Contact.UPDATE_DECISION_ROLE',
        userRole: 'ADM',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Contact not found',
  })
  @RequirePermission('Contact', 'UPDATE_DECISION_ROLE')
  async updateDecisionAuthority(
    @Param('contactId') contactId: string,
    @Body() updateDecisionAuthorityDto: UpdateDecisionAuthorityDto,
    @CurrentUser() user: User,
  ): Promise<DecisionAuthorityResponseDto> {
    return this.contactService.updateDecisionAuthority(contactId, updateDecisionAuthorityDto, user);
  }
}

