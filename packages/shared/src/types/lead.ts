import { BaseEntity } from "./base";
import { Comment } from "./comment";

export type LeadSource =
    | "TRADESHOW"
    | "COLD_CALL"
    | "REFERRAL"
    | "WEBSITE"
    | "OTHER";

export type LeadStatus = "NEW" | "QUALIFIED" | "CONVERTED" | "REJECTED";

export interface Lead extends BaseEntity {
    type: "lead";

    // Core Info
    companyName: string;
    firstName?: string;
    lastName?: string;
    position?: string;

    // Contact Info
    email?: string;
    phone?: string;
    website?: string;

    // Address (simplified for Lead)
    city?: string;
    country?: string;

    // Qualification
    source: LeadSource;
    status: LeadStatus;

    // Details
    notes?: string;

    // Ownership
    owner: string; // User ID

    // Conversion
    convertedAndCustomerId?: string; // ID of the customer if converted

    comments?: Comment[];
}
