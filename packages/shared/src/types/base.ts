export interface BaseEntity {
    // CouchDB metadata
    _id: string;
    _rev?: string;
    type: string;

    // Audit trail
    createdBy: string;
    createdAt: string; // ISO Date string
    modifiedBy: string;
    modifiedAt: string; // ISO Date string
    version: number;

    // Offline sync support
    _conflicts?: string[];
    lastSyncedAt?: string; // ISO Date string
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
