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
