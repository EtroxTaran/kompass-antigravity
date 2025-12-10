import { BaseEntity, Address } from "./base";
export interface Supplier extends BaseEntity {
    type: "supplier";
    companyName: string;
    supplierNumber?: string;
    vatNumber?: string;
    email?: string;
    phone?: string;
    website?: string;
    billingAddress: Address;
    paymentTerms?: string;
    deliveryTerms?: string;
    rating?: "A" | "B" | "C";
    category?: string[];
    status?: 'Active' | 'Inactive' | 'Blacklisted' | 'PendingApproval' | 'Rejected';
    approvedBy?: string;
    approvedAt?: string;
    rejectedBy?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    blacklistReason?: string;
    blacklistedBy?: string;
    blacklistedAt?: string;
    reinstatedBy?: string;
    reinstatedAt?: string;
    activeProjectCount?: number;
}
