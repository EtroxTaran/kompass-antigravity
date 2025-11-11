/**
 * Entity Template for KOMPASS
 * 
 * Usage: Replace {{ENTITY_NAME}} with your entity name (e.g., Customer, Opportunity)
 * Replace {{ENTITY_DESCRIPTION}} with a description
 * Add your specific fields below the base entity fields
 */

/**
 * {{ENTITY_DESCRIPTION}}
 * 
 * @example
 * ```typescript
 * const {{ENTITY_NAME_LOWER}}: {{ENTITY_NAME}} = {
 *   _id: '{{ENTITY_NAME_LOWER}}-uuid',
 *   _rev: '1-abc',
 *   type: '{{ENTITY_NAME_LOWER}}',
 *   // ... your fields
 *   createdBy: 'user-id',
 *   createdAt: new Date(),
 *   modifiedBy: 'user-id',
 *   modifiedAt: new Date(),
 *   version: 1,
 * };
 * ```
 */
export interface {{ENTITY_NAME}} {
  // ==================== CouchDB Required Fields ====================
  /** CouchDB document ID (format: "{{ENTITY_NAME_LOWER}}-{UUID}") */
  _id: string;
  
  /** CouchDB revision (for optimistic locking) */
  _rev: string;
  
  /** Document type discriminator */
  type: '{{ENTITY_NAME_LOWER}}';
  
  // ==================== Your Entity Fields ====================
  // TODO: Add your entity-specific fields here
  // Example:
  // name: string;
  // description?: string;
  
  // ==================== Audit Trail (GoBD Compliance) ====================
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
  
  // ==================== Offline Sync Support ====================
  /** CouchDB conflict revisions (offline-first) */
  _conflicts?: string[];
  
  /** Last successful sync timestamp */
  lastSyncedAt?: Date;
  
  /** Flag for queued offline changes */
  _queuedForSync?: boolean;
  
  // ==================== GoBD Immutability (if needed) ====================
  // Uncomment if this entity needs immutability after finalization
  // /** When entity became immutable */
  // immutableAt?: Date;
  // 
  // /** SHA-256 hash for tamper detection */
  // immutableHash?: string;
  // 
  // /** True = GoBD locked, cannot edit */
  // finalized?: boolean;
  // 
  // /** Array of immutable field names */
  // immutableFields?: string[];
  // 
  // /** Change log for post-finalization changes */
  // changeLog?: Array<{
  //   field: string;
  //   oldValue: unknown;
  //   newValue: unknown;
  //   changedBy: string;
  //   changedAt: Date;
  //   reason?: string;
  //   approvedBy?: string;
  // }>;
}

/**
 * Type guard to check if an object is a {{ENTITY_NAME}}
 */
export function is{{ENTITY_NAME}}(obj: unknown): obj is {{ENTITY_NAME}} {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '_id' in obj &&
    '_rev' in obj &&
    'type' in obj &&
    (obj as {{ENTITY_NAME}}).type === '{{ENTITY_NAME_LOWER}}'
  );
}

/**
 * Creates a new {{ENTITY_NAME}} with required audit fields
 */
export function create{{ENTITY_NAME}}(
  data: Omit<{{ENTITY_NAME}}, '_id' | '_rev' | 'type' | 'createdBy' | 'createdAt' | 'modifiedBy' | 'modifiedAt' | 'version'>,
  userId: string
): Omit<{{ENTITY_NAME}}, '_rev'> {
  const now = new Date();
  return {
    _id: `{{ENTITY_NAME_LOWER}}-${crypto.randomUUID()}`,
    type: '{{ENTITY_NAME_LOWER}}',
    ...data,
    createdBy: userId,
    createdAt: now,
    modifiedBy: userId,
    modifiedAt: now,
    version: 1,
  };
}
