import { useEffect, useState } from 'react';

/**
 * Offline detection hook result
 */
export interface OfflineResult {
  /** Whether user is online */
  isOnline: boolean;
  /** Whether user is offline */
  isOffline: boolean;
}

/**
 * Hook to detect online/offline status
 *
 * Uses navigator.onLine and online/offline events for cross-browser compatibility.
 * Handles browser compatibility issues.
 *
 * @returns OfflineResult with online/offline status
 *
 * @example
 * ```tsx
 * const { isOnline, isOffline } = useOffline();
 * if (isOffline) {
 *   return <OfflineIndicator />;
 * }
 * ```
 */
export function useOffline(): OfflineResult {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    // Initial check
    setIsOnline(navigator.onLine);

    // Event handlers
    const handleOnline = (): void => {
      setIsOnline(true);
    };

    const handleOffline = (): void => {
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
  };
}
