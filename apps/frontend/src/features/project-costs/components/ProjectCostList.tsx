import { useState } from 'react';
import { Check, X, FileText, Euro } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type {
  ProjectCostResponseDto,
  ProjectCostStatus,
  ProjectCostType,
} from '@kompass/shared/types/entities/project-cost';
import { projectCostApi } from '../services/project-cost-api';

/**
 * Project Cost List Component
 * 
 * Displays list of project costs with actions.
 * 
 * @see Phase 1 of Time Tracking Implementation Plan
 */
interface ProjectCostListProps {
  costs: ProjectCostResponseDto[];
  onCostUpdated?: () => void;
  showActions?: boolean;
}

export function ProjectCostList({
  costs,
  onCostUpdated,
  showActions = true,
}: ProjectCostListProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Format date
   */
  function formatDate(date?: Date): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Get cost type label
   */
  function getCostTypeLabel(type: ProjectCostType): string {
    const labels: Record<ProjectCostType, string> = {
      material: 'Material',
      contractor: 'Auftragnehmer',
      external_service: 'Externe Dienstleistung',
      equipment: 'Ausrüstung',
      other: 'Sonstiges',
    };
    return labels[type] || type;
  }

  /**
   * Get status label
   */
  function getStatusLabel(status: ProjectCostStatus): string {
    const labels: Record<ProjectCostStatus, string> = {
      planned: 'Geplant',
      ordered: 'Bestellt',
      received: 'Erhalten',
      invoiced: 'Rechnung erhalten',
      paid: 'Bezahlt',
    };
    return labels[status] || status;
  }

  /**
   * Get status badge variant
   */
  function getStatusVariant(
    status: ProjectCostStatus,
  ): 'default' | 'secondary' | 'outline' | 'destructive' {
    switch (status) {
      case 'planned':
        return 'secondary';
      case 'ordered':
        return 'default';
      case 'received':
        return 'default';
      case 'invoiced':
        return 'outline';
      case 'paid':
        return 'outline';
      default:
        return 'default';
    }
  }

  /**
   * Handle approve cost
   */
  async function handleApprove(costId: string) {
    setLoading(true);
    try {
      await projectCostApi.approve(costId);
      toast({
        title: 'Genehmigt',
        description: 'Projektkosten wurden genehmigt',
      });
      onCostUpdated?.();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Projektkosten konnten nicht genehmigt werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handle mark as paid
   */
  async function handleMarkPaid(costId: string) {
    setLoading(true);
    try {
      await projectCostApi.markAsPaid(costId);
      toast({
        title: 'Als bezahlt markiert',
        description: 'Projektkosten wurden als bezahlt markiert',
      });
      onCostUpdated?.();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Projektkosten konnten nicht als bezahlt markiert werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Datum</TableHead>
          <TableHead>Typ</TableHead>
          <TableHead>Beschreibung</TableHead>
          <TableHead>Lieferant</TableHead>
          <TableHead>Rechnungs-Nr.</TableHead>
          <TableHead className="text-right">Menge</TableHead>
          <TableHead className="text-right">Einheitspreis</TableHead>
          <TableHead className="text-right">Gesamt</TableHead>
          <TableHead className="text-right">Inkl. MwSt</TableHead>
          <TableHead>Status</TableHead>
          {showActions && <TableHead className="text-right">Aktionen</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {costs.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={showActions ? 11 : 10}
              className="text-center text-muted-foreground"
            >
              Keine Projektkosten gefunden
            </TableCell>
          </TableRow>
        ) : (
          costs.map((cost) => (
            <TableRow key={cost._id}>
              {/* Invoice Date */}
              <TableCell>{formatDate(cost.invoiceDate)}</TableCell>

              {/* Cost Type */}
              <TableCell>
                <Badge variant="secondary">
                  {getCostTypeLabel(cost.costType)}
                </Badge>
              </TableCell>

              {/* Description */}
              <TableCell className="max-w-xs truncate">
                {cost.description}
              </TableCell>

              {/* Supplier */}
              <TableCell>{cost.supplierName || '-'}</TableCell>

              {/* Invoice Number */}
              <TableCell>
                {cost.invoiceNumber ? (
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {cost.invoiceNumber}
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>

              {/* Quantity */}
              <TableCell className="text-right font-mono">
                {cost.quantity}
              </TableCell>

              {/* Unit Price */}
              <TableCell className="text-right font-mono">
                €{cost.unitPriceEur.toFixed(2)}
              </TableCell>

              {/* Total */}
              <TableCell className="text-right font-mono font-medium">
                €{cost.totalCostEur.toFixed(2)}
              </TableCell>

              {/* Total with Tax */}
              <TableCell className="text-right font-mono font-bold">
                €{cost.totalWithTaxEur.toFixed(2)}
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge variant={getStatusVariant(cost.status)}>
                  {getStatusLabel(cost.status)}
                </Badge>
              </TableCell>

              {/* Actions */}
              {showActions && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {!cost.approvedBy && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(cost._id)}
                        disabled={loading}
                        title="Genehmigen"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {cost.status === 'invoiced' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkPaid(cost._id)}
                        disabled={loading}
                        title="Als bezahlt markieren"
                      >
                        <Euro className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

