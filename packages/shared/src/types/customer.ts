import { BaseEntity } from './base';

export interface Address {
    street: string;
    streetNumber?: string;
    addressLine2?: string;
    zipCode: string;
    city: string;
    state?: string;
    country: string;
    latitude?: number;
    longitude?: number;
}

export interface Customer extends BaseEntity {
    type: 'customer';

    // Basic company information
    companyName: string;
    vatNumber?: string;
    email?: string;
    phone?: string;
    website?: string;

    // Financial information
    creditLimit?: number;
    paymentTerms?: string;

    // Categorization
    industry?: string;
    customerType?:
    | 'direct_marketer'
    | 'retail'
    | 'franchise'
    | 'cooperative'
    | 'other';
    rating?: 'A' | 'B' | 'C';

    // Address Management
    billingAddress: Address;
    locations: string[]; // IDs
    defaultDeliveryLocationId?: string;

    // Relationship management
    owner: string; // User ID
    contactPersons: string[]; // IDs

    // DSGVO
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
