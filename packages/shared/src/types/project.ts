import { BaseEntity } from "./base";
import { Comment } from "./comment";

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

  // Financial
  budget?: number;

  // Estimated costs (from offer/BOM)
  estimatedMaterialCost?: number;
  estimatedLaborCost?: number;
  estimatedSubcontractorCost?: number;
  estimatedTotalCost?: number;

  // Actual costs (real-time)
  actualMaterialCost?: number;
  actualLaborCost?: number;
  actualSubcontractorCost?: number;
  actualExpenses?: number;
  actualTotalCost?: number;

  // Analysis
  budgetStatus?: "OnTrack" | "Warning" | "Exceeded";

  comments?: Comment[];
}
