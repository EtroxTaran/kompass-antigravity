import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

class NextActionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  task: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  assignee: string;

  @IsString()
  @IsOptional()
  dueDate?: string;
}

export class CreateProtocolDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string;

  @IsString()
  date: string; // ISO date format

  @IsString()
  customerId: string;

  @IsString()
  @MaxLength(5000)
  summary: string;

  @IsArray()
  @IsString({ each: true })
  participants: string[];

  @IsString()
  @IsOptional()
  opportunityId?: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  voiceNoteUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10000)
  transcription?: string;

  @ValidateNested({ each: true })
  @Type(() => NextActionDto)
  @IsOptional()
  nextActions?: NextActionDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateProtocolDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  summary?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  participants?: string[];

  @IsString()
  @IsOptional()
  opportunityId?: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  voiceNoteUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10000)
  transcription?: string;

  @ValidateNested({ each: true })
  @Type(() => NextActionDto)
  @IsOptional()
  nextActions?: NextActionDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
