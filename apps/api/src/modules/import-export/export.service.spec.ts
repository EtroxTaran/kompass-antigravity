import { Test, TestingModule } from '@nestjs/testing';
import { ExportService } from './export.service';
import { ExportFormat } from './dto/export.dto';

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExportService],
    }).compile();

    service = module.get<ExportService>(ExportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exportToCsv', () => {
    it('should export data to CSV format', () => {
      const data = [
        { companyName: 'Test GmbH', email: 'test@example.com' },
        { companyName: 'Demo AG', email: 'demo@example.com' },
      ];

      const result = service.exportToCsv(data, { format: ExportFormat.CSV });

      expect(result).toBeInstanceOf(Buffer);
      const content = result.toString('utf-8');
      expect(content).toContain('companyName');
      expect(content).toContain('email');
      expect(content).toContain('Test GmbH');
      expect(content).toContain('Demo AG');
    });

    it('should handle empty data', () => {
      const result = service.exportToCsv([], { format: ExportFormat.CSV });

      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString('utf-8')).toBe('');
    });

    it('should filter fields when specified', () => {
      const data = [
        { companyName: 'Test GmbH', email: 'test@example.com', phone: '123' },
      ];

      const result = service.exportToCsv(data, {
        format: ExportFormat.CSV,
        fields: ['companyName'],
      });

      const content = result.toString('utf-8');
      expect(content).toContain('companyName');
      expect(content).not.toContain('phone');
    });
  });

  describe('exportToExcel', () => {
    it('should export data to Excel format', () => {
      const data = [{ companyName: 'Test GmbH', email: 'test@example.com' }];

      const result = service.exportToExcel(data, {
        format: ExportFormat.EXCEL,
        sheetName: 'Test',
      });

      expect(result).toBeInstanceOf(Buffer);
      // Excel files start with PK (ZIP signature)
      expect(result[0]).toBe(0x50);
      expect(result[1]).toBe(0x4b);
    });
  });

  describe('exportToJson', () => {
    it('should export data to JSON format', () => {
      const data = [{ companyName: 'Test GmbH' }];

      const result = service.exportToJson(data);

      expect(result).toBeInstanceOf(Buffer);
      const parsed = JSON.parse(result.toString('utf-8'));
      expect(parsed).toEqual(data);
    });
  });

  describe('exportLexwareCsv', () => {
    it('should export invoices with German column headers', () => {
      const invoices = [
        {
          invoiceNumber: 'INV-2025-00001',
          date: '2025-01-15',
          customerName: 'Test GmbH',
          totalNet: 1000,
          vatAmount: 190,
          totalGross: 1190,
        },
      ];

      const result = service.exportLexwareCsv(invoices);
      const content = result.toString('utf-8');

      // Check German headers
      expect(content).toContain('Rechnungsnummer');
      expect(content).toContain('Datum');
      expect(content).toContain('Kunde');
      expect(content).toContain('Nettobetrag');
      expect(content).toContain('MwSt');
      expect(content).toContain('Bruttobetrag');
    });

    it('should format numbers in German locale (comma decimals)', () => {
      const invoices = [
        {
          invoiceNumber: 'INV-2025-00001',
          date: '2025-01-15',
          customerName: 'Test GmbH',
          totalNet: 1234.56,
          vatAmount: 234.57,
          totalGross: 1469.13,
        },
      ];

      const result = service.exportLexwareCsv(invoices);
      const content = result.toString('utf-8');

      // German number format uses comma as decimal separator
      expect(content).toContain('1.234,56');
      expect(content).toContain('234,57');
      expect(content).toContain('1.469,13');
    });

    it('should format dates in German format (dd.MM.yyyy)', () => {
      const invoices = [
        {
          invoiceNumber: 'INV-2025-00001',
          date: '2025-01-15',
          customerName: 'Test GmbH',
          totalNet: 100,
          vatAmount: 19,
          totalGross: 119,
        },
      ];

      const result = service.exportLexwareCsv(invoices);
      const content = result.toString('utf-8');

      expect(content).toContain('15.01.2025');
    });

    it('should use semicolon as field separator', () => {
      const invoices = [
        {
          invoiceNumber: 'INV-2025-00001',
          date: '2025-01-15',
          customerName: 'Test GmbH',
          totalNet: 100,
          vatAmount: 19,
          totalGross: 119,
        },
      ];

      const result = service.exportLexwareCsv(invoices);
      const content = result.toString('utf-8');
      const lines = content.split('\n');

      // Headers should be semicolon-separated
      expect(lines[0]).toContain(';');
      expect(lines[0].split(';').length).toBe(6);
    });

    it('should include UTF-8 BOM for Excel compatibility', () => {
      const invoices = [
        {
          invoiceNumber: 'INV-2025-00001',
          date: '2025-01-15',
          customerName: 'Test GmbH',
          totalNet: 100,
          vatAmount: 19,
          totalGross: 119,
        },
      ];

      const result = service.exportLexwareCsv(invoices);
      const content = result.toString('utf-8');

      // UTF-8 BOM character
      expect(content.charCodeAt(0)).toBe(0xfeff);
    });

    it('should return headers only for empty data', () => {
      const result = service.exportLexwareCsv([]);
      const content = result.toString('utf-8');

      expect(content).toContain('Rechnungsnummer');
      expect(content.split('\n').length).toBeLessThanOrEqual(2);
    });

    it('should escape fields containing semicolons', () => {
      const invoices = [
        {
          invoiceNumber: 'INV-2025-00001',
          date: '2025-01-15',
          customerName: 'Test; GmbH',
          totalNet: 100,
          vatAmount: 19,
          totalGross: 119,
        },
      ];

      const result = service.exportLexwareCsv(invoices);
      const content = result.toString('utf-8');

      // Field with semicolon should be quoted
      expect(content).toContain('"Test; GmbH"');
    });
  });

  describe('getContentType', () => {
    it('should return correct content type for CSV', () => {
      expect(service.getContentType(ExportFormat.CSV)).toBe(
        'text/csv; charset=utf-8',
      );
    });

    it('should return correct content type for Lexware', () => {
      expect(service.getContentType(ExportFormat.LEXWARE)).toBe(
        'text/csv; charset=utf-8',
      );
    });

    it('should return correct content type for Excel', () => {
      expect(service.getContentType(ExportFormat.EXCEL)).toContain(
        'spreadsheetml',
      );
    });

    it('should return correct content type for JSON', () => {
      expect(service.getContentType(ExportFormat.JSON)).toBe(
        'application/json',
      );
    });
  });

  describe('exportDatev', () => {
    it('should export invoices in DATEV ASCII format', () => {
      const invoices = [
        {
          invoiceNumber: 'INV-2025-001',
          date: '2025-01-15T10:00:00Z',
          customerName: 'Test GmbH',
          totalNet: 1000,
          vatAmount: 190,
          totalGross: 1190,
          customerId: 'CUST123',
        },
      ];

      const result = service.exportDatev(invoices);
      const content = result.toString('utf-8');

      // Check Header
      expect(content).toContain('"EXTF";700;21;DATEV Format-Logistik');

      // Check Data Row
      // Amount: 1190.00 -> 1190,00
      expect(content).toContain('1190,00');
      // S/H: S
      expect(content).toContain(';S;');
      // Currency: EUR
      expect(content).toContain(';EUR;');
      // Debitor: 10000
      expect(content).toContain(';10000;');
      // Revenue Account: 19% VAT -> 8400
      expect(content).toContain(';8400;');
      // Date: 15.01 -> 1501
      expect(content).toContain(';1501;');
      // Doc Ref: INV-2025-001
      expect(content).toContain(';INV-2025-001;');
      // Text
      expect(content).toContain('"INV-2025-001 Test GmbH"');
    });

    it('should handle 7% VAT rate correctly', () => {
      const invoices = [
        {
          invoiceNumber: 'INV-7',
          date: '2025-01-01',
          totalNet: 100,
          vatAmount: 7,
          totalGross: 107,
        },
      ];

      const result = service.exportDatev(invoices);
      const content = result.toString('utf-8');

      // Revenue Account: 7% VAT -> 8300
      expect(content).toContain(';8300;');
    });

    it('should handle 0% VAT rate correctly', () => {
      const invoices = [
        {
          invoiceNumber: 'INV-0',
          date: '2025-01-01',
          totalNet: 100,
          vatAmount: 0,
          totalGross: 100,
        },
      ];

      const result = service.exportDatev(invoices);
      const content = result.toString('utf-8');

      // Revenue Account: 0% VAT -> 8120
      expect(content).toContain(';8120;');
    });
  });

  describe('generateFilename', () => {
    it('should generate filename with correct extension', () => {
      const csvFilename = service.generateFilename(
        'customers',
        ExportFormat.CSV,
      );
      expect(csvFilename).toMatch(/^customers_export_.*\.csv$/);

      const excelFilename = service.generateFilename(
        'customers',
        ExportFormat.EXCEL,
      );
      expect(excelFilename).toMatch(/^customers_export_.*\.xlsx$/);

      const lexwareFilename = service.generateFilename(
        'rechnungen',
        ExportFormat.LEXWARE,
      );
      expect(lexwareFilename).toMatch(/^rechnungen_export_.*\.csv$/);

      const datevFilename = service.generateFilename(
        'datev',
        ExportFormat.DATEV,
      );
      expect(datevFilename).toMatch(/^datev_export_.*\.csv$/);
    });
  });
});
