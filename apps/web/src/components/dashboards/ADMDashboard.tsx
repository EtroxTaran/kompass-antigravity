import { useOpportunities } from "@/hooks/useOpportunity";
import { useCustomers } from "@/hooks/useCustomer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, Target, CheckSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ADMDashboard() {
  const { opportunities, loading: loadingOpportunities } = useOpportunities();
  const { customers, loading: loadingCustomers } = useCustomers();
  const navigate = useNavigate();

  // Mock authorized user ID for "My Data" filtering (replace with real auth context later)
  // const { user } = useAuth();
  // const myUserId = user?.id;
  // For now, we show all data or filter by a mock ID if needed. Let's show all for MVP visibility.

  // Metrics
  const activeOpportunities = opportunities.filter(
    (o) => o.stage !== "closed_won" && o.stage !== "closed_lost",
  );
  const myPipelineValue = activeOpportunities.reduce(
    (sum, o) => sum + (o.expectedValue || 0),
    0,
  );
  const newCustomersThisMonth = customers.filter((c) => {
    const date = new Date(c.createdAt);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  // TODO: Fetch user tasks when useUserTasks hook lists are ready. For now static or mock.
  const myOpenTasksCount = 5; // Placeholder

  if (loadingOpportunities || loadingCustomers) {
    return <div className="p-8 text-center">Lade Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sales Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meine Chancen</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeOpportunities.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Volumen: €{myPipelineValue.toLocaleString("de-DE")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neue Kunden</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newCustomersThisMonth}</div>
            <p className="text-xs text-muted-foreground">in diesem Monat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Offene Aufgaben
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myOpenTasksCount}</div>
            <p className="text-xs text-muted-foreground">2 überfällig</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Schnellaktionen
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-4">
            <Button size="sm" onClick={() => navigate("/sales/new")}>
              Neue Chance
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/customers/new")}
            >
              Neuer Kunde
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Meine Pipeline</CardTitle>
            <CardDescription>Aktive Verkaufschancen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeOpportunities.slice(0, 5).map((opp) => (
                <div
                  key={opp._id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div
                    className="cursor-pointer hover:underline"
                    onClick={() => navigate(`/sales/${opp._id}`)}
                  >
                    <p className="font-medium text-sm">{opp.title}</p>
                    <p className="text-xs text-muted-foreground">{opp.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      €{(opp.expectedValue || 0).toLocaleString("de-DE")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(opp.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {activeOpportunities.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Keine aktiven Chancen.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Aufgaben (Demo)</CardTitle>
            <CardDescription>Meine to-dos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Angebot für Müller GmbH nachfassen
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Präsentation vorbereiten</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">
                  Kundenrückruf (Überfällig)
                </span>
              </div>
              <Button
                variant="link"
                size="sm"
                className="px-0"
                onClick={() => navigate("/tasks")}
              >
                Alle Aufgaben ansehen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
