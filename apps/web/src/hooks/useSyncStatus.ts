import { useState, useEffect, useCallback } from "react";
import { dbService, StorageInfo } from "@/lib/db";
import { StorageTier } from "@/lib/tiered-storage/types";

export type SyncStatus =
  | "idle"
  | "active"
  | "paused"
  | "error"
  | "offline"
  | "storage_full";

interface SyncState {
  status: SyncStatus;
  isOnline: boolean;
  pendingChanges: number;
  lastSyncTime: Date | null;
  storage: StorageInfo | null;
  activeTiers: StorageTier[];
}

/**
 * Hook to monitor database sync status, online/offline state, and storage usage
 */
export function useSyncStatus() {
  const [state, setState] = useState<SyncState>({
    status: "idle",
    isOnline: navigator.onLine,
    pendingChanges: 0,
    lastSyncTime: null,
    storage: null,
    activeTiers: [],
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

  // Subscribe to sync status and storage changes
  useEffect(() => {
    const unsubscribe = dbService.subscribe((update) => {
      setState((prev) => ({
        ...prev,
        status: update.status as SyncStatus,
        storage: update.storage || prev.storage,
        lastSyncTime: update.status === "idle" ? new Date() : prev.lastSyncTime,
        activeTiers: update.activeTiers || [],
      }));
    });

    return unsubscribe;
  }, []);

  // Manual sync trigger
  const triggerSync = useCallback(() => {
    if (state.isOnline && state.status !== "storage_full") {
      dbService.stopSync();
      // Restart sync, which triggers all tiers (Essential + Recent check)
      dbService.startSync();
    }
  }, [state.isOnline, state.status]);

  // Manual storage check
  const checkStorage = useCallback(async () => {
    const storage = await dbService.checkStorage();
    setState((prev) => ({ ...prev, storage }));
  }, []);

  // Request persistent storage
  const requestPersistentStorage = useCallback(async () => {
    return dbService.requestPersistentStorage();
  }, []);

  // Derived state
  const isStorageWarning = state.storage?.isWarning ?? false;
  const isStorageCritical = state.storage?.isCritical ?? false;

  return {
    ...state,
    triggerSync,
    checkStorage,
    requestPersistentStorage,
    isStorageWarning,
    isStorageCritical,
  };
}
