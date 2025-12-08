import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

const LOCAL_DB_NAME = 'kompass_local';
const REMOTE_DB_URL = 'http://localhost:5984/kompass'; // TODO: Make configurable via env

class DatabaseService {
    private db: PouchDB.Database;
    private remoteDB: PouchDB.Database;
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
                index: { fields: ['type'] }
            });
            console.log('Indexes created');
        } catch (err) {
            console.error('Error creating indexes', err);
        }
    }

    startSync() {
        if (this.syncHandler) return;

        this.syncHandler = this.db.sync(this.remoteDB, {
            live: true,
            retry: true
        }).on('change', (info) => {
            console.log('Sync change', info);
            // Determine if active/connected for UI indicator
        }).on('paused', (err) => {
            console.log('Sync paused', err);
        }).on('active', () => {
            console.log('Sync active');
        }).on('denied', (err) => {
            console.error('Sync denied', err);
        }).on('complete', (info) => {
            console.log('Sync complete', info);
        }).on('error', (err) => {
            console.error('Sync error', err);
        });
    }

    stopSync() {
        if (this.syncHandler) {
            this.syncHandler.cancel();
            this.syncHandler = null;
        }
    }
}

export const dbService = new DatabaseService();
