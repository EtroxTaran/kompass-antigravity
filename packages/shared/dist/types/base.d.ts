export interface BaseEntity {
    _id: string;
    _rev?: string;
    type: string;
    createdBy: string;
    createdAt: string;
    modifiedBy: string;
    modifiedAt: string;
    version: number;
    _conflicts?: string[];
    lastSyncedAt?: string;
}
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
