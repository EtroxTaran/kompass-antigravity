import { Users, Download } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { TimeEntryList } from '../components/TimeEntryList';
import { useTeamTimesheets } from '../hooks/useTimeTracking';

/**
 * Team Timesheets Page
 *
 * Manager page for viewing and approving team time entries.
 *
 * Features:
 * - View all team member time entries
 * - Filter by project, status, date range
 * - Bulk approve time entries
 * - Export team timesheets
 *
 * @see Phase 1.3 of Time Tracking Implementation Plan
 *
 * Permissions: PLAN and GF roles only
 */
/**
 * Helper: Get start of current week (Monday)
 */
function getStartOfWeek(): Date {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  return new Date(today.setDate(diff));
}

/**
 * Helper: Get end of current week (Sunday)
 */
function getEndOfWeek(): Date {
  const start = getStartOfWeek();
  start.setDate(start.getDate() + 6);
  return start;
}

export function TeamTimesheetsPage() {
  // Filters
  const [projectId, setProjectId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(
    getStartOfWeek().toISOString().split('T')[0] ?? ''
  );
  const [endDate, setEndDate] = useState<string>(
    getEndOfWeek().toISOString().split('T')[0] ?? ''
  );

  // Fetch team timesheets
  const { entries, loading, refetch } = useTeamTimesheets({
    projectId: projectId || undefined,
    status: status || undefined,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });

  /**
   * Calculate summary statistics
   */
  const totalHours = entries.reduce(
    (sum, entry) => sum + entry.durationMinutes / 60,
    0
  );
  const totalCost = entries.reduce(
    (sum, entry) => sum + (entry.totalCostEur || 0),
    0
  );
  const pendingCount = entries.filter((e) => e.status === 'completed').length;
  const approvedCount = entries.filter((e) => e.status === 'approved').length;

  // Calculate by team member
  const byUser = entries.reduce(
    (acc, entry) => {
      const userId = entry.userId;
      if (!acc[userId]) {
        acc[userId] = {
          userName: entry.userName || userId,
          hours: 0,
          cost: 0,
        };
      }
      acc[userId].hours += entry.durationMinutes / 60;
      acc[userId].cost += entry.totalCostEur || 0;
      return acc;
    },
    {} as Record<string, { userName: string; hours: number; cost: number }>
  );

  /**
   * Set to current week
   */
  function setCurrentWeek() {
    setStartDate(getStartOfWeek().toISOString().split('T')[0] ?? '');
    setEndDate(getEndOfWeek().toISOString().split('T')[0] ?? '');
  }

  /**
   * Handle export
   */
  function handleExport() {
    // TODO: Implement CSV export
    // Export functionality will be implemented here
  }

  /**
   * Clear filters
   */
  function clearFilters() {
    setProjectId('');
    setStatus('');
    setCurrentWeek();
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Team-Zeiterfassungen</h1>
            <p className="text-muted-foreground">
              Genehmigen und verwalten Sie Team-Zeiterfassungen
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportieren
        </Button>
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
            <CardDescription>Ausstehend</CardDescription>
            <CardTitle className="text-2xl">{pendingCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Genehmigt</CardDescription>
            <CardTitle className="text-2xl">{approvedCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Team member summary */}
      {Object.keys(byUser).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Team-Übersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(byUser).map(([userId, data]) => (
                <div key={userId} className="p-4 bg-muted rounded-lg space-y-1">
                  <p className="font-medium">{data.userName}</p>
                  <p className="text-2xl font-bold">{data.hours.toFixed(1)}h</p>
                  <p className="text-sm text-muted-foreground">
                    €{data.cost.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="Alle Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Alle Status</SelectItem>
                  <SelectItem value="completed">Ausstehend</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Time entries list with bulk approval */}
      <Card>
        <CardHeader>
          <CardTitle>Team-Zeiterfassungen ({entries.length})</CardTitle>
          <CardDescription>
            Genehmigen Sie Zeiterfassungen Ihres Teams
          </CardDescription>
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
