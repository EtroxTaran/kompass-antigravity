import { Injectable, Inject } from '@nestjs/common';
import { OPERATIONAL_DB } from '../../database/database.module';
import { AuditService } from '../../shared/services/audit.service';
import { BaseRepository, BaseEntity } from '../../shared/base.repository';
import * as Nano from 'nano';

export interface TourStop {
  locationId?: string;
  address?: string;
  name: string;
  arrivalTime?: string;
  departureTime?: string;
  activityType?: 'delivery' | 'pickup' | 'service' | 'visit';
  notes?: string;
  completed: boolean;
}

export interface Tour extends BaseEntity {
  type: 'tour';

  name: string;
  date: string;

  driverId: string;
  vehicleId?: string;

  startLocation: string;
  endLocation: string;
  stops: TourStop[];

  totalDistanceKm?: number;
  totalDurationMinutes?: number;

  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}

@Injectable()
export class TourRepository extends BaseRepository<Tour> {
  protected readonly entityType = 'tour';

  constructor(
    @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Tour>,
    auditService: AuditService,
  ) {
    super(db, auditService);
  }
}
