import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConflictBannerProps {
  conflictCount: number;
  onResolveClick: () => void;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Banner displayed when sync conflicts are detected
 */
export function ConflictBanner({
  conflictCount,
  onResolveClick,
  onDismiss,
  className,
}: ConflictBannerProps) {
  if (conflictCount === 0) return null;

  return (
    <div
      className={cn(
        "bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-100 dark:bg-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {conflictCount} Synchronisierungskonflikt
              {conflictCount > 1 ? "e" : ""} erkannt
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">
              Lokale und Server-Änderungen müssen zusammengeführt werden.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResolveClick}
            className="px-4 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Konflikte lösen
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded transition-colors"
            >
              <X className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConflictBanner;
