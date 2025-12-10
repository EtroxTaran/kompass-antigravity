import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
} from 'class-validator';

export enum ExportFormat {
  CSV = 'csv',
  EXCEL = 'excel',
  JSON = 'json',
  LEXWARE = 'lexware',
}

export class ExportOptionsDto {
  @IsEnum(ExportFormat)
  format: ExportFormat = ExportFormat.CSV;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export interface ExportOptions {
  format: ExportFormat;
  fields?: string[];
  startDate?: Date;
  endDate?: Date;
  sheetName?: string;
}
