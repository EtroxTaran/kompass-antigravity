import { CloudOff, RefreshCw, CheckCircle2, WifiOff } from "lucide-react";
import { useSyncStatus } from "@/hooks/useSyncStatus";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function SyncIndicator() {
  const { status, isOnline, triggerSync } = useSyncStatus();

  const getIcon = () => {
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
    if (!isOnline) {
      return "Offline - Änderungen werden gespeichert";
    }
    switch (status) {
      case "active":
        return "Synchronisiere...";
      case "error":
        return "Synchronisierungsfehler";
      case "idle":
        return "Synchronisiert";
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
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
              status === "error"
                ? "bg-destructive/10"
                : "bg-transparent hover:bg-muted",
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
