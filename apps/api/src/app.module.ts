import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

// Core modules
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';

// Feature modules
import { CustomerModule } from './modules/customer/customer.module';
import { ContactModule } from './modules/contact/contact.module';
import { LocationModule } from './modules/location/location.module';
import { OpportunityModule } from './modules/opportunity/opportunity.module';
import { ProjectModule } from './modules/project/project.module';
import { MaterialModule } from './modules/material/material.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { TimeEntryModule } from './modules/time-entry/time-entry.module';
import { SearchModule } from './modules/search/search.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { MailModule } from './modules/mail/mail.module';
import { ImportExportModule } from './modules/import-export/import-export.module';

// New MVP modules
import { UserTaskModule } from './modules/user-task/user-task.module';
import { ProjectTaskModule } from './modules/project-task/project-task.module';
import { ActivityModule } from './modules/activity/activity.module';
import { OfferModule } from './modules/offer/offer.module';
import { ContractModule } from './modules/contract/contract.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { TourModule } from './modules/tour/tour.module';
import { MileageModule } from './modules/mileage/mileage.module';
import { ProtocolModule } from './modules/protocol/protocol.module';
import { ProjectCostModule } from './modules/project-cost/project-cost.module';
import { PurchaseOrderModule } from './modules/purchase-order/purchase-order.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { SupplierContractModule } from './modules/supplier-contract/supplier-contract.module';
import { SupplierInvoiceModule } from './modules/supplier-invoice/supplier-invoice.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { TranscribeModule } from './modules/transcribe/transcribe.module';
import { RfqModule } from './modules/rfq/rfq.module';
import { ProjectSubcontractorModule } from './modules/project-subcontractor/project-subcontractor.module';
import { PresenceModule } from './modules/presence/presence.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CommentModule } from './modules/comment/comment.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PortalModule } from './modules/portal/portal.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SummarizeModule } from './modules/summarize/summarize.module';

// Guards
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RbacGuard } from './auth/guards/rbac.guard';

// Filters
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Core infrastructure
    DatabaseModule,
    AuthModule,
    PresenceModule,
    SharedModule,
    SearchModule,
    PdfModule,
    MailModule,
    ImportExportModule,

    // Feature modules
    CustomerModule,
    ContactModule,
    LocationModule,
    OpportunityModule,
    ProjectModule,
    MaterialModule,
    SupplierModule,
    InvoiceModule,
    TimeEntryModule,

    // New MVP modules
    UserTaskModule,
    ProjectTaskModule,
    ActivityModule,
    NotificationModule,
    OfferModule,
    ContractModule,
    ExpenseModule,
    TourModule,
    MileageModule,
    ProtocolModule,
    ProjectCostModule,
    PurchaseOrderModule,
    CalendarModule,
    SupplierContractModule,
    SupplierInvoiceModule,
    DeliveryModule,
    TranscribeModule,
    RfqModule,
    ProjectSubcontractorModule,
    InventoryModule,
    CommentModule,
    PortalModule,
    DashboardModule,
    SummarizeModule,
  ],
  providers: [
    // Global exception filter (RFC 7807)
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
