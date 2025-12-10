import { Module } from '@nestjs/common';
import { SupplierInvoiceService } from './supplier-invoice.service';
import { SupplierInvoiceController } from './supplier-invoice.controller';
import { SupplierInvoiceRepository } from './supplier-invoice.repository';
import { PurchaseOrderModule } from '../purchase-order/purchase-order.module';
import { DeliveryModule } from '../delivery/delivery.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [PurchaseOrderModule, DeliveryModule, ProjectModule],
  controllers: [SupplierInvoiceController],
  providers: [SupplierInvoiceService, SupplierInvoiceRepository],
  exports: [SupplierInvoiceService],
})
export class SupplierInvoiceModule {}
