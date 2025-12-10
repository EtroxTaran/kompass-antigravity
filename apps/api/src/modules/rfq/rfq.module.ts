import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RfqController } from './rfq.controller';
import { RfqService } from './rfq.service';
import { RfqRepository } from './rfq.repository';
import { PdfModule } from '../pdf/pdf.module';
import { MailModule } from '../mail/mail.module';
import { SupplierModule } from '../supplier/supplier.module';
import { ContractModule } from '../contract/contract.module';

@Module({
  imports: [
    DatabaseModule,
    PdfModule,
    MailModule,
    SupplierModule,
    ContractModule,
  ],
  controllers: [RfqController],
  providers: [RfqService, RfqRepository],
  exports: [RfqService],
})
export class RfqModule {}
