import React from 'react';

import { Badge } from '@/components/ui/badge';

import { useOffline } from '../../hooks/useOffline';

/**
 * Offline Indicator Component
 *
 * Shows "Offline" badge when user is offline.
 * Positioned in header/navigation area.
 *
 * @example
 * ```tsx
 * <OfflineIndicator />
 * ```
 */
export function OfflineIndicator(): React.ReactElement | null {
  const { isOffline } = useOffline();

  if (!isOffline) {
    return null;
  }

  return (
    <Badge variant="destructive" className="ml-2">
      Offline
    </Badge>
  );
}
