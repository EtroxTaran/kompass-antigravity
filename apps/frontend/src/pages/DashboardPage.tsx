import { Calendar, DollarSign, FileText } from 'lucide-react';
import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useAuth } from '../hooks/useAuth';

/**
 * Dashboard Page Component
 *
 * Role-specific dashboard showing KPIs, overview sections, and key metrics.
 * Currently implements basic structure with KPI cards.
 * Future: Will contain role-specific content per documentation.
 *
 * Reference: `ui-ux/06-dashboards/gf-dashboard.md`
 *
 * @example
 * ```tsx
 * <Route path="/dashboard" element={<DashboardPage />} />
 * ```
 */
export function DashboardPage(): React.ReactElement {
  const { user, isLoading } = useAuth();

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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          {user?.displayName ? `Hallo, ${user.displayName}` : 'Hallo'} -{' '}
          {getRoleLabel()}
        </p>
      </div>

      {/* KPI Cards Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* KPI Card 1: Umsatz */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Umsatz (Quartal)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€ 0</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-muted-foreground">
                Keine Daten verfügbar
              </span>
            </p>
          </CardContent>
        </Card>

        {/* KPI Card 2: Offene Opportunities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Offene Opportunities
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-muted-foreground">
                Keine Daten verfügbar
              </span>
            </p>
          </CardContent>
        </Card>

        {/* KPI Card 3: Aktive Projekte */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktive Projekte
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-muted-foreground">
                Keine Daten verfügbar
              </span>
            </p>
          </CardContent>
        </Card>

        {/* KPI Card 4: Liquidität */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liquidität</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€ 0</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-muted-foreground">
                Keine Daten verfügbar
              </span>
            </p>
          </CardContent>
        </Card>

        {/* KPI Card 5: Toureneffizienz */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toureneffizienz
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-muted-foreground">
                Keine Daten verfügbar
              </span>
            </p>
          </CardContent>
        </Card>

        {/* KPI Card 6: Offene Aufträge */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Offene Aufträge
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-muted-foreground">
                Keine Daten verfügbar
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sales Overview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Vertriebsübersicht</CardTitle>
            <CardDescription>
              Sales overview wird hier implementiert
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Diese Sektion wird in zukünftigen Releases mit
              Opportunity-Pipeline und Gewinnrate gefüllt.
            </p>
          </CardContent>
        </Card>

        {/* Project Portfolio Section */}
        <Card>
          <CardHeader>
            <CardTitle>Projektportfolio</CardTitle>
            <CardDescription>
              Project portfolio wird hier implementiert
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Diese Sektion wird in zukünftigen Releases mit Projektstatus und
              Budget-Vergleich gefüllt.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Financial Overview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Finanzübersicht</CardTitle>
            <CardDescription>
              Financial overview wird hier implementiert
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Diese Sektion wird in zukünftigen Releases mit Umsatz-Trends und
              Finanzstatus gefüllt.
            </p>
          </CardContent>
        </Card>

        {/* Team Performance Section */}
        <Card>
          <CardHeader>
            <CardTitle>Team-Performance</CardTitle>
            <CardDescription>
              Team performance wird hier implementiert
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Diese Sektion wird in zukünftigen Releases mit Top-Performern und
              Auslastung gefüllt.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
