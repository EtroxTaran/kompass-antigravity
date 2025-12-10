import { BaseEntity } from "./base";
import { Comment } from "./comment";

export interface InvoicePosition {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatRate: number; // 0.19 for 19%
  totalNet: number;
}

export interface Invoice extends BaseEntity {
  type: "invoice";

  invoiceNumber: string;
  customerId: string;
  projectId?: string;

  date: string; // ISO date string YYYY-MM-DD
  dueDate: string; // ISO date string YYYY-MM-DD

  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";

  positions: InvoicePosition[];

  totalNet: number;
  vatAmount: number;
  totalGross: number;

  notes?: string;

  comments?: Comment[];
}
