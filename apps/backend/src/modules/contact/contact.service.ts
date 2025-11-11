/**
 * Contact Service
 * 
 * Business logic for Contact/ContactPerson management
 * 
 * Responsibilities:
 * - Validate contact data and business rules
 * - Check RBAC permissions (especially for decision roles)
 * - Orchestrate repository calls
 * - Log audit trail
 * 
 * Business Rules:
 * - CO-001: Approval limit required if canApproveOrders=true
 * - CO-002: Primary contact locations must be in assignedLocationIds
 * - CO-003: Customer should have at least one decision maker (warning)
 * 
 * CRITICAL RBAC:
 * - Only PLAN and GF can update decision-making roles
 * - ADM can update basic contact info for their customers
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';
import type { ContactPerson } from '@kompass/shared/types/entities/contact';
import { getContactDisplayName, validateContact } from '@kompass/shared/types/entities/contact';
import { UpdateDecisionAuthorityDto } from './dto/update-decision-authority.dto';
import { DecisionAuthorityResponseDto } from './dto/decision-authority-response.dto';

/**
 * Placeholder User type
 */
interface User {
  id: string;
  role: 'GF' | 'PLAN' | 'ADM' | 'KALK' | 'BUCH';
}

/**
 * Contact Repository Interface (placeholder)
 */
interface IContactRepository {
  findById(id: string): Promise<ContactPerson | null>;
  findByCustomer(customerId: string): Promise<ContactPerson[]>;
  update(id: string, updates: Partial<ContactPerson>): Promise<ContactPerson>;
}

/**
 * Audit Service Interface (placeholder)
 */
interface IAuditService {
  log(entry: any): Promise<void>;
}

/**
 * Contact Service
 */
@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @Inject('IContactRepository')
    private readonly contactRepository: IContactRepository,
    @Inject('IAuditService')
    private readonly auditService: IAuditService,
  ) {}

  /**
   * Get decision authority information for a contact
   * 
   * RBAC: All roles can VIEW decision authority
   */
  async getDecisionAuthority(contactId: string, user: User): Promise<DecisionAuthorityResponseDto> {
    const contact = await this.contactRepository.findById(contactId);

    if (!contact) {
      throw new NotFoundException(`Contact ${contactId} not found`);
    }

    return {
      contactId: contact._id,
      contactName: getContactDisplayName(contact),
      decisionMakingRole: contact.decisionMakingRole,
      authorityLevel: contact.authorityLevel,
      canApproveOrders: contact.canApproveOrders,
      approvalLimitEur: contact.approvalLimitEur,
      functionalRoles: contact.functionalRoles,
      departmentInfluence: contact.departmentInfluence,
      assignedLocationIds: contact.assignedLocationIds,
      isPrimaryContactForLocations: contact.isPrimaryContactForLocations,
      lastUpdated: contact.modifiedAt,
      updatedBy: contact.modifiedBy,
    };
  }

  /**
   * Update decision authority for a contact
   * 
   * CRITICAL RBAC: Only PLAN and GF can update decision-making roles
   * This is a restricted operation due to business impact
   */
  async updateDecisionAuthority(
    contactId: string,
    dto: UpdateDecisionAuthorityDto,
    user: User,
  ): Promise<DecisionAuthorityResponseDto> {
    // CRITICAL: Check restricted permission
    if (user.role !== 'PLAN' && user.role !== 'GF') {
      throw new ForbiddenException(
        'Only ADM+ users (PLAN, GF) can update contact decision-making roles',
      );
    }

    // Get existing contact
    const contact = await this.contactRepository.findById(contactId);
    if (!contact) {
      throw new NotFoundException(`Contact ${contactId} not found`);
    }

    // Business rule CO-001: Validate approval limit if canApproveOrders is true
    if (dto.canApproveOrders === true) {
      if (!dto.approvalLimitEur || dto.approvalLimitEur <= 0) {
        throw new BadRequestException(
          'Contacts who can approve orders must have an approval limit > 0',
        );
      }
    }

    // Prepare updates
    const updates: Partial<ContactPerson> = {
      decisionMakingRole: dto.decisionMakingRole,
      authorityLevel: dto.authorityLevel,
      canApproveOrders: dto.canApproveOrders,
      approvalLimitEur: dto.approvalLimitEur,
      functionalRoles: dto.functionalRoles,
      departmentInfluence: dto.departmentInfluence,
      modifiedBy: user.id,
      modifiedAt: new Date(),
    };

    // Validate updated contact
    const validatedContact: Partial<ContactPerson> = {
      ...contact,
      ...updates,
    };

    const validationErrors = validateContact(validatedContact);
    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Log the change (GoBD audit trail)
    await this.auditService.log({
      entityType: 'Contact',
      entityId: contactId,
      action: 'UPDATE_DECISION_ROLE',
      oldValue: {
        decisionMakingRole: contact.decisionMakingRole,
        authorityLevel: contact.authorityLevel,
        approvalLimitEur: contact.approvalLimitEur,
      },
      newValue: {
        decisionMakingRole: dto.decisionMakingRole,
        authorityLevel: dto.authorityLevel,
        approvalLimitEur: dto.approvalLimitEur,
      },
      userId: user.id,
      timestamp: new Date(),
    });

    // Update in database
    const updated = await this.contactRepository.update(contactId, updates);

    this.logger.log('Contact decision authority updated', {
      contactId,
      decisionMakingRole: dto.decisionMakingRole,
      authorityLevel: dto.authorityLevel,
      userId: user.id,
    });

    return {
      contactId: updated._id,
      contactName: getContactDisplayName(updated),
      decisionMakingRole: updated.decisionMakingRole,
      authorityLevel: updated.authorityLevel,
      canApproveOrders: updated.canApproveOrders,
      approvalLimitEur: updated.approvalLimitEur,
      functionalRoles: updated.functionalRoles,
      departmentInfluence: updated.departmentInfluence,
      assignedLocationIds: updated.assignedLocationIds,
      isPrimaryContactForLocations: updated.isPrimaryContactForLocations,
      lastUpdated: updated.modifiedAt,
      updatedBy: updated.modifiedBy,
    };
  }

  /**
   * Check if customer has at least one decision maker
   * Returns warning if not (business rule CO-003)
   */
  async validateCustomerHasDecisionMaker(customerId: string): Promise<{ hasDecisionMaker: boolean; warning?: string }> {
    const contacts = await this.contactRepository.findByCustomer(customerId);

    const hasDecisionMaker = contacts.some(
      (c) =>
        c.decisionMakingRole === DecisionMakingRole.DECISION_MAKER ||
        c.decisionMakingRole === DecisionMakingRole.KEY_INFLUENCER,
    );

    if (!hasDecisionMaker) {
      return {
        hasDecisionMaker: false,
        warning: 'Customer should have at least one decision maker or key influencer',
      };
    }

    return { hasDecisionMaker: true };
  }
}

