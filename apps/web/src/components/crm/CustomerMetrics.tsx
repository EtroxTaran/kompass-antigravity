import { useProjects } from "@/hooks/useProjects";
import { useOffers } from "@/hooks/useOffers";
import { useInvoices } from "@/hooks/useInvoice";
import { useActivities } from "@/hooks/useActivities";
import { Card, CardContent } from "@/components/ui/card";
import { Target, FolderOpen, Euro, Clock } from "lucide-react";

interface CustomerMetricsProps {
  customerId: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDaysAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Heute";
  if (diffDays === 1) return "Vor 1 Tag";
  return `Vor ${diffDays} Tagen`;
}

export function CustomerMetrics({ customerId }: CustomerMetricsProps) {
  const { projects, loading: projectsLoading } = useProjects({ customerId });
  const { offers, loading: offersLoading } = useOffers({ customerId });
  const { invoices, loading: invoicesLoading } = useInvoices({ customerId });
  const { activities, loading: activitiesLoading } = useActivities(customerId);

  const isLoading =
    projectsLoading || offersLoading || invoicesLoading || activitiesLoading;

  // Calculate metrics
  const activeOffers = offers.filter(
    (o) => o.status === "sent" || o.status === "viewed",
  );
  const offerTotalValue = activeOffers.reduce(
    (sum, o) => sum + (o.totalNet || 0),
    0,
  );

  const activeProjects = projects.filter(
    (p) => p.status === "active" || p.status === "planning",
  );
  const projectsTotalBudget = activeProjects.reduce(
    (sum, p) => sum + (p.budget || 0),
    0,
  );

  // Calculate YTD revenue from paid invoices
  const currentYear = new Date().getFullYear();
  const paidInvoicesThisYear = invoices.filter(
    (inv) =>
      inv.status === "paid" && new Date(inv.date).getFullYear() === currentYear,
  );
  const revenueThisYear = paidInvoicesThisYear.reduce(
    (sum, inv) => sum + (inv.totalGross || 0),
    0,
  );

  // Get last activity
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const lastActivity = sortedActivities[0];

  const activityTypeLabels: Record<string, string> = {
    call: "Anruf",
    email: "E-Mail",
    meeting: "Meeting",
    visit: "Besuch",
    note: "Notiz",
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-20" />
                  <div className="h-6 bg-muted rounded animate-pulse w-16" />
                  <div className="h-3 bg-muted rounded animate-pulse w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Active Offers */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Offene Angebote</p>
              <p className="text-2xl font-bold">{activeOffers.length} aktive</p>
              <p className="text-muted-foreground text-xs">
                {formatCurrency(offerTotalValue)} gesamt
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Projekte</p>
              <p className="text-2xl font-bold">
                {activeProjects.length} laufend
              </p>
              <p className="text-muted-foreground text-xs">
                {formatCurrency(projectsTotalBudget)} Budget
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
              <Euro className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Umsatz</p>
              <p className="text-2xl font-bold">
                {formatCurrency(revenueThisYear)}
              </p>
              <p className="text-muted-foreground text-xs">Dieses Jahr</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Activity */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-950/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Letzte Aktivität</p>
              <p className="text-2xl font-bold">
                {lastActivity ? formatDaysAgo(lastActivity.date) : "-"}
              </p>
              <p className="text-muted-foreground text-xs">
                {lastActivity
                  ? activityTypeLabels[lastActivity.activityType] ||
                    lastActivity.activityType
                  : "Keine Aktivitäten"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
