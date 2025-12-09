import {
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  IsArray,
} from 'class-validator';

export interface FieldMapping {
  sourceColumn: string;
  targetField: string;
}

export class ImportMappingsDto {
  @IsObject()
  mappings: Record<string, string>;

  @IsOptional()
  @IsBoolean()
  autoDetect?: boolean;
}

export class ImportExecuteDto {
  @IsOptional()
  @IsBoolean()
  skipErrors?: boolean;

  @IsOptional()
  @IsBoolean()
  skipDuplicates?: boolean;

  @IsOptional()
  @IsBoolean()
  updateDuplicates?: boolean;
}

export interface ParsedRow {
  rowIndex: number;
  data: Record<string, any>;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
  status: 'error' | 'warning';
}

export interface ImportResult {
  importId: string;
  importedCount: number;
  skippedCount: number;
  errorCount: number;
  duplicateCount: number;
  status: 'completed' | 'failed';
  errors?: ValidationError[];
}

export interface ImportSession {
  importId: string;
  filename: string;
  rowCount: number;
  headers: string[];
  rows: ParsedRow[];
  mappings?: Record<string, string>;
  status: 'uploaded' | 'mapped' | 'validated' | 'completed';
}
