import { useProjects } from "@/hooks/useProject";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  CircleDashed,
  Clock,
  AlertTriangle,
} from "lucide-react";
// import { Project } from '@kompass/shared';
import { useNavigate } from "react-router-dom";
import { AtRiskProjectsWidget } from "./AtRiskProjectsWidget";

export function PLANDashboard() {
  const { projects, loading } = useProjects();
  const navigate = useNavigate();

  const activeProjects = projects.filter((p) => p.status === "active");
  const planningProjects = projects.filter((p) => p.status === "planning");

  // Sort projects by end date for urgency? Or start date? Let's use start date for timeline view.
  const timelineProjects = [...activeProjects, ...planningProjects].sort(
    (a, b) =>
      new Date(a.startDate || "").getTime() -
      new Date(b.startDate || "").getTime(),
  );

  if (loading) {
    return <div className="p-8 text-center">Lade Projekte...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Projektmanagement (PLAN)</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aktive Projekte
              </CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects.length}</div>
              <p className="text-xs text-muted-foreground">In Ausführung</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Planung</CardTitle>
              <CircleDashed className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {planningProjects.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Vorbereitungsphase
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Abgeschlossen
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter((p) => p.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">Gesamt</p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <AtRiskProjectsWidget projects={activeProjects} />
        </div>
      </div>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Projektübersicht & Zeitachse</CardTitle>
          <CardDescription>Laufende und geplante Projekte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {timelineProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Keine aktiven Projekte.
              </p>
            ) : (
              timelineProjects.map((proj) => {
                // Simple visual progress bar or active indicator
                const isLate =
                  proj.endDate &&
                  new Date(proj.endDate) < new Date() &&
                  proj.status === "active";

                return (
                  <div
                    key={proj._id}
                    className="border rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/projects/${proj._id}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm">{proj.name}</h3>
                        <span className="text-xs text-muted-foreground">
                          ({proj.projectNumber})
                        </span>
                        {isLate && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          proj.status === "active"
                            ? "bg-green-100 text-green-800"
                            : proj.status === "planning"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100"
                        }`}
                      >
                        {proj.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <AlertTriangle
                          className={`h-3 w-3 mr-1 ${
                            proj.budgetStatus === "Exceeded"
                              ? "text-red-500"
                              : proj.budgetStatus === "Warning"
                                ? "text-amber-500"
                                : "text-green-500"
                          }`}
                        />
                        Budget:{" "}
                        {proj.budgetStatus === "Exceeded"
                          ? "Überzogen"
                          : proj.budgetStatus === "Warning"
                            ? "Warnung"
                            : "OK"}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Start:{" "}
                        {proj.startDate
                          ? new Date(proj.startDate).toLocaleDateString("de-DE")
                          : "TBD"}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Ende:{" "}
                        {proj.endDate
                          ? new Date(proj.endDate).toLocaleDateString("de-DE")
                          : "TBD"}
                      </div>
                    </div>

                    {/* Simplified Mock Gantt Bar */}
                    <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${proj.status === "active" ? (!isLate ? "bg-green-500" : "bg-red-500") : "bg-blue-400"}`}
                        style={{ width: "45%" }} // Mock progress for now
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
