import { BaseEntity } from "./base";

export type SupplierContractStatus =
  | "draft"
  | "pending_approval"
  | "sent_to_supplier"
  | "signed"
  | "active"
  | "completed"
  | "terminated"
  | "cancelled";

export type SupplierContractType =
  | "framework" // Rahmenvertrag
  | "project" // Project-specific
  | "service_agreement" // Wartungsvertrag
  | "purchase_order"; // Simple PO

export type ValueType = "Fixed" | "TimeAndMaterial" | "UnitPrice" | "CostPlus";

export interface PaymentMilestone {
  description: string; // e.g., "50% Anzahlung"
  percentage: number; // % of contract value
  amount: number; // Calculated: contractValue * percentage
  dueCondition: string; // "Bei Auftragserteilung", "Nach Lieferung"
  dueDate?: string; // ISO date
  invoiceId?: string; // Link to invoice
  paidDate?: string; // ISO date
  status: "Pending" | "Invoiced" | "Paid";
}

export interface SupplierContract extends BaseEntity {
  type: "supplier_contract";

  // Contract Basics
  contractNumber: string; // "SC-2025-00123"
  supplierId: string;
  projectId?: string; // null = framework contract

  // Contract Details
  contractType: SupplierContractType;
  title: string;
  description: string;
  scope: string[]; // Work packages

  // Financial
  contractValue: number;
  currency: string; // Added currency for completeness
  valueType: ValueType;
  paymentSchedule: PaymentMilestone[];
  retentionPercentage?: number; // 5-10%

  // Timeline
  startDate: string; // ISO date
  endDate: string; // ISO date
  noticePeriod?: number; // Days

  // Legal
  termsAccepted: boolean;
  insuranceRequired: boolean;
  minimumInsuranceAmount?: number;

  // Status
  status: SupplierContractStatus;
  signedBySupplier: boolean;
  signedByUs: boolean;
  signedDate?: string; // ISO date
  approvedBy?: string;
  approvedAt?: string; // ISO date

  // Performance
  actualValue?: number;
  actualEndDate?: string;
}
