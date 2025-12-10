import { useNavigate } from "react-router-dom";
import { Project } from "@kompass/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Users,
  CheckSquare,
} from "lucide-react";
import { format } from "date-fns";
import { TaskList } from "./TaskList";
import { TimeTrackingList } from "./TimeTrackingList";
import { ProjectTaskKanban } from "@/components/tasks/ProjectTaskKanban";
import { ProjectCostOverview } from "./ProjectCostOverview";
import { ProjectMaterialList } from "./material/ProjectMaterialList";
import { ProjectSubcontractorList } from "./ProjectSubcontractorList";
import { CommentSection } from "@/components/common/comments/CommentSection";
import { useQueryClient } from "@tanstack/react-query";

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/projects")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {project.name}
            </h1>
            <p className="text-muted-foreground">
              {project.projectNumber} •{" "}
              <span className="capitalize">{project.status}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/projects/${project._id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Project
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Überblick</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="time">Zeiterfassung</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="subcontractors">Subcontractors</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="comments">Kommentare</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Start Date
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {project.startDate
                    ? format(new Date(project.startDate), "dd.MM.yyyy")
                    : "-"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">End Date</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {project.endDate
                    ? format(new Date(project.endDate), "dd.MM.yyyy")
                    : "-"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {project.budget ? `${project.budget} €` : "-"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {project.status}
                </div>
              </CardContent>
            </Card>
          </div>

          <ProjectCostOverview project={project} />
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <ProjectTaskKanban projectId={project._id} />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <TaskList projectId={project._id} />
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <TimeTrackingList projectId={project._id} />
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <ProjectMaterialList projectId={project._id} />
        </TabsContent>

        <TabsContent value="subcontractors" className="space-y-4">
          <ProjectSubcontractorList />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Users className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Project Manager</p>
                  <p className="text-sm text-muted-foreground">
                    ID: {project.projectManagerId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="h-[600px]">
          <CommentSection
            entityType="project"
            entityId={project._id}
            comments={project.comments || []}
            onCommentAdded={() => {
              queryClient.invalidateQueries({
                queryKey: ["project", project._id],
              });
            }}
            onCommentResolved={() => {
              queryClient.invalidateQueries({
                queryKey: ["project", project._id],
              });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
