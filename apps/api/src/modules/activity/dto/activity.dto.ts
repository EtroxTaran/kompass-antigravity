import {
  IsString,
  IsEnum,
  IsOptional,
  Length,
  MaxLength,
  IsDateString,
  IsNumber,
  Min,
  Max,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AttachmentDto {
  @IsString()
  @Length(1, 255)
  fileName: string;

  @IsString()
  fileUrl: string;

  @IsNumber()
  @Min(0)
  fileSize: number;

  @IsString()
  mimeType: string;

  @IsOptional()
  @IsDateString()
  uploadedAt?: string;
}

export class CreateActivityDto {
  @IsEnum(['call', 'email', 'meeting', 'visit', 'note'])
  activityType: 'call' | 'email' | 'meeting' | 'visit' | 'note';

  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  locationId?: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1440) // Max 24 hours
  duration?: number;

  @IsString()
  @Length(3, 200)
  subject: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  outcome?: string;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  followUpNotes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  // Phase 2 voice-to-text placeholders
  @IsOptional()
  @IsString()
  voiceRecordingUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50000)
  voiceTranscript?: string;
}

export class UpdateActivityDto {
  @IsOptional()
  @IsEnum(['call', 'email', 'meeting', 'visit', 'note'])
  activityType?: 'call' | 'email' | 'meeting' | 'visit' | 'note';

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  locationId?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1440)
  duration?: number;

  @IsOptional()
  @IsString()
  @Length(3, 200)
  subject?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  outcome?: string;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  followUpNotes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @IsOptional()
  @IsString()
  voiceRecordingUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50000)
  voiceTranscript?: string;
}
