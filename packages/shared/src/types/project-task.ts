import { BaseEntity } from "./base";
import { Comment } from "./comment";

export type ProjectTaskStatus =
  | "todo"
  | "in_progress"
  | "review"
  | "done"
  | "blocked";
export type ProjectTaskPriority = "low" | "medium" | "high" | "critical";
export type ProjectPhase = "planning" | "execution" | "delivery" | "closure";

export interface ProjectTask extends BaseEntity {
  type: "project_task";

  // Associations
  projectId: string;
  parentTaskId?: string; // Hierarchical tasks

  // Core Info
  title: string;
  description?: string;

  // Status & Priority
  status: ProjectTaskStatus;
  priority: ProjectTaskPriority;

  // Project phase
  phase?: ProjectPhase;
  milestone?: string;

  // Execution
  assignedToId?: string;
  dueDate?: string;

  estimatedHours?: number;
  actualHours?: number;

  // Blocking (required when status is 'blocked')
  blockingReason?: string;

  // Completion tracking
  completedAt?: string;
  completedBy?: string;

  comments?: Comment[];
}
