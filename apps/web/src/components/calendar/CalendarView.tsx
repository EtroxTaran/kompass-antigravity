import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  X,
  Clock,
  User,
  Building2,
  TrendingUp,
  FolderKanban,
  FileText,
  ListTodo,
} from "lucide-react";
import {
  useCalendarEvents,
  exportCalendarIcs,
  type CalendarEvent,
  type EventType,
  type EventStatus,
  type EventPriority,
} from "@/hooks/useCalendarEvents";

type ViewMode = "month" | "week" | "day" | "agenda";

// Get event type icon
function getEventTypeIcon(type: EventType) {
  switch (type) {
    case "user_task":
      return <ListTodo className="h-4 w-4" />;
    case "project_task":
    case "project_deadline":
      return <FolderKanban className="h-4 w-4" />;
    case "opportunity_close":
      return <TrendingUp className="h-4 w-4" />;
    case "invoice_due":
      return <FileText className="h-4 w-4" />;
  }
}

// Get event type label
function getEventTypeLabel(type: EventType): string {
  switch (type) {
    case "user_task":
      return "Aufgabe";
    case "project_task":
      return "Projekt-Aufgabe";
    case "project_deadline":
      return "Projekt-Frist";
    case "opportunity_close":
      return "Opportunity";
    case "invoice_due":
      return "Rechnung";
  }
}

// Get status badge
function getStatusBadge(status: EventStatus) {
  switch (status) {
    case "open":
      return <Badge variant="outline">Offen</Badge>;
    case "in_progress":
      return (
        <Badge className="bg-blue-100 text-blue-800">In Bearbeitung</Badge>
      );
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-800">Abgeschlossen</Badge>
      );
    case "overdue":
      return <Badge className="bg-red-100 text-red-800">Überfällig</Badge>;
  }
}

// Get priority badge
function getPriorityBadge(priority: EventPriority | undefined) {
  if (!priority) return null;

  switch (priority) {
    case "urgent":
      return <Badge className="bg-red-100 text-red-800">Dringend</Badge>;
    case "high":
      return <Badge className="bg-orange-100 text-orange-800">Hoch</Badge>;
    case "medium":
      return <Badge className="bg-blue-100 text-blue-800">Mittel</Badge>;
    case "low":
      return <Badge className="bg-gray-100 text-gray-800">Niedrig</Badge>;
  }
}

// Format date for display
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// Format time
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Get month name
function getMonthName(month: number): string {
  const date = new Date(2025, month, 1);
  return new Intl.DateTimeFormat("de-DE", { month: "long" }).format(date);
}

// Get days in month for calendar grid
function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDay.getDay();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Convert to Monday-start

  // Add previous month days
  for (let i = startOffset - 1; i >= 0; i--) {
    const prevDay = new Date(year, month, -i);
    days.push(prevDay);
  }

  // Add current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Add next month days to fill grid
  const remainingDays = 42 - days.length; // 6 rows × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

