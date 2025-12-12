import { BaseEntity } from "./base";

export interface ContactPerson extends BaseEntity {
  type: "contact";

  // Basic information
  firstName: string;
  lastName: string;

  // Primary status - marks as main point of contact for customer
  isPrimary: boolean;

  title?: string;
  position?: string;
  department?: string;

  // Contact details
  email?: string;
  phone?: string;
  mobile?: string;

  // Relationship
  customerId: string;

  // Decision-Making
  decisionMakingRole:
    | "decision_maker"
    | "key_influencer"
    | "recommender"
    | "gatekeeper"
    | "operational_contact"
    | "informational";
  authorityLevel: "low" | "medium" | "high" | "final_authority";
  canApproveOrders: boolean;
  approvalLimitEur?: number;

  // Location Assignment
  assignedLocationIds: string[];
  isPrimaryContactForLocations: string[];

  // Preferences
  preferredContactMethod?: "email" | "phone" | "mobile";
  language?: string;
}
