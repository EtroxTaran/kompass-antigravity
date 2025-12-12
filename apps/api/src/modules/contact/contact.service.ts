import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ContactRepository, Contact } from './contact.repository';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';
import { AuditService } from '../../shared/services/audit.service';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly auditService: AuditService,
  ) {}

  async findAll(
    options: { page?: number; limit?: number; search?: string } = {},
  ) {
    if (options.search) {
      return this.contactRepository.findByEmail(options.search, options);
    }
    return this.contactRepository.findAll(options);
  }

  async findById(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      throw new NotFoundException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Resource Not Found',
        status: 404,
        detail: `Contact with ID '${id}' not found`,
        resourceType: 'Contact',
        resourceId: id,
      });
    }
    return contact;
  }

  async findByCustomer(
    customerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.contactRepository.findByCustomer(customerId, options);
  }

  async create(
    dto: CreateContactDto,
    user: { id: string; email?: string },
  ): Promise<Contact> {
    // Validate: approvalLimitEur required when canApproveOrders is true
    if (
      dto.canApproveOrders &&
      (dto.approvalLimitEur === undefined || dto.approvalLimitEur === null)
    ) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Approval limit is required when contact can approve orders',
        errors: [
          {
            field: 'approvalLimitEur',
            message: 'Required when canApproveOrders is true',
            value: dto.approvalLimitEur,
          },
        ],
      });
    }

    const contactData = {
      ...dto,
      isPrimary: dto.isPrimary ?? false,
      assignedLocationIds: dto.assignedLocationIds || [],
      isPrimaryContactForLocations: dto.isPrimaryContactForLocations || [],
    };

    // If setting as primary, clear other primary contacts for this customer
    if (contactData.isPrimary) {
      await this.clearPrimaryForCustomer(dto.customerId);
    }

    const newContact = await this.contactRepository.create(
      contactData as Partial<Contact>,
      user.id,
      user.email,
    );

    // GoBD Audit Log
    await this.auditService.logChange(
      newContact._id,
      'contact',
      'CREATE',
      newContact,
      null,
      user.id,
      user.email,
    );

    return newContact;
  }

  async update(
    id: string,
    dto: UpdateContactDto,
    user: { id: string; email?: string },
  ): Promise<Contact> {
    // Ensure contact exists
    const existing = await this.findById(id);

    // Validate: approvalLimitEur required when canApproveOrders is true
    const canApprove =
      dto.canApproveOrders !== undefined
        ? dto.canApproveOrders
        : existing.canApproveOrders;
    const approvalLimit =
      dto.approvalLimitEur !== undefined
        ? dto.approvalLimitEur
        : existing.approvalLimitEur;

    if (canApprove && (approvalLimit === undefined || approvalLimit === null)) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Approval limit is required when contact can approve orders',
        errors: [
          {
            field: 'approvalLimitEur',
            message: 'Required when canApproveOrders is true',
            value: approvalLimit,
          },
        ],
      });
    }

    // If setting as primary, clear other primary contacts for this customer
    if (dto.isPrimary) {
      await this.clearPrimaryForCustomer(existing.customerId, id);
    }

    const updatedContact = await this.contactRepository.update(
      id,
      dto as Partial<Contact>,
      user.id,
      user.email,
    );

    // GoBD Audit Log
    await this.auditService.logChange(
      id,
      'contact',
      'UPDATE',
      updatedContact,
      existing,
      user.id,
      user.email,
    );

    return updatedContact;
  }

  async delete(
    id: string,
    user: { id: string; email?: string },
  ): Promise<void> {
    // Ensure contact exists
    await this.findById(id);

    await this.auditService.logChange(
      id,
      'contact',
      'DELETE',
      {},
      await this.findById(id),
      user.id,
      user.email,
    );
    return this.contactRepository.delete(id, user.id, user.email);
  }

  async getAuditHistory(id: string) {
    // Ensure contact exists
    await this.findById(id);
    return this.auditService.getHistory(id);
  }

  /**
   * Clears the isPrimary flag for all contacts of a customer except the excluded one.
   * This ensures only one contact can be marked as primary per customer.
   */
  private async clearPrimaryForCustomer(
    customerId: string,
    excludeId?: string,
  ): Promise<void> {
    const result = await this.findByCustomer(customerId);
    const contacts = result.data || result;

    for (const contact of contacts) {
      if (contact.isPrimary && contact._id !== excludeId) {
        await this.contactRepository.update(
          contact._id,
          { isPrimary: false },
          'system',
          'system@kompass.local',
        );
      }
    }
  }
}
