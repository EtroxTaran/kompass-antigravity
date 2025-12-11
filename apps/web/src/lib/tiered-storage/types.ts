export type StorageTier = "essential" | "recent" | "onDemand";

export interface TierConfig {
  tier: StorageTier;
  maxSizeBytes: number;
  syncIntervalMs: number;
  priority: number; // 1 = highest
}

export interface TierQuota {
  tier: StorageTier;
  used: number;
  limit: number;
  usagePercent: number;
}

export interface TieredStorageState {
  tiers: TierQuota[];
  totalUsed: number;
  totalLimit: number;
  totalUsagePercent: number;
  status: "ok" | "warning" | "critical" | "full";
}

export interface PinnedDocument {
  docId: string;
  entityType: string;
  entityName: string;
  sizeBytes: number;
  pinnedAt: string;
}
