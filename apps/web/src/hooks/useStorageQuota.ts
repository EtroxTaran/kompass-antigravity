import { useState, useEffect, useCallback } from "react";

interface StorageQuotaState {
  usage: number;
  quota: number;
  percentUsed: number;
  remaining: number;
  isLowStorage: boolean;
  isLoading: boolean;
  error: Error | null;
}

const LOW_STORAGE_THRESHOLD = 10 * 1024 * 1024; // 10MB in bytes

/**
 * Hook to monitor storage quota using the Storage API
 *
 * @returns Storage quota information including usage, remaining space, and low storage warning
 */
export function useStorageQuota() {
  const [state, setState] = useState<StorageQuotaState>({
    usage: 0,
    quota: 0,
    percentUsed: 0,
    remaining: 0,
    isLowStorage: false,
    isLoading: true,
    error: null,
  });

  const checkStorageQuota = useCallback(async () => {
    // Check if Storage API is available
    if (!navigator.storage || !navigator.storage.estimate) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: new Error("Storage API not available"),
      }));
      return;
    }

    try {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const remaining = quota - usage;
      const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;
      const isLowStorage = remaining < LOW_STORAGE_THRESHOLD;

      setState({
        usage,
        quota,
        percentUsed,
        remaining,
        isLowStorage,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to get storage estimate"),
      }));
    }
  }, []);

  useEffect(() => {
    checkStorageQuota();

    // Check every 30 seconds
    const interval = setInterval(checkStorageQuota, 30000);

    return () => clearInterval(interval);
  }, [checkStorageQuota]);

  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }, []);

  return {
    ...state,
    refresh: checkStorageQuota,
    formatBytes,
    usageFormatted: formatBytes(state.usage),
    quotaFormatted: formatBytes(state.quota),
    remainingFormatted: formatBytes(state.remaining),
  };
}

export default useStorageQuota;
