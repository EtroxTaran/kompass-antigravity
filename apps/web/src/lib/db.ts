import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";

PouchDB.plugin(PouchDBFind);

const LOCAL_DB_NAME = "kompass_local";
const REMOTE_DB_URL = "http://localhost:5984/kompass"; // TODO: Make configurable via env

class DatabaseService {
  private db: PouchDB.Database;
  private remoteDB: PouchDB.Database;
  private listeners: ((status: string) => void)[] = [];
  private currentStatus: "idle" | "active" | "paused" | "error" = "idle";
  private syncHandler: PouchDB.Replication.Sync<{}> | null = null;

  constructor() {
    this.db = new PouchDB(LOCAL_DB_NAME);
    this.remoteDB = new PouchDB(REMOTE_DB_URL);
  }

  getDB() {
    return this.db;
  }

  async init() {
    // Ensure indexes exist (example)
    try {
      await this.db.createIndex({
        index: { fields: ["type"] },
      });
      console.log("Indexes created");
    } catch (err) {
      console.error("Error creating indexes", err);
    }
  }

  subscribe(listener: (status: string) => void) {
    this.listeners.push(listener);
    listener(this.currentStatus); // Initial emission
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(status: "idle" | "active" | "paused" | "error") {
    this.currentStatus = status;
    this.listeners.forEach((l) => l(status));
  }

  startSync() {
    if (this.syncHandler) return;

    this.syncHandler = this.db
      .sync(this.remoteDB, {
        live: true,
        retry: true,
      })
      .on("change", (info) => {
        console.log("Sync change", info);
        this.notify("active");
        // Debounce back to paused or idle if needed, but 'paused' event usually fires when uptodate
      })
      .on("paused", (err) => {
        console.log("Sync paused", err);
        this.notify("idle"); // 'paused' means "up to date" usually
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
      this.notify("idle");
    }
  }
}

export const dbService = new DatabaseService();
