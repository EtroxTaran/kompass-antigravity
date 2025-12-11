import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import { NotificationGateway } from './notification.gateway';
import { DatabaseModule } from '../../database/database.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
    imports: [DatabaseModule, SharedModule],
    controllers: [NotificationController],
    providers: [
        NotificationService,
        NotificationRepository,
        NotificationGateway,
    ],
    exports: [NotificationService],
})
export class NotificationModule { }
