import { BaseEntity } from "./base";

export enum SubcontractorStatus {
  Planned = "Planned",
  Confirmed = "Confirmed",
  InProgress = "InProgress",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export enum BudgetStatus {
  OnTrack = "OnTrack",
  Warning = "Warning",
  Exceeded = "Exceeded",
}

// Assuming ServiceCategory is already defined in supplier.ts, but re-exporting or using string if strictly needed to avoid circular deps if they exist.
// Ideally we import it. For now, using string literal union matching the spec or importing if I knew where it was exactly.
// Spec says: CARPENTRY, METALWORK, etc.
export enum ServiceCategory {
  CARPENTRY = "carpentry",
  METALWORK = "metalwork",
  ELECTRICAL = "electrical",
  PLUMBING = "plumbing",
  HVAC = "hvac",
  PAINTING = "painting",
  FLOORING = "flooring",
  WOOD_MATERIALS = "wood_materials",
  METAL_MATERIALS = "metal_materials",
  LIGHTING = "lighting",
  FURNITURE = "furniture",
  FIXTURES = "fixtures",
  INSTALLATION = "installation",
  TRANSPORT = "transport",
  DISPOSAL = "disposal",
  CLEANING = "cleaning",
  OTHER = "other",
}

export interface ProjectSubcontractor extends BaseEntity {
  _id: string; // "project-subcontractor-{uuid}"
  _rev?: string;
  type: "project_subcontractor";

  // Assignment
  projectId: string; // Required
  supplierId: string; // Required
  contractId?: string; // Optional, link to contract

  // Work Details
  workPackage: string; // Required, e.g., "Elektrik Installation"
  serviceCategory: ServiceCategory; // Required
  description: string; // Required, scope of work

  // Schedule
  plannedStartDate: string; // Required
  plannedEndDate: string; // Required
  actualStartDate?: string;
  actualEndDate?: string;

  // Financial
  estimatedCost: number; // Required, from KALK
  actualCost?: number; // Updated as invoices arrive
  budgetStatus: BudgetStatus;

  // Status
  status: SubcontractorStatus;
  completionPercentage: number; // 0-100

  // Performance
  qualityRating?: number; // 1-5, after completion
  timelinessRating?: number; // 1-5, on-time delivery
  communicationRating?: number; // 1-5, responsiveness
  notes?: string; // Issues, feedback

  // Audit Trail
  assignedBy: string; // INN or PLAN
  assignedAt: string;
  modifiedBy: string;
  modifiedAt: string;
  version: number;
}

export interface AssignSubcontractorDto {
  supplierId: string;
  projectId: string; // Often path param, but good to have in DTO valid
  contractId?: string;
  workPackage: string;
  serviceCategory: ServiceCategory;
  description: string;
  plannedStartDate: string;
  plannedEndDate: string;
  estimatedCost: number;
}

export interface UpdateAssignmentDto {
  workPackage?: string;
  description?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  estimatedCost?: number;
  status?: SubcontractorStatus;
  completionPercentage?: number;
  notes?: string;
}

export interface RateSubcontractorDto {
  qualityRating: number;
  timelinessRating: number;
  communicationRating: number;
}
