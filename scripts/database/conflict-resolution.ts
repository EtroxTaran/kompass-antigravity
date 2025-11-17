/**
 * CouchDB Conflict Resolution Utilities
 *
 * Provides utilities for detecting and resolving conflicts in a multi-master CouchDB cluster.
 * Implements various conflict resolution strategies for different entity types.
 *
 * Usage:
 *   import { detectConflicts, resolveConflicts } from './conflict-resolution';
 */

import * as Nano from 'nano';
import type { BaseEntity } from '../../packages/shared/src/types';

export interface Conflict {
  documentId: string;
  field: string;
  localValue: unknown;
  remoteValue: unknown;
  localRev: string;
  remoteRev: string;
  conflictType: 'field' | 'deletion' | 'addition';
  timestamp: Date;
}

export interface ConflictResolution {
  documentId: string;
  resolution: 'local' | 'remote' | 'merge' | 'manual';
  resolvedDocument: unknown;
  resolvedRev: string;
  conflictsResolved: number;
}

export enum ConflictResolutionStrategy {
  /** Last write wins - use the document with the latest modifiedAt timestamp */
  LAST_WRITE_WINS = 'last-write-wins',

  /** Merge non-conflicting fields, manual resolution for conflicts */
  MERGE_NON_CONFLICTING = 'merge-non-conflicting',

  /** User decides which version to keep */
  USER_DECIDES = 'user-decides',

  /** Escalate to admin for manual resolution */
  ESCALATE_TO_ADMIN = 'escalate-to-admin',

  /** Entity-specific resolution (e.g., GoBD-compliant for invoices) */
  ENTITY_SPECIFIC = 'entity-specific',
}

/**
 * Detect conflicts between local and remote document versions
 */
