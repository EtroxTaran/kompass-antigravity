import { BaseEntity } from "./base";
export interface Opportunity extends BaseEntity {
  type: "opportunity";
  title: string;
  customerId: string;
  contactPersonId?: string;
  stage:
    | "lead"
    | "qualified"
    | "analysis"
    | "proposal"
    | "negotiation"
    | "closed_won"
    | "closed_lost";
  probability: number;
  expectedValue: number;
  currency: string;
  expectedCloseDate?: string;
  description?: string;
  nextStep?: string;
  lostReason?: string;
  lostReasonDetails?: string;
  owner: string;
}
