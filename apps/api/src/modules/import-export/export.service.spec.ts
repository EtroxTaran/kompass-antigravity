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

  describe('getContentType', () => {
    it('should return correct content type for CSV', () => {
      expect(service.getContentType(ExportFormat.CSV)).toBe(
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
    });
  });
});
