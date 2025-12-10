import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Project } from "@kompass/shared";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AtRiskProjectsWidgetProps {
  projects: Project[];
}

export function AtRiskProjectsWidget({ projects }: AtRiskProjectsWidgetProps) {
  const navigate = useNavigate();
  // Filter for Warning or Exceeded
  const atRisk = projects.filter(
    (p) =>
      (p.budgetStatus === "Warning" || p.budgetStatus === "Exceeded") &&
      p.status === "active",
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
          Kritische Projekte
        </CardTitle>
        <CardDescription>
          {atRisk.length === 0
            ? "Keine Projekte mit Budget-Warnung"
            : `${atRisk.length} Projekt${atRisk.length !== 1 ? "e" : ""} über oder nahe Budget-Limit`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {atRisk.length === 0 ? (
            <div className="text-sm text-center text-muted-foreground py-4">
              Alles im grünen Bereich.
            </div>
          ) : (
            atRisk.map((project) => (
              <div
                key={project._id}
                className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {project.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.projectNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      project.budgetStatus === "Exceeded"
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {project.budgetStatus === "Exceeded"
                      ? "ÜBERZOGEN"
                      : "> 80%"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => navigate(`/projects/${project._id}`)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
