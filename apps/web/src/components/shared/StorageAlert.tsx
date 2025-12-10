import { AlertTriangle, X } from "lucide-react";
import { useSyncStatus } from "@/hooks/useSyncStatus";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

/**
 * Storage warning/critical alert banner
 * Displays when storage usage exceeds thresholds
 */
export function StorageAlert() {
  const {
    storage,
    isStorageWarning,
    isStorageCritical,
    requestPersistentStorage,
  } = useSyncStatus();
  const [dismissed, setDismissed] = useState(false);
  const [persistRequested, setPersistRequested] = useState(false);

  // Reset dismissed state if storage changes severity
  useEffect(() => {
    if (isStorageCritical) {
      setDismissed(false);
    }
  }, [isStorageCritical]);

  // Don't show if dismissed or no warning
  if (dismissed || (!isStorageWarning && !isStorageCritical)) {
    return null;
  }

  const usagePercent = storage ? Math.round(storage.usagePercent * 100) : 0;
  const usageMB = storage ? Math.round(storage.usage / (1024 * 1024)) : 0;
  const quotaMB = storage ? Math.round(storage.quota / (1024 * 1024)) : 0;

  const handlePersist = async () => {
    const granted = await requestPersistentStorage();
    setPersistRequested(true);
    if (granted) {
      console.log("Persistent storage granted");
    }
  };

  return (
    <Alert
      variant={isStorageCritical ? "destructive" : "default"}
      className="mb-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {isStorageCritical ? (
            <>
              <strong>Speicher voll!</strong> Synchronisierung pausiert. Bitte
              löschen Sie nicht benötigte Daten. ({usageMB} MB / {quotaMB} MB,{" "}
              {usagePercent}%)
            </>
          ) : (
            <>
              <strong>Speicher fast voll</strong> ({usagePercent}%). Die
              Synchronisierung könnte bald pausieren.
            </>
          )}
        </AlertDescription>
      </div>
      <div className="flex items-center gap-2">
        {!persistRequested && (
          <Button variant="outline" size="sm" onClick={handlePersist}>
            Daten schützen
          </Button>
        )}
        {!isStorageCritical && (
          <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
}
