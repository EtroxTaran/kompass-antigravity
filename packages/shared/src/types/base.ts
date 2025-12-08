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
