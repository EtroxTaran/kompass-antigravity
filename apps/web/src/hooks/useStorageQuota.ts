import { useState, useEffect, useCallback } from "react";
import { storageService } from "@/services/storage.service";

interface StorageQuotaState {
  usage: number;
  quota: number;
  percentUsed: number;
  remaining: number;
  isLowStorage: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to monitor storage quota using the centralized StorageService
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
    try {
      const quotaStatus = await storageService.checkQuota();

      setState({
        usage: quotaStatus.used,
        quota: quotaStatus.total,
        percentUsed: quotaStatus.percentage,
        remaining: quotaStatus.available,
        isLowStorage: quotaStatus.status === 'Warning' || quotaStatus.status === 'Critical',
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
