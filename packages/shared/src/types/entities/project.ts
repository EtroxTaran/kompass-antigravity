import { BaseEntity } from './base-entity';

/**
 * Project Entity
 * 
 * Represents a customer project from contract through execution and completion.
 * Includes comprehensive cost tracking and profitability analysis.
 * 
 * @see Phase 1.1 of Time Tracking Implementation Plan
 * @see DATA_MODEL_SPECIFICATION.md - Future Entities (Placeholder)
 */
export interface Project extends BaseEntity {
  _id: string;                    // Format: "project-{uuid}" or "P-YYYY-X###" (GoBD)
  type: 'project';                // Fixed discriminator
  
  // Basic Information
  projectNumber: string;          // Unique project number (e.g., "P-2024-B023")
  projectName: string;            // Project title
  description?: string;           // Project description
  
  // Relationships
  customerId: string;             // Parent customer (REQUIRED)
  opportunityId?: string;         // Source opportunity if converted
  contractId?: string;            // Contract document reference
  locationId?: string;            // Delivery location
  
  // Project Management
  projectManager: string;         // User ID with role PLAN (REQUIRED)
  teamMembers: string[];          // Array of User IDs on project team
  
  // Timeline
  plannedStartDate: Date;         // Planned start (-30 to +365 days from today)
  plannedEndDate: Date;           // Planned end (must be > start date)
  actualStartDate?: Date;         // Actual start date
  actualEndDate?: Date;           // Actual completion date
  
  // Status
  status: ProjectStatus;          // Current project status
  progress: number;               // Completion percentage (0-100)
  
  // Financial - Contract
  contractValueEur: number;       // Contract value (from Offer/Contract)
  
  // Budget & Cost Tracking (NEW - Time Tracking Feature)
  budgetedLaborHours: number;     // Planned labor hours
  budgetedLaborCostEur: number;   // Planned labor cost
  budgetedMaterialCostEur: number; // Planned material cost
  budgetedTotalCostEur: number;   // Total planned cost
  
  // Actual Costs (calculated from TimeEntry and ProjectCost)
  actualLaborHours: number;       // Sum of approved time entries
  actualLaborCostEur: number;     // Sum of time entry costs
  actualMaterialCostEur: number;  // Sum of material/contractor costs
  actualTotalCostEur: number;     // Total actual cost
  
  // Profitability
  estimatedProfitEur: number;     // Calculated: contractValue - actualTotalCost
  profitMarginPercent: number;    // Calculated: (profit / contractValue) × 100
  
  // Cost tracking status
  costTrackingStatus: CostTrackingStatus;  // Budget status indicator
  costVarianceEur: number;        // budgeted - actual
  costVariancePercent: number;    // (variance / budgeted) × 100
  
  // Last cost update
  lastCostUpdateAt: Date;         // When costs were last recalculated
  
  // Project phases/milestones (optional)
  phases?: ProjectPhase[];        // Project phases or milestones
}

/**
 * Project Status
 * 
 * Tracks the lifecycle of a project from planning through completion.
 */
export enum ProjectStatus {
  PLANNING = 'planning',          // Initial planning phase
  ACTIVE = 'active',              // Active execution
  ON_HOLD = 'on_hold',            // Temporarily paused
  COMPLETED = 'completed',        // Successfully completed
  CANCELLED = 'cancelled',        // Project cancelled
}

/**
 * Cost Tracking Status
 * 
 * Indicates whether project costs are within budget thresholds.
 */
export enum CostTrackingStatus {
  ON_BUDGET = 'on_budget',        // < 80% of budget spent
  AT_RISK = 'at_risk',            // 80-110% of budget spent
  OVER_BUDGET = 'over_budget',    // > 110% of budget spent
}

/**
 * Project Phase
 * 
 * Represents a phase or milestone within a project.
 */
