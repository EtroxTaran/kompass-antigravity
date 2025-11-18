import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Customer Activity Timeline Component
 *
 * MVP placeholder for customer activity timeline.
 * Future: Will display protocols, updates, and interactions.
 *
 * @example
 * ```tsx
 * <CustomerActivityTimeline customerId="customer-123" />
 * ```
 */
export function CustomerActivityTimeline(): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitäten</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground">Noch keine Aktivitäten</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Aktivitäten werden hier angezeigt, sobald Protokolle erstellt
            wurden.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
