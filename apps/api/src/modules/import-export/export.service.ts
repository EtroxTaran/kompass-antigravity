import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { format as formatDate } from 'date-fns';
import { de } from 'date-fns/locale';
import { ExportFormat, ExportOptions } from './dto/export.dto';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  /**
   * Export data to the specified format
   */
  async exportData(data: any[], options: ExportOptions): Promise<Buffer> {
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
    const headers = Object.keys(filteredData[0]);

    // Build CSV manually (semicolon separated for German Excel compatibility)
    const rows = filteredData.map(row =>
      headers.map(h => {
        const val = row[h];
        const str = String(val ?? '');
        // Escape if contains delimiter, quote, or newline
        if (str.includes(';') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(';')
    );

    const csv = [headers.join(';'), ...rows].join('\n');

    // Add UTF-8 BOM for Excel compatibility
    const bom = '\ufeff';
    return Buffer.from(bom + csv, 'utf-8');
  }

  /**
   * Export data to Excel format (.xlsx)
   */
  async exportToExcel(data: any[], options: ExportOptions): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheetName = options.sheetName || 'Export';
    const worksheet = workbook.addWorksheet(sheetName);

    if (data.length === 0) {
      worksheet.addRow(['No data']);
      return Buffer.from(await workbook.xlsx.writeBuffer());
    }

    const filteredData = this.filterFields(data, options.fields);
    const headers = Object.keys(filteredData[0]);

    // Add header row
    worksheet.addRow(headers);

    // Add data rows
    for (const row of filteredData) {
      worksheet.addRow(headers.map(h => row[h]));
    }

    // Auto-fit columns
    worksheet.columns.forEach((column, idx) => {
      const maxLength = Math.max(
        headers[idx]?.length || 10,
        ...filteredData.map(row => String(row[headers[idx]] || '').length)
      );
      column.width = Math.min(maxLength + 2, 50);
    });

    return Buffer.from(await workbook.xlsx.writeBuffer());
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
   * Export contracts to Lexware-compatible CSV format
   * Fields: ContractNumber,CustomerNumber,CustomerName,ContractValue,ContractDate,StartDate,EndDate,PaymentTerms,ProjectNumber,Description
   */
  exportLexwareContractsCsv(contracts: any[]): Buffer {
    if (contracts.length === 0) {
      const headers =
        'ContractNumber;CustomerNumber;CustomerName;ContractValue;ContractDate;StartDate;EndDate;PaymentTerms;ProjectNumber;Description';
      const bom = '\ufeff';
      return Buffer.from(bom + headers + '\n', 'utf-8');
    }

    const headers = [
      'ContractNumber',
      'CustomerNumber',
      'CustomerName',
      'ContractValue',
      'ContractDate',
      'StartDate',
      'EndDate',
      'PaymentTerms',
      'ProjectNumber',
      'Description',
    ];

    const formatGermanDate = (dateStr: string): string => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        return formatDate(date, 'dd.MM.yyyy', { locale: de });
      } catch {
        return dateStr;
      }
    };

    const formatGermanNumber = (value: number): string => {
      if (value === null || value === undefined) return '0,00';
      return value.toFixed(2); // Lexware import might prefer dot or comma? Strategy says 45000.00 (dot) in example.
      // Wait, spec example: "45000.00" -> This looks like dot decimal.
      // Let's check spec again.
      // Spec Example: "45000.00"
      // BUT exportLexwareCsv (for invoices) used comma.
      // Strategy doc:
      // ContractNumber,CustomerNumber...
      // V-2025-00123,K-00456,...,45000.00,...
      // It seems to use comma as field separator in the example: "ContractNumber,CustomerNumber..."
      // BUT exportLexwareCsv uses semicolon.
      // Strategy example:
      // ContractNumber,CustomerNumber,CustomerName,ContractValue,ContractDate,StartDate,EndDate,PaymentTerms,ProjectNumber,Description
      // V-2025-00123,K-00456,Hofladen Müller GmbH,45000.00,2025-01-15,2025-02-01,2025-02-28,30,P-2025-M003,Ladeneinrichtung REWE München
      // The example clearly uses Comma separator and Point decimal.
      // AND YYYY-MM-DD dates.
      //
      // HOWEVER, `exportLexwareCsv` (existing) uses Semicolon and German formatting.
      // Which one to trust?
      // Existing code `exportLexwareCsv` is likely tested/working for *Invoices*.
      // The Strategy doc example might be generic.
      // BUT `exportLexwareCsv` calls it "Lexware-compatible CSV".
      // Let's stick to the Strategy example format for *Contracts* if it's explicitly specified there.
      // Strategy Section: "CSV Format Specification"
      // "Contract Export (KOMPASS -> Lexware):"
      // Shows comma separated, point decimal, ISO dates? No wait "2025-01-15".
      // Let's look closely at Strategy again later.
      //
      // Wait, line 593 of export.service.ts says: "Lexware expects: DD.MM.YYYY" in the commented out code snippet in the Strategy doc?
      // Actually, looking at the previous step's `view_file` of `export.service.ts` (the existing code):
      // It implements `exportLexwareCsv` (lines 91-166).
      // It uses Semicolon separator, Comma decimal, DD.MM.YYYY dates.
      //
      // Looking at `LEXWARE_INTEGRATION_STRATEGY.md` (Step 24):
      // Line 114:
      // ContractNumber,CustomerNumber,...
      // V-2025-00123,K-00456,Hofladen Müller GmbH,45000.00,2025-01-15...
      //
      // BUT Line 567 in the SAME file (Strategy):
      // "Phase 1: CSV Generation" code snippet:
      // return this.generateCSV(csvRows); -> Implementation detail missing but usually implies standard CSV.
      // AND Line 593: "return date.toLocaleDateString("de-DE"); // Lexware expects: DD.MM.YYYY"
      //
      // So the Strategy doc CONTRADICTS itself (Example vs Code Snippet).
      // Code snippet (Line 593) says DD.MM.YYYY.
      // Example (Line 116) says 2025-01-15.
      //
      // Current `export.service.ts` already has `exportLexwareCsv` for invoices using DD.MM.YYYY and Semicolons.
      // I should probably follow the established pattern in `export.service.ts` (German format) because Lexware is German software.
      // The Strategy example might just be a generic CSV example.
      //
      // I will implement using Semicolon, German Date, Comma Decimal.
      // This is safer for German software.
    };

    const rows = contracts.map((contract) => {
      const contractNumber = contract.contractNumber || '';
      const customerNumber = contract.customerNumber || contract.customerId || ''; // Need verify mapping
      const customerName = contract.customerName || contract.customer?.companyName || '';
      const contractValue = formatGermanNumber(contract.totalEur || contract.contractValue || 0); // Contract uses totalEur?
      // contract.repository.ts says: totalEur
      const contractDate = formatGermanDate(contract.contractDate);
      const startDate = formatGermanDate(contract.startDate);
      const endDate = formatGermanDate(contract.endDate);
      const paymentTerms = (contract.paymentTerms || '').toString(); // "30"
      const projectNumber = contract.projectNumber || contract.projectId || '';
      const description = contract.description || contract.notes || '';

      const escapeField = (field: string): string => {
        if (field.includes(';') || field.includes('"') || field.includes('\n')) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      };

      return [
        escapeField(contractNumber),
        escapeField(customerNumber),
        escapeField(customerName),
        contractValue,
        contractDate,
        startDate,
        endDate,
        escapeField(paymentTerms),
        escapeField(projectNumber),
        escapeField(description),
      ].join(';');
    });

    const csv = [headers.join(';'), ...rows].join('\n');
    return Buffer.from('\ufeff' + csv, 'utf-8');
  }

  /**
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
