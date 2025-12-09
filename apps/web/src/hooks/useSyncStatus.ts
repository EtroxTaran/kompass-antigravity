import { useState, useEffect, useCallback } from "react";
import { dbService } from "@/lib/db";

export type SyncStatus = "idle" | "active" | "paused" | "error" | "offline";

interface SyncState {
  status: SyncStatus;
  isOnline: boolean;
  pendingChanges: number;
  lastSyncTime: Date | null;
}

/**
 * Hook to monitor database sync status and online/offline state
 */
export function useSyncStatus() {
  const [state, setState] = useState<SyncState>({
    status: "idle",
    isOnline: navigator.onLine,
    pendingChanges: 0,
    lastSyncTime: null,
  });

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setState((prev) => ({ ...prev, isOnline: true }));
      dbService.startSync();
    };

    const handleOffline = () => {
      setState((prev) => ({ ...prev, isOnline: false, status: "offline" }));
      dbService.stopSync();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Start sync if online
    if (navigator.onLine) {
      dbService.startSync();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Subscribe to sync status changes
  useEffect(() => {
    const unsubscribe = dbService.subscribe((status) => {
      setState((prev) => ({
        ...prev,
        status: status as SyncStatus,
        lastSyncTime: status === "idle" ? new Date() : prev.lastSyncTime,
      }));
    });

    return unsubscribe;
  }, []);

  // Manual sync trigger
  const triggerSync = useCallback(() => {
    if (state.isOnline) {
      dbService.stopSync();
      dbService.startSync();
    }
  }, [state.isOnline]);

  return {
    ...state,
    triggerSync,
  };
}
