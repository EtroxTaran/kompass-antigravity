import { Project } from "@kompass/shared";
import { ProjectBudgetWidget } from "@/components/accounting/ProjectBudgetWidget";
import { ProjectCostBreakdown } from "@/components/accounting/ProjectCostBreakdown";

interface ProjectCostOverviewProps {
  project: Project;
}

export function ProjectCostOverview({ project }: ProjectCostOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <ProjectBudgetWidget project={project} />
        <ProjectCostBreakdown project={project} />
      </div>
    </div>
  );
}
