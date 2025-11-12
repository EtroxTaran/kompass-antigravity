import { Injectable } from '@nestjs/common';
import { CalendarEventDto } from '../dto/calendar-event.dto';
import * as ics from 'ics';
import { EventAttributes } from 'ics';

@Injectable()
export class IcsGeneratorService {
  /**
   * Generates ICS file content from calendar events
   * @param events Array of calendar events
   * @returns ICS file content as string
   */
  generateIcs(events: CalendarEventDto[]): string {
    const icsEvents: EventAttributes[] = events.map((event) =>
      this.eventToIcsFormat(event),
    );

    const { error, value } = ics.createEvents(icsEvents);

    if (error) {
      throw new Error(`Failed to generate ICS file: ${error.message}`);
    }

    return this.addCustomHeaders(value!);
  }

  /**
   * Converts CalendarEvent to ICS EventAttributes format
   */
  private eventToIcsFormat(event: CalendarEventDto): EventAttributes {
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;

    const icsEvent: EventAttributes = {
      uid: `${event.id}@kompass.de`,
      start: this.dateToIcsFormat(startDate),
      end: this.dateToIcsFormat(endDate),
      title: event.title,
      description: event.description || '',
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      categories: event.tags || [],
      url: event.url || '',
    };

    // Add location if present
    if (event.location) {
      icsEvent.location = event.location;
    }

    // Map priority
    if (event.priority) {
      icsEvent.priority = this.mapPriorityToIcs(event.priority);
    }

    return icsEvent;
  }

  /**
   * Converts Date to ICS date array format [year, month, day, hour, minute]
   */
  private dateToIcsFormat(date: Date): [number, number, number, number, number] {
    return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ];
  }

  /**
   * Maps CalendarPriority to ICS priority (1-9 scale)
   */
  private mapPriorityToIcs(priority: string): number {
    const mapping: Record<string, number> = {
      low: 9,
      medium: 5,
      high: 3,
      urgent: 2,
      critical: 1,
    };

    return mapping[priority] || 5;
  }

  /**
   * Adds custom VCALENDAR headers
   */
  private addCustomHeaders(icsContent: string): string {
    // Replace default prodid and add custom properties
    const lines = icsContent.split('\r\n');
    const headerIndex = lines.findIndex((line) => line.startsWith('PRODID:'));

    if (headerIndex !== -1) {
      lines[headerIndex] = 'PRODID:-//KOMPASS CRM//Calendar Export//EN';
      
      // Add custom calendar properties after PRODID
      lines.splice(headerIndex + 1, 0, 
        'X-WR-CALNAME:KOMPASS Kalender',
        'X-WR-TIMEZONE:Europe/Berlin',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH'
      );
    }

    return lines.join('\r\n');
  }
}


