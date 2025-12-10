import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository } from '../../shared/base.repository';
import { RequestForQuote } from '@kompass/shared';
import * as Nano from 'nano';

@Injectable()
export class RfqRepository extends BaseRepository<RequestForQuote> {
  protected readonly entityType = 'request_for_quote';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<RequestForQuote>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  async generateRfqNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `RFQ-${year}-`;

    const result = await this.db.find({
      selector: {
        type: this.entityType,
        rfqNumber: { $regex: `^${prefix}` },
      },
      fields: ['rfqNumber'],
      limit: 1,
      sort: [{ rfqNumber: 'desc' } as any],
    });

    let nextNumber = 1;
    if (result.docs.length > 0) {
      const lastRfqNumber = (result.docs[0] as any).rfqNumber;
      const lastSequence = parseInt(lastRfqNumber.split('-').pop() || '0', 10);
      nextNumber = lastSequence + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }
}
