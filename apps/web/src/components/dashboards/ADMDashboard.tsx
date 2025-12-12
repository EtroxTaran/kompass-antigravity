import { useOpportunities } from "@/hooks/useOpportunity";
import { useCustomers } from "@/hooks/useCustomer";
import { useUserTasks } from "@/hooks/useUserTasks";
import { useTodayTour } from "@/hooks/useTodayTour";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, Target, CheckSquare, Clock, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


export function ADMDashboard() {
  const { opportunities, loading: loadingOpportunities } = useOpportunities();
  const { customers, loading: loadingCustomers } = useCustomers();
  const { tasks, loading: loadingTasks, overdueTasks } = useUserTasks(); // Assuming useUserTasks filters for current user by default or we need to pass ID
  const { tour, loading: loadingTour } = useTodayTour();
  const navigate = useNavigate();

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

  const openTasks = tasks.filter((t) => ["open", "in_progress"].includes(t.status));

  // Sort tasks: Urgent first, then by due date
  const sortedTasks = [...openTasks].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const pDiff = (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
    if (pDiff !== 0) return pDiff;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  if (loadingOpportunities || loadingCustomers || loadingTasks || loadingTour) {
    return <div className="p-8 text-center">Lade Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sales Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("de-DE", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

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
            <div className="text-2xl font-bold">{openTasks.length}</div>
            <p className={`text-xs ${overdueTasks.length > 0 ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
              {overdueTasks.length} überfällig
            </p>
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
            <Button size="sm" onClick={() => navigate("/opportunities/new")}>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pipeline Widget */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Meine Pipeline</CardTitle>
            <CardDescription>Top aktive Verkaufschancen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeOpportunities
                .sort((a, b) => (b.expectedValue || 0) - (a.expectedValue || 0))
                .slice(0, 5)
                .map((opp) => (
                  <div
                    key={opp._id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div
                      className="cursor-pointer hover:underline overflow-hidden"
                      onClick={() => navigate(`/sales/${opp._id}`)}
                    >
                      <p className="font-medium text-sm truncate">{opp.title}</p>
                      <p className="text-xs text-muted-foreground">{opp.stage}</p>
                    </div>
                    <div className="text-right whitespace-nowrap pl-2">
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
                <p className="text-sm text-muted-foreground text-center py-4">
                  Keine aktiven Chancen.
                </p>
              )}
              <Button
                variant="link"
                size="sm"
                className="w-full mt-2"
                onClick={() => navigate("/sales")}
              >
                Zur Pipeline <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Widget */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Aufgaben</CardTitle>
            <CardDescription>Nächste To-Dos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedTasks.slice(0, 5).map(task => (
                <div key={task._id} className="flex items-start gap-2 border-b pb-2 last:border-0 last:pb-0">
                  <CheckSquare className={`h-4 w-4 mt-1 ${task.priority === 'urgent' ? 'text-red-500' : 'text-muted-foreground'}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${task.priority === 'urgent' ? 'text-red-600' : ''}`}>
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <p className={`text-xs ${new Date(task.dueDate) < new Date() ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                        Fällig: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {sortedTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Alles erledigt! Keine offenen Aufgaben.
                </p>
              )}

              <Button
                variant="link"
                size="sm"
                className="w-full mt-2"
                onClick={() => navigate("/tasks")}
              >
                Alle Aufgaben ansehen <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Route Widget */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Heutige Route</CardTitle>
            <CardDescription>
              {tour ? `${tour.stops?.length || 0} Stopps geplant` : "Keine Tour geplant"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tour ? (
              <div className="space-y-4">
                <div className="relative border-l-2 border-primary/20 ml-2 space-y-6 pl-4 py-2">
                  {(tour.stops || []).slice(0, 3).map((stop: any, index: number) => (
                    <div key={stop.id || index} className="relative">
                      <span className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-background ${stop.status === 'visited' ? 'bg-green-500' : 'bg-primary'}`} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{stop.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{stop.address}</span>
                      </div>
                    </div>
                  ))}
                  {(tour.stops?.length || 0) > 3 && (
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-muted" />
                      <span className="text-sm text-muted-foreground">... {tour.stops.length - 3} weitere</span>
                    </div>
                  )}
                </div>
                <Button className="w-full" size="sm" onClick={() => navigate(`/tours/${tour._id}`)}>
                  Tour starten
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <MapPin className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  Für heute ist keine Tour geplant.
                </p>
                <Button variant="outline" size="sm" onClick={() => navigate("/tours/new")}>
                  Route planen
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

