import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { LeadRepository } from './lead.repository';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';
import { CustomerService } from '../customer/customer.service';
import { Lead } from '@kompass/shared';

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly customerService: CustomerService,
  ) {}

  async findAll(options: { page?: number; limit?: number } = {}) {
    return this.leadRepository.findAll(options);
  }

  async findById(id: string): Promise<Lead> {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new NotFoundException(`Lead with ID '${id}' not found`);
    }
    return lead;
  }

  async findByOwner(
    ownerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.leadRepository.findByOwner(ownerId, options);
  }

  async create(
    dto: CreateLeadDto,
    user: { id: string; email?: string },
  ): Promise<Lead> {
    return this.leadRepository.create(
      {
        ...dto,
        status: 'NEW',
        type: 'lead',
      } as Partial<Lead>,
      user.id,
      user.email,
    );
  }

  async update(
    id: string,
    dto: UpdateLeadDto,
    user: { id: string; email?: string },
  ): Promise<Lead> {
    const lead = await this.findById(id);
    if (lead.status === 'CONVERTED' || lead.status === 'REJECTED') {
      // Allow minor updates or Status changes back?
      // Logic: If trying to update a converted lead, it might be restricted.
      // For now allow it but log warning.
      this.logger.warn(`Updating ${lead.status} lead ${id}`);
    }
    return this.leadRepository.update(
      id,
      dto as Partial<Lead>,
      user.id,
      user.email,
    );
  }

  async convertToCustomer(id: string, user: { id: string; email?: string }) {
    const lead = await this.findById(id);

    if (lead.status === 'CONVERTED') {
      throw new BadRequestException('Lead is already converted');
    }

    // Create Customer
    const customerDto = {
      companyName: lead.companyName,
      email: lead.email,
      phone: lead.phone,
      website: lead.website,
      billingAddress: {
        street: 'TBD', // Address is simplified in Lead, mapped roughly or needs enrichment
        zipCode: '00000',
        city: lead.city || 'Unknown',
        country: lead.country || 'Deutschland',
      },
      locations: [],
      contactPersons: [],
      owner: lead.owner, // Keep same owner
      industry: 'Other', // Default
      acquisitionSource: lead.source, // Map source
    };

    // Note: We are creating a barebones customer.
    // Ideally the user enriches this data in a form before creating.
    // But per requirements "Convert" button might just trigger this.
    // Better UX: Frontend redirects to Customer Create Form pre-filled.
    // Backend Conversion: Use this if "One Click Conversion" is needed.
    // Let's implement this as a backend utility that does the job.

    const customer = await this.customerService.create(
      customerDto as any,
      user,
    ); // Using as any to bypass strict DTO check for now or construct full DTO

    // Update Lead
    await this.update(
      id,
      { status: 'CONVERTED', convertedAndCustomerId: customer._id },
      user,
    );

    return customer;
  }
}
