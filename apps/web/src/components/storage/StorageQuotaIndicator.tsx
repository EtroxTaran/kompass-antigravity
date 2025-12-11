import { useStorageQuota } from "@/hooks/useStorageQuota";
import { useTieredStorage } from "@/hooks/useTieredStorage";
import { HardDrive } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function StorageQuotaIndicator() {
  const {
    percentUsed,
    usageFormatted,
    quotaFormatted,
    isLowStorage,
    isLoading,
  } = useStorageQuota();

  const { tierQuotas, formatBytes } = useTieredStorage();

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
      <div className="flex items-center justify-between mb-1">
        <Link
          to="/settings/storage"
          className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
        >
          <HardDrive className="w-3 h-3" />
          <span>Speicher</span>
        </Link>
        <span className="text-[10px] text-gray-400">
          {Math.round(percentUsed)}%
        </span>
      </div>

      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1 cursor-help">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${progressColor}`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs space-y-1">
            <p className="font-semibold border-b pb-1 mb-1">Speicher Details</p>
            {tierQuotas.map((t) => (
              <div key={t.tier} className="flex justify-between gap-4">
                <span className="capitalize text-gray-400">{t.tier}:</span>
                <span>{formatBytes(t.used)}</span>
              </div>
            ))}
            <div className="pt-1 border-t mt-1 flex justify-between gap-4 font-medium">
              <span>Gesamt:</span>
              <span>
                {usageFormatted} / {quotaFormatted}
              </span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="text-[10px] text-gray-500 dark:text-gray-500 flex justify-between">
        <span>
          {usageFormatted} / {quotaFormatted}
        </span>
        {isLowStorage && (
          <Link
            to="/settings/storage"
            className="text-red-500 hover:underline ml-1"
          >
            • Wenig Speicher
          </Link>
        )}
      </div>
    </div>
  );
}

export default StorageQuotaIndicator;
