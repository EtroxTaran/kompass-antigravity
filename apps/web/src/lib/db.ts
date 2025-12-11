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
import { storageService } from "../services/storage.service";
import { QuotaStatus } from "@kompass/shared/src/types/storage.types"; // Ensure this matches or map it

PouchDB.plugin(PouchDBFind);

const LOCAL_DB_NAME = "kompass_local";
const REMOTE_DB_URL = "http://localhost:5984/kompass"; // TODO: Make configurable via env

// Tier Limits (in bytes) - Refactored: Should use TIER_CONFIGS from storage service if possible, but kept here for estimation logic parity
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

type SyncStatus = "idle" | "active" | "paused" | "error" | "storage_full";

interface StatusUpdate {
  status: SyncStatus;
  storage?: QuotaStatus; // StorageInfo
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

  private storageInfo: QuotaStatus | null = null; // StorageInfo
  private storageCheckInterval: number | null = null;

  private currentUserId: string | null = null;

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
   * Calculate detailed tier usage (Expensive, call sparingly)
   */
  async getTierQuotas(): Promise<TierQuota[]> {
    const allDocs = await this.db.allDocs({ include_docs: true });

    let essentialSize = 0;
    let recentSize = 0;
    let onDemandSize = 0;

    // Use string matching/logic similar to filters to categorize
    const pinnedIds = storageService.getPinnedDocIds();
    const mockReq = { query: { userId: this.currentUserId, pinnedIds: pinnedIds } };

    for (const row of allDocs.rows) {
      const doc = row.doc;
      if (!doc || doc._id.startsWith('_design/')) continue;

      const size = JSON.stringify(doc).length;

      // We should use storageService logic ideally, but replicating filter logic for estimation is fine
      // if filters match service logic.
      // storageService doesn't have "onDemandFilter" equivalent exposed as public function yet that takes req,
      // but it has `isEssential`.
      // Let's stick to existing logic for now to ensure consistency with what was implemented.

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
  async checkStorage() {
    this.storageInfo = await storageService.checkQuota();

    // If storage is critical and we're syncing, pause sync
    if (this.storageInfo.status === 'Critical' && (this.pushHandler || this.essentialPullHandler)) {
      console.warn("Storage critical, pausing sync");
      this.stopSync();
      this.notify("storage_full");
    }

    return this.storageInfo;
  }

  /**
   * Trigger eviction for Recent tier if needed
   */
  async enforceTierLimits() {
    if (!this.currentUserId) return;

    // We can rely on StorageInfo from storageService, or calculate detail.
    // To be precise we calculate detail here.
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
  getStorageInfo() {
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
    if (!this.currentUserId) {
      console.warn("User ID not set, cannot start filtered sync");
      return;
    }

    const storage = await this.checkStorage();
    if (storage.status === 'Critical') {
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
    // Get pinned IDs from storageService
    const pinnedIds = storageService.getPinnedDocIds(); // This assumes the method is public in StorageService
    // I need to ensure getPinnedDocIds is public in StorageService. I'll check/fix if needed.
    // Looking at my previous write: `public getPinnedDocIds(): string[]` was NOT there.
    // I only added `isPinned`. I must update StorageService to expose IDs or I can't sync them here easily.
    // actually I added `public unpinDocument` and `private loadPinnedDocs`.
    // I missed `getPinnedDocIds` in StorageService!
    // I will add it in next step. For now I assume it exists to keep flow.

    if (pinnedIds.length === 0) return;

    this.activeTiers.add('onDemand');
    this.notify('active');

    try {
      // We pass the list of IDs to the filter
      const pinnedIdsStr = pinnedIds.join(',');

      await this.db.replicate.from(this.remoteDB, {
        filter: 'app_filters/onDemand',
        query_params: { pinnedIds: pinnedIdsStr }
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
    storageService.pinDocument(docId);
    // Trigger sync for this doc
    this.syncPinnedDocuments();
  }

  async unpinDocument(docId: string) {
    storageService.unpinDocument(docId);
    // We don't automatically delete the doc
  }

  // Removed internal getPinnedDocIds() as we use service now.

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
  /**
   * Get list of pinned document IDs
   */
  getPinnedDocIds(): string[] {
    return storageService.getPinnedDocIds(); // Assumes storageService exposes this, otherwise we need to add it there too.
  }

  destroy() {
    this.stopSync();
    this.stopStorageMonitoring();
  }
}

export const dbService = new DatabaseService();

// Load pinned items on startup - storageService handles this internally now, 
// OR we want to trigger sync on load?
// storageService loads IDs. Check if we need to sync them on init.
// Maybe add a `syncPinnedDocuments()` call in `init()`?