export interface ProjectPhase {
  id: string;                     // Unique phase identifier
  name: string;                   // Phase name (e.g., "Design", "Construction")
  description?: string;           // Phase description
  plannedStartDate: Date;         // Planned phase start
  plannedEndDate: Date;           // Planned phase end
  actualStartDate?: Date;         // Actual phase start
  actualEndDate?: Date;           // Actual phase end
  status: 'not_started' | 'in_progress' | 'completed';
  budgetedHours?: number;         // Budgeted hours for this phase
  actualHours?: number;           // Actual hours logged to this phase
}

/**
 * Profitability Report
 * 
 * Comprehensive profitability analysis for a project.
 */
export interface ProfitabilityReport {
  projectId: string;
  projectName: string;
  
  // Contract
  contractValueEur: number;
  
  // Costs
  budgetedTotalCostEur: number;
  actualTotalCostEur: number;
  costVarianceEur: number;
  costVariancePercent: number;
  
  // Labor breakdown
  budgetedLaborCostEur: number;
  actualLaborCostEur: number;
  laborVarianceEur: number;
  
  // Material breakdown
  budgetedMaterialCostEur: number;
  actualMaterialCostEur: number;
  materialVarianceEur: number;
  
  // Profitability
  estimatedProfitEur: number;
  profitMarginPercent: number;
  costTrackingStatus: CostTrackingStatus;
  
  // Alerts
  isOverBudget: boolean;
  isAtRisk: boolean;
  warningMessage?: string;
}

/**
 * Create Project DTO
 * 
 * Data transfer object for creating a new project.
 */
export interface CreateProjectDto {
  projectName: string;
  description?: string;
  customerId: string;
  opportunityId?: string;
  locationId?: string;
  projectManager: string;
  teamMembers?: string[];
  plannedStartDate: Date;
  plannedEndDate: Date;
  contractValueEur: number;
  budgetedLaborHours: number;
  budgetedLaborCostEur: number;
  budgetedMaterialCostEur: number;
  phases?: Omit<ProjectPhase, 'id'>[];
}

/**
 * Update Project DTO
 * 
 * Data transfer object for updating an existing project.
 */
export interface UpdateProjectDto {
  projectName?: string;
  description?: string;
  locationId?: string;
  projectManager?: string;
  teamMembers?: string[];
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  status?: ProjectStatus;
  progress?: number;
  contractValueEur?: number;
  budgetedLaborHours?: number;
  budgetedLaborCostEur?: number;
  budgetedMaterialCostEur?: number;
  phases?: ProjectPhase[];
}

/**
 * Project Response DTO
 * 
 * Data transfer object for project API responses.
 */
export interface ProjectResponseDto extends Project {
  customerName: string;           // Populated from customer
  projectManagerName: string;     // Populated from user
  locationName?: string;          // Populated from location
  opportunityName?: string;       // Populated from opportunity
}

/**
 * Calculate cost tracking status based on budget variance
 */
export function calculateCostTrackingStatus(
  actualCostEur: number,
  budgetedCostEur: number
): CostTrackingStatus {
  if (budgetedCostEur === 0) {
    return CostTrackingStatus.ON_BUDGET;
  }
  
  const percentUsed = (actualCostEur / budgetedCostEur) * 100;
  
  if (percentUsed < 80) {
    return CostTrackingStatus.ON_BUDGET;
  } else if (percentUsed <= 110) {
    return CostTrackingStatus.AT_RISK;
  } else {
    return CostTrackingStatus.OVER_BUDGET;
  }
}

/**
 * Calculate profit margin percentage
 */
export function calculateProfitMargin(
  contractValueEur: number,
  actualCostEur: number
): { profitEur: number; marginPercent: number } {
  const profitEur = contractValueEur - actualCostEur;
  const marginPercent = contractValueEur > 0 
    ? (profitEur / contractValueEur) * 100 
    : 0;
  
  return {
    profitEur: Math.round(profitEur * 100) / 100,
    marginPercent: Math.round(marginPercent * 100) / 100,
  };
}

