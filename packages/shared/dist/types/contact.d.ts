import { BaseEntity } from "./base";
export declare enum DecisionMakingRole {
    DECISION_MAKER = "decision_maker",
    KEY_INFLUENCER = "key_influencer",
    RECOMMENDER = "recommender",
    GATEKEEPER = "gatekeeper",
    OPERATIONAL_CONTACT = "operational_contact",
    INFORMATIONAL = "informational"
}
export declare enum FunctionalRole {
    OWNER_CEO = "owner_ceo",
    PURCHASING_MANAGER = "purchasing_manager",
    FACILITY_MANAGER = "facility_manager",
    STORE_MANAGER = "store_manager",
    PROJECT_COORDINATOR = "project_coordinator",
    FINANCIAL_CONTROLLER = "financial_controller",
    OPERATIONS_MANAGER = "operations_manager",
    ADMINISTRATIVE = "administrative"
}
export interface ContactPerson extends BaseEntity {
    type: "contact";
    firstName: string;
    lastName: string;
    title?: string;
    position?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    customerId: string;
    decisionMakingRole: DecisionMakingRole;
    authorityLevel: "low" | "medium" | "high" | "final_authority";
    canApproveOrders: boolean;
    approvalLimitEur?: number;
    functionalRoles: FunctionalRole[];
    departmentInfluence: string[];
    assignedLocationIds: string[];
    isPrimaryContactForLocations: string[];
    preferredContactMethod?: "email" | "phone" | "mobile";
    language?: string;
}
