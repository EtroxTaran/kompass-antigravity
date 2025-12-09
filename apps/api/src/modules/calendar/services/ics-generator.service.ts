import { Injectable } from '@nestjs/common';
import { CalendarEventDto, CalendarEventType } from '../dto';

/**
 * Service for generating ICS (iCalendar) files following RFC 5545.
 */
@Injectable()
export class IcsGeneratorService {
  /**
   * Generate ICS content from calendar events.
   */
  generateIcs(
    events: CalendarEventDto[],
    calendarName: string = 'KOMPASS Calendar',
  ): string {
    const lines: string[] = [];

    // Calendar header
    lines.push('BEGIN:VCALENDAR');
    lines.push('VERSION:2.0');
    lines.push('PRODID:-//KOMPASS CRM//Calendar//DE');
    lines.push(`X-WR-CALNAME:${this.escapeText(calendarName)}`);
    lines.push('CALSCALE:GREGORIAN');
    lines.push('METHOD:PUBLISH');

    // Add events
    for (const event of events) {
      lines.push(...this.generateVEvent(event));
    }

    // Calendar footer
    lines.push('END:VCALENDAR');

    return lines.join('\r\n');
  }

  private generateVEvent(event: CalendarEventDto): string[] {
    const lines: string[] = [];
    const now = this.formatDateTimeUtc(new Date());

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${event.id}@kompass.de`);
    lines.push(`DTSTAMP:${now}`);

    // Date handling
    if (event.allDay) {
      lines.push(
        `DTSTART;VALUE=DATE:${this.formatDateOnly(new Date(event.startDate))}`,
      );
      lines.push(
        `DTEND;VALUE=DATE:${this.formatDateOnly(new Date(event.endDate))}`,
      );
    } else {
      lines.push(
        `DTSTART:${this.formatDateTimeUtc(new Date(event.startDate))}`,
      );
      lines.push(`DTEND:${this.formatDateTimeUtc(new Date(event.endDate))}`);
    }

    // Summary (title)
    lines.push(`SUMMARY:${this.escapeText(event.title)}`);

    // Description
    if (event.description) {
      lines.push(`DESCRIPTION:${this.escapeText(event.description)}`);
    }

    // Categories based on event type
    lines.push(`CATEGORIES:${this.getCategory(event.type)}`);

    // Status
    lines.push(`STATUS:${this.mapStatus(event.status)}`);

    // Priority (1-9, where 1 is highest)
    if (event.priority) {
      lines.push(`PRIORITY:${this.mapPriority(event.priority)}`);
    }

    // Related entity as URL
    if (event.relatedEntity) {
      const url = this.generateEntityUrl(
        event.relatedEntity.type,
        event.relatedEntity.id,
      );
      lines.push(`URL:${url}`);
    }

    // Organizer/Assigned
    if (event.assignedTo) {
      lines.push(
        `ORGANIZER;CN=${this.escapeText(event.assignedTo.name)}:mailto:${event.assignedTo.email || 'noreply@kompass.de'}`,
      );
    }

    lines.push('END:VEVENT');

    return lines;
  }

  private formatDateTimeUtc(date: Date): string {
    return date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  }

  private formatDateOnly(date: Date): string {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  }

  private escapeText(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  }

  private getCategory(type: CalendarEventType): string {
    const categories: Record<CalendarEventType, string> = {
      [CalendarEventType.USER_TASK]: 'Aufgabe',
      [CalendarEventType.PROJECT_TASK]: 'Projekt-Aufgabe',
      [CalendarEventType.PROJECT_DEADLINE]: 'Projekt-Frist',
      [CalendarEventType.OPPORTUNITY_CLOSE]: 'Opportunity',
      [CalendarEventType.INVOICE_DUE]: 'Rechnung',
    };
    return categories[type];
  }

  private mapStatus(status: string): string {
    switch (status) {
      case 'completed':
        return 'COMPLETED';
      case 'in_progress':
        return 'IN-PROCESS';
      case 'cancelled':
        return 'CANCELLED';
      default:
        return 'NEEDS-ACTION';
    }
  }

  private mapPriority(priority: string): number {
    switch (priority) {
      case 'urgent':
        return 1;
      case 'high':
        return 3;
      case 'medium':
        return 5;
      case 'low':
        return 9;
      default:
        return 5;
    }
  }

  private generateEntityUrl(type: string, id: string): string {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const paths: Record<string, string> = {
      customer: 'customers',
      project: 'projects',
      opportunity: 'sales',
      invoice: 'invoices',
    };
    return `${baseUrl}/${paths[type] || type}/${id}`;
  }
}
