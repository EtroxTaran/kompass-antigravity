import { useState } from 'react';
import { Download, Filter, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TimeEntryList } from '../components/TimeEntryList';
import { useTimeTracking } from '../hooks/useTimeTracking';
import type { TimeEntryStatus } from '@kompass/shared/types/entities/time-entry';

/**
 * Time Tracking Page
 * 
 * Main page for time tracking with filtering, export, and bulk actions.
 * 
 * @see Phase 1.3 of Time Tracking Implementation Plan
 */
export function TimeTrackingPage() {
  // Filters
  const [projectId, setProjectId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [status, setStatus] = useState<TimeEntryStatus | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Fetch time entries with filters
  const { entries, loading, refetch } = useTimeTracking({
    projectId: projectId || undefined,
    userId: userId || undefined,
    status: status || undefined,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
  });

  /**
   * Calculate summary statistics
   */
  const totalHours = entries.reduce(
    (sum, entry) => sum + entry.durationMinutes / 60,
    0,
  );
  const totalCost = entries.reduce(
    (sum, entry) => sum + (entry.totalCostEur || 0),
    0,
  );
  const approvedCount = entries.filter((e) => e.status === 'approved').length;
  const pendingCount = entries.filter((e) => e.status === 'completed').length;

  /**
   * Handle export to CSV
   */
  function handleExport() {
    // TODO: Implement CSV export
    console.log('Export to CSV');
  }

  /**
   * Clear all filters
   */
  function clearFilters() {
    setProjectId('');
    setUserId('');
    setStatus('');
    setStartDate('');
    setEndDate('');
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Zeiterfassung</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Zeiterfassungen für alle Projekte
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportieren
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Manuelle Erfassung
          </Button>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gesamt Stunden</CardDescription>
            <CardTitle className="text-2xl">{totalHours.toFixed(1)}h</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gesamt Kosten</CardDescription>
            <CardTitle className="text-2xl">€{totalCost.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Genehmigt</CardDescription>
            <CardTitle className="text-2xl">{approvedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ausstehend</CardDescription>
            <CardTitle className="text-2xl">{pendingCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filter</CardTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Filter zurücksetzen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Project filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-project">Projekt</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger id="filter-project">
                  <SelectValue placeholder="Alle Projekte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Alle Projekte</SelectItem>
                  {/* TODO: Load projects from API */}
                  <SelectItem value="project-1">Project Alpha</SelectItem>
                  <SelectItem value="project-2">Project Beta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TimeEntryStatus | '')}>
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="Alle Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Alle Status</SelectItem>
                  <SelectItem value="in_progress">Läuft</SelectItem>
                  <SelectItem value="completed">Abgeschlossen</SelectItem>
                  <SelectItem value="approved">Genehmigt</SelectItem>
                  <SelectItem value="rejected">Abgelehnt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start date filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-start-date">Von Datum</Label>
              <Input
                id="filter-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End date filter */}
            <div className="space-y-2">
              <Label htmlFor="filter-end-date">Bis Datum</Label>
              <Input
                id="filter-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Apply filter button */}
            <div className="flex items-end">
              <Button onClick={() => refetch()} disabled={loading} className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Filtern
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time entries list */}
      <Card>
        <CardHeader>
          <CardTitle>Zeiterfassungen ({entries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Lädt Zeiterfassungen...
            </div>
          ) : (
            <TimeEntryList
              entries={entries}
              onEntryUpdated={refetch}
              showBulkActions={true}
              showApprovalActions={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

