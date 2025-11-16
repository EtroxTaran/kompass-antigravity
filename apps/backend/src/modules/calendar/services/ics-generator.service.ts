import { Injectable } from '@nestjs/common';
// TODO: Install 'ics' package when implementing calendar export
// import * as ics from 'ics';
// import type { EventAttributes } from 'ics';

import type { CalendarEventDto } from '../dto/calendar-event.dto';

// Stub types for now
type EventAttributes = unknown;

@Injectable()
export class IcsGeneratorService {
  /**
   * Generates ICS file content from calendar events
   * @param events Array of calendar events
   * @returns ICS file content as string
   */
  generateIcs(_events: CalendarEventDto[]): string {
    // TODO: Implement when 'ics' package is installed
    // const icsEvents: EventAttributes[] = events.map((event) =>
    //   this.eventToIcsFormat(event)
    // );
    // const { error, value } = ics.createEvents(icsEvents);
    // if (error) {
    //   throw new Error(`Failed to generate ICS file: ${error.message}`);
    // }
    // return this.addCustomHeaders(value);
    throw new Error(
      'ICS generation not yet implemented. Install "ics" package.'
    );
  }

  /**
   * Converts CalendarEvent to ICS EventAttributes format
   * TODO: Implement when 'ics' package is installed
   */
  private _eventToIcsFormat(_event: CalendarEventDto): EventAttributes {
    // TODO: Implement when 'ics' package is installed
    // const startDate = new Date(_event.startDate);
    // const endDate = _event.endDate ? new Date(_event.endDate) : startDate;
    // const icsEvent: EventAttributes = {
    //   uid: `${_event.id}@kompass.de`,
    //   start: this.dateToIcsFormat(startDate),
    //   end: this.dateToIcsFormat(endDate),
    //   title: _event.title,
    //   description: _event.description || '',
    //   status: 'CONFIRMED',
    //   busyStatus: 'BUSY',
    //   categories: _event.tags || [],
    //   url: _event.url || '',
    // };
    // if (_event.location) {
    //   icsEvent.location = _event.location;
    // }
    // if (_event.priority) {
    //   icsEvent.priority = this.mapPriorityToIcs(_event.priority);
    // }
    // return icsEvent;
    return {} as EventAttributes;
  }

  /**
   * Converts Date to ICS date array format [year, month, day, hour, minute]
   * TODO: Implement when 'ics' package is installed
   */
  private dateToIcsFormat(
    date: Date
  ): [number, number, number, number, number] {
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
  private _addCustomHeaders(_icsContent: string): string {
    // TODO: Implement when 'ics' package is installed
    // const lines = _icsContent.split('\r\n');
    // const headerIndex = lines.findIndex((line) => line.startsWith('PRODID:'));
    // if (headerIndex !== -1) {
    //   lines[headerIndex] = 'PRODID:-//KOMPASS CRM//Calendar Export//EN';
    //   lines.splice(
    //     headerIndex + 1,
    //     0,
    //     'X-WR-CALNAME:KOMPASS Kalender',
    //     'X-WR-TIMEZONE:Europe/Berlin',
    //     'CALSCALE:GREGORIAN',
    //     'METHOD:PUBLISH'
    //   );
    // }
    // return lines.join('\r\n');
    return '';
  }
}
