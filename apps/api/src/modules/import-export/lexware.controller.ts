import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { LexwareSyncService } from './lexware-sync.service';
import { Response } from 'express';

@Controller('integration/lexware')
export class LexwareController {
  constructor(private readonly lexwareSyncService: LexwareSyncService) {}

  @Get('status')
  async getStatus() {
    return this.lexwareSyncService.getSyncStatus();
  }

  @Post('export/trigger')
  async triggerExport() {
    return this.lexwareSyncService.exportContractsToLexware();
  }

  @Post('import/trigger')
  async triggerImport() {
    return this.lexwareSyncService.importPaymentsFromLexware();
  }
}
