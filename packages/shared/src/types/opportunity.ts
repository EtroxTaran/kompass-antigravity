import { BaseEntity } from "./base";
import { Comment } from "./comment";

export interface Opportunity extends BaseEntity {
  type: "opportunity";

  // Core Info
  title: string;
  customerId: string;
  contactPersonId?: string;

  // Pipeline
  stage:
  | "lead"
  | "qualified"
  | "analysis"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

  probability: number; // 0-100
  expectedValue: number;
  currency: string;

  expectedCloseDate?: string;

  // Details
  description?: string;
  nextStep?: string;

  // Lost reason
  lostReason?: string;
  lostReasonDetails?: string;

  // Assignment
  owner: string;

  comments?: Comment[];
}
