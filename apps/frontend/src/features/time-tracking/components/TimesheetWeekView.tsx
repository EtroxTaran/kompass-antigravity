import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TimeEntryResponseDto } from '@kompass/shared/types/entities/time-entry';

/**
 * Timesheet Week View Component
 * 
 * Displays time entries in a weekly calendar grid view.
 * 
 * @see Phase 1.3 of Time Tracking Implementation Plan
 */
interface TimesheetWeekViewProps {
  entries: TimeEntryResponseDto[];
  startDate: Date;
  onEntryUpdated?: () => void;
}

export function TimesheetWeekView({
  entries,
  startDate,
  onEntryUpdated,
}: TimesheetWeekViewProps) {
  /**
   * Get days of the week
   */
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  /**
   * Get entries for a specific day
   */
  function getEntriesForDay(date: Date): TimeEntryResponseDto[] {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return entries.filter((entry) => {
      const entryDate = new Date(entry.startTime);
      return entryDate >= dayStart && entryDate <= dayEnd;
    });
  }

  /**
   * Calculate total hours for a day
   */
  function getTotalHours(date: Date): number {
    const dayEntries = getEntriesForDay(date);
    return dayEntries.reduce(
      (sum, entry) => sum + entry.durationMinutes / 60,
      0,
    );
  }

  /**
   * Format day header
   */
  function formatDayHeader(date: Date): string {
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });
  }

  /**
   * Format duration
   */
  function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${String(mins).padStart(2, '0')}`;
  }

  /**
   * Get day total
   */
  function getDayTotal(date: Date): string {
    const hours = getTotalHours(date);
    return `${hours.toFixed(1)}h`;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {weekDays.map((day) => {
        const dayEntries = getEntriesForDay(day);
        const totalHours = getTotalHours(day);

        return (
          <Card key={day.toISOString()} className="min-h-[300px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {formatDayHeader(day)}
              </CardTitle>
              <p className="text-2xl font-bold">{getDayTotal(day)}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dayEntries.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Keine Erfassungen
                  </p>
                ) : (
                  dayEntries.map((entry) => (
                    <div
                      key={entry._id}
                      className="p-2 bg-muted rounded-md text-xs space-y-1"
                    >
                      <p className="font-medium truncate">
                        {entry.projectName || entry.projectId}
                      </p>
                      <p className="text-muted-foreground truncate">
                        {entry.taskDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <span>{formatDuration(entry.durationMinutes)}</span>
                        <Badge
                          variant={
                            entry.status === 'approved'
                              ? 'outline'
                              : 'secondary'
                          }
                          className="text-xs"
                        >
                          {entry.status === 'approved' ? '✓' : '○'}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

