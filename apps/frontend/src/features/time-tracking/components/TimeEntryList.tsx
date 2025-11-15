import { Check, X, Clock, Calendar } from 'lucide-react';
import { useState } from 'react';

import type { TimeEntryResponseDto, TimeEntryStatus } from '@kompass/shared';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { timeTrackingApi } from '../services/time-tracking-api';

import { useToast } from '@/hooks/use-toast';

/**
 * Time Entry List Component
 *
 * Displays list of time entries with filtering, bulk actions, and approval.
 *
 * @see Phase 1.3 of Time Tracking Implementation Plan
 */
interface TimeEntryListProps {
  entries: TimeEntryResponseDto[];
  onEntryUpdated?: () => void;
  showBulkActions?: boolean;
  showApprovalActions?: boolean;
}

export function TimeEntryList({
  entries,
  onEntryUpdated,
  showBulkActions = false,
  showApprovalActions = false,
}: TimeEntryListProps) {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Format duration from minutes to HH:MM
   */
  function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${String(mins).padStart(2, '0')}`;
  }

  /**
   * Format date
   */
  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Format time
   */
  function formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Get status badge variant
   */
  function getStatusVariant(
    status: TimeEntryStatus
  ): 'default' | 'secondary' | 'outline' | 'destructive' {
    switch (status) {
      case 'in_progress':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'approved':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'default';
    }
  }

  /**
   * Get status label
   */
  function getStatusLabel(status: TimeEntryStatus): string {
    const labels: Record<TimeEntryStatus, string> = {
      in_progress: 'Läuft',
      completed: 'Abgeschlossen',
      approved: 'Genehmigt',
      rejected: 'Abgelehnt',
    };
    return labels[status] || status;
  }

  /**
   * Handle approve entry
   */
  async function handleApprove(entryId: string) {
    setLoading(true);
    try {
      await timeTrackingApi.approve(entryId);
      toast({
        title: 'Genehmigt',
        description: 'Zeiterfassung wurde genehmigt',
      });
      onEntryUpdated?.();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Zeiterfassung konnte nicht genehmigt werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handle reject entry
   */
  async function handleReject(entryId: string) {
    const reason = prompt('Grund für Ablehnung:');
    if (!reason) return;

    setLoading(true);
    try {
      await timeTrackingApi.reject(entryId, reason);
      toast({
        title: 'Abgelehnt',
        description: 'Zeiterfassung wurde abgelehnt',
      });
      onEntryUpdated?.();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Zeiterfassung konnte nicht abgelehnt werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handle bulk approve
   */
  async function handleBulkApprove() {
    if (selectedIds.size === 0) {
      toast({
        title: 'Keine Auswahl',
        description: 'Bitte wählen Sie Zeiterfassungen aus',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await timeTrackingApi.bulkApprove(Array.from(selectedIds));
      toast({
        title: 'Genehmigt',
        description: `${result.approvedCount} Zeiterfassungen wurden genehmigt`,
      });
      setSelectedIds(new Set());
      onEntryUpdated?.();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Zeiterfassungen konnten nicht genehmigt werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Toggle entry selection
   */
  function toggleSelection(entryId: string) {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(entryId)) {
      newSelection.delete(entryId);
    } else {
      newSelection.add(entryId);
    }
    setSelectedIds(newSelection);
  }

  /**
   * Select all entries
   */
  function selectAll() {
    if (selectedIds.size === entries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(entries.map((e) => e._id)));
    }
  }

  return (
    <div className="space-y-4">
      {/* Bulk actions toolbar */}
      {showBulkActions && entries.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <Checkbox
            checked={selectedIds.size === entries.length}
            onCheckedChange={selectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedIds.size} von {entries.length} ausgewählt
          </span>
          {selectedIds.size > 0 && (
            <Button size="sm" onClick={handleBulkApprove} disabled={loading}>
              <Check className="mr-2 h-4 w-4" />
              Alle genehmigen
            </Button>
          )}
        </div>
      )}

      {/* Time entries table */}
      <Table>
        <TableHeader>
          <TableRow>
            {showBulkActions && <TableHead className="w-12"></TableHead>}
            <TableHead>Datum</TableHead>
            <TableHead>Projekt</TableHead>
            <TableHead>Aufgabe</TableHead>
            <TableHead>Benutzer</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>Ende</TableHead>
            <TableHead className="text-right">Dauer</TableHead>
            <TableHead className="text-right">Kosten</TableHead>
            <TableHead>Status</TableHead>
            {showApprovalActions && (
              <TableHead className="text-right">Aktionen</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showBulkActions ? 11 : 10}
                className="text-center text-muted-foreground"
              >
                Keine Zeiterfassungen gefunden
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow key={entry._id}>
                {/* Checkbox */}
                {showBulkActions && (
                  <TableCell>
                    {entry.status === 'completed' && (
                      <Checkbox
                        checked={selectedIds.has(entry._id)}
                        onCheckedChange={() => toggleSelection(entry._id)}
                      />
                    )}
                  </TableCell>
                )}

                {/* Date */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(entry.startTime)}
                  </div>
                </TableCell>

                {/* Project */}
                <TableCell className="font-medium">
                  {entry.projectName || entry.projectId}
                </TableCell>

                {/* Task */}
                <TableCell className="max-w-xs truncate">
                  {entry.taskDescription}
                </TableCell>

                {/* User */}
                <TableCell>{entry.userName || entry.userId}</TableCell>

                {/* Start time */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {formatTime(entry.startTime)}
                  </div>
                </TableCell>

                {/* End time */}
                <TableCell>
                  {entry.endTime ? formatTime(entry.endTime) : '-'}
                </TableCell>

                {/* Duration */}
                <TableCell className="text-right font-mono">
                  {formatDuration(entry.durationMinutes)}
                </TableCell>

                {/* Cost */}
                <TableCell className="text-right font-mono">
                  {entry.totalCostEur
                    ? `€${entry.totalCostEur.toFixed(2)}`
                    : '-'}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant={getStatusVariant(entry.status as TimeEntryStatus)}
                  >
                    {getStatusLabel(entry.status as TimeEntryStatus)}
                  </Badge>
                </TableCell>

                {/* Actions */}
                {showApprovalActions && (
                  <TableCell className="text-right">
                    {entry.status === 'completed' && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(entry._id)}
                          disabled={loading}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(entry._id)}
                          disabled={loading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
