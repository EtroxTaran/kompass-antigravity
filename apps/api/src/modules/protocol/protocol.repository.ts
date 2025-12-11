import { Injectable, Inject, Logger } from '@nestjs/common';
import { BaseRepository } from '../../shared/base.repository';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { Protocol } from '@kompass/shared';
import * as Nano from 'nano';

@Injectable()
export class ProtocolRepository extends BaseRepository<Protocol> {
  protected readonly entityType = 'protocol';
  private readonly logger = new Logger(ProtocolRepository.name);

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Protocol>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  /**
   * Find protocols for a specific customer
   */
  async findByCustomer(
    customerId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ customerId }, options);
  }

  /**
   * Unlink all protocols from a customer (set customerId = null)
   * Used for cascading customer delete - preserves protocol data
   */
  async unlinkFromCustomer(
    customerId: string,
    userId: string,
  ): Promise<number> {
    const result = await this.findByCustomer(customerId, { limit: 1000 });
    let unlinkedCount = 0;

    for (const protocol of result.data) {
      await this.update(
        protocol._id,
        { customerId: undefined } as Partial<Protocol>,
        userId,
      );
      unlinkedCount++;
    }

    return unlinkedCount;
  }
}
