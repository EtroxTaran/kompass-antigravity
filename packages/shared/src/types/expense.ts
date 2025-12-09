import { BaseEntity } from "./base";

export interface Expense extends BaseEntity {
  type: "expense";

  // Core Info
  description: string;
  amount: number;
  currency: string;
  date: string; // ISO date
  category: "travel" | "meal" | "accommodation" | "material" | "other";

  // Links
  userId: string;
  projectId?: string;
  customerId?: string;

  // Receipt
  receiptUrl?: string; // URL to stored receipt image/pdf

  // Status
  status: "draft" | "submitted" | "approved" | "rejected" | "reimbursed";
  rejectionReason?: string;
}
