import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { parse as parseDate, isValid } from 'date-fns';
import { de } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';
import {
  ParsedRow,
  ValidationError,
  ImportSession,
  ImportResult,
} from './dto/import.dto';

// Field mapping synonyms for automatic detection
const FIELD_SYNONYMS: Record<string, string[]> = {
  companyName: [
    'company_name',
    'Company Name',
    'Company',
    'Firma',
    'Firmenname',
    'Unternehmensname',
  ],
  vatNumber: [
    'vat_number',
    'VAT Number',
    'USt-IdNr',
    'UStIdNr',
    'Umsatzsteuer-ID',
  ],
  email: ['email', 'Email', 'E-Mail', 'Mail', 'E-Mail-Adresse'],
  phone: ['phone', 'Phone', 'Telefon', 'Tel', 'Telefonnummer'],
  'billingAddress.street': [
    'street',
    'Straße',
    'Strasse',
    'address_street',
    'Adresse',
  ],
  'billingAddress.zipCode': [
    'zip',
    'zipCode',
    'PLZ',
    'Postleitzahl',
    'postal_code',
    'address_zip',
  ],
  'billingAddress.city': ['city', 'Stadt', 'Ort', 'address_city'],
  'billingAddress.country': ['country', 'Land', 'address_country'],
  creditLimit: ['credit_limit', 'Kreditlimit', 'Credit Limit'],
  rating: ['rating', 'Rating', 'Bewertung'],
};

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);
  private sessions: Map<string, ImportSession> = new Map();

  /**
   * Parse uploaded file (Excel or CSV)
   */
  async parseFile(buffer: Buffer, filename: string): Promise<ImportSession> {
    const importId = uuidv4();
    const extension = filename.split('.').pop()?.toLowerCase();

    let headers: string[] = [];
    let rows: ParsedRow[] = [];

    try {
      const workbook = new ExcelJS.Workbook();

      if (extension === 'csv') {
        // Parse CSV
        await workbook.csv.read(require('stream').Readable.from(buffer));
      } else {
        // Parse Excel - convert Buffer to ArrayBuffer
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
        await workbook.xlsx.load(arrayBuffer);
      }

      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error('No worksheet found');
      }

      const rowCount = worksheet.rowCount;
      if (rowCount < 2) {
        throw new BadRequestException({
          type: 'https://api.kompass.de/errors/import-error',
          title: 'Empty File',
          status: 400,
          detail: 'File must contain at least a header row and one data row',
        });
      }

      // Extract headers from first row
      const headerRow = worksheet.getRow(1);
      headers = [];
      headerRow.eachCell((cell, colNumber) => {
        headers[colNumber - 1] = String(cell.value || '').trim();
      });

      // Extract data rows
      rows = [];
      for (let rowNum = 2; rowNum <= rowCount; rowNum++) {
        const row = worksheet.getRow(rowNum);
        const data: Record<string, any> = {};

        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber - 1];
          if (header) {
            data[header] = cell.value;
          }
        });

        rows.push({
          rowIndex: rowNum,
          data,
        });
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/import-error',
        title: 'File Parse Error',
        status: 400,
        detail: `Failed to parse file: ${error.message}`,
      });
    }

    const session: ImportSession = {
      importId,
      filename,
      rowCount: rows.length,
      headers,
      rows,
      status: 'uploaded',
    };

    this.sessions.set(importId, session);
    this.logger.log(
      `Import session ${importId} created with ${rows.length} rows`,
    );

    return session;
  }

  /**
   * Get import session by ID
   */
  getSession(importId: string): ImportSession | undefined {
    return this.sessions.get(importId);
  }

  /**
   * Auto-detect field mappings based on column headers
   */
  autoDetectMappings(headers: string[]): Record<string, string> {
    const mappings: Record<string, string> = {};

    for (const header of headers) {
      const normalizedHeader = header.toLowerCase().trim();

      // Check for exact match first
      for (const [field, synonyms] of Object.entries(FIELD_SYNONYMS)) {
        if (
          field.toLowerCase() === normalizedHeader ||
          synonyms.some((s) => s.toLowerCase() === normalizedHeader)
        ) {
          mappings[header] = field;
          break;
        }
      }
    }

    return mappings;
  }

  /**
   * Set field mappings for an import session
   */
  setMappings(
    importId: string,
    mappings: Record<string, string>,
  ): ImportSession {
    const session = this.sessions.get(importId);
    if (!session) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Import Session Not Found',
        status: 400,
        detail: `Import session ${importId} not found`,
      });
    }

    session.mappings = mappings;
    session.status = 'mapped';
    return session;
  }

  /**
   * Validate import data against business rules
   */
  validateData(
    importId: string,
    validator: (row: Record<string, any>) => ValidationError[],
  ): { validRows: number; invalidRows: number; errors: ValidationError[] } {
    const session = this.sessions.get(importId);
    if (!session) {
      throw new BadRequestException({
        type: 'https://api.kompass.de/errors/not-found',
        title: 'Import Session Not Found',
        status: 400,
        detail: `Import session ${importId} not found`,
      });
    }

    const allErrors: ValidationError[] = [];
    let validRows = 0;
    let invalidRows = 0;

    for (const row of session.rows) {
      const mappedData = this.applyMappings(row.data, session.mappings || {});
      const rowErrors = validator(mappedData);

      if (rowErrors.length > 0) {
        allErrors.push(
          ...rowErrors.map((e) => ({
            ...e,
            row: row.rowIndex,
          })),
        );
        invalidRows++;
      } else {
        validRows++;
      }
    }

    session.status = 'validated';
    return { validRows, invalidRows, errors: allErrors };
  }

  /**
   * Apply field mappings to a row
   */
  applyMappings(
    rowData: Record<string, any>,
    mappings: Record<string, string>,
  ): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [sourceColumn, targetField] of Object.entries(mappings)) {
      const value = rowData[sourceColumn];
      if (value !== undefined && value !== '') {
        this.setNestedValue(result, targetField, value);
      }
    }

    return result;
  }

  /**
   * Set nested value using dot notation
   */
  private setNestedValue(
    obj: Record<string, any>,
    path: string,
    value: any,
  ): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
  }

  /**
   * Get mapped data for all rows
   */
  getMappedRows(importId: string): Record<string, any>[] {
    const session = this.sessions.get(importId);
    if (!session || !session.mappings) {
      return [];
    }

    return session.rows.map((row) =>
      this.applyMappings(row.data, session.mappings!),
    );
  }

  /**
   * Parse various date formats
   */
  parseDate(value: string): Date | null {
    if (!value) return null;

    const formats = [
      'yyyy-MM-dd',
      'dd.MM.yyyy',
      'dd.MM.yy',
      'd.M.yyyy',
      'd.M.yy',
      'dd/MM/yyyy',
      'dd-MM-yyyy',
      'yyyy/MM/dd',
    ];

    for (const format of formats) {
      try {
        const parsed = parseDate(value, format, new Date(), { locale: de });
        if (isValid(parsed)) {
          return parsed;
        }
      } catch {
        // Try next format
      }
    }

    // Try ISO format
    const isoDate = new Date(value);
    if (isValid(isoDate)) {
      return isoDate;
    }

    return null;
  }

  /**
   * Clean up session after import
   */
  cleanupSession(importId: string): void {
    this.sessions.delete(importId);
    this.logger.log(`Import session ${importId} cleaned up`);
  }
}
