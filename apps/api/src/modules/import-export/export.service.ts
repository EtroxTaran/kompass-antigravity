import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { format as formatDate } from 'date-fns';
import { de } from 'date-fns/locale';
import { ExportFormat, ExportOptions } from './dto/export.dto';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  /**
   * Export data to the specified format
   */
  exportData(data: any[], options: ExportOptions): Buffer {
    switch (options.format) {
      case ExportFormat.CSV:
        return this.exportToCsv(data, options);
      case ExportFormat.EXCEL:
        return this.exportToExcel(data, options);
      case ExportFormat.JSON:
        return this.exportToJson(data);
      case ExportFormat.LEXWARE:
        return this.exportLexwareCsv(data);
      case ExportFormat.DATEV:
        return this.exportDatev(data);
      default:
        return this.exportToCsv(data, options);
    }
  }

  /**
   * Export data to CSV format
   */
  exportToCsv(data: any[], options: ExportOptions): Buffer {
    if (data.length === 0) {
      return Buffer.from('', 'utf-8');
    }

    const filteredData = this.filterFields(data, options.fields);
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const csv = XLSX.utils.sheet_to_csv(worksheet, { FS: ';', RS: '\n' });

    // Add UTF-8 BOM for Excel compatibility
    const bom = '\ufeff';
    return Buffer.from(bom + csv, 'utf-8');
  }

  /**
   * Export data to Excel format (.xlsx)
   */
  exportToExcel(data: any[], options: ExportOptions): Buffer {
    if (data.length === 0) {
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.aoa_to_sheet([['No data']]),
        'Export',
      );
      return Buffer.from(
        XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
      );
    }

    const filteredData = this.filterFields(data, options.fields);
    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    // Set column widths based on content
    const colWidths = this.calculateColumnWidths(filteredData);
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    const sheetName = options.sheetName || 'Export';
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    return Buffer.from(
      XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
    );
  }

  /**
   * Export data to JSON format
   */
  exportToJson(data: any[]): Buffer {
    return Buffer.from(JSON.stringify(data, null, 2), 'utf-8');
  }

  /**
   * Export invoices to Lexware-compatible CSV format
   * Uses German formatting: comma decimals, semicolon separator, dd.MM.yyyy dates
   */
  exportLexwareCsv(invoices: any[]): Buffer {
    if (invoices.length === 0) {
      const headers =
        'Rechnungsnummer;Datum;Kunde;Nettobetrag;MwSt;Bruttobetrag';
      const bom = '\ufeff';
      return Buffer.from(bom + headers + '\n', 'utf-8');
    }

    // German column headers as per Lexware specification
    const headers = [
      'Rechnungsnummer',
      'Datum',
      'Kunde',
      'Nettobetrag',
      'MwSt',
      'Bruttobetrag',
    ];

    // Format number to German locale (comma as decimal separator)
    const formatGermanNumber = (value: number): string => {
      if (value === null || value === undefined) return '0,00';
      return value.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    // Format date to German format
    const formatGermanDate = (dateStr: string): string => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        return formatDate(date, 'dd.MM.yyyy', { locale: de });
      } catch {
        return dateStr;
      }
    };

    // Build CSV rows
    const rows = invoices.map((invoice) => {
      const invoiceNumber = invoice.invoiceNumber || '';
      const date = formatGermanDate(invoice.date || invoice.createdAt);
      const customer = invoice.customerName || invoice.customerId || '';
      const netAmount = formatGermanNumber(invoice.totalNet || 0);
      const vatAmount = formatGermanNumber(invoice.vatAmount || 0);
      const grossAmount = formatGermanNumber(invoice.totalGross || 0);

      // Escape fields that might contain semicolons or quotes
      const escapeField = (field: string): string => {
        if (
          field.includes(';') ||
          field.includes('"') ||
          field.includes('\n')
        ) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      };

      return [
        escapeField(invoiceNumber),
        date,
        escapeField(customer),
        netAmount,
        vatAmount,
        grossAmount,
      ].join(';');
    });

    // Combine headers and rows
    const csv = [headers.join(';'), ...rows].join('\n');

    // Add UTF-8 BOM for Excel compatibility
    const bom = '\ufeff';
    return Buffer.from(bom + csv, 'utf-8');
  }

  /**
   * Export invoices to DATEV ASCII format
   * Docs: https://www.datev.de/dnlexos/mobile/api/content/examples/1036228/pdf
   */
  exportDatev(invoices: any[]): Buffer {
    // DATEV Header line
    // Extended header with format description
    const headerLine =
      '"EXTF";700;21;DATEV Format-Logistik;9;20250101000000000;20250101000000000;"";"";"";0;"";"";"";"";"";"";"";"";"";"";"";"";"";"";"";"";"";"";"";"";"";"";"";';

    const headers = [
      'Umsatz (ohne Soll/Haben-Kz)', // 1. Volume
      'Soll/Haben-Kennzeichen', // 2. Debit/Credit
      'Währungsumsatz (ohne Soll/Haben-Kz)', // 3. Currency volume
      'Wechselkurs', // 4. Exchange rate
      'Basisumsatz', // 5. Base volume
      'Währungskennzeichen', // 6. Currency (EUR)
      'Konto', // 7. Account (Debitor)
      'Gegenkonto (ohne BU-Schlüssel)', // 8. Contra Account (Revenue)
      'BU-Schlüssel', // 9. BU-Key
      'Belegdatum', // 10. Date (DDMM)
      'Belegfeld 1', // 11. Invoice Number
      'Belegfeld 2', // 12. Due Date?
      'Skonto', // 13
      'Buchungstext', // 14. Description
    ];

    const rows = invoices.map((invoice) => {
      // 1. Umsatz (Gross Amount)
      const amount = (invoice.totalGross || 0)
        .toFixed(2)
        .replace('.', ',')
        .replace(/-/, ''); // DATEV amounts are always positive, S/H indicates sign

      // 2. Soll/Haben
      const sh = 'S'; // Invoices are Debit (Soll) for Customer account

      // 6. Currency
      const currency = 'EUR';

      // 7. Konto (Debitor) - Use Customer ID hash or default
      // In reality this needs a Mapping table. We'll derive from customerId for now or use dummy.
      // E.g. 10000 + some numeric part of id? Or just 10000 generic.
      // Let's assume a generic Debitor range or try to parse numeric customer ID if available.
      // For this MVP we'll use a placeholder or derived ID.
      // HACK: Use 10000 as base debitor account
      const debitor = '10000';

      // 8. Gegenkonto (Revenue) - Based on VAT
      // Standard SKR03: 19% = 8400, 7% = 8300, 0% = 8120
      // We'll simplistic check vatAmount/totalNet to guess rate or use default 8400
      let revenueAccount = '8400';
      const vatRate =
        invoice.totalNet > 0 ? (invoice.vatAmount / invoice.totalNet) * 100 : 0;

      if (Math.abs(vatRate - 7) < 0.1) revenueAccount = '8300';
      if (Math.abs(vatRate - 0) < 0.1) revenueAccount = '8120';

      // 10. Belegdatum (DDMM)
      const date = invoice.date
        ? formatDate(new Date(invoice.date), 'ddMM')
        : '0101';

      // 11. Belegfeld 1 (Invoice Number)
      const docRef = (invoice.invoiceNumber || '').substring(0, 36);

      // 14. Buchungstext
      const text =
        `${invoice.invoiceNumber || ''} ${invoice.customerName || ''}`
          .substring(0, 60)
          .replace(/;/g, ' '); // simple sanitization

      // Create CSV line (semicolon separated)
      // Standard DATEV format is strictly positional.
      // We fill up to index 14.
      // indices: 0=Amount, 1=SH, ..., 6=Debitor, 7=Contra, ..., 9=Date, 10=Ref, 13=Text
      return [
        amount, // 1
        sh, // 2
        '', // 3
        '', // 4
        '', // 5
        currency, // 6
        debitor, // 7
        revenueAccount, // 8
        '', // 9
        date, // 10
        docRef, // 11
        '', // 12
        '', // 13
        `"${text}"`, // 14
      ].join(';');
    });

    // DATEV uses Windows-1252 usually, but UTF-8 with BOM works for most modern imports too.
    // Spec says ASCII/ANSI. We'll stick to UTF-8 BOM for compatibility with our other exports unless strictly required otherwise.
    const csvContent = [headerLine, headers.join(';'), ...rows].join('\r\n'); // CRLF for Windows

    return Buffer.from('\ufeff' + csvContent, 'utf-8');
  }

  /**
   * Filter data to only include specified fields
   */
  private filterFields(data: any[], fields?: string[]): any[] {
    if (!fields || fields.length === 0) {
      // Flatten nested objects for export
      return data.map((item) => this.flattenObject(item));
    }

    return data.map((item) => {
      const filtered: Record<string, any> = {};
      for (const field of fields) {
        const value = this.getNestedValue(item, field);
        if (value !== undefined) {
          filtered[field] = this.formatValue(value);
        }
      }
      return filtered;
    });
  }

  /**
   * Flatten nested objects for export
   */
  private flattenObject(obj: any, prefix = ''): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key of Object.keys(obj)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      // Skip internal fields
      if (key.startsWith('_') && key !== '_id') continue;

      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        Object.assign(result, this.flattenObject(value, newKey));
      } else {
        result[newKey] = this.formatValue(value);
      }
    }

    return result;
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Format value for export (dates, arrays, etc.)
   */
  private formatValue(value: any): any {
    if (value === null || value === undefined) {
      return '';
    }
    if (value instanceof Date) {
      return formatDate(value, 'dd.MM.yyyy', { locale: de });
    }
    if (typeof value === 'object' && value.toISOString) {
      // ISO date string from DB
      try {
        return formatDate(new Date(value), 'dd.MM.yyyy', { locale: de });
      } catch {
        return value;
      }
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  }

  /**
   * Calculate column widths based on content
   */
  private calculateColumnWidths(data: any[]): Array<{ wch: number }> {
    if (data.length === 0) return [];

    const headers = Object.keys(data[0]);
    return headers.map((header) => {
      const maxLength = Math.max(
        header.length,
        ...data.map((row) => String(row[header] || '').length),
      );
      return { wch: Math.min(maxLength + 2, 50) };
    });
  }

  /**
   * Get content type for response
   */
  getContentType(format: ExportFormat): string {
    switch (format) {
      case ExportFormat.CSV:
      case ExportFormat.LEXWARE:
      case ExportFormat.DATEV:
        return 'text/csv; charset=utf-8';
      case ExportFormat.EXCEL:
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case ExportFormat.JSON:
        return 'application/json';
      default:
        return 'text/csv; charset=utf-8';
    }
  }

  /**
   * Get file extension for format
   */
  getFileExtension(format: ExportFormat): string {
    switch (format) {
      case ExportFormat.CSV:
      case ExportFormat.LEXWARE:
      case ExportFormat.DATEV:
        return 'csv';
      case ExportFormat.EXCEL:
        return 'xlsx';
      case ExportFormat.JSON:
        return 'json';
      default:
        return 'csv';
    }
  }

  /**
   * Generate filename for export
   */
  generateFilename(entityType: string, format: ExportFormat): string {
    const timestamp = formatDate(new Date(), 'yyyy-MM-dd_HHmm', { locale: de });
    const extension = this.getFileExtension(format);
    return `${entityType}_export_${timestamp}.${extension}`;
  }
}
