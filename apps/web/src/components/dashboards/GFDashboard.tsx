import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useCustomers } from "@/hooks/useCustomer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Euro,
  Briefcase,
  AlertCircle,
  Target,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Format currency in German format
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format currency short (K/M)
function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000) {
    return `€${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `€${(amount / 1000).toFixed(0)}k`;
  }
  return formatCurrency(amount);
}

// Get utilization color
function getUtilizationColor(value: number): string {
  if (value > 100) return "text-red-600";
  if (value >= 80) return "text-amber-600";
  return "text-green-600";
}

function getUtilizationBg(value: number): string {
  if (value > 100) return "bg-red-100";
  if (value >= 80) return "bg-amber-100";
  return "bg-green-100";
}

// Loading Skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-16 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function GFDashboard() {
  const { metrics, loading, error } = useDashboardMetrics();
  const { customers } = useCustomers();

  // Helper to get customer name
  const getCustomerName = (id: string) =>
    customers.find((c) => c._id === id)?.companyName || "Unbekannt";

  if (loading) {
    return (
      <div className="p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Fehler beim Laden</h2>
        <p className="text-muted-foreground">
          Dashboard-Daten konnten nicht geladen werden.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Geschäftsführer Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Umsatz (Bezahlt)
            </CardTitle>
            <Euro className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(metrics.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">Bezahlte Rechnungen</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Offene Forderungen
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(metrics.outstandingRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.overdueInvoices.count} überfällige Rechnungen
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pipeline (Gewichtet)
            </CardTitle>
            <Target className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(metrics.weightedPipeline)}
            </div>
            <p className="text-xs text-muted-foreground">
              Volumen: {formatCurrency(metrics.pipelineValue)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktive Projekte
            </CardTitle>
            <Briefcase className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeProjectCount}</div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-green-600">
                {metrics.onTimeProjectCount} pünktlich
              </span>
              {metrics.delayedProjectCount > 0 && (
                <span className="text-red-600">
                  {metrics.delayedProjectCount} verzögert
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Vertriebspipeline</CardTitle>
            <CardDescription>Opportunity-Wert nach Phase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.pipelineStages.map((stage) => {
                const maxValue = Math.max(
                  ...metrics.pipelineStages.map((s) => s.value),
                );
                const widthPercent =
                  maxValue > 0 ? (stage.value / maxValue) * 100 : 0;

                return (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{stage.label}</span>
                        <Badge variant="outline">{stage.count}</Badge>
                      </div>
                      <span className="font-semibold text-sm">
                        {formatCurrencyShort(stage.value)}
                      </span>
                    </div>
                    <div className="h-8 rounded overflow-hidden bg-muted relative">
                      <div
                        className="absolute inset-y-0 left-0 flex items-center justify-center transition-all rounded"
                        style={{
                          width: `${widthPercent}%`,
                          backgroundColor: stage.color,
                          minWidth: stage.value > 0 ? "40px" : "0",
                        }}
                      >
                        {widthPercent > 15 && (
                          <span className="text-white text-xs font-medium">
                            {Math.round(widthPercent)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Umsatzentwicklung</CardTitle>
            <CardDescription>Letzte 12 Monate</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={metrics.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(value) => formatCurrencyShort(value)}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Umsatz"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle>Projekte nach Status</CardTitle>
            <CardDescription>Aktuelle Verteilung</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={metrics.projectsByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6">
                  {metrics.projectsByStatus.map((entry) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Chancen</CardTitle>
            <CardDescription>Höchste erwartete Werte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topOpportunities.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Keine offenen Chancen.
                </p>
              ) : (
                metrics.topOpportunities.map((opp) => (
                  <div
                    key={opp._id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{opp.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {getCustomerName(opp.customerId)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        {formatCurrency(opp.expectedValue)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {opp.probability}% Wahrscheinlichkeit
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Überfällige Rechnungen
            </CardTitle>
            <CardDescription>
              {metrics.overdueInvoices.count} Rechnungen •{" "}
              {formatCurrency(metrics.overdueInvoices.totalValue)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.overdueInvoices.invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Keine überfälligen Rechnungen. 🎉
                </p>
              ) : (
                metrics.overdueInvoices.invoices.slice(0, 5).map((inv) => (
                  <div
                    key={inv._id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm">{inv.invoiceNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        Fällig: {new Date(inv.dueDate).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        {formatCurrency(inv.totalGross)}
                      </p>
                      <Badge variant="destructive" className="text-xs">
                        {inv.daysOverdue} Tage überfällig
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Team Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team-Auslastung
            </CardTitle>
            <CardDescription>Aktueller Monat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.teamUtilization.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Keine Zeiterfassungen vorhanden.
                </p>
              ) : (
                metrics.teamUtilization.slice(0, 5).map((member) => (
                  <div key={member.userId} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{member.userName}</span>
                      <span
                        className={`font-semibold text-sm ${getUtilizationColor(
                          member.utilizationPercent,
                        )}`}
                      >
                        {member.utilizationPercent}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={Math.min(member.utilizationPercent, 100)}
                        className={`h-2 ${getUtilizationBg(
                          member.utilizationPercent,
                        )}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {member.totalHours}h / {member.targetHours}h
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
