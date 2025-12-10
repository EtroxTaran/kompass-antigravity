import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";

PouchDB.plugin(PouchDBFind);

const LOCAL_DB_NAME = "kompass_local";
const REMOTE_DB_URL = "http://localhost:5984/kompass"; // TODO: Make configurable via env

// Storage thresholds
const STORAGE_WARNING_THRESHOLD = 0.8; // 80%
const STORAGE_CRITICAL_THRESHOLD = 0.9; // 90%

export interface StorageInfo {
  usage: number;
  quota: number;
  usagePercent: number;
  isWarning: boolean;
  isCritical: boolean;
}

type SyncStatus = "idle" | "active" | "paused" | "error" | "storage_full";

interface StatusUpdate {
  status: SyncStatus;
  storage?: StorageInfo;
}

class DatabaseService {
  private db: PouchDB.Database;
  private remoteDB: PouchDB.Database;
  private listeners: ((update: StatusUpdate) => void)[] = [];
  private currentStatus: SyncStatus = "idle";
  private syncHandler: PouchDB.Replication.Sync<{}> | null = null;
  private storageInfo: StorageInfo | null = null;
  private storageCheckInterval: number | null = null;

  constructor() {
    this.db = new PouchDB(LOCAL_DB_NAME);
    this.remoteDB = new PouchDB(REMOTE_DB_URL);
  }

  getDB() {
    return this.db;
  }

  async init() {
    // Ensure indexes exist
    try {
      await this.db.createIndex({
        index: { fields: ["type"] },
      });
      console.log("Indexes created");
    } catch (err) {
      console.error("Error creating indexes", err);
    }

    // Initial storage check
    await this.checkStorage();

    // Start periodic storage monitoring
    this.startStorageMonitoring();
  }

  /**
   * Get current storage estimate using navigator.storage API
   */
  async getStorageEstimate(): Promise<StorageInfo> {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const usage = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const usagePercent = quota > 0 ? usage / quota : 0;

        return {
          usage,
          quota,
          usagePercent,
          isWarning: usagePercent >= STORAGE_WARNING_THRESHOLD,
          isCritical: usagePercent >= STORAGE_CRITICAL_THRESHOLD,
        };
      } catch (err) {
        console.error("Error getting storage estimate", err);
      }
    }

    // Fallback for browsers without storage API
    return {
      usage: 0,
      quota: 0,
      usagePercent: 0,
      isWarning: false,
      isCritical: false,
    };
  }

  /**
   * Check storage and update status
   */
  async checkStorage(): Promise<StorageInfo> {
    this.storageInfo = await this.getStorageEstimate();

    // If storage is critical and we're syncing, pause sync
    if (this.storageInfo.isCritical && this.syncHandler) {
      console.warn("Storage critical, pausing sync");
      this.stopSync();
      this.notify("storage_full");
    }

    return this.storageInfo;
  }

  /**
   * Start periodic storage monitoring
   */
  private startStorageMonitoring() {
    if (this.storageCheckInterval) return;

    // Check storage every 30 seconds
    this.storageCheckInterval = window.setInterval(() => {
      this.checkStorage();
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
    listener({ status: this.currentStatus, storage: this.storageInfo || undefined });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(status: SyncStatus) {
    this.currentStatus = status;
    this.listeners.forEach((l) => l({ status, storage: this.storageInfo || undefined }));
  }

  async startSync() {
    if (this.syncHandler) return;

    // Check storage before starting sync
    const storage = await this.checkStorage();
    if (storage.isCritical) {
      console.warn("Cannot start sync: storage is critical");
      this.notify("storage_full");
      return;
    }

    this.syncHandler = this.db
      .sync(this.remoteDB, {
        live: true,
        retry: true,
      })
      .on("change", (info) => {
        console.log("Sync change", info);
        this.notify("active");
        // Check storage after changes
        this.checkStorage();
      })
      .on("paused", (err) => {
        console.log("Sync paused", err);
        this.notify("idle");
      })
      .on("active", () => {
        console.log("Sync active");
        this.notify("active");
      })
      .on("denied", (err) => {
        console.error("Sync denied", err);
        this.notify("error");
      })
      .on("complete", (info) => {
        console.log("Sync complete", info);
        this.notify("idle");
      })
      .on("error", (err) => {
        console.error("Sync error", err);
        this.notify("error");
      });
  }

  stopSync() {
    if (this.syncHandler) {
      this.syncHandler.cancel();
      this.syncHandler = null;
      if (this.currentStatus !== "storage_full") {
        this.notify("idle");
      }
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
