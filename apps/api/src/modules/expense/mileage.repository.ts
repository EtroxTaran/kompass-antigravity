import { Injectable, Inject } from "@nestjs/common";
import { BaseRepository } from "../../shared/base.repository";
import { Mileage } from "@kompass/shared";
import { OPERATIONAL_DB } from "../../database/database.module";
import { AuditService } from "../../shared/services/audit.service";
import * as Nano from 'nano';

@Injectable()
export class MileageRepository extends BaseRepository<Mileage> {
    protected readonly entityType = "mileage";

    constructor(
        @Inject(OPERATIONAL_DB) db: Nano.DocumentScope<Mileage>,
        auditService: AuditService
    ) {
        super(db, auditService);
    }
}
