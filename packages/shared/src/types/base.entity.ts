/**
 * Base Entity Interface for KOMPASS
 * 
 * All CouchDB documents must extend this interface
 * Ensures GoBD compliance and offline-first support
 */

/**
 * Base fields required for all entities
 */
export interface BaseEntity {
  /** CouchDB document ID */
  _id: string;

  /** CouchDB revision (for optimistic locking) */
  _rev: string;

  /** Document type discriminator */
  type: string;

  /** User ID who created this record */
  createdBy: string;

  /** Creation timestamp */
  createdAt: Date;

  /** User ID who last modified this record */
  modifiedBy: string;

  /** Last modification timestamp */
  modifiedAt: Date;

  /** Optimistic locking version */
  version: number;

  /** CouchDB conflict revisions (offline-first) */
  _conflicts?: string[];

  /** Last successful sync timestamp */
  lastSyncedAt?: Date;

  /** Flag for queued offline changes */
  _queuedForSync?: boolean;

  /** Offline timestamp when change was made */
  _offlineTimestamp?: Date;
}

/**
 * Base fields for immutable entities (GoBD compliance)
 */
export interface ImmutableEntity extends BaseEntity {
  /** When entity became immutable */
  immutableAt?: Date;

  /** SHA-256 hash for tamper detection */
  immutableHash?: string;

  /** True = GoBD locked, cannot edit */
  finalized?: boolean;

  /** Array of immutable field names */
  immutableFields?: string[];

  /** Change log for post-finalization changes */
  changeLog?: ChangeLogEntry[];
}

/**
 * Change log entry for audit trail
 */
export interface ChangeLogEntry {
  /** Field that was changed */
  field: string;

  /** Previous value */
  oldValue: unknown;

  /** New value */
  newValue: unknown;

  /** User ID who made the change */
  changedBy: string;

  /** When the change was made */
  changedAt: Date;

  /** Reason for change (required for immutable entities) */
  reason?: string;

  /** User ID who approved the change (for sensitive changes) */
  approvedBy?: string;
}

/**
 * Soft delete fields
 */
export interface SoftDeletable {
  /** Soft delete flag */
  deletedAt?: Date;

  /** User who soft deleted */
  deletedBy?: string;

  /** True if soft deleted */
  _deleted?: boolean;
}

