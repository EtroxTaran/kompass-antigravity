import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/base.repository';
import { Location } from '@kompass/shared';
import { Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import * as Nano from 'nano';

@Injectable()
export class LocationRepository extends BaseRepository<Location> {
  protected readonly entityType = 'location';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Location>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  async findByCustomerId(customerId: string): Promise<Location[]> {
    const result = await this.findBySelector(
      { customerId: customerId },
      { limit: 100 }
    );
    return result.data;
  }

  async deleteByCustomer(customerId: string, userId: string, userEmail?: string): Promise<number> {
    const locations = await this.findByCustomerId(customerId);
    let deletedCount = 0;
    for (const location of locations) {
      await this.delete(location._id, userId, userEmail);
      deletedCount++;
    }
    return deletedCount;
  }
}
