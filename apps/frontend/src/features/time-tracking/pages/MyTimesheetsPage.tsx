import { useState } from 'react';
import { Calendar, Download } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimeEntryList } from '../components/TimeEntryList';
import { TimesheetWeekView } from '../components/TimesheetWeekView';
import { useMyTimesheets } from '../hooks/useTimeTracking';

/**
 * My Timesheets Page
 * 
 * Personal timesheets page for individual users.
 * 
 * Features:
 * - View personal time entries
 * - Weekly view with quick entry
 * - Submit for approval
 * - Export timesheets
 * 
 * @see Phase 1.3 of Time Tracking Implementation Plan
 */
export function MyTimesheetsPage() {
  // Date range filters
  const [startDate, setStartDate] = useState<string>(
    getStartOfWeek().toISOString().split('T')[0],
  );
  const [endDate, setEndDate] = useState<string>(
    getEndOfWeek().toISOString().split('T')[0],
  );

  // Fetch timesheets
  const { entries, loading, refetch } = useMyTimesheets({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });

  /**
   * Calculate summary statistics
   */
  const totalHours = entries.reduce(
    (sum, entry) => sum + entry.durationMinutes / 60,
    0,
  );
  const approvedHours = entries
    .filter((e) => e.status === 'approved')
    .reduce((sum, entry) => sum + entry.durationMinutes / 60, 0);
  const pendingHours = entries
    .filter((e) => e.status === 'completed')
    .reduce((sum, entry) => sum + entry.durationMinutes / 60, 0);

  /**
   * Get start of week (Monday)
   */
  function getStartOfWeek(): Date {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust if Sunday
    return new Date(now.setDate(diff));
  }

  /**
   * Get end of week (Sunday)
   */
  function getEndOfWeek(): Date {
    const start = getStartOfWeek();
    return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  }

  /**
   * Set to current week
   */
  function setCurrentWeek() {
    setStartDate(getStartOfWeek().toISOString().split('T')[0]);
    setEndDate(getEndOfWeek().toISOString().split('T')[0]);
  }

  /**
   * Set to previous week
   */
  function setPreviousWeek() {
    const start = new Date(startDate);
    start.setDate(start.getDate() - 7);
    const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }

  /**
   * Set to next week
   */
  function setNextWeek() {
    const start = new Date(startDate);
    start.setDate(start.getDate() + 7);
    const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }

  /**
   * Handle export
   */
  function handleExport() {
    // TODO: Implement CSV export
    console.log('Export timesheets');
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meine Zeiterfassungen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre persönlichen Zeiterfassungen
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportieren
        </Button>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gesamt Stunden</CardDescription>
            <CardTitle className="text-2xl">{totalHours.toFixed(1)}h</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Genehmigt</CardDescription>
            <CardTitle className="text-2xl">{approvedHours.toFixed(1)}h</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ausstehend</CardDescription>
            <CardTitle className="text-2xl">{pendingHours.toFixed(1)}h</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Date range selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>Zeitraum</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={setPreviousWeek}>
                ← Vorherige Woche
              </Button>
              <Button variant="outline" size="sm" onClick={setCurrentWeek}>
                Diese Woche
              </Button>
              <Button variant="outline" size="sm" onClick={setNextWeek}>
                Nächste Woche →
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="start-date">Von</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="end-date">Bis</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs: List view vs Week view */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Listen-Ansicht</TabsTrigger>
          <TabsTrigger value="week">Wochen-Ansicht</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
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
                  showBulkActions={false}
                  showApprovalActions={false}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week">
          <TimesheetWeekView
            entries={entries}
            startDate={new Date(startDate)}
            onEntryUpdated={refetch}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

