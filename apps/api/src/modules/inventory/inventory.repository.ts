import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { BaseRepository } from '../../shared/base.repository';
import { AuditService } from '../../shared/services/audit.service';
import { InventoryMovement } from '@kompass/shared';
import * as Nano from 'nano';

@Injectable()
export class InventoryMovementRepository extends BaseRepository<InventoryMovement> {
  protected readonly entityType = 'inventory_movement';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<InventoryMovement>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }

  async findByMaterial(materialId: string): Promise<InventoryMovement[]> {
    const result = await this.findBySelector(
      {
        materialId: materialId,
      },
      { sort: 'movementDate', order: 'desc', limit: 100 },
    );
    return result.data;
  }
}
