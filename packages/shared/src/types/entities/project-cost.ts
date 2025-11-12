import { BaseEntity } from './base-entity';

/**
 * ProjectCost Entity
 * 
 * Represents non-labor costs for projects including materials, contractors,
 * external services, and equipment rental.
 * 
 * @see Phase 1.1 of Time Tracking Implementation Plan
 */
export interface ProjectCost extends BaseEntity {
  _id: string;                    // Format: "project-cost-{uuid}"
  type: 'project_cost';           // Fixed discriminator
  
  // Project reference
  projectId: string;              // Parent project (REQUIRED)
  
  // Cost details
  costType: ProjectCostType;      // Type of cost
  description: string;            // What was purchased/hired (REQUIRED, 10-500 chars)
  supplierName?: string;          // Supplier/contractor name
  
  // Financial
  quantity: number;               // Amount/hours (default: 1)
  unitPriceEur: number;           // Price per unit
  totalCostEur: number;           // Calculated: quantity × unitPriceEur
  taxRate: number;                // VAT rate (default: 19%)
  taxAmountEur: number;           // Calculated tax
  totalWithTaxEur: number;        // Total including tax
  
  // Documentation
  invoiceNumber?: string;         // Supplier invoice reference
  invoiceDate?: Date;             // Date of invoice
  invoicePdfUrl?: string;         // Uploaded invoice PDF
  orderNumber?: string;           // Purchase order reference
  
  // Status
  status: ProjectCostStatus;      // Current status
  paidAt?: Date;                  // When payment was made
  
  // Approval
  approvedBy?: string;            // User ID who approved expense
  approvedAt?: Date;              // When approved
}

/**
 * Project Cost Type
 * 
 * Categories of non-labor costs that can be tracked.
 */
export enum ProjectCostType {
  MATERIAL = 'material',                  // Construction materials, supplies
  CONTRACTOR = 'contractor',              // External contractor labor
  EXTERNAL_SERVICE = 'external_service',  // Consulting, specialized services
  EQUIPMENT = 'equipment',                // Equipment rental or purchase
  OTHER = 'other',                        // Miscellaneous costs
}

/**
 * Project Cost Status
 * 
 * Tracks the lifecycle of a project cost through procurement and payment.
 */
export enum ProjectCostStatus {
  PLANNED = 'planned',     // Planned but not yet ordered
  ORDERED = 'ordered',     // Purchase order issued
  RECEIVED = 'received',   // Goods/services received
  INVOICED = 'invoiced',   // Invoice received
  PAID = 'paid',           // Payment completed
}

/**
 * Material Cost Summary
 * 
 * Aggregated material and non-labor costs for a project.
 */
export interface MaterialCostSummary {
  projectId: string;
  totalCostEur: number;                    // Sum of all project costs (excluding tax)
  totalWithTaxEur: number;                 // Sum including tax
  byCostType: CostTypeSummary[];           // Breakdown by cost type
  byStatus: CostStatusSummary[];           // Breakdown by payment status
  pendingPaymentEur: number;               // Costs not yet paid
}

/**
 * Cost Type Summary
 * 
 * Cost breakdown by type (materials, contractors, etc.)
 */
export interface CostTypeSummary {
  costType: ProjectCostType;
  totalCostEur: number;
  totalWithTaxEur: number;
  itemCount: number;
}

/**
 * Cost Status Summary
 * 
 * Cost breakdown by payment status for cash flow tracking.
 */
export interface CostStatusSummary {
  status: ProjectCostStatus;
  totalCostEur: number;
  totalWithTaxEur: number;
  itemCount: number;
}

/**
 * Create Project Cost DTO
 * 
 * Data transfer object for creating a new project cost.
 */
export interface CreateProjectCostDto {
  projectId: string;
  costType: ProjectCostType;
  description: string;
  supplierName?: string;
  quantity: number;
  unitPriceEur: number;
  taxRate?: number;               // Optional, defaults to 19%
  invoiceNumber?: string;
  invoiceDate?: Date;
  orderNumber?: string;
  status: ProjectCostStatus;
}

/**
 * Update Project Cost DTO
 * 
 * Data transfer object for updating an existing project cost.
 */
export interface UpdateProjectCostDto {
  costType?: ProjectCostType;
  description?: string;
  supplierName?: string;
  quantity?: number;
  unitPriceEur?: number;
  taxRate?: number;
  invoiceNumber?: string;
  invoiceDate?: Date;
  invoicePdfUrl?: string;
  orderNumber?: string;
  status?: ProjectCostStatus;
}

/**
 * Project Cost Response DTO
 * 
 * Data transfer object for project cost API responses.
 */
export interface ProjectCostResponseDto extends ProjectCost {
  projectName: string;            // Populated from project
  approvedByName?: string;        // Populated from approver user
}

/**
 * Calculate total cost with tax
 */
export function calculateProjectCostTotals(
  quantity: number,
  unitPriceEur: number,
  taxRate: number = 0.19
): { totalCostEur: number; taxAmountEur: number; totalWithTaxEur: number } {
  const totalCostEur = quantity * unitPriceEur;
  const taxAmountEur = totalCostEur * taxRate;
  const totalWithTaxEur = totalCostEur + taxAmountEur;
  
  return {
    totalCostEur: Math.round(totalCostEur * 100) / 100,
    taxAmountEur: Math.round(taxAmountEur * 100) / 100,
    totalWithTaxEur: Math.round(totalWithTaxEur * 100) / 100,
  };
}

