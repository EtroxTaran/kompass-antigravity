import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean, IsArray, IsISO8601, MaxLength, Matches } from 'class-validator';

export enum CalendarEventType {
  USER_TASK = 'user_task',
  PROJECT_TASK = 'project_task',
  PROJECT_DEADLINE = 'project_deadline',
  PROJECT_START = 'project_start',
  PROJECT_MILESTONE = 'project_milestone',
  OPPORTUNITY_CLOSE = 'opportunity_close',
  INVOICE_DUE = 'invoice_due',
  ACTIVITY_SCHEDULED = 'activity_scheduled',
  USER_VACATION = 'user_vacation',
  HOLIDAY = 'holiday',
}

export enum CalendarEntityType {
  USER_TASK = 'UserTask',
  PROJECT_TASK = 'ProjectTask',
  PROJECT = 'Project',
  OPPORTUNITY = 'Opportunity',
  INVOICE = 'Invoice',
  ACTIVITY = 'Activity',
  USER = 'User',
  SYSTEM = 'System',
}

export enum CalendarPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical',
}

export class CalendarEventDto {
  @ApiProperty({
    description: 'Unique event ID',
    example: 'usertask-123',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Event type',
    enum: CalendarEventType,
    example: CalendarEventType.USER_TASK,
  })
  @IsEnum(CalendarEventType)
  type: CalendarEventType;

  @ApiProperty({
    description: 'Event title',
    example: 'Follow up with customer',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Event description',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({
    description: 'Hex color for visual coding',
    example: '#3B82F6',
    pattern: '^#[0-9A-F]{6}$',
  })
  @IsString()
  @Matches(/^#[0-9A-F]{6}$/i, {
    message: 'Color must be a valid hex color (#RRGGBB)',
  })
  color: string;

  @ApiProperty({
    description: 'Icon name for event type',
    example: 'CheckSquare',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: 'Event start date/time',
    type: 'string',
    format: 'date-time',
    example: '2025-02-05T00:00:00Z',
  })
  @IsISO8601()
  startDate: Date;

  @ApiProperty({
    description: 'Event end date/time',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  endDate?: Date;

  @ApiProperty({
    description: 'True if all-day event',
    example: true,
  })
  @IsBoolean()
  allDay: boolean;

  @ApiProperty({
    description: 'Reference to source entity ID',
    example: 'usertask-123',
  })
  @IsString()
  entityId: string;

  @ApiProperty({
    description: 'Source entity type',
    enum: CalendarEntityType,
    example: CalendarEntityType.USER_TASK,
  })
  @IsEnum(CalendarEntityType)
  entityType: CalendarEntityType;

  @ApiProperty({
    description: 'Entity-specific status',
    example: 'open',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Priority level',
    enum: CalendarPriority,
    required: false,
  })
  @IsOptional()
  @IsEnum(CalendarPriority)
  priority?: CalendarPriority;

  @ApiProperty({
    description: 'User IDs assigned to event',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedTo?: string[];

  @ApiProperty({
    description: 'Physical location',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Custom tags for filtering',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Deep link to entity detail page',
    example: '/tasks/usertask-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  url?: string;
}


