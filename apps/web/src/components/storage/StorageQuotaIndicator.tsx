import { useStorageQuota } from "@/hooks/useStorageQuota";
import { HardDrive } from "lucide-react";

/**
 * Visual indicator showing current storage usage
 * Displays a progress bar with usage percentage
 */
export function StorageQuotaIndicator() {
  const {
    percentUsed,
    usageFormatted,
    quotaFormatted,
    isLowStorage,
    isLoading,
  } = useStorageQuota();

  if (isLoading) {
    return (
      <div className="px-3 py-2 text-xs text-gray-500">Checking storage...</div>
    );
  }

  const progressColor = isLowStorage
    ? "bg-red-500"
    : percentUsed > 70
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1">
        <HardDrive className="w-3 h-3" />
        <span>Speicher</span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${progressColor}`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>

      <div className="text-[10px] text-gray-500 dark:text-gray-500">
        {usageFormatted} / {quotaFormatted}
        {isLowStorage && (
          <span className="text-red-500 ml-1">• Wenig Speicher</span>
        )}
      </div>
    </div>
  );
}

export default StorageQuotaIndicator;
