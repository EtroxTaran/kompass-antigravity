import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsDate,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  Length,
} from 'class-validator';

import { MeetingType, MeetingStatus } from './create-meeting.dto';

/**
 * Update Meeting DTO
 */
export class UpdateMeetingDto {
  @ApiPropertyOptional({
    description: 'Scheduled date and time',
    example: '2025-06-15T10:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  scheduledAt?: Date;

  @ApiPropertyOptional({
    description: 'Meeting title/subject',
    example: 'Besprechung neuer Ladenbau-Projektanforderungen',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @Length(2, 200)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Meeting description',
    example:
      'Detaillierte Besprechung der Anforderungen für den neuen Ladenbau',
    maxLength: 500,
  })
  @IsString()
  @Length(0, 500)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Duration in minutes',
    example: 60,
    minimum: 15,
    maximum: 480,
  })
  @IsNumber()
  @Min(15)
  @Max(480)
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({
    description: 'Meeting type',
    enum: MeetingType,
  })
  @IsEnum(MeetingType)
  @IsOptional()
  meetingType?: MeetingType;

  @ApiPropertyOptional({
    description: 'Meeting outcome/summary',
    example:
      'Kunde zeigt großes Interesse an neuem Ladenbau-Konzept. Nächster Schritt: Angebotserstellung.',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString()
  @Length(10, 2000)
  @IsOptional()
  outcome?: string;

  @ApiPropertyOptional({
    description: 'Whether the meeting actually took place',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  attended?: boolean;

  @ApiPropertyOptional({
    description: 'Follow-up date if needed',
    example: '2025-06-20T10:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  followUpDate?: Date;

  @ApiPropertyOptional({
    description: 'Detailed notes from the meeting',
    example: 'Kunde wünscht nachhaltige Materialien. Budget: €50.000-€70.000.',
    maxLength: 5000,
  })
  @IsString()
  @Length(0, 5000)
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Tour ID (to link meeting to a tour)',
    example: 'tour-789',
  })
  @IsString()
  @IsOptional()
  tourId?: string;
}

/**
 * GPS Check-In DTO
 */
export class CheckInDto {
  @ApiProperty({
    description: 'GPS latitude',
    example: 48.1351,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'GPS longitude',
    example: 11.582,
  })
  @IsNumber()
  longitude: number;
}
