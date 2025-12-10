import { BaseEntity } from "./base";

export interface PurchaseOrderItem {
  materialId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder extends BaseEntity {
  type: "purchase-order";
  orderNumber: string;
  supplierId: string;
  date: string; // ISO Date
  expectedDeliveryDate?: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  currency: string;
  status: "draft" | "ordered" | "received" | "cancelled";
  projectId?: string; // Optional link to a project

  // Approval Workflow
  approvalStatus?: "pending" | "approved" | "rejected";
  approvalRequestedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export type PurchaseOrderApprovalStatus = "pending" | "approved" | "rejected";
