import { useState } from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  RefreshCw,
  Monitor,
  Smartphone,
  Clock,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConflictData } from "@/hooks/useConflictResolution";

interface ConflictResolutionModalProps {
  conflict: ConflictData;
  onResolve: (resolvedData: Record<string, any>, strategy: string) => void;
  onCancel: () => void;
}

type FieldResolution = "local" | "server";

export function ConflictResolutionModal({
  conflict,
  onResolve,
  onCancel,
}: ConflictResolutionModalProps) {
  const [fieldResolutions, setFieldResolutions] = useState<
    Record<string, FieldResolution>
  >(() => {
    // Default to server version for all fields
    const defaults: Record<string, FieldResolution> = {};
    conflict.fields.forEach((field) => {
      defaults[field] = "server";
    });
    return defaults;
  });

  const changedFields = conflict.fields.filter(
    (field) =>
      JSON.stringify(conflict.localVersion[field]) !==
      JSON.stringify(conflict.serverVersion[field]),
  );

  const handleFieldSelect = (field: string, source: FieldResolution) => {
    setFieldResolutions((prev) => ({ ...prev, [field]: source }));
  };

  const handleSelectAll = (source: FieldResolution) => {
    const newResolutions: Record<string, FieldResolution> = {};
    conflict.fields.forEach((field) => {
      newResolutions[field] = source;
    });
    setFieldResolutions(newResolutions);
  };

  const handleResolve = () => {
    const resolvedData: Record<string, any> = {};
    conflict.fields.forEach((field) => {
      const source = fieldResolutions[field] || "server";
      resolvedData[field] =
        source === "local"
          ? conflict.localVersion[field]
          : conflict.serverVersion[field];
    });
    onResolve(resolvedData, "manual");
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "–";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    if (typeof value === "boolean") return value ? "Ja" : "Nein";
    return String(value);
  };

  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-red-50 dark:bg-red-900/30">
          <div>
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Konflikt lösen: {conflict.entityName}
            </h2>
            <p className="text-sm text-red-600 dark:text-red-400">
              {conflict.entityType} • {changedFields.length} geänderte Felder
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Version Info */}
        <div className="grid grid-cols-2 border-b">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border-r">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Smartphone className="w-4 h-4" />
              <span className="font-medium text-sm">Lokale Version</span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs text-blue-600 dark:text-blue-400">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {conflict.localUser}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimestamp(conflict.localTimestamp)}
              </span>
            </div>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/30">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Monitor className="w-4 h-4" />
              <span className="font-medium text-sm">Server Version</span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs text-green-600 dark:text-green-400">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {conflict.serverUser}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimestamp(conflict.serverTimestamp)}
              </span>
            </div>
          </div>
        </div>

        {/* Field Comparison */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {changedFields.map((field) => {
              const localValue = formatValue(conflict.localVersion[field]);
              const serverValue = formatValue(conflict.serverVersion[field]);
              const selected = fieldResolutions[field];

              return (
                <div key={field} className="border rounded-lg overflow-hidden">
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b">
                    <span className="font-medium text-sm">{field}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    {/* Local */}
                    <button
                      onClick={() => handleFieldSelect(field, "local")}
                      className={cn(
                        "p-3 text-left border-r transition-colors",
                        selected === "local"
                          ? "bg-blue-100 dark:bg-blue-900/50 ring-2 ring-inset ring-blue-500"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800",
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          Lokal
                        </span>
                        {selected === "local" && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <p className="text-sm font-mono break-words">
                        {localValue}
                      </p>
                    </button>

                    {/* Server */}
                    <button
                      onClick={() => handleFieldSelect(field, "server")}
                      className={cn(
                        "p-3 text-left transition-colors",
                        selected === "server"
                          ? "bg-green-100 dark:bg-green-900/50 ring-2 ring-inset ring-green-500"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800",
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-green-600 dark:text-green-400">
                          Server
                        </span>
                        {selected === "server" && (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm font-mono break-words">
                        {serverValue}
                      </p>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectAll("local")}
              className="px-3 py-1.5 text-xs border rounded-lg hover:bg-white dark:hover:bg-gray-700 flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Alle Lokal
            </button>
            <button
              onClick={() => handleSelectAll("server")}
              className="px-3 py-1.5 text-xs border rounded-lg hover:bg-white dark:hover:bg-gray-700 flex items-center gap-1"
            >
              Alle Server
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-white dark:hover:bg-gray-700"
            >
              Abbrechen
            </button>
            <button
              onClick={handleResolve}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Zusammenführen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConflictResolutionModal;
