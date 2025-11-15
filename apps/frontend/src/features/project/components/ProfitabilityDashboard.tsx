/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from 'lucide-react';

import type { ProfitabilityReport } from '@kompass/shared/types/entities/project';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

/**
 * Profitability Dashboard Component
 *
 * Displays comprehensive profitability analysis for a project.
 * Shows budget vs actual costs, profit margins, and alerts.
 *
 * @see Phase 1.4 of Time Tracking Implementation Plan
 */
interface ProfitabilityDashboardProps {
  report: ProfitabilityReport;
}

export function ProfitabilityDashboard({
  report,
}: ProfitabilityDashboardProps) {
  /**
   * Get budget usage percentage
   */
  const budgetUsagePercent =
    report.budgetedTotalCostEur > 0
      ? (report.actualTotalCostEur / report.budgetedTotalCostEur) * 100
      : 0;

  /**
   * Get status color
   */
  function getStatusColor(status: string): string {
    switch (status) {
      case 'on_budget':
        return 'text-green-600';
      case 'at_risk':
        return 'text-yellow-600';
      case 'over_budget':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  /**
   * Get status label
   */
  function getStatusLabel(status: string): string {
    switch (status) {
      case 'on_budget':
        return 'Im Budget';
      case 'at_risk':
        return 'Gefährdet';
      case 'over_budget':
        return 'Über Budget';
      default:
        return status;
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert if over budget or at risk */}
      {(report.isOverBudget || report.isAtRisk) && report.warningMessage && (
        <Alert variant={report.isOverBudget ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {report.isOverBudget
              ? 'Kritisch: Über Budget'
              : 'Warnung: Gefährdet'}
          </AlertTitle>
          <AlertDescription>{report.warningMessage}</AlertDescription>
        </Alert>
      )}

      {/* Main metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Contract Value */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Auftragswert</CardDescription>
            <CardTitle className="text-2xl">
              €
              {report.contractValueEur.toLocaleString('de-DE', {
                minimumFractionDigits: 2,
              })}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Actual Total Cost */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ist-Kosten</CardDescription>
            <CardTitle className="text-2xl">
              €
              {report.actualTotalCostEur.toLocaleString('de-DE', {
                minimumFractionDigits: 2,
              })}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Budget: €
              {report.budgetedTotalCostEur.toLocaleString('de-DE', {
                minimumFractionDigits: 2,
              })}
            </p>
          </CardHeader>
        </Card>

        {/* Estimated Profit */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Geschätzter Gewinn</CardDescription>
            <CardTitle
              className={`text-2xl ${report.estimatedProfitEur >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {report.estimatedProfitEur >= 0 ? (
                <TrendingUp className="inline h-5 w-5 mr-1" />
              ) : (
                <TrendingDown className="inline h-5 w-5 mr-1" />
              )}
              €
              {Math.abs(report.estimatedProfitEur).toLocaleString('de-DE', {
                minimumFractionDigits: 2,
              })}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Profit Margin */}
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gewinnmarge</CardDescription>
            <CardTitle
              className={`text-2xl ${report.profitMarginPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {report.profitMarginPercent.toFixed(1)}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Budget status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Budget-Status</CardTitle>
              <CardDescription>
                {budgetUsagePercent.toFixed(1)}% des Budgets verbraucht
              </CardDescription>
            </div>
            <Badge className={getStatusColor(report.costTrackingStatus)}>
              {getStatusLabel(report.costTrackingStatus)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={Math.min(budgetUsagePercent, 100)} className="h-4" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>€0</span>
            <span>
              Budget: €
              {report.budgetedTotalCostEur.toLocaleString('de-DE', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Cost breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Labor costs */}
        <Card>
          <CardHeader>
            <CardTitle>Arbeitskosten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Budget:</span>
              <span className="font-mono">
                €
                {report.budgetedLaborCostEur.toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Ist:</span>
              <span className="font-mono font-bold">
                €
                {report.actualLaborCostEur.toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-muted-foreground">Abweichung:</span>
              <span
                className={`font-mono font-bold ${report.laborVarianceEur >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {report.laborVarianceEur >= 0 ? '+' : ''}€
                {report.laborVarianceEur.toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Material costs */}
        <Card>
          <CardHeader>
            <CardTitle>Materialkosten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Budget:</span>
              <span className="font-mono">
                €
                {report.budgetedMaterialCostEur.toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Ist:</span>
              <span className="font-mono font-bold">
                €
                {report.actualMaterialCostEur.toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-muted-foreground">Abweichung:</span>
              <span
                className={`font-mono font-bold ${report.materialVarianceEur >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {report.materialVarianceEur >= 0 ? '+' : ''}€
                {report.materialVarianceEur.toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall variance */}
      <Card>
        <CardHeader>
          <CardTitle>Gesamt-Abweichung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Abweichung (€)</p>
              <p
                className={`text-3xl font-bold ${report.costVarianceEur >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {report.costVarianceEur >= 0 ? '+' : ''}€
                {Math.abs(report.costVarianceEur).toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Abweichung (%)</p>
              <p
                className={`text-3xl font-bold ${report.costVariancePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {report.costVariancePercent >= 0 ? '+' : ''}
                {report.costVariancePercent.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
