import { CloudOff, RefreshCw, CheckCircle2, WifiOff, HardDrive } from "lucide-react";
import { useSyncStatus } from "@/hooks/useSyncStatus";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function SyncIndicator() {
  const { status, isOnline, triggerSync, storage, isStorageCritical } = useSyncStatus();

  const getIcon = () => {
    if (isStorageCritical || status === "storage_full") {
      return <HardDrive className="h-4 w-4 text-destructive" />;
    }
    if (!isOnline) {
      return <WifiOff className="h-4 w-4 text-amber-500" />;
    }
    switch (status) {
      case "active":
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case "error":
        return <CloudOff className="h-4 w-4 text-destructive" />;
      case "idle":
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  const getLabel = () => {
    if (isStorageCritical || status === "storage_full") {
      const usagePercent = storage ? Math.round(storage.usagePercent * 100) : 0;
      return `Speicher voll (${usagePercent}%) - Sync pausiert`;
    }
    if (!isOnline) {
      return "Offline - Änderungen werden gespeichert";
    }
    switch (status) {
      case "active":
        return "Synchronisiere...";
      case "error":
        return "Synchronisierungsfehler";
      case "idle":
        return storage
          ? `Synchronisiert (${Math.round(storage.usagePercent * 100)}% Speicher)`
          : "Synchronisiert";
      default:
        return "Status unbekannt";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={triggerSync}
            disabled={isStorageCritical || status === "storage_full"}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
              status === "error" || isStorageCritical
                ? "bg-destructive/10"
                : "bg-transparent hover:bg-muted",
              (isStorageCritical || status === "storage_full") && "cursor-not-allowed opacity-50"
            )}
          >
            {getIcon()}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getLabel()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