// Check if same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Event Detail Dialog
function EventDetailDialog({
  event,
  isOpen,
  onClose,
}: {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!event) return null;

  const getEntityLink = () => {
    if (!event.relatedEntity) return null;
    const paths: Record<string, string> = {
      customer: "customers",
      project: "projects",
      opportunity: "sales",
      invoice: "invoices",
    };
    return `/${paths[event.relatedEntity.type] || event.relatedEntity.type}/${event.relatedEntity.id}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: event.color + "1A",
                color: event.color,
              }}
            >
              {getEventTypeIcon(event.type)}
            </div>
            <DialogTitle>{event.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="mb-1">{formatDate(new Date(event.startDate))}</p>
              {event.allDay ? (
                <Badge variant="outline">Ganztägig</Badge>
              ) : (
                <p className="text-muted-foreground">
                  {formatTime(new Date(event.startDate))} -{" "}
                  {formatTime(new Date(event.endDate))}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <p className="text-muted-foreground mb-2">Beschreibung</p>
              <p>{event.description}</p>
            </div>
          )}

          <Separator />

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            {getStatusBadge(event.status)}
          </div>

          {/* Priority */}
          {event.priority && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Priorität</span>
              {getPriorityBadge(event.priority)}
            </div>
          )}

          {/* Assigned To */}
          {event.assignedTo && (
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground mb-1">Zugewiesen an</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {event.assignedTo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{event.assignedTo.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Related Entity */}
          {event.relatedEntity && (
            <div className="flex items-start gap-3">
              {event.relatedEntity.type === "customer" && (
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              )}
              {event.relatedEntity.type === "project" && (
                <FolderKanban className="h-5 w-5 text-muted-foreground mt-0.5" />
              )}
              {event.relatedEntity.type === "opportunity" && (
                <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-muted-foreground mb-1">Verknüpft mit</p>
                <p className="mb-2">
                  {event.relatedEntity.type === "customer" && "Kunde: "}
                  {event.relatedEntity.type === "project" && "Projekt: "}
                  {event.relatedEntity.type === "opportunity" &&
                    "Opportunity: "}
                  {event.relatedEntity.name}
                </p>
                {getEntityLink() && (
                  <Link to={getEntityLink()!}>
                    <Button variant="outline" size="sm">
                      Details anzeigen
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Filter Panel Sheet
function FilterPanel({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    eventTypes: EventType[];
    statuses: EventStatus[];
    priorities: EventPriority[];
    assignedTo: string;
  };
  onFilterChange: (filters: {
    eventTypes: EventType[];
    statuses: EventStatus[];
    priorities: EventPriority[];
    assignedTo: string;
  }) => void;
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    const cleared = {
      eventTypes: [] as EventType[],
      statuses: [] as EventStatus[],
      priorities: [] as EventPriority[],
      assignedTo: "all",
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-80">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Filter</SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)] mt-6">
          <div className="space-y-6 pr-4">
            {/* Event Types */}
            <div>
              <h3 className="mb-3 font-medium">Ereignistypen</h3>
              <div className="space-y-3">
                {[
                  {
                    value: "user_task" as EventType,
                    label: "Aufgaben",
                    color: "#3B82F6",
                  },
                  {
                    value: "project_task" as EventType,
                    label: "Projekt-Aufgaben",
                    color: "#10B981",
                  },
                  {
                    value: "project_deadline" as EventType,
                    label: "Projekt-Fristen",
                    color: "#10B981",
                  },
                  {
                    value: "opportunity_close" as EventType,
                    label: "Opportunities",
                    color: "#A855F7",
                  },
                  {
                    value: "invoice_due" as EventType,
                    label: "Rechnungen",
                    color: "#F59E0B",
                  },
                ].map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={localFilters.eventTypes.includes(type.value)}
                      onCheckedChange={(checked) => {
                        setLocalFilters({
                          ...localFilters,
                          eventTypes: checked
                            ? [...localFilters.eventTypes, type.value]
                            : localFilters.eventTypes.filter(
                                (t) => t !== type.value,
                              ),
                        });
                      }}
                    />
                    <div
                      className="h-3 w-3 rounded"
                      style={{ backgroundColor: type.color }}
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div>
              <h3 className="mb-3 font-medium">Status</h3>
              <div className="space-y-3">
                {[
                  { value: "open" as EventStatus, label: "Offen" },
                  {
                    value: "in_progress" as EventStatus,
                    label: "In Bearbeitung",
                  },
                  { value: "completed" as EventStatus, label: "Abgeschlossen" },
                  { value: "overdue" as EventStatus, label: "Überfällig" },
                ].map((status) => (
                  <label
                    key={status.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={localFilters.statuses.includes(status.value)}
                      onCheckedChange={(checked) => {
                        setLocalFilters({
                          ...localFilters,
                          statuses: checked
                            ? [...localFilters.statuses, status.value]
                            : localFilters.statuses.filter(
                                (s) => s !== status.value,
                              ),
                        });
                      }}
                    />
                    <span>{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            {/* Priority */}
            <div>
              <h3 className="mb-3 font-medium">Priorität</h3>
              <div className="space-y-3">
                {[
                  { value: "low" as EventPriority, label: "Niedrig" },
                  { value: "medium" as EventPriority, label: "Mittel" },
                  { value: "high" as EventPriority, label: "Hoch" },
                  { value: "urgent" as EventPriority, label: "Dringend" },
                ].map((priority) => (
                  <label
                    key={priority.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Checkbox
                      checked={localFilters.priorities.includes(priority.value)}
                      onCheckedChange={(checked) => {
                        setLocalFilters({
                          ...localFilters,
                          priorities: checked
                            ? [...localFilters.priorities, priority.value]
                            : localFilters.priorities.filter(
                                (p) => p !== priority.value,
                              ),
                        });
                      }}
                    />
                    <span>{priority.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator />

            {/* Assigned To Filter */}
            <div>
              <h3 className="mb-3 font-medium">Zugewiesen an</h3>
              <Select
                value={localFilters.assignedTo}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, assignedTo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="me">Mir zugewiesen</SelectItem>
                  <SelectItem value="unassigned">Nicht zugewiesen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleClear}>
              Zurücksetzen
            </Button>
            <Button onClick={handleApply}>Übernehmen</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Month View Component
function MonthView({
  currentDate,
  events,
  onEventClick,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}) {
  const days = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );
  const today = new Date();
  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 bg-muted">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center border-r border-border last:border-r-0"
          >
            <span className="text-muted-foreground text-sm">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, today);
          const dayEvents = events.filter((event) =>
            isSameDay(new Date(event.startDate), day),
          );

          return (
            <div
              key={index}
              className={`min-h-28 p-2 border-r border-b border-border last:border-r-0 ${
                !isCurrentMonth ? "bg-muted/30" : ""
              } ${isToday ? "bg-blue-50 border-2 border-blue-500" : ""} hover:bg-muted/50 transition-colors`}
            >
              <div
                className={`text-right mb-2 text-sm ${isToday ? "text-blue-600 font-semibold" : isCurrentMonth ? "" : "text-muted-foreground"}`}
              >
                {day.getDate()}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    className="w-full text-left px-2 py-1 rounded text-xs hover:shadow-sm transition-shadow truncate"
                    style={{
                      backgroundColor: event.color + "1A",
                      borderLeft: `3px solid ${event.color}`,
                    }}
                    onClick={() => onEventClick(event)}
                  >
                    <div className="flex items-center gap-1">
                      <span style={{ color: event.color }}>
                        {getEventTypeIcon(event.type)}
                      </span>
                      <span className="truncate">{event.title}</span>
                      {!event.allDay && (
                        <span className="text-muted-foreground ml-auto shrink-0">
                          {formatTime(new Date(event.startDate))}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <button className="w-full text-left text-xs text-muted-foreground hover:text-foreground px-2">
                    +{dayEvents.length - 3} weitere
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Agenda View Component
function AgendaView({
  events,
  onEventClick,
}: {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}) {
  // Group events by date
  const groupedEvents = useMemo(() => {
    return events.reduce(
      (acc, event) => {
        const dateKey = formatDate(new Date(event.startDate));
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
      },
      {} as Record<string, CalendarEvent[]>,
    );
  }, [events]);

  if (Object.keys(groupedEvents).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Keine Ereignisse</h3>
        <p className="text-muted-foreground mb-4">
          Keine Ereignisse in diesem Zeitraum
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <div key={date}>
          <div className="bg-muted px-4 py-3 mb-3 rounded-lg">
            <h3 className="font-medium">{date}</h3>
          </div>
          <div className="space-y-2">
            {dateEvents.map((event) => (
              <button
                key={event.id}
                className="w-full text-left p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                onClick={() => onEventClick(event)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: event.color + "1A",
                      color: event.color,
                    }}
                  >
                    {getEventTypeIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-1">{event.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {event.allDay ? (
                        <span>Ganztägig</span>
                      ) : (
                        <span>
                          {formatTime(new Date(event.startDate))} -{" "}
                          {formatTime(new Date(event.endDate))}
                        </span>
                      )}
                      <span>•</span>
                      <span style={{ color: event.color }}>
                        {getEventTypeLabel(event.type)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Main Calendar View Component
export function CalendarView() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    eventTypes: [] as EventType[],
    statuses: [] as EventStatus[],
    priorities: [] as EventPriority[],
    assignedTo: "all",
  });

  // Calculate date range based on view mode
  const dateRange = useMemo(() => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    if (viewMode === "month") {
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    } else if (viewMode === "week") {
      const dayOfWeek = start.getDay();
      start.setDate(start.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      end.setDate(start.getDate() + 6);
    }
    // For day view, start and end are the same

    return { startDate: start, endDate: end };
  }, [currentDate, viewMode]);

  // Fetch events using hook
  const { events, loading } = useCalendarEvents({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    filters:
      filters.eventTypes.length > 0 ||
      filters.statuses.length > 0 ||
      filters.priorities.length > 0
        ? filters
        : undefined,
  });

  // Get date range label for header
  const getDateRangeLabel = () => {
    if (viewMode === "month") {
      return `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`;
    }
    if (viewMode === "day") {
      return formatDate(currentDate);
    }
    // Week view
    const weekStart = new Date(currentDate);
    const dayOfWeek = weekStart.getDay();
    weekStart.setDate(
      weekStart.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1),
    );
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return `${new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit" }).format(weekStart)} - ${new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(weekEnd)}`;
  };

  // Navigate dates
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const handleExport = async () => {
    await exportCalendarIcs(dateRange.startDate, dateRange.endDate);
  };

  const activeFiltersCount =
    filters.eventTypes.length +
    filters.statuses.length +
    filters.priorities.length +
    (filters.assignedTo !== "all" ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Kalender</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Heute
            </Button>
            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-lg font-medium">{getDateRangeLabel()}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Buttons */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            {(["month", "week", "day", "agenda"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                className={`px-3 py-1.5 text-sm ${viewMode === mode ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setViewMode(mode)}
              >
                {mode === "month"
                  ? "Monat"
                  : mode === "week"
                    ? "Woche"
                    : mode === "day"
                      ? "Tag"
                      : "Agenda"}
              </button>
            ))}
          </div>

          {/* Filter Button */}
          <Button variant="outline" onClick={() => setShowFilters(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {activeFiltersCount > 0 && (
              <Badge className="ml-2" variant="secondary">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {/* Export Button */}
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      <Card>
        <CardContent className="p-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : viewMode === "agenda" ? (
            <AgendaView events={events} onEventClick={handleEventClick} />
          ) : (
            <MonthView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
            />
          )}
        </CardContent>
      </Card>

      {/* Event Detail Dialog */}
      <EventDetailDialog
        event={selectedEvent}
        isOpen={showEventDetail}
        onClose={() => setShowEventDetail(false)}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={setFilters}
      />
    </div>
  );
}

// Named export for index
export { CalendarView as default };
