import { Injectable, Inject } from '@nestjs/common';
import { AUDIT_DB } from '../../database/database.module';
import * as Nano from 'nano';
import * as crypto from 'crypto';

export interface AuditLogEntry {
  _id?: string;
  _rev?: string;
  type: 'audit_log';
  documentId: string;
  documentType: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  hash: string;
  previousHash: string;
  userId: string;
  userEmail?: string;
  timestamp: string;
  changes?: FieldChange[];
}

export interface FieldChange {
  field: string;
  oldValue: any;
  newValue: any;
}

@Injectable()
export class AuditService {
  private lastHashCache: Map<string, string> = new Map();

  constructor(
    @Inject(AUDIT_DB)
    private readonly auditDb: Nano.DocumentScope<AuditLogEntry>,
  ) {}

  /**
   * Create an audit log entry following the "audit-then-write" pattern.
   * This ensures GoBD compliance with immutable, hash-chained audit logs.
   */
  async logChange(
    documentId: string,
    documentType: string,
    operation: 'CREATE' | 'UPDATE' | 'DELETE',
    newDocument: any,
    oldDocument: any | null,
    userId: string,
    userEmail?: string,
  ): Promise<AuditLogEntry> {
    // Calculate hash of new document state
    const newHash = this.calculateHash(newDocument);

    // Get previous hash for this document (creates cryptographic chain)
    const previousHash = await this.getLastAuditHash(documentId);

    // Detect field changes for UPDATE operations
    let changes: FieldChange[] | undefined;
    if (operation === 'UPDATE' && oldDocument) {
      changes = this.detectFieldChanges(oldDocument, newDocument);
    }

    // Create audit log entry
    const auditEntry: AuditLogEntry = {
      _id: `audit-${documentId}-${Date.now()}-${crypto.randomUUID().split('-')[0]}`,
      type: 'audit_log',
      documentId,
      documentType,
      operation,
      hash: newHash,
      previousHash,
      userId,
      userEmail,
      timestamp: new Date().toISOString(),
      changes,
    };

    // Write to immutable audit log
    await this.auditDb.insert(auditEntry);

    // Update cache
    this.lastHashCache.set(documentId, newHash);

    return auditEntry;
  }

  private calculateHash(document: any): string {
    // Remove CouchDB-specific fields for consistent hashing
    const cleanDoc = { ...document };
    delete cleanDoc._rev;
    delete cleanDoc._id;

    const content = JSON.stringify(cleanDoc, Object.keys(cleanDoc).sort());
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  private async getLastAuditHash(documentId: string): Promise<string> {
    // Check cache first
    if (this.lastHashCache.has(documentId)) {
      return this.lastHashCache.get(documentId)!;
    }

    try {
      // Query for the latest audit entry for this document
      const result = await this.auditDb.find({
        selector: {
          documentId,
          type: 'audit_log',
        },
        sort: [{ timestamp: 'desc' }],
        limit: 1,
      });

      if (result.docs.length > 0) {
        const lastHash = result.docs[0].hash;
        this.lastHashCache.set(documentId, lastHash);
        return lastHash;
      }
    } catch (error) {
      console.warn('Error fetching last audit hash:', error);
    }

    // Genesis hash for new documents
    return '0'.repeat(64);
  }

  private detectFieldChanges(oldDoc: any, newDoc: any): FieldChange[] {
    const changes: FieldChange[] = [];
    const allKeys = new Set([...Object.keys(oldDoc), ...Object.keys(newDoc)]);

    for (const key of allKeys) {
      // Skip metadata fields
      if (
        ['_id', '_rev', 'modifiedAt', 'modifiedBy', 'version'].includes(key)
      ) {
        continue;
      }

      const oldValue = oldDoc[key];
      const newValue = newDoc[key];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({ field: key, oldValue, newValue });
      }
    }

    return changes;
  }
}
