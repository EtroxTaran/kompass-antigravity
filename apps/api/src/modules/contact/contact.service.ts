import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ContactRepository } from './contact.repository';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactPerson } from '@kompass/shared';
import { SearchService } from '../search/search.service';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly searchService: SearchService,
  ) { }

  async create(createContactDto: CreateContactDto, userId: string, userEmail?: string): Promise<ContactPerson> {
    this.validateApprovalLimit(createContactDto.canApproveOrders, createContactDto.approvalLimitEur);

    // Pass DTO directly, BaseRepository handles ID, metadata, and audit
    const newContact = await this.contactRepository.create(createContactDto, userId, userEmail);
    this.indexContact(newContact);
    return newContact;
  }

  async findAll(customerId?: string): Promise<any> { // Returns PaginatedResult or Array
    if (customerId) {
      return this.contactRepository.findByCustomerId(customerId);
    }
    return this.contactRepository.findAll();
  }

  async findOne(id: string): Promise<ContactPerson> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto, userId: string, userEmail?: string): Promise<ContactPerson> {
    const existing = await this.findOne(id);

    const canApprove = updateContactDto.canApproveOrders ?? existing.canApproveOrders;
    const limit = updateContactDto.approvalLimitEur ?? existing.approvalLimitEur;
    this.validateApprovalLimit(canApprove, limit);

    const updatedContact = await this.contactRepository.update(id, updateContactDto, userId, userEmail);
    this.indexContact(updatedContact);
    return updatedContact;
  }

  async remove(id: string, userId: string, userEmail?: string): Promise<void> {
    await this.contactRepository.delete(id, userId, userEmail);
    await this.searchService.deleteDocument('contacts', id);
  }

  async checkDuplicates(criteria: { email?: string; phone?: string; excludeId?: string }) {
    const matches = [];

    if (criteria.email) {
      const emailHits = await this.searchService.search('contacts', criteria.email, { limit: 5 });
      matches.push(...emailHits.hits.map((h: any) => ({ ...h, matchReason: 'Email Match' })));
    }

    if (criteria.phone) {
      const phoneHits = await this.searchService.search('contacts', criteria.phone, { limit: 5 });
      matches.push(...phoneHits.hits.map((h: any) => ({ ...h, matchReason: 'Phone Match' })));
    }

    // Deduplicate and filter excludeId
    const uniqueMap = new Map();
    for (const m of matches) {
      if (criteria.excludeId && m.id === criteria.excludeId) continue;
      if (!uniqueMap.has(m.id)) {
        uniqueMap.set(m.id, {
          id: m.id,
          companyName: `${m.firstName} ${m.lastName}`.trim(), // Reuse companyName field for Contact Name
          matchReason: m.matchReason,
          score: 1.0, // Simplified score
        });
      }
    }

    return Array.from(uniqueMap.values());
  }

  private async indexContact(contact: ContactPerson) {
    try {
      await this.searchService.addDocuments('contacts', [
        {
          _id: contact._id,
          id: contact._id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          position: contact.position,
          customerId: contact.customerId,
        },
      ]);
    } catch (e) {
      console.error('Failed to index contact', e);
    }
  }

  private validateApprovalLimit(canApprove: boolean, limit?: number) {
    if (canApprove && (limit === undefined || limit === null)) {
      throw new BadRequestException('Approval limit is required when canApproveOrders is true');
    }
  }
}
