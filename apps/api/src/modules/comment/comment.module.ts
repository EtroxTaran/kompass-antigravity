import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { ProjectModule } from '../project/project.module';
import { OfferModule } from '../offer/offer.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { ProjectTaskModule } from '../project-task/project-task.module';
import { OpportunityModule } from '../opportunity/opportunity.module';
import { PresenceModule } from '../presence/presence.module';
import { AuthModule } from '../../auth/auth.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    ProjectModule,
    OfferModule,
    InvoiceModule,
    ProjectTaskModule,
    OpportunityModule,
    PresenceModule,
    AuthModule,
    NotificationModule,
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
