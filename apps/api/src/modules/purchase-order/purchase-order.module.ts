import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderRepository } from './purchase-order.repository';
import { DatabaseModule } from '../../database/database.module';
import { PdfModule } from '../pdf/pdf.module';
import { MailModule } from '../mail/mail.module';
import { SearchModule } from '../search/search.module';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
  imports: [DatabaseModule, PdfModule, MailModule, SearchModule, SupplierModule],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService, PurchaseOrderRepository],
  exports: [PurchaseOrderService],
})
export class PurchaseOrderModule { }
