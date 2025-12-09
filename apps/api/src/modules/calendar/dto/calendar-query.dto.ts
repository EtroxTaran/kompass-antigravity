import {
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum CalendarEventType {
  USER_TASK = 'user_task',
  PROJECT_TASK = 'project_task',
  PROJECT_DEADLINE = 'project_deadline',
  OPPORTUNITY_CLOSE = 'opportunity_close',
  INVOICE_DUE = 'invoice_due',
}

export enum EventStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
}

export enum EventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CalendarQueryDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsArray()
  @IsEnum(CalendarEventType, { each: true })
  eventTypes?: CalendarEventType[];

  @IsOptional()
  @IsArray()
  @IsEnum(EventStatus, { each: true })
  statuses?: EventStatus[];

  @IsOptional()
  @IsArray()
  @IsEnum(EventPriority, { each: true })
  priorities?: EventPriority[];

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  @Type(() => Number)
  limit?: number = 1000;
}
