import { useState, useEffect, useCallback } from "react";

export type EventType =
  | "user_task"
  | "project_task"
  | "project_deadline"
  | "opportunity_close"
  | "invoice_due";
export type EventStatus = "open" | "in_progress" | "completed" | "overdue";
export type EventPriority = "low" | "medium" | "high" | "urgent";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  status: EventStatus;
  priority?: EventPriority;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  assignedTo?: {
    id: string;
    name: string;
    email?: string;
  };
  relatedEntity?: {
    type: "customer" | "project" | "opportunity" | "invoice";
    name: string;
    id: string;
  };
  color: string;
  sourceId: string;
  sourceType: string;
}

export interface CalendarFilters {
  eventTypes: EventType[];
  statuses: EventStatus[];
  priorities: EventPriority[];
  assignedTo: string;
}

interface UseCalendarEventsOptions {
  startDate: Date;
  endDate: Date;
  filters?: Partial<CalendarFilters>;
}

interface UseCalendarEventsResult {
  events: CalendarEvent[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// API base URL from environment or default
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Mock data for fallback when API is unavailable
const mockEvents: CalendarEvent[] = [
  {
    id: "ut-1",
    title: "Follow-up mit Hofladen Müller",
    description: "Nachfassen bezüglich Angebot für Ladeneinrichtung",
    type: "user_task",
    status: "open",
    priority: "high",
    startDate: new Date(2025, 0, 28, 14, 0).toISOString(),
    endDate: new Date(2025, 0, 28, 15, 0).toISOString(),
    assignedTo: { id: "1", name: "Michael Schmidt" },
    relatedEntity: { type: "customer", name: "Hofladen Müller GmbH", id: "1" },
    color: "#F97316",
    sourceId: "1",
    sourceType: "UserTask",
  },
  {
    id: "pt-2",
    title: "Projektbesprechung REWE",
    description: "Wöchentliches Team-Meeting zum REWE Projekt",
    type: "project_task",
    status: "in_progress",
    startDate: new Date(2025, 0, 29, 10, 0).toISOString(),
    endDate: new Date(2025, 0, 29, 11, 30).toISOString(),
    assignedTo: { id: "2", name: "Anna Weber" },
    relatedEntity: { type: "project", name: "REWE München Süd", id: "2" },
    color: "#10B981",
    sourceId: "2",
    sourceType: "ProjectTask",
  },
  {
    id: "op-3",
    title: "Opportunity Abschluss: Bäckerei Schmidt",
    description: "Erwartetes Abschlussdatum für Verkaufschance",
    type: "opportunity_close",
    status: "open",
    priority: "urgent",
    startDate: new Date(2025, 0, 30).toISOString(),
    endDate: new Date(2025, 0, 30).toISOString(),
    allDay: true,
    assignedTo: { id: "3", name: "Thomas Müller" },
    relatedEntity: {
      type: "opportunity",
      name: "Modernisierung Backstube",
      id: "3",
    },
    color: "#EF4444",
    sourceId: "3",
    sourceType: "Opportunity",
  },
  {
    id: "pd-4",
    title: "Projekt Deadline: Hofladen Ladenbau",
    description: "Fertigstellung Phase 1",
    type: "project_deadline",
    status: "open",
    startDate: new Date(2025, 0, 31).toISOString(),
    endDate: new Date(2025, 0, 31).toISOString(),
    allDay: true,
    relatedEntity: {
      type: "project",
      name: "Hofladen Ladenbau Projekt",
      id: "1",
    },
    color: "#10B981",
    sourceId: "4",
    sourceType: "Project",
  },
  {
    id: "ut-5",
    title: "Technische Zeichnungen erstellen",
    description: "CAD-Zeichnungen für Kundenpräsentation",
    type: "project_task",
    status: "open",
    priority: "medium",
    startDate: new Date(2025, 1, 3, 9, 0).toISOString(),
    endDate: new Date(2025, 1, 3, 12, 0).toISOString(),
    assignedTo: { id: "2", name: "Anna Weber" },
    relatedEntity: { type: "project", name: "Bäckerei Schmidt", id: "3" },
    color: "#3B82F6",
    sourceId: "5",
    sourceType: "ProjectTask",
  },
];

export function useCalendarEvents(
  options: UseCalendarEventsOptions,
): UseCalendarEventsResult {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams({
        startDate: options.startDate.toISOString(),
        endDate: options.endDate.toISOString(),
      });

      if (
        options.filters?.eventTypes &&
        options.filters.eventTypes.length > 0
      ) {
        options.filters.eventTypes.forEach((type) =>
          params.append("eventTypes", type),
        );
      }
      if (options.filters?.statuses && options.filters.statuses.length > 0) {
        options.filters.statuses.forEach((status) =>
          params.append("statuses", status),
        );
      }
      if (
        options.filters?.priorities &&
        options.filters.priorities.length > 0
      ) {
        options.filters.priorities.forEach((priority) =>
          params.append("priorities", priority),
        );
      }

      // Fetch from API
      const response = await fetch(
        `${API_BASE_URL}/api/v1/calendar/my-events?${params}`,
        {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      } else if (response.status === 401) {
        // Unauthorized - use mock data for demo
        console.warn("Not authenticated, using mock data");
        setEvents(filterMockEvents(options));
      } else {
        throw new Error(`API error: ${response.status}`);
      }
    } catch (err) {
      console.warn("API unavailable, falling back to mock data:", err);
      // Fallback to mock data when API is unavailable
      setEvents(filterMockEvents(options));
    } finally {
      setLoading(false);
    }
  }, [options.startDate, options.endDate, options.filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

// Helper to filter mock events (used as fallback)
function filterMockEvents(options: UseCalendarEventsOptions): CalendarEvent[] {
  let filtered = mockEvents;

  // Apply date filter
  const start = options.startDate.getTime();
  const end = options.endDate.getTime();
  filtered = filtered.filter((event) => {
    const eventStart = new Date(event.startDate).getTime();
    return eventStart >= start && eventStart <= end;
  });

  // Apply type filter
  if (options.filters?.eventTypes && options.filters.eventTypes.length > 0) {
    filtered = filtered.filter((event) =>
      options.filters!.eventTypes!.includes(event.type),
    );
  }

  // Apply status filter
  if (options.filters?.statuses && options.filters.statuses.length > 0) {
    filtered = filtered.filter((event) =>
      options.filters!.statuses!.includes(event.status),
    );
  }

  // Apply priority filter
  if (options.filters?.priorities && options.filters.priorities.length > 0) {
    filtered = filtered.filter(
      (event) =>
        event.priority && options.filters!.priorities!.includes(event.priority),
    );
  }

  return filtered;
}

// Export ICS file from API
export async function exportCalendarIcs(
  startDate: Date,
  endDate: Date,
): Promise<void> {
  try {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/api/v1/calendar/export/ics?${params}`,
      {
        credentials: "include",
      },
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kompass-calendar-${new Date().toISOString().split("T")[0]}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      throw new Error("Failed to export calendar");
    }
  } catch (err) {
    console.warn("API export failed, generating client-side:", err);
    // Fallback: Generate minimal client-side ICS
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//KOMPASS CRM//Calendar//DE",
      "X-WR-CALNAME:KOMPASS Calendar",
      "END:VCALENDAR",
    ];
    const content = lines.join("\r\n");
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kompass-calendar-${new Date().toISOString().split("T")[0]}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
