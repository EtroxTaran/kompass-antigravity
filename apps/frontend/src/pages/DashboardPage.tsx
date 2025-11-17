import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useAuth } from '../hooks/useAuth';

/**
 * Dashboard Page Component
 *
 * Placeholder dashboard page for authenticated users.
 * Shows role-specific welcome message.
 * Future: Will contain role-specific dashboard content.
 *
 * @example
 * ```tsx
 * <Route path="/dashboard" element={<DashboardPage />} />
 * ```
 */
export function DashboardPage(): React.ReactElement {
  const { user } = useAuth();

  const getRoleLabel = (): string => {
    if (!user || !user.roles || user.roles.length === 0) {
      return 'Benutzer';
    }

    const roleLabels: Record<string, string> = {
      ADM: 'Außendienst',
      INNEN: 'Innendienst',
      PLAN: 'Planung',
      KALK: 'Kalkulation',
      BUCH: 'Buchhaltung',
      GF: 'Geschäftsführung',
      ADMIN: 'Administrator',
    };

    const primaryRole = user.primaryRole || user.roles[0];
    return roleLabels[primaryRole] || primaryRole;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Willkommen bei KOMPASS</h1>
        <p className="text-muted-foreground mt-2">
          {user?.displayName ? `Hallo, ${user.displayName}` : 'Hallo'} -{' '}
          {getRoleLabel()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            Ihr persönliches Dashboard wird hier angezeigt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Das Dashboard wird in zukünftigen Releases mit rollenspezifischen
            Inhalten und Kennzahlen gefüllt.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
