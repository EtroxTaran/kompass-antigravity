import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryRepository } from './delivery.repository';
// Controller omitted for minimal implementation as it's internal logic for now, 
// unless we need to create deliveries from frontend in this task (not in requirements).
// But for completeness and testing, let's expose at least a basic one or just service export.

@Module({
    providers: [DeliveryService, DeliveryRepository],
    exports: [DeliveryService],
})
export class DeliveryModule { }
