import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ImportService } from './import.service';
import { LexwareSyncService } from './lexware-sync.service';
import { LexwareController } from './lexware.controller';
import { ContractModule } from '../contract/contract.module';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [ContractModule, InvoiceModule],
  providers: [ExportService, ImportService, LexwareSyncService],
  controllers: [LexwareController],
  exports: [ExportService, ImportService],
})
export class ImportExportModule { }
