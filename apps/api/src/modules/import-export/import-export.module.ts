import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ImportService } from './import.service';

@Module({
  providers: [ExportService, ImportService],
  exports: [ExportService, ImportService],
})
export class ImportExportModule {}
