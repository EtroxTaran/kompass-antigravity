import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MeetingType, MeetingStatus } from './create-meeting.dto';

/**
 * Meeting Response DTO
 */
export class MeetingResponseDto {
  @ApiProperty({
    description: 'Meeting ID',
    example: 'meeting-550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Scheduled date and time',
    example: '2025-06-15T10:00:00Z',
  })
  scheduledAt: Date;

  @ApiProperty({
    description: 'Duration in minutes',
    example: 60,
  })
  durationMinutes: number;

  @ApiProperty({
    description: 'Meeting type',
    enum: MeetingType,
    example: MeetingType.FOLLOW_UP,
  })
  meetingType: MeetingType;

  @ApiProperty({
    description: 'Purpose of the meeting',
    example: 'Besprechung neuer Ladenbau-Projektanforderungen',
  })
  purpose: string;

  @ApiProperty({
    description: 'Customer ID',
    example: 'customer-123',
  })
  customerId: string;

  @ApiProperty({
    description: 'Location ID',
    example: 'location-456',
  })
  locationId: string;

  @ApiPropertyOptional({
    description: 'Tour ID',
    example: 'tour-789',
  })
  tourId?: string;

  @ApiProperty({
    description: 'Contact person IDs',
    type: [String],
    example: ['contact-111', 'contact-222'],
  })
  contactPersonIds: string[];

  @ApiPropertyOptional({
    description: 'Project ID',
    example: 'project-999',
  })
  projectId?: string;

  @ApiProperty({
    description: 'Meeting status',
    enum: MeetingStatus,
    example: MeetingStatus.SCHEDULED,
  })
  status: MeetingStatus;

  @ApiPropertyOptional({
    description: 'Meeting outcome',
    example: 'Kunde zeigt großes Interesse an neuem Ladenbau-Konzept.',
  })
  outcome?: string;

  @ApiProperty({
    description: 'Whether meeting was attended',
    example: false,
  })
  attended: boolean;

  @ApiPropertyOptional({
    description: 'Check-in timestamp',
    example: '2025-06-15T10:05:00Z',
  })
  checkInTime?: Date;

  @ApiPropertyOptional({
    description: 'Check-out timestamp',
    example: '2025-06-15T11:00:00Z',
  })
  checkOutTime?: Date;

  @ApiProperty({
    description: 'Whether follow-up is required',
    example: true,
  })
  followUpRequired: boolean;

  @ApiPropertyOptional({
    description: 'Follow-up date',
    example: '2025-06-20T10:00:00Z',
  })
  followUpDate?: Date;

  @ApiPropertyOptional({
    description: 'Detailed notes',
    example: 'Kunde wünscht nachhaltige Materialien.',
  })
  notes?: string;

  @ApiProperty({
    description: 'Created timestamp',
    example: '2025-06-10T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last modified timestamp',
    example: '2025-06-15T11:00:00Z',
  })
  modifiedAt: Date;
}

