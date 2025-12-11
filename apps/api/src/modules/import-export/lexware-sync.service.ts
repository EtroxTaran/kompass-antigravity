import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ContractRepository } from '../contract/contract.repository';
import { InvoiceRepository } from '../invoice/invoice.repository';
import { ExportService } from './export.service';
import * as fs from 'fs';
import * as path from 'path';
import { InvoiceService } from '../invoice/invoice.service';

@Injectable()
export class LexwareSyncService implements OnModuleInit {
  private readonly logger = new Logger(LexwareSyncService.name);
  private readonly EXPORT_PATH = './lexware-sync/exports';
  private readonly IMPORT_PATH = './lexware-sync/imports';
  private syncInterval: NodeJS.Timeout;

  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceService: InvoiceService,
    private readonly exportService: ExportService,
  ) {
    this.ensureDirectories();
  }

  onModuleInit() {
    this.logger.log('Initializing Lexware Sync Service...');
    // Schedule export every night (simulated check every hour)
    // For now, we'll just log that it's active.
    // In a real app we'd use a robust scheduler.
    // We will rely on manual trigger or simple interval for Phase 2.
    this.syncInterval = setInterval(
      () => {
        // Check if we should export (e.g. is it 2 AM?)
        // Simulating automation catch-up:
        // For this MVP step, we won't auto-run but provide the Logic.
      },
      60 * 60 * 1000,
    ); // Check every hour
  }

  private ensureDirectories() {
    if (!fs.existsSync(this.EXPORT_PATH)) {
      fs.mkdirSync(this.EXPORT_PATH, { recursive: true });
    }
    if (!fs.existsSync(this.IMPORT_PATH)) {
      fs.mkdirSync(this.IMPORT_PATH, { recursive: true });
    }
  }

  async getSyncStatus() {
    const exports = fs.readdirSync(this.EXPORT_PATH).map((f) => ({
      filename: f,
      createdAt: fs.statSync(path.join(this.EXPORT_PATH, f)).birthtime,
      type: 'export',
    }));

    const imports = fs.readdirSync(this.IMPORT_PATH).map((f) => ({
      filename: f,
      createdAt: fs.statSync(path.join(this.IMPORT_PATH, f)).birthtime,
      type: 'import',
    }));

    return {
      lastSync: new Date(), // placeholder
      files: [...exports, ...imports].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      ),
      exportPath: path.resolve(this.EXPORT_PATH),
      importPath: path.resolve(this.IMPORT_PATH),
    };
  }

  async exportContractsToLexware(): Promise<{
    count: number;
    filename: string;
  }> {
    // 1. Find contracts signed in the last 24h (or all unsynced?)
    // For Phase 2, let's just grab "Verified" contracts or use a specific window.
    // Going with "Signed" contracts from last 7 days to be safe for manual trigger.
    const now = new Date();
    const sevenDaysAgo = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const result = await this.contractRepository.findByStatus('signed', {
      limit: 1000,
    });
    // Filter locally for date if needed, or assume Status change is the trigger.
    // Ideally we would track "synced" status. For now, dump all 'signed' (MVP/Phase 2 simplifiction).
    // Or better: Filter by updated_at if possible. BaseRepository might not expose it easily in query.
    // Let's just export ALL signed contracts for now as a base sync.
    const contracts = result.data.filter(
      (c) => c.modifiedAt && c.modifiedAt > sevenDaysAgo,
    );

    if (contracts.length === 0) {
      return { count: 0, filename: '' };
    }

    const csvBuffer = this.exportService.exportLexwareContractsCsv(contracts);
    const filename = `kompass_contracts_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
    const filePath = path.join(this.EXPORT_PATH, filename);

    fs.writeFileSync(filePath, csvBuffer);
    this.logger.log(`Exported ${contracts.length} contracts to ${filePath}`);

    return { count: contracts.length, filename };
  }

  async importPaymentsFromLexware() {
    // Lister files in imports
    const files = fs
      .readdirSync(this.IMPORT_PATH)
      .filter((f) => f.endsWith('.csv') && !f.endsWith('.processed'));
    let totalImported = 0;

    for (const file of files) {
      const filePath = path.join(this.IMPORT_PATH, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Parse CSV
      // Lexware Invoice Export Format (as per Strategy):
      // InvoiceNumber,CustomerNumber,InvoiceDate...
      // But we just need InvoiceNumber and Payment info.

      const lines = content.split('\n');
      // Skip header?
      const processLine = async (line: string) => {
        // This is naive parsing, should use CSV parser properly or simple generic split
        // Assuming Semicolon separated as per our Export service default? Or Comma?
        // Strategy said Comma for Contracts, maybe Semicolon for Invoices?
        // Let's try to detect.
        const separator = line.includes(';') ? ';' : ',';
        const parts = line.split(separator);
        if (parts.length < 5) return;

        // Mapping (based on Strategy "Payment Import (Lexware -> KOMPASS)" sample)
        // InvoiceNumber,CustomerNumber,InvoiceDate,DueDate,GrossAmount,PaymentDate,PaymentAmount...
        // [0] InvoiceNumber
        // [5] PaymentDate
        // [6] PaymentAmount
        // [8] Status
        const invoiceNumber = parts[0]?.trim().replace(/"/g, '');
        const paymentStatus = parts[8]?.trim().replace(/"/g, '') || 'Paid';

        if (invoiceNumber && invoiceNumber.startsWith('R-')) {
          // Assuming Invoice No starts with R- or INV-
          try {
            // Find Invoice
            const invoice =
              await this.invoiceRepository.findByInvoiceNumber(invoiceNumber);
            if (invoice) {
              // Update status
              // Need to call Service to ensure logic? Or Repo directly?
              // Repo doesn't have biz logic. Use check.
              if (
                invoice.status !== 'paid' &&
                paymentStatus.toLowerCase() === 'paid'
              ) {
                await this.invoiceRepository.update(
                  invoice._id,
                  { status: 'paid' },
                  'system',
                );
                totalImported++;
              }
            }
          } catch (e) {
            this.logger.error(
              `Failed to process payment for ${invoiceNumber}`,
              e,
            );
          }
        }
      };

      for (const line of lines.slice(1)) {
        // Skip header
        await processLine(line);
      }

      // Mark processed
      fs.renameSync(filePath, filePath + '.processed');
    }

    return { processedFiles: files.length, invoicesUpdated: totalImported };
  }
}
