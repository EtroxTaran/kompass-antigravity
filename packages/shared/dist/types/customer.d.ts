import { BaseEntity, Address } from "./base";
export interface Customer extends BaseEntity {
    type: "customer";
    companyName: string;
    vatNumber?: string;
    email?: string;
    phone?: string;
    website?: string;
    creditLimit?: number;
    paymentTerms?: string;
    industry?: string;
    customerType?: "direct_marketer" | "retail" | "franchise" | "cooperative" | "other";
    rating?: "A" | "B" | "C";
    billingAddress: Address;
    locations: string[];
    defaultDeliveryLocationId?: string;
    owner: string;
    contactPersons: string[];
    visitFrequencyDays?: number;
    lastVisit?: string;
    dsgvoConsent?: {
        marketing: boolean;
        aiProcessing: boolean;
        dataSharing: boolean;
        grantedAt?: string;
        grantedBy?: string;
        revokedAt?: string;
    };
    dataRetentionUntil?: string;
    anonymized?: boolean;
    anonymizedAt?: string;
}
