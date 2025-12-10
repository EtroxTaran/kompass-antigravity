import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { PdfModule } from '../pdf/pdf.module';
import { MailModule } from '../mail/mail.module';
import { ImportExportModule } from '../import-export/import-export.module';

import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from './invoice.repository';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
  imports: [PdfModule, MailModule, ImportExportModule],
  exports: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