export async function detectConflicts(
  db: Nano.DocumentScope<unknown>,
  documentId: string
): Promise<Conflict[]> {
  const conflicts: Conflict[] = [];

  try {
    // Get document with conflicts
    const doc = await db.get(documentId, { conflicts: true });

    // Check if document has conflicts
    if (!doc._conflicts || doc._conflicts.length === 0) {
      return conflicts;
    }

    // Get all conflicting revisions
    const conflictRevs = doc._conflicts;
    const mainDoc = doc as BaseEntity;

    for (const conflictRev of conflictRevs) {
      try {
        // Get conflicting revision
        const conflictDoc = (await db.get(documentId, {
          rev: conflictRev,
        })) as BaseEntity;

        // Compare fields
        const allFields = new Set([
          ...Object.keys(mainDoc),
          ...Object.keys(conflictDoc),
        ]);

        for (const field of allFields) {
          // Skip CouchDB metadata fields
          if (field.startsWith('_')) {
            continue;
          }

          const localValue = mainDoc[field as keyof BaseEntity];
          const remoteValue = conflictDoc[field as keyof BaseEntity];

          // Detect conflicts
          if (localValue !== remoteValue) {
            let conflictType: Conflict['conflictType'] = 'field';

            if (localValue === undefined && remoteValue !== undefined) {
              conflictType = 'addition';
            } else if (localValue !== undefined && remoteValue === undefined) {
              conflictType = 'deletion';
            }

            conflicts.push({
              documentId,
              field,
              localValue,
              remoteValue,
              localRev: mainDoc._rev || '',
              remoteRev: conflictRev,
              conflictType,
              timestamp: new Date(),
            });
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(
          `Failed to get conflict revision ${conflictRev}:`,
          errorMessage
        );
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `Failed to detect conflicts for ${documentId}:`,
      errorMessage
    );
  }

  return conflicts;
}

/**
 * Resolve conflicts using specified strategy
 */
export async function resolveConflicts(
  db: Nano.DocumentScope<unknown>,
  documentId: string,
  strategy: ConflictResolutionStrategy,
  userChoice?: 'local' | 'remote'
): Promise<ConflictResolution> {
  const conflicts = await detectConflicts(db, documentId);

  if (conflicts.length === 0) {
    const doc = await db.get(documentId);
    return {
      documentId,
      resolution: 'local',
      resolvedDocument: doc,
      resolvedRev: (doc as BaseEntity)._rev || '',
      conflictsResolved: 0,
    };
  }

  const doc = (await db.get(documentId)) as BaseEntity;
  const conflictRevs = doc._conflicts || [];

  let resolvedDocument: unknown = { ...doc };
  let conflictsResolved = 0;

  switch (strategy) {
    case ConflictResolutionStrategy.LAST_WRITE_WINS:
      // Get all conflicting versions
      const versions = await Promise.all(
        conflictRevs.map(async (rev) => {
          const versionDoc = (await db.get(documentId, { rev })) as BaseEntity;
          return {
            rev,
            doc: versionDoc,
            modifiedAt: versionDoc.modifiedAt || new Date(0),
          };
        })
      );

      // Add current version
      versions.push({
        rev: doc._rev || '',
        doc,
        modifiedAt: doc.modifiedAt || new Date(0),
      });

      // Find version with latest modifiedAt
      const latest = versions.reduce((latest, current) => {
        const latestDate =
          latest.modifiedAt instanceof Date
            ? latest.modifiedAt
            : new Date(latest.modifiedAt);
        const currentDate =
          current.modifiedAt instanceof Date
            ? current.modifiedAt
            : new Date(current.modifiedAt);
        return currentDate > latestDate ? current : latest;
      });

      resolvedDocument = latest.doc;
      conflictsResolved = conflictRevs.length;

      // Delete losing revisions
      for (const rev of conflictRevs) {
        if (rev !== latest.rev) {
          try {
            await db.destroy(documentId, rev);
          } catch (error) {
            // Ignore errors if revision already deleted
          }
        }
      }

      break;

    case ConflictResolutionStrategy.MERGE_NON_CONFLICTING:
      // Merge non-conflicting fields
      const merged = { ...doc } as Record<string, unknown>;

      // Get all conflicting versions
      const conflictVersions = await Promise.all(
        conflictRevs.map(async (rev) => {
          return (await db.get(documentId, { rev })) as BaseEntity;
        })
      );

      // Merge fields that don't conflict
      for (const conflict of conflicts) {
        // For conflicting fields, use local value (can be enhanced with business logic)
        if (conflict.conflictType === 'field') {
          merged[conflict.field] = conflict.localValue;
        }
      }

      // Add fields that exist in other versions but not in local
      for (const version of conflictVersions) {
        for (const key of Object.keys(version)) {
          if (!key.startsWith('_') && !(key in merged)) {
            merged[key] = version[key as keyof BaseEntity];
          }
        }
      }

      resolvedDocument = merged;
      conflictsResolved = conflicts.filter(
        (c) => c.conflictType === 'field'
      ).length;

      // Delete conflict revisions after merge
      for (const rev of conflictRevs) {
        try {
          await db.destroy(documentId, rev);
        } catch (error) {
          // Ignore errors
        }
      }

      break;

    case ConflictResolutionStrategy.USER_DECIDES:
      if (!userChoice) {
        throw new Error('User choice required for USER_DECIDES strategy');
      }

      if (userChoice === 'local') {
        resolvedDocument = doc;
        // Delete remote conflicts
        for (const rev of conflictRevs) {
          try {
            await db.destroy(documentId, rev);
          } catch (error) {
            // Ignore errors
          }
        }
      } else {
        // Use remote version (latest conflict)
        const remoteVersion = (await db.get(documentId, {
          rev: conflictRevs[0],
        })) as BaseEntity;
        resolvedDocument = remoteVersion;

        // Delete local version and other conflicts
        try {
          await db.destroy(documentId, doc._rev || '');
        } catch (error) {
          // Ignore errors
        }
        for (let i = 1; i < conflictRevs.length; i++) {
          try {
            await db.destroy(documentId, conflictRevs[i]);
          } catch (error) {
            // Ignore errors
          }
        }
      }

      conflictsResolved = conflictRevs.length;
      break;

    case ConflictResolutionStrategy.ESCALATE_TO_ADMIN:
      // Don't auto-resolve, just return conflicts for manual resolution
      return {
        documentId,
        resolution: 'manual',
        resolvedDocument: doc,
        resolvedRev: doc._rev || '',
        conflictsResolved: 0,
      };

    case ConflictResolutionStrategy.ENTITY_SPECIFIC:
      // Entity-specific resolution based on document type
      const docType = (doc as BaseEntity).type;
      return await resolveEntitySpecificConflicts(
        db,
        documentId,
        docType,
        conflicts
      );

    default:
      throw new Error(`Unknown conflict resolution strategy: ${strategy}`);
  }

  // Save resolved document
  if (resolvedDocument) {
    delete (resolvedDocument as { _conflicts?: string[] })._conflicts;
    const saved = await db.insert(
      resolvedDocument as Nano.DocumentInsertResponse
    );
    return {
      documentId,
      resolution:
        strategy === ConflictResolutionStrategy.ESCALATE_TO_ADMIN
          ? 'manual'
          : 'merge',
      resolvedDocument,
      resolvedRev: saved.rev,
      conflictsResolved,
    };
  }

  return {
    documentId,
    resolution: 'manual',
    resolvedDocument: doc,
    resolvedRev: doc._rev || '',
    conflictsResolved: 0,
  };
}

/**
 * Entity-specific conflict resolution
 * Implements GoBD-compliant resolution for immutable entities
 */
async function resolveEntitySpecificConflicts(
  db: Nano.DocumentScope<unknown>,
  documentId: string,
  entityType: string | undefined,
  conflicts: Conflict[]
): Promise<ConflictResolution> {
  const doc = (await db.get(documentId)) as BaseEntity;

  // GoBD-compliant entities (Invoice, Payment) - keep latest finalized version
  if (entityType === 'invoice' || entityType === 'payment') {
    const finalized = (doc as { finalized?: boolean }).finalized;

    if (finalized) {
      // For finalized documents, use last write wins but log changes
      return await resolveConflicts(
        db,
        documentId,
        ConflictResolutionStrategy.LAST_WRITE_WINS
      );
    }
  }

  // Customer/Opportunity/Project - merge non-conflicting, manual for conflicts
  if (
    ['customer', 'opportunity', 'project', 'location', 'contact'].includes(
      entityType || ''
    )
  ) {
    return await resolveConflicts(
      db,
      documentId,
      ConflictResolutionStrategy.MERGE_NON_CONFLICTING
    );
  }

  // Default: last write wins
  return await resolveConflicts(
    db,
    documentId,
    ConflictResolutionStrategy.LAST_WRITE_WINS
  );
}

/**
 * Get all documents with conflicts in a database
 */
export async function findConflicts(
  db: Nano.DocumentScope<unknown>
): Promise<Conflict[]> {
  const allConflicts: Conflict[] = [];

  try {
    // Query for all documents with conflicts
    const result = await db.list({ include_docs: true });

    for (const row of result.rows) {
      const doc = row.doc as BaseEntity;
      if (doc._conflicts && doc._conflicts.length > 0) {
        const docConflicts = await detectConflicts(db, doc._id);
        allConflicts.push(...docConflicts);
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to find conflicts:', errorMessage);
  }

  return allConflicts;
}
