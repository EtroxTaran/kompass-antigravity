import {
  CalendarEventType,
  EventStatus,
  EventPriority,
} from './calendar-query.dto';

export interface RelatedEntity {
  type: 'customer' | 'project' | 'opportunity' | 'invoice';
  name: string;
  id: string;
}

export interface AssignedUser {
  id: string;
  name: string;
  email?: string;
}

export class CalendarEventDto {
  id: string;
  title: string;
  description?: string;
  type: CalendarEventType;
  status: EventStatus;
  priority?: EventPriority;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  assignedTo?: AssignedUser;
  relatedEntity?: RelatedEntity;
  color: string;
  sourceId: string;
  sourceType: string;
}

export class CalendarEventsResponseDto {
  events: CalendarEventDto[];
  total: number;
  startDate: string;
  endDate: string;
}

// Color mapping for event types
export const EVENT_TYPE_COLORS: Record<CalendarEventType, string> = {
  [CalendarEventType.USER_TASK]: '#3B82F6', // Blue
  [CalendarEventType.PROJECT_TASK]: '#10B981', // Green
  [CalendarEventType.PROJECT_DEADLINE]: '#10B981', // Green
  [CalendarEventType.OPPORTUNITY_CLOSE]: '#A855F7', // Purple
  [CalendarEventType.INVOICE_DUE]: '#F59E0B', // Amber
};

// Priority overrides
export const PRIORITY_COLORS: Record<EventPriority, string> = {
  [EventPriority.LOW]: '#6B7280', // Gray
  [EventPriority.MEDIUM]: '#3B82F6', // Blue
  [EventPriority.HIGH]: '#F97316', // Orange
  [EventPriority.URGENT]: '#EF4444', // Red
};

export function getEventColor(
  type: CalendarEventType,
  priority?: EventPriority,
): string {
  // Priority overrides type color for high/urgent
  if (priority === EventPriority.URGENT || priority === EventPriority.HIGH) {
    return PRIORITY_COLORS[priority];
  }
  return EVENT_TYPE_COLORS[type];
}
