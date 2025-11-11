/**
 * API Service Template for KOMPASS
 * 
 * Implements:
 * - REST API calls
 * - PouchDB offline storage
 * - Sync logic
 * - Error handling
 * 
 * Usage: Replace {{ENTITY_NAME}} with your entity name
 */

import PouchDB from 'pouchdb-browser';
import type { {{ENTITY_NAME}} } from '@kompass/shared';
import type { Create{{ENTITY_NAME}}Dto, Update{{ENTITY_NAME}}Dto } from '../types/{{ENTITY_NAME_LOWER}}.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

/**
 * Local PouchDB instance for offline storage
 */
const localDB = new PouchDB<{{ENTITY_NAME}}>('{{ENTITY_NAME_PLURAL_LOWER}}');

/**
 * Get auth token from storage
 */
function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

/**
 * Create headers with auth token
 */
function createHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * API Service for {{ENTITY_NAME}}
 */
export const {{ENTITY_NAME_LOWER}}Api = {
  // ==================== API Methods ====================

  /**
   * Get all {{ENTITY_NAME}}s from API
   */
  async getAll(): Promise<{{ENTITY_NAME}}[]> {
    const response = await fetch(`${API_BASE_URL}/{{ENTITY_NAME_PLURAL_LOWER}}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch {{ENTITY_NAME_PLURAL}}: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get a single {{ENTITY_NAME}} by ID from API
   */
  async getById(id: string): Promise<{{ENTITY_NAME}}> {
    const response = await fetch(`${API_BASE_URL}/{{ENTITY_NAME_PLURAL_LOWER}}/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('{{ENTITY_NAME}} not found');
      }
      throw new Error(`Failed to fetch {{ENTITY_NAME}}: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Create a new {{ENTITY_NAME}} via API
   */
  async create(data: Create{{ENTITY_NAME}}Dto): Promise<{{ENTITY_NAME}}> {
    const response = await fetch(`${API_BASE_URL}/{{ENTITY_NAME_PLURAL_LOWER}}`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create {{ENTITY_NAME}}');
    }

    return response.json();
  },

  /**
   * Update an existing {{ENTITY_NAME}} via API
   */
  async update(id: string, data: Update{{ENTITY_NAME}}Dto): Promise<{{ENTITY_NAME}}> {
    const response = await fetch(`${API_BASE_URL}/{{ENTITY_NAME_PLURAL_LOWER}}/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Conflict detected. Please refresh and try again.');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to update {{ENTITY_NAME}}');
    }

    return response.json();
  },

  /**
   * Delete a {{ENTITY_NAME}} via API
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/{{ENTITY_NAME_PLURAL_LOWER}}/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete {{ENTITY_NAME}}: ${response.statusText}`);
    }
  },

  // ==================== Offline/PouchDB Methods ====================

  /**
   * Get all {{ENTITY_NAME}}s from local PouchDB
   */
  async getAllFromLocal(): Promise<{{ENTITY_NAME}}[]> {
    try {
      const result = await localDB.allDocs({
        include_docs: true,
      });
      
      return result.rows
        .filter((row) => row.doc && row.doc.type === '{{ENTITY_NAME_LOWER}}')
        .map((row) => row.doc as {{ENTITY_NAME}});
    } catch (error) {
      console.error('Failed to get {{ENTITY_NAME_PLURAL}} from local:', error);
      return [];
    }
  },

  /**
   * Get a single {{ENTITY_NAME}} from local PouchDB
   */
  async getFromLocal(id: string): Promise<{{ENTITY_NAME}} | null> {
    try {
      const doc = await localDB.get(id);
      return doc.type === '{{ENTITY_NAME_LOWER}}' ? doc : null;
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Save {{ENTITY_NAME}} to local PouchDB
   */
  async saveToLocal(entity: {{ENTITY_NAME}}): Promise<void> {
    try {
      await localDB.put(entity);
    } catch (error) {
      console.error('Failed to save {{ENTITY_NAME}} to local:', error);
      throw error;
    }
  },

  /**
   * Save all {{ENTITY_NAME}}s to local PouchDB
   */
  async saveAllToLocal(entities: {{ENTITY_NAME}}[]): Promise<void> {
    try {
      await localDB.bulkDocs(entities);
    } catch (error) {
      console.error('Failed to save {{ENTITY_NAME_PLURAL}} to local:', error);
      throw error;
    }
  },

  /**
   * Create {{ENTITY_NAME}} locally (offline mode)
   */
  async createLocal(data: Create{{ENTITY_NAME}}Dto): Promise<{{ENTITY_NAME}}> {
    const entity: Omit<{{ENTITY_NAME}}, '_rev'> = {
      _id: `{{ENTITY_NAME_LOWER}}-${crypto.randomUUID()}`,
      type: '{{ENTITY_NAME_LOWER}}',
      ...data,
      _queuedForSync: true,
      createdAt: new Date(),
      modifiedAt: new Date(),
      version: 1,
      // TODO: Add user ID from auth context
      createdBy: 'current-user-id',
      modifiedBy: 'current-user-id',
    };

    await localDB.put(entity as {{ENTITY_NAME}});
    
    return entity as {{ENTITY_NAME}};
  },

  /**
   * Update {{ENTITY_NAME}} locally (offline mode)
   */
  async updateLocal(id: string, data: Update{{ENTITY_NAME}}Dto): Promise<{{ENTITY_NAME}}> {
    const existing = await localDB.get(id);
    
    const updated: {{ENTITY_NAME}} = {
      ...existing,
      ...data,
      _queuedForSync: true,
      modifiedAt: new Date(),
      version: existing.version + 1,
      modifiedBy: 'current-user-id', // TODO: Get from auth context
    };

    await localDB.put(updated);
    
    return updated;
  },

  /**
   * Delete {{ENTITY_NAME}} from local PouchDB
   */
  async deleteFromLocal(id: string): Promise<void> {
    try {
      const doc = await localDB.get(id);
      await localDB.remove(doc);
    } catch (error) {
      console.error('Failed to delete {{ENTITY_NAME}} from local:', error);
    }
  },

  /**
   * Mark {{ENTITY_NAME}} for deletion (tombstone pattern)
   */
  async markForDeletion(id: string): Promise<void> {
    const existing = await localDB.get(id);
    
    const tombstone: {{ENTITY_NAME}} = {
      ...existing,
      _deleted: true,
      _queuedForSync: true,
      deletedAt: new Date(),
      deletedBy: 'current-user-id', // TODO: Get from auth context
    } as {{ENTITY_NAME}};

    await localDB.put(tombstone);
  },

  /**
   * Sync a single {{ENTITY_NAME}} between local and remote
   */
  async syncOne(id: string): Promise<void> {
    try {
      const [local, remote] = await Promise.all([
        this.getFromLocal(id),
        this.getById(id),
      ]);

      if (!local && remote) {
        // Remote exists, save to local
        await this.saveToLocal(remote);
      } else if (local && !remote) {
        // Local exists, push to remote
        if (local._queuedForSync) {
          await this.create(local as Create{{ENTITY_NAME}}Dto);
        }
      } else if (local && remote) {
        // Both exist, check for conflicts
        if (local._rev !== remote._rev) {
          // Conflict detected - handle based on strategy
          console.warn('Conflict detected for {{ENTITY_NAME}}:', id);
          // TODO: Implement conflict resolution
        }
      }
    } catch (error) {
      console.error('Failed to sync {{ENTITY_NAME}}:', error);
      throw error;
    }
  },

  /**
   * Sync all queued {{ENTITY_NAME}} changes
   */
  async syncAll(): Promise<{ synced: number; failed: number; conflicts: number }> {
    const queued = await localDB.find({
      selector: {
        type: '{{ENTITY_NAME_LOWER}}',
        _queuedForSync: true,
      },
    });

    const results = {
      synced: 0,
      failed: 0,
      conflicts: 0,
    };

    for (const doc of queued.docs) {
      try {
        await this.syncOne(doc._id);
        results.synced++;
      } catch (error) {
        if (error.message?.includes('conflict')) {
          results.conflicts++;
        } else {
          results.failed++;
        }
      }
    }

    return results;
  },

  /**
   * Get sync status for a {{ENTITY_NAME}}
   */
  async getSyncStatus(id: string): Promise<{
    queued: boolean;
    conflicts: number;
    lastSynced: Date | null;
  }> {
    const local = await this.getFromLocal(id);
    
    if (!local) {
      return {
        queued: false,
        conflicts: 0,
        lastSynced: null,
      };
    }

    return {
      queued: local._queuedForSync || false,
      conflicts: local._conflicts?.length || 0,
      lastSynced: local.lastSyncedAt || null,
    };
  },
};

