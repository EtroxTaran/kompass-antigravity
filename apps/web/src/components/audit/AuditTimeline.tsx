import { useState, useMemo } from "react";
import {
  Clock,
  User,
  Edit2,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Lock,
  Filter,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entityType: string;
  entityId: string;
  entityName?: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  reason?: string;
  immutable: boolean; // GoBD compliance
}

interface AuditTimelineProps {
  entries: AuditLogEntry[];
  onFilterChange?: (filters: AuditFilters) => void;
  className?: string;
}

interface AuditFilters {
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
  action?: string;
  search?: string;
}

const actionConfig = {
  CREATE: {
    icon: Plus,
    label: "Erstellt",
    color: "text-green-600 bg-green-100",
  },
  UPDATE: {
    icon: Edit2,
    label: "Geändert",
    color: "text-blue-600 bg-blue-100",
  },
  DELETE: { icon: Trash2, label: "Gelöscht", color: "text-red-600 bg-red-100" },
};

export function AuditTimeline({ entries, className }: AuditTimelineProps) {
  const [expandedEntries, setExpandedEntries] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AuditFilters>({});

  const toggleEntry = (id: string) => {
    setExpandedEntries((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
  };

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (filters.action && entry.action !== filters.action) return false;
      if (filters.userId && entry.userId !== filters.userId) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          entry.entityName?.toLowerCase().includes(searchLower) ||
          entry.userName.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [entries, filters]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "–";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Bar */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Suchen..."
            value={filters.search || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-900"
          />
        </div>
        <select
          value={filters.action || ""}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              action: e.target.value || undefined,
            }))
          }
          className="px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-900"
        >
          <option value="">Alle Aktionen</option>
          <option value="CREATE">Erstellt</option>
          <option value="UPDATE">Geändert</option>
          <option value="DELETE">Gelöscht</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "p-2 rounded-lg border transition-colors",
            showFilters
              ? "bg-primary text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700",
          )}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

        {/* Entries */}
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Keine Audit-Einträge gefunden
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const config = actionConfig[entry.action];
              const Icon = config.icon;
              const isExpanded = expandedEntries.includes(entry.id);

              return (
                <div key={entry.id} className="relative pl-12">
                  {/* Icon */}
                  <div
                    className={cn(
                      "absolute left-3 w-7 h-7 rounded-full flex items-center justify-center",
                      config.color,
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Content */}
                  <div className="bg-white dark:bg-gray-900 border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleEntry(entry.id)}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {entry.entityType}
                          </span>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs",
                              config.color,
                            )}
                          >
                            {config.label}
                          </span>
                          {entry.immutable && (
                            <Lock
                              className="w-3 h-3 text-amber-500"
                              aria-label="GoBD-konform (unveränderlich)"
                            />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {entry.entityName || entry.entityId}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {entry.userName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>

                      {entry.changes.length > 0 &&
                        (isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        ))}
                    </button>

                    {/* Expanded content */}
                    {isExpanded && entry.changes.length > 0 && (
                      <div className="border-t bg-gray-50 dark:bg-gray-800 p-3 space-y-2">
                        <h4 className="text-xs font-medium text-gray-500 uppercase">
                          Änderungen
                        </h4>
                        <div className="space-y-2">
                          {entry.changes.map((change, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 text-sm"
                            >
                              <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                {change.field}
                              </span>
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span
                                  className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs truncate max-w-[150px]"
                                  title={formatValue(change.oldValue)}
                                >
                                  {formatValue(change.oldValue)}
                                </span>
                                <span className="text-gray-400">→</span>
                                <span
                                  className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs truncate max-w-[150px]"
                                  title={formatValue(change.newValue)}
                                >
                                  {formatValue(change.newValue)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {entry.reason && (
                          <div className="pt-2 border-t mt-3">
                            <p className="text-xs text-gray-500">
                              <strong>Grund:</strong> {entry.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditTimeline;
