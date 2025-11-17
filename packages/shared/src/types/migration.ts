/**
 * Migration-related types for KOMPASS
 *
 * Types for database migration framework and migration scripts
 */

/**
 * Migration status
 */
export enum MigrationStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ROLLED_BACK = 'rolled_back',
}

/**
 * Migration execution result
 */
export interface MigrationResult {
  /** Total documents processed */
  total: number;
  /** Number of documents updated */
  updated: number;
  /** Number of documents skipped */
  skipped: number;
  /** Errors encountered during migration */
  errors: Array<{ id: string; error: string }>;
}

/**
 * Migration metadata stored in database
 */
export interface MigrationRecord {
  _id: string; // Format: "migration-001" or "migration-001-customer-address-to-billing-address"
  _rev?: string;
  type: 'migration';
  /** Migration version/identifier (e.g., "001") */
  version: string;
  /** Migration name (e.g., "customer-address-to-billing-address") */
  name: string;
  /** Migration description */
  description: string;
  /** Migration status */
  status: MigrationStatus;
  /** When migration was executed */
  executedAt?: Date;
  /** Who executed the migration */
  executedBy?: string;
  /** Migration result */
  result?: MigrationResult;
  /** Error message if migration failed */
  error?: string;
  /** Migration duration in milliseconds */
  duration?: number;
  /** Whether this was a dry run */
  dryRun: boolean;
  /** Created timestamp */
  createdAt: Date;
  /** Modified timestamp */
  modifiedAt: Date;
}

/**
 * Migration script interface
 * All migration scripts must export a function matching this signature
 */
export interface MigrationScript {
  /** Execute the migration */
  execute(dryRun?: boolean): Promise<MigrationResult>;
  /** Rollback the migration (optional) */
  rollback?(): Promise<void>;
  /** Get migration metadata */
  getMetadata(): {
    version: string;
    name: string;
    description: string;
  };
}

/**
 * Migration runner configuration
 */
export interface MigrationRunnerConfig {
  /** CouchDB URL */
  couchdbUrl: string;
  /** CouchDB admin user */
  couchdbUser: string;
  /** CouchDB admin password */
  couchdbPassword: string;
  /** Database name */
  database: string;
  /** Migrations directory */
  migrationsDir: string;
  /** Dry run mode (default: true) */
  dryRun?: boolean;
  /** Target migration version (if specified, run up to this version) */
  targetVersion?: string;
}
