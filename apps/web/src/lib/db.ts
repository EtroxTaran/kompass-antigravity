import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import {
  StorageTier,
  TierQuota,
} from "./tiered-storage/types";
import {
  essentialFilter,
  recentFilter,
  onDemandFilter
} from "./tiered-storage/syncFilters";
import { evictLruDocuments } from "./tiered-storage/lruEviction";

PouchDB.plugin(PouchDBFind);

const LOCAL_DB_NAME = "kompass_local";
const REMOTE_DB_URL = "http://localhost:5984/kompass"; // TODO: Make configurable via env

// Tier Limits (in bytes)
const TIER_LIMITS = {
  essential: 5 * 1024 * 1024,      // 5MB
  recent: 10 * 1024 * 1024,        // 10MB
  onDemand: 35 * 1024 * 1024,      // 35MB
};

// Sync Intervals (in ms)
const SYNC_INTERVALS = {
  essential: 15 * 60 * 1000,       // 15 min
  recent: 60 * 60 * 1000,          // 60 min
};

// Storage thresholds
const STORAGE_WARNING_THRESHOLD = 0.8; // 80%
const STORAGE_CRITICAL_THRESHOLD = 0.95; // 95%

export interface StorageInfo {
  usage: number;
  quota: number;
  usagePercent: number;
  isWarning: boolean;
  isCritical: boolean;
  tiers?: TierQuota[];
}

type SyncStatus = "idle" | "active" | "paused" | "error" | "storage_full";

interface StatusUpdate {
  status: SyncStatus;
  storage?: StorageInfo;
  activeTiers?: StorageTier[];
}

class DatabaseService {
  private db: PouchDB.Database;
  private remoteDB: PouchDB.Database;
  private listeners: ((update: StatusUpdate) => void)[] = [];
  private currentStatus: SyncStatus = "idle";

  // Replication handlers
  private pushHandler: PouchDB.Replication.Replication<Record<string, unknown>> | null = null;
  private essentialPullHandler: PouchDB.Replication.Replication<Record<string, unknown>> | null = null;
  private recentPullInterval: number | null = null;

  private storageInfo: StorageInfo | null = null;
  private storageCheckInterval: number | null = null;

  private currentUserId: string | null = null;
  private pinnedDocIds: Set<string> = new Set();

  // Active sync state
  private activeTiers: Set<StorageTier> = new Set();

  constructor() {
    this.db = new PouchDB(LOCAL_DB_NAME);
    this.remoteDB = new PouchDB(REMOTE_DB_URL);
  }

  getDB() {
    return this.db;
  }

  setUserId(userId: string) {
    this.currentUserId = userId;
  }

  async init() {
    // Ensure indexes exist
    try {
      await this.db.createIndex({
        index: { fields: ["type"] },
      });
      await this.db.createIndex({
        index: { fields: ["modifiedAt"] },
      });
      console.log("Indexes created");

      // Attempt to deploy filters to remote if we can (optional, assuming we have rights)
      // In production specific setup scripts would do this.
      await this.deployFiltersToRemote();

    } catch (err) {
      console.error("Error initializing DB", err);
    }

    // Initial storage check
    await this.checkStorage();

    // Start periodic storage monitoring
    this.startStorageMonitoring();

    console.log("DatabaseService initialized with Tiered Storage strategy");
  }

  /**
   * Deploy filter functions to remote DB design document
   */
  private async deployFiltersToRemote() {
    try {
      const ddoc: any = {
        _id: '_design/app_filters',
        filters: {
          essential: essentialFilter.toString(),
          recent: recentFilter.toString(),
          onDemand: onDemandFilter.toString()
        }
      };

      try {
        const existing: any = await this.remoteDB.get('_design/app_filters');
        ddoc._rev = existing._rev;
      } catch {
        // missing, create new
      }

      await this.remoteDB.put(ddoc);
      console.log("Deployed filters to remote DB");
    } catch (err) {
      console.warn("Could not deploy filters to remote DB (might lack permissions, ignore if preset)", err);
    }
  }

  /**
   * Get current storage estimate using navigator.storage API
   */
  async getStorageEstimate(): Promise<StorageInfo> {
    let usage = 0;
    let quota = 0;
    let usagePercent = 0;

    if ("storage" in navigator && "estimate" in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        usage = estimate.usage || 0;
        quota = estimate.quota || 0;
        usagePercent = quota > 0 ? usage / quota : 0;
      } catch (err) {
        console.error("Error getting storage estimate", err);
      }
    }

