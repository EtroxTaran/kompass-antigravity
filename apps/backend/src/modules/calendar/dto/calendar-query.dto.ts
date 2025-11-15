import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsISO8601,
  IsOptional,
  IsArray,
  IsString,
  IsEnum,
} from 'class-validator';

import { CalendarEventType, CalendarPriority } from './calendar-event.dto';

export class CalendarQueryDto {
  @ApiProperty({
    description: 'Start date for event range',
    type: 'string',
    format: 'date-time',
    example: '2025-01-01T00:00:00Z',
  })
  @IsISO8601()
  startDate: string;

  @ApiProperty({
    description: 'End date for event range',
    type: 'string',
    format: 'date-time',
    example: '2025-01-31T23:59:59Z',
  })
  @IsISO8601()
  endDate: string;

  @ApiProperty({
    description: 'Filter by event types',
    type: [String],
    required: false,
    enum: CalendarEventType,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(CalendarEventType, { each: true })
  @Type(() => String)
  types?: CalendarEventType[];

  @ApiProperty({
    description: 'Filter events assigned to specific user',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({
    description: 'Filter by status',
    type: [String],
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  status?: string[];

  @ApiProperty({
    description: 'Filter by priority',
    type: [String],
    required: false,
    enum: CalendarPriority,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(CalendarPriority, { each: true })
  @Type(() => String)
  priority?: CalendarPriority[];
}
