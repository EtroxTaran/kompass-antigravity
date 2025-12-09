import { BaseEntity } from "./base";

export interface Project extends BaseEntity {
  type: "project";

  projectNumber: string;
  name: string;

  // References
  customerId: string;
  opportunityId?: string;

  // Status
  status: "planning" | "active" | "on_hold" | "completed" | "cancelled";

  // Timeline
  startDate?: string;
  endDate?: string;
  actualEndDate?: string;

  // Personnel
  projectManagerId: string;
  teamMemberIds: string[];

  // Financial info could be sensitive, might be in a separate Cost entity or protected fields
  budget?: number;
}
