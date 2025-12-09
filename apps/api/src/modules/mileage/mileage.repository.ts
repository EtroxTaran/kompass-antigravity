import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository, BaseEntity } from '../../shared/base.repository';
import * as Nano from 'nano';

export interface Mileage extends BaseEntity {
  type: 'mileage';

  userId: string;
  date: string;

  vehicleId?: string;
  licensePlate?: string;

  startLocation: string;
  endLocation: string;
  distanceKm: number;

  purpose: string;
  projectId?: string;
  tourId?: string;

  status: 'draft' | 'submitted' | 'approved';
}

@Injectable()
export class MileageRepository extends BaseRepository<Mileage> {
  protected readonly entityType = 'mileage';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Mileage>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }
}
