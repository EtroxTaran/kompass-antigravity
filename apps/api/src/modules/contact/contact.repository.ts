import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/base.repository';
import { ContactPerson } from '@kompass/shared';
import { Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import * as Nano from 'nano';

@Injectable()
export class ContactRepository extends BaseRepository<ContactPerson> {
  protected readonly entityType = 'contact';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<ContactPerson>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  async findByCustomerId(customerId: string): Promise<ContactPerson[]> {
    const result = await this.findBySelector(
      { customerId: customerId },
      { limit: 100 } // Reasonable limit for filtered list
    );
    return result.data;
  }

  async deleteByCustomer(customerId: string, userId: string, userEmail?: string): Promise<number> {
    const contacts = await this.findByCustomerId(customerId);
    let deletedCount = 0;
    for (const contact of contacts) {
      await this.delete(contact._id, userId, userEmail);
      deletedCount++;
    }
    return deletedCount;
  }
}
