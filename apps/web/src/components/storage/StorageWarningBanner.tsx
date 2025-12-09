import { useState } from "react";
import { useStorageQuota } from "@/hooks/useStorageQuota";
import { AlertTriangle, X } from "lucide-react";

/**
 * Warning banner displayed when storage is low
 * Dismissible by user, re-appears on page refresh if still low
 */
export function StorageWarningBanner() {
  const { isLowStorage, remainingFormatted, isLoading } = useStorageQuota();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isLoading || !isLowStorage || isDismissed) {
    return null;
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">
            <strong>Speicherwarnung:</strong> Nur noch {remainingFormatted}{" "}
            verfügbar. Synchronisierung könnte eingeschränkt werden.
          </span>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 hover:bg-amber-200 dark:hover:bg-amber-800 rounded transition-colors"
          aria-label="Warnung schließen"
        >
          <X className="w-4 h-4 text-amber-700 dark:text-amber-300" />
        </button>
      </div>
    </div>
  );
}

export default StorageWarningBanner;
