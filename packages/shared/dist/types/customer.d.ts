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
    companyName: string;
    vatNumber?: string;
    email?: string;
    phone?: string;
    website?: string;
    creditLimit?: number;
    paymentTerms?: string;
    industry?: string;
    customerType?: 'direct_marketer' | 'retail' | 'franchise' | 'cooperative' | 'other';
    rating?: 'A' | 'B' | 'C';
    billingAddress: Address;
    locations: string[];
    defaultDeliveryLocationId?: string;
    owner: string;
    contactPersons: string[];
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
