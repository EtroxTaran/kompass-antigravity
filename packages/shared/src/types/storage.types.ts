export interface QuotaStatus {
    total: number; // Total available storage (e.g., 50MB for iOS)
    used: number; // Currently used bytes
    available: number; // Remaining bytes
    percentage: number; // Used percentage (0-100)

    breakdown: {
        tier1Essential: number;
        tier2Recent: number;
        tier3Pinned: number;
    };

    status: 'OK' | 'Warning' | 'Critical'; // OK < 80%, Warning 80-95%, Critical > 95%
    message: string | null;
}

export type StorageTier = 'tier1_essential' | 'tier2_recent' | 'tier3_pinned';

export interface TierConfig {
    name: StorageTier;
    maxSize: number; // Max size in bytes
    priority: number; // 1 (Highest) to 3 (Lowest)
    evictionPolicy: 'none' | 'lru' | 'manual';
}

export interface QueuedChange {
    id: string; // UUID
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    entityType: string;
    entityId: string;
    entityData: unknown;

    timestamp: Date;
    userId: string;
    deviceId: string;

    syncStatus: 'Pending' | 'InProgress' | 'Synced' | 'Failed';
    syncAttempts: number;
    lastSyncAttempt?: Date;
    lastSyncError?: string;

    dependencies?: string[];
    conflictDetected?: boolean;
}

export interface DocumentMeta {
    id: string;
    size: number;
    lastAccessed: Date;
    tier: StorageTier;
    pinned: boolean;
}
