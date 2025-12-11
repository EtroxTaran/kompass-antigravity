import { BaseEntity } from "./base";

export enum DecisionMakingRole {
  DECISION_MAKER = "decision_maker",
  KEY_INFLUENCER = "key_influencer",
  RECOMMENDER = "recommender",
  GATEKEEPER = "gatekeeper",
  OPERATIONAL_CONTACT = "operational_contact",
  INFORMATIONAL = "informational",
}

export enum FunctionalRole {
  OWNER_CEO = "owner_ceo",
  PURCHASING_MANAGER = "purchasing_manager",
  FACILITY_MANAGER = "facility_manager",
  STORE_MANAGER = "store_manager",
  PROJECT_COORDINATOR = "project_coordinator",
  FINANCIAL_CONTROLLER = "financial_controller",
  OPERATIONS_MANAGER = "operations_manager",
  ADMINISTRATIVE = "administrative",
}

export interface ContactPerson extends BaseEntity {
  type: "contact";

  // Basic information
  firstName: string;
  lastName: string;
  title?: string;
  position?: string;

  // Contact details
  email?: string;
  phone?: string;
  mobile?: string;

  // Relationship
  customerId: string;

  // Decision-Making & Authority
  decisionMakingRole: DecisionMakingRole;
  authorityLevel: "low" | "medium" | "high" | "final_authority";
  canApproveOrders: boolean;
  approvalLimitEur?: number;

  // Role & Responsibilities
  functionalRoles: FunctionalRole[];
  departmentInfluence: string[];

  // Location Assignment
  assignedLocationIds: string[];
  isPrimaryContactForLocations: string[];

  // Communication preferences
  preferredContactMethod?: "email" | "phone" | "mobile";
  language?: string;
}
