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
