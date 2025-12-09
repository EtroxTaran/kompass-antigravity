import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository } from '../../shared/base.repository';
import { SupplierContract, SupplierContractStatus } from '@kompass/shared';
import * as Nano from 'nano';

@Injectable()
export class SupplierContractRepository extends BaseRepository<SupplierContract> {
  protected readonly entityType = 'supplier_contract';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<SupplierContract>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  /**
   * Find contracts for a specific supplier
   */
  async findBySupplier(
    supplierId: string,
    options: { page?: number; limit?: number } = {},
  ) {
    return this.findBySelector({ supplierId }, options);
  }

  /**
   * Find active contracts (signed or active)
   */
  async findActive(options: { page?: number; limit?: number } = {}) {
    const activeStatuses: SupplierContractStatus[] = [
      'signed',
      'active',
      'in_progress' as SupplierContractStatus,
    ];
    return this.findBySelector({ status: { $in: activeStatuses } }, options);
  }

  /**
   * Generate next contract number
   */
  async generateContractNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `SC-${year}-`;

    // This is a simplified sequential number generation.
    // In high concurrency, this might need a counter document or atomic increment.
    const result = await this.db.find({
      selector: {
        type: this.entityType,
        contractNumber: { $regex: `^${prefix}` },
      },
      fields: ['contractNumber'],
      limit: 10000,
    });

    let maxNumber = 0;
    for (const doc of result.docs) {
      const numPart = (doc as any).contractNumber.replace(prefix, '');
      const num = parseInt(numPart, 10);
      if (num > maxNumber) {
        maxNumber = num;
      }
    }

    return `${prefix}${String(maxNumber + 1).padStart(5, '0')}`;
  }
}
