import { BaseEntity } from "./base";
export interface Project extends BaseEntity {
    type: "project";
    projectNumber: string;
    name: string;
    customerId: string;
    opportunityId?: string;
    status: "planning" | "active" | "on_hold" | "completed" | "cancelled";
    startDate?: string;
    endDate?: string;
    actualEndDate?: string;
    projectManagerId: string;
    teamMemberIds: string[];
    budget?: number;
    estimatedMaterialCost?: number;
    estimatedLaborCost?: number;
    estimatedSubcontractorCost?: number;
    estimatedTotalCost?: number;
    actualMaterialCost?: number;
    actualLaborCost?: number;
    actualSubcontractorCost?: number;
    actualExpenses?: number;
    actualTotalCost?: number;
    budgetStatus?: "OnTrack" | "Warning" | "Exceeded";
}