    return {
      usage,
      quota,
      usagePercent,
      isWarning: usagePercent >= STORAGE_WARNING_THRESHOLD,
      isCritical: usagePercent >= STORAGE_CRITICAL_THRESHOLD,
    };
  }

  /**
   * Calculate detailed tier usage (Expensive, call sparingly)
   */
  async getTierQuotas(): Promise<TierQuota[]> {
    const allDocs = await this.db.allDocs({ include_docs: true });

    let essentialSize = 0;
    let recentSize = 0;
    let onDemandSize = 0;

    // Use string matching/logic similar to filters to categorize
    // This is an estimation matching the filter logic in JS
    const mockReq = { query: { userId: this.currentUserId, pinnedIds: Array.from(this.pinnedDocIds) } };

    for (const row of allDocs.rows) {
      const doc = row.doc;
      if (!doc || doc._id.startsWith('_design/')) continue;

      const size = JSON.stringify(doc).length;

      if (essentialFilter(doc, mockReq)) {
        essentialSize += size;
      } else if (onDemandFilter(doc, mockReq)) {
        onDemandSize += size;
      } else {
        // Default to recent if not essential or pinned
        recentSize += size;
      }
    }

    return [
      { tier: 'essential', used: essentialSize, limit: TIER_LIMITS.essential, usagePercent: essentialSize / TIER_LIMITS.essential },
      { tier: 'recent', used: recentSize, limit: TIER_LIMITS.recent, usagePercent: recentSize / TIER_LIMITS.recent },
      { tier: 'onDemand', used: onDemandSize, limit: TIER_LIMITS.onDemand, usagePercent: onDemandSize / TIER_LIMITS.onDemand },
    ];
  }

  /**
   * Check storage and update status
   */
  async checkStorage(): Promise<StorageInfo> {
    this.storageInfo = await this.getStorageEstimate();

    // If storage is critical and we're syncing, pause sync
    if (this.storageInfo.isCritical && (this.pushHandler || this.essentialPullHandler)) {
      console.warn("Storage critical, pausing sync");
      this.stopSync();
      this.notify("storage_full");
    }

    // Check tier limits specifically for Recent tier eviction
    // We do this less frequently ideally, but for now we do it here if overhead allows.
    // To avoid lag, we might skip detailed tier check here and rely on separate process,
    // but Issue #55 implies auto-purge.
    // Let's implement a simplified check or trigger it separately.

    return this.storageInfo;
  }

  /**
   * Trigger eviction for Recent tier if needed
   */
  async enforceTierLimits() {
    if (!this.currentUserId) return;

    const quotas = await this.getTierQuotas();
    const recentQuota = quotas.find(q => q.tier === 'recent');

    if (recentQuota && recentQuota.usagePercent > 0.8) {
      console.log("Recent tier > 80%, running eviction...");
      // Target to free: get back to 70%?
      const targetBytes = recentQuota.used - (recentQuota.limit * 0.7);
      if (targetBytes > 0) {
        const result = await evictLruDocuments(this.db, targetBytes, this.currentUserId);
        console.log(`Evicted ${result.evictedCount} docs, freed ${result.freedBytes} bytes`);
      }
    }
  }

  /**
   * Start periodic storage monitoring
   */
  private startStorageMonitoring() {
    if (this.storageCheckInterval) return;

    // Check storage every 30 seconds
    this.storageCheckInterval = window.setInterval(async () => {
      await this.checkStorage();
      // Also enforce limits periodically
      this.enforceTierLimits().catch(err => console.error("Eviction error", err));
    }, 30000);
  }

  /**
   * Stop storage monitoring
   */
  private stopStorageMonitoring() {
    if (this.storageCheckInterval) {
      clearInterval(this.storageCheckInterval);
      this.storageCheckInterval = null;
    }
  }

  /**
   * Get current storage info
   */
  getStorageInfo(): StorageInfo | null {
    return this.storageInfo;
  }

  subscribe(listener: (update: StatusUpdate) => void) {
    this.listeners.push(listener);
    // Initial emission with current state
    listener({
      status: this.currentStatus,
      storage: this.storageInfo || undefined,
      activeTiers: Array.from(this.activeTiers),
    });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(status: SyncStatus) {
    this.currentStatus = status;
    this.listeners.forEach((l) =>
      l({
        status,
        storage: this.storageInfo || undefined,
        activeTiers: Array.from(this.activeTiers)
      }),
    );
  }

  async startSync() {
    // Default startSync behaves as "Start All Tiers" unless strict control needed
    if (!this.currentUserId) {
      console.warn("User ID not set, cannot start filtered sync");
      return;
    }

    const storage = await this.checkStorage();
    if (storage.isCritical) {
      console.warn("Cannot start sync: storage is critical");
      this.notify("storage_full");
      return;
    }

    this.notify("active");

    // 1. Start Push (Continuous, Upload everything)
    if (!this.pushHandler) {
      this.pushHandler = this.db.replicate.to(this.remoteDB, {
        live: true,
        retry: true
      })
        .on('change', () => this.notify("active"))
        .on('error', (err) => console.error("Push error", err));
    }

    // 2. Start Essential Pull (Live or Frequent)
    // We use live for Essential as per spec "Available immediately" / "15 min" implies high pri.
    // Live is better for UX.
    if (!this.essentialPullHandler) {
      this.activeTiers.add('essential');
      this.essentialPullHandler = this.db.replicate.from(this.remoteDB, {
        live: true,
        retry: true,
        filter: 'app_filters/essential',
        query_params: { userId: this.currentUserId }
      })
        .on('change', () => {
          this.notify("active");
          this.checkStorage();
        })
        .on('error', (err) => {
          console.error("Essential Pull error", err);
          this.activeTiers.delete('essential');
        });
    }

    // 3. Schedule Recent Pull (Hourly - One shot)
    if (!this.recentPullInterval) {
      // Run immediately
      this.syncRecentTier();

      // Then every hour
      this.recentPullInterval = window.setInterval(() => {
        this.syncRecentTier();
      }, SYNC_INTERVALS.recent);
    }
  }

  /**
   * Perform one-shot sync for Recent Tier
   */
  async syncRecentTier() {
    if (!this.currentUserId) return;

    this.activeTiers.add('recent');
    this.notify('active');

    try {
      await this.db.replicate.from(this.remoteDB, {
        filter: 'app_filters/recent',
        query_params: { userId: this.currentUserId }
      });
      console.log("Recent tier synced");
    } catch (err) {
      console.error("Recent sync error", err);
    } finally {
      this.activeTiers.delete('recent');
      this.notify(this.activeTiers.size > 0 ? 'active' : 'idle');
      this.enforceTierLimits();
    }
  }

  /**
   * Sync specifically pinned documents (On-Demand)
   */
  async syncPinnedDocuments() {
    if (this.pinnedDocIds.size === 0) return;

    this.activeTiers.add('onDemand');
    this.notify('active');

    try {
      // We pass the list of IDs to the filter
      const pinnedIds = Array.from(this.pinnedDocIds).join(',');

      await this.db.replicate.from(this.remoteDB, {
        filter: 'app_filters/onDemand',
        query_params: { pinnedIds }
      });
      console.log("Pinned docs synced");
    } catch (err) {
      console.error("Pinned sync error", err);
    } finally {
      this.activeTiers.delete('onDemand');
      this.notify(this.activeTiers.size > 0 ? 'active' : 'idle');
    }
  }

  /**
   * Pin a document for offline access
   */
  async pinDocument(docId: string) {
    this.pinnedDocIds.add(docId);
    // Persist pinned IDs? For now in memory, but normally in localStorage or PouchDB meta doc
    localStorage.setItem('kompass_pinned_ids', JSON.stringify(Array.from(this.pinnedDocIds)));

    // Trigger sync for this doc
    this.syncPinnedDocuments();
  }

  async unpinDocument(docId: string) {
    this.pinnedDocIds.delete(docId);
    localStorage.setItem('kompass_pinned_ids', JSON.stringify(Array.from(this.pinnedDocIds)));
    // We don't automatically delete the doc, eviction will assume it's "Recent" now and might eventually evict it
  }

  getPinnedDocIds(): string[] {
    return Array.from(this.pinnedDocIds);
  }

  stopSync() {
    if (this.pushHandler) {
      this.pushHandler.cancel();
      this.pushHandler = null;
    }
    if (this.essentialPullHandler) {
      this.essentialPullHandler.cancel();
      this.essentialPullHandler = null;
    }
    if (this.recentPullInterval) {
      clearInterval(this.recentPullInterval);
      this.recentPullInterval = null;
    }

    this.activeTiers.clear();

    if (this.currentStatus !== "storage_full") {
      this.notify("idle");
    }
  }

  /**
   * Request persistent storage to prevent browser eviction
   */
  async requestPersistentStorage(): Promise<boolean> {
    if ("storage" in navigator && "persist" in navigator.storage) {
      try {
        const isPersisted = await navigator.storage.persist();
        console.log("Persistent storage:", isPersisted ? "granted" : "denied");
        return isPersisted;
      } catch (err) {
        console.error("Error requesting persistent storage", err);
      }
    }
    return false;
  }

  /**
   * Cleanup on unmount
   */
  destroy() {
    this.stopSync();
    this.stopStorageMonitoring();
  }
}

export const dbService = new DatabaseService();

// Load pinned items on startup
const storedPinned = localStorage.getItem('kompass_pinned_ids');
if (storedPinned) {
  try {
    const ids = JSON.parse(storedPinned);
    ids.forEach((id: string) => dbService.pinDocument(id));
  } catch (e) {
    console.warn("Failed to load pinned IDs", e);
  }
}
