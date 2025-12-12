import { BaseEntity } from "./base";
export interface ContactPerson extends BaseEntity {
    type: "contact";
    firstName: string;
    lastName: string;
    isPrimary: boolean;
    title?: string;
    position?: string;
    department?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    customerId: string;
    decisionMakingRole: "decision_maker" | "key_influencer" | "recommender" | "gatekeeper" | "operational_contact" | "informational";
    authorityLevel: "low" | "medium" | "high" | "final_authority";
    canApproveOrders: boolean;
    approvalLimitEur?: number;
    assignedLocationIds: string[];
    isPrimaryContactForLocations: string[];
    preferredContactMethod?: "email" | "phone" | "mobile";
    language?: string;
}
