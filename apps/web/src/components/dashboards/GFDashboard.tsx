import { useInvoices } from "@/hooks/useInvoice";
import { useOpportunities } from "@/hooks/useOpportunity";
import { useProjects } from "@/hooks/useProject";
import { useCustomers } from "@/hooks/useCustomer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Euro, TrendingUp, Briefcase, AlertCircle } from "lucide-react";
// import { Invoice, Opportunity, Project, Customer } from '@kompass/shared'; // Types unused as they are inferred

export function GFDashboard() {
  const { invoices, loading: loadingInvoices } = useInvoices();
  const { opportunities, loading: loadingOpportunities } = useOpportunities();
  const { projects, loading: loadingProjects } = useProjects();
  const { customers } = useCustomers();

  // Helper to get customer name
  const getCustomerName = (id: string) =>
    customers.find((c) => c._id === id)?.companyName || "Unbekannt";

  // Calculate Metrics
  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.totalGross, 0);

  const outstandingRevenue = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.totalGross, 0);

  const pipelineValue = opportunities
    .filter((opp) => opp.stage !== "closed_won" && opp.stage !== "closed_lost")
    .reduce((sum, opp) => sum + (opp.expectedValue || 0), 0);

  const weightedPipeline = opportunities
    .filter((opp) => opp.stage !== "closed_won" && opp.stage !== "closed_lost")
    .reduce(
      (sum, opp) =>
        sum + ((opp.expectedValue || 0) * (opp.probability || 0)) / 100,
      0,
    );

  const activeInfos = projects.filter(
    (p) => p.status === "active" || p.status === "planning",
  ).length;

  // Recent Invoices
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (loadingInvoices || loadingOpportunities || loadingProjects) {
    return <div className="p-8 text-center">Lade Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Geschäftsführer Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Umsatz (Bezahlt)
            </CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €
              {totalRevenue.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              in diesem Jahr (mock)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Offene Forderungen
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €
              {outstandingRevenue.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              aus{" "}
              {
                invoices.filter(
                  (i) => i.status === "sent" || i.status === "overdue",
                ).length
              }{" "}
              Rechnungen
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pipeline (Gewichtet)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €
              {weightedPipeline.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Volumen: €{pipelineValue.toLocaleString("de-DE")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktive Projekte
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInfos}</div>
            <p className="text-xs text-muted-foreground">
              Laufend oder in Planung
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Neueste Rechnungen</CardTitle>
            <CardDescription>
              Die letzten 5 erstellten Rechnungen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Keine Rechnungen gefunden.
                </p>
              ) : (
                recentInvoices.map((inv) => (
                  <div
                    key={inv._id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{inv.invoiceNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(inv.date).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        €{inv.totalGross.toLocaleString("de-DE")}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          inv.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : inv.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Opportunities */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Chancen</CardTitle>
            <CardDescription>
              Die wertvollsten offenen Opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {opportunities
                .filter(
                  (o) => o.stage !== "closed_won" && o.stage !== "closed_lost",
                )
                .sort((a, b) => (b.expectedValue || 0) - (a.expectedValue || 0))
                .slice(0, 5)
                .map((opp) => (
                  <div
                    key={opp._id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-sm">{opp.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {getCustomerName(opp.customerId)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        €{(opp.expectedValue || 0).toLocaleString("de-DE")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {opp.probability}% Wahrscheinlichkeit
                      </p>
                    </div>
                  </div>
                ))}
              {opportunities.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Keine offenen Chancen.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
