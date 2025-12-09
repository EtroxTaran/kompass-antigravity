import { BaseEntity } from "./base";

export interface ProjectCost extends BaseEntity {
  type: "project-cost";
  projectId: string;
  description: string;
  amount: number;
  currency: string; // EUR
  date: string; // ISO Date
  costType: "material" | "labor" | "external" | "misc";
  status: "planned" | "incurred" | "paid";
  invoiceId?: string; // Link to an invoice if applicable
}
