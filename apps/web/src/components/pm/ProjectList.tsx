import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface ProjectListProps {
  customerId?: string;
}

export function ProjectList({ customerId }: ProjectListProps) {
  const { projects, loading } = useProjects({ customerId });
  const navigate = useNavigate();

  if (loading) return <div>Loading Projects...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Active Projects</h2>
        <Button onClick={() => navigate("/projects/new")}>New Project</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card
            key={project._id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/projects/${project._id}`)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {project.projectNumber}
              </CardTitle>
              <Badge
                variant={project.status === "active" ? "default" : "secondary"}
                className="uppercase"
              >
                {project.status.replace("_", " ")}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">{project.name}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {(project.budget || 0) > 0
                  ? `Budget: ${project.budget?.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}`
                  : "No Budget set"}
              </p>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No active projects. Start by creating one.
          </div>
        )}
      </div>
    </div>
  );
}
