import { Plus, Download } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { ProjectCostForm } from '../components/ProjectCostForm';
import { ProjectCostList } from '../components/ProjectCostList';
import { useProjectCosts } from '../hooks/useProjectCosts';

/**
 * Project Costs Page
 *
 * Main page for project cost management.
 *
 * Features:
 * - View all project costs
 * - Add new costs
 * - Approve costs (BUCH/GF role)
 * - Mark as paid
 * - Cost summary statistics
 *
 * @see Phase 1 of Time Tracking Implementation Plan
 */
interface ProjectCostsPageProps {
  projectId: string;
}

export function ProjectCostsPage({ projectId }: ProjectCostsPageProps) {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // Fetch project costs
  const { costs, summary, loading, refetch } = useProjectCosts(projectId);

  /**
   * Handle export
   */
  function handleExport() {
    // TODO: Implement CSV export
    // Export functionality will be implemented here
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projektkosten</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Materialien, Auftragnehmer und externe
            Dienstleistungen
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportieren
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Kosten hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Neue Projektkosten</DialogTitle>
                <DialogDescription>
                  Erfassen Sie Materialkosten, Auftragnehmer oder externe
                  Dienstleistungen
                </DialogDescription>
              </DialogHeader>
              <ProjectCostForm
                projectId={projectId}
                onSuccess={() => {
                  setIsFormOpen(false);
                  refetch();
                }}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Gesamt (netto)</CardDescription>
              <CardTitle className="text-2xl">
                €
                {summary.totalCostEur.toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                })}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Gesamt (inkl. MwSt)</CardDescription>
              <CardTitle className="text-2xl">
                €
                {summary.totalWithTaxEur.toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                })}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ausstehende Zahlung</CardDescription>
              <CardTitle className="text-2xl">
                €
                {summary.pendingPaymentEur.toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                })}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Anzahl Positionen</CardDescription>
              <CardTitle className="text-2xl">{costs.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Cost breakdown by type */}
      {summary && summary.byCostType.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kostenaufschlüsselung nach Art</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {summary.byCostType.map((typeSummary) => (
                <div
                  key={typeSummary.costType}
                  className="p-4 bg-muted rounded-lg space-y-1"
                >
                  <p className="text-sm text-muted-foreground">
                    {typeSummary.costType === 'material' && 'Material'}
                    {typeSummary.costType === 'contractor' && 'Auftragnehmer'}
                    {typeSummary.costType === 'external_service' &&
                      'Externe Dienste'}
                    {typeSummary.costType === 'equipment' && 'Ausrüstung'}
                    {typeSummary.costType === 'other' && 'Sonstiges'}
                  </p>
                  <p className="text-xl font-bold">
                    €{typeSummary.totalCostEur.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {typeSummary.itemCount} Position(en)
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project costs list */}
      <Card>
        <CardHeader>
          <CardTitle>Kostenpositionen ({costs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Lädt Projektkosten...
            </div>
          ) : (
            <ProjectCostList
              costs={costs}
              onCostUpdated={refetch}
              showActions={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
