import { BaseEntity } from "./base";
import { Comment } from "./comment";
export type ProjectTaskStatus = "todo" | "in_progress" | "review" | "done" | "blocked";
export type ProjectTaskPriority = "low" | "medium" | "high" | "critical";
export type ProjectPhase = "planning" | "execution" | "delivery" | "closure";
export interface ProjectTask extends BaseEntity {
    type: "project_task";
    projectId: string;
    parentTaskId?: string;
    title: string;
    description?: string;
    status: ProjectTaskStatus;
    priority: ProjectTaskPriority;
    phase?: ProjectPhase;
    milestone?: string;
    assignedToId?: string;
    dueDate?: string;
    estimatedHours?: number;
    actualHours?: number;
    blockingReason?: string;
    completedAt?: string;
    completedBy?: string;
    comments?: Comment[];
}
