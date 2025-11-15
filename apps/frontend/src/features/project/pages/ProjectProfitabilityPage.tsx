import { TrendingUp, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ProfitabilityDashboard } from '../components/ProfitabilityDashboard';
import { useProfitability } from '../hooks/useProfitability';

/**
 * Project Profitability Page
 *
 * Displays comprehensive profitability analysis for a project.
 *
 * Features:
 * - Budget vs actual comparison
 * - Cost breakdown by labor and materials
 * - Profit margin analysis
 * - Budget alerts and warnings
 *
 * @see Phase 1.4 of Time Tracking Implementation Plan
 */
interface ProjectProfitabilityPageProps {
  projectId: string;
}

export function ProjectProfitabilityPage({
  projectId,
}: ProjectProfitabilityPageProps) {
  const { report, loading, error, refetch } = useProfitability(projectId);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Lädt Rentabilitätsbericht...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Fehler</CardTitle>
            <CardDescription>
              Rentabilitätsbericht konnte nicht geladen werden
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              {error?.message || 'Unbekannter Fehler'}
            </p>
            <Button onClick={refetch} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Erneut versuchen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Projekt-Rentabilität</h1>
            <p className="text-muted-foreground">{report.projectName}</p>
          </div>
        </div>
        <Button variant="outline" onClick={refetch}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Aktualisieren
        </Button>
      </div>

      {/* Profitability Dashboard */}
      <ProfitabilityDashboard report={report} />
    </div>
  );
}
