import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDate,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MeetingType } from '@kompass/shared/types/entities/meeting';

/**
 * Re-export MeetingType from shared for DTO usage
 * This ensures enum values always match between DTO and entity
 */
export { MeetingType };

/**
 * Meeting Status Enum
 * Note: This is a derived status for API purposes.
 * The entity doesn't store status explicitly - it uses 'attended' and 'outcome' fields.
 */
export enum MeetingStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

/**
 * Create Meeting DTO
 */
export class CreateMeetingDto {
  @ApiProperty({
    description: 'Scheduled date and time',
    example: '2025-06-15T10:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  scheduledAt: Date;

  @ApiProperty({
    description: 'Meeting title/subject',
    example: 'Besprechung neuer Ladenbau-Projektanforderungen',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @Length(2, 200)
  title: string;

  @ApiPropertyOptional({
    description: 'Meeting description',
    example: 'Detaillierte Besprechung der Anforderungen für den neuen Ladenbau',
    maxLength: 500,
  })
  @IsString()
  @Length(0, 500)
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Duration in minutes',
    example: 60,
    minimum: 15,
    maximum: 480,
  })
  @IsNumber()
  @Min(15)
  @Max(480)
  duration: number;

  @ApiProperty({
    description: 'Meeting type',
    enum: MeetingType,
    example: MeetingType.FOLLOW_UP,
  })
  @IsEnum(MeetingType)
  meetingType: MeetingType;


  @ApiProperty({
    description: 'Customer ID',
    example: 'customer-123',
  })
  @IsString()
  customerId: string;

  @ApiProperty({
    description: 'Location ID for the meeting',
    example: 'location-456',
  })
  @IsString()
  locationId: string;

  @ApiPropertyOptional({
    description: 'Tour ID (if part of a tour)',
    example: 'tour-789',
  })
  @IsString()
  @IsOptional()
  tourId?: string;

  @ApiPropertyOptional({
    description: 'Contact person IDs attending the meeting',
    type: [String],
    example: ['contact-111', 'contact-222'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attendees?: string[];

  @ApiPropertyOptional({
    description: 'Project ID (if related to a project/opportunity)',
    example: 'project-999',
  })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({
    description: 'Follow-up date if needed',
    example: '2025-06-20T10:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  followUpDate?: Date;

  @ApiPropertyOptional({
    description: 'Related opportunity ID',
    example: 'opportunity-123',
  })
  @IsString()
  @IsOptional()
  opportunityId?: string;
}

