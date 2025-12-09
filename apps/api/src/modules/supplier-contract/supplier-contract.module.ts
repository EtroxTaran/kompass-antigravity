import { Module } from '@nestjs/common';
import { SupplierContractController } from './supplier-contract.controller';
import { SupplierContractService } from './supplier-contract.service';
import { SupplierContractRepository } from './supplier-contract.repository';
import { DatabaseModule } from '../../database/database.module';
import { PdfModule } from '../pdf/pdf.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [DatabaseModule, PdfModule, MailModule],
  controllers: [SupplierContractController],
  providers: [SupplierContractService, SupplierContractRepository],
  exports: [SupplierContractService],
})
export class SupplierContractModule {}
