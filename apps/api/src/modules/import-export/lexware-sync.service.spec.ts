import { Test, TestingModule } from '@nestjs/testing';
import { LexwareSyncService } from './lexware-sync.service';
import { ContractRepository } from '../contract/contract.repository';
import { InvoiceRepository } from '../invoice/invoice.repository';
import { InvoiceService } from '../invoice/invoice.service';
import { ExportService } from './export.service';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('pdfmake/src/printer', () => {
  return class PdfPrinter {
    createPdfKitDocument() {
      return {};
    }
  };
});
jest.mock('../invoice/invoice.service');
jest.mock('../pdf/pdf.service');

describe('LexwareSyncService', () => {
    let service: LexwareSyncService;
    let contractRepository: any;
    let invoiceRepository: any;
    let invoiceService: any;
    let exportService: any;

    beforeEach(async () => {
        contractRepository = {
            findByStatus: jest.fn(),
        };
        invoiceRepository = {
            findByInvoiceNumber: jest.fn(),
            update: jest.fn(),
        };
        invoiceService = {};
        exportService = {
            exportLexwareContractsCsv: jest.fn(),
        };

        // Mock fs
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.mkdirSync as jest.Mock).mockReturnValue(true);
        (fs.readdirSync as jest.Mock).mockReturnValue([]);
        (fs.statSync as jest.Mock).mockReturnValue({ birthtime: new Date() });

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LexwareSyncService,
                { provide: ContractRepository, useValue: contractRepository },
                { provide: InvoiceRepository, useValue: invoiceRepository },
                { provide: InvoiceService, useValue: invoiceService },
                { provide: ExportService, useValue: exportService },
            ],
        }).compile();

        service = module.get<LexwareSyncService>(LexwareSyncService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('exportContractsToLexware', () => {
        it('should export signed contracts with recent modifications', async () => {
            const contracts = [
                {
                    _id: '1',
                    contractNumber: 'C-001',
                    status: 'signed',
                    modifiedAt: new Date().toISOString(), // recent
                },
            ];
            contractRepository.findByStatus.mockResolvedValue({ data: contracts });
            exportService.exportLexwareContractsCsv.mockReturnValue(Buffer.from('csv'));
            (fs.writeFileSync as jest.Mock).mockImplementation(() => { });

            const result = await service.exportContractsToLexware();

            expect(contractRepository.findByStatus).toHaveBeenCalledWith('signed', { limit: 1000 });
            expect(exportService.exportLexwareContractsCsv).toHaveBeenCalledWith(contracts);
            expect(fs.writeFileSync).toHaveBeenCalled();
            expect(result.count).toBe(1);
        });

        it('should ignore old contracts', async () => {
            const oldDate = new Date();
            oldDate.setDate(oldDate.getDate() - 8);
            const contracts = [
                {
                    _id: '1',
                    contractNumber: 'C-001',
                    status: 'signed',
                    modifiedAt: oldDate.toISOString(), // old
                },
            ];
            contractRepository.findByStatus.mockResolvedValue({ data: contracts });

            const result = await service.exportContractsToLexware();
            expect(exportService.exportLexwareContractsCsv).not.toHaveBeenCalled();
            expect(result.count).toBe(0);
        });
    });

    describe('importPaymentsFromLexware', () => {
        it('should process payment csv', async () => {
            (fs.readdirSync as jest.Mock).mockReturnValue(['payment.csv']);
            (fs.readFileSync as jest.Mock).mockReturnValue('InvoiceNumber;CustomerNumber;Date;Due;Gross;PayDate;PayAmount;Empty;Paid\nR-1001;123;;;;2025-01-01;100;;Paid');

            invoiceRepository.findByInvoiceNumber.mockResolvedValue({ _id: '1', status: 'sent', invoiceNumber: 'R-1001' });
            invoiceRepository.update.mockResolvedValue({});
            (fs.renameSync as jest.Mock).mockImplementation(() => { });

            const result = await service.importPaymentsFromLexware();

            expect(invoiceRepository.findByInvoiceNumber).toHaveBeenCalledWith('R-1001');
            expect(invoiceRepository.update).toHaveBeenCalledWith('1', { status: 'paid' }, 'system');
            expect(result.invoicesUpdated).toBe(1);
        });
    });
});
