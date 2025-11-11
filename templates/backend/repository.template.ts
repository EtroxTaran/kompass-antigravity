import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import type { DocumentScope, MangoQuery } from 'nano';
import type { {{ENTITY_NAME}} } from '@kompass/shared';

/**
 * Repository for {{ENTITY_NAME}} entity
 * 
 * Implements the Repository pattern for CouchDB data access
 * Handles conflict detection, offline sync, and CRUD operations
 */
@Injectable()
export class {{ENTITY_NAME}}Repository {
  private readonly db: DocumentScope<{{ENTITY_NAME}}>;

  constructor(@Inject('COUCHDB_CONNECTION') private readonly nano: ServerScope) {
    this.db = this.nano.use<{{ENTITY_NAME}}>('{{DATABASE_NAME}}');
  }

  /**
   * Find a {{ENTITY_NAME}} by ID
   * 
   * @throws NotFoundException if entity not found
   */
  async findById(id: string): Promise<{{ENTITY_NAME}}> {
    try {
      const doc = await this.db.get(id);
      return doc;
    } catch (error) {
      if (error.statusCode === 404) {
        throw new NotFoundException(`{{ENTITY_NAME}} with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Find all {{ENTITY_NAME}}s with optional filtering
   */
  async findAll(query?: Partial<MangoQuery>): Promise<{{ENTITY_NAME}}[]> {
    const defaultQuery: MangoQuery = {
      selector: {
        type: '{{ENTITY_NAME_LOWER}}',
        ...query?.selector,
      },
      limit: query?.limit || 100,
      skip: query?.skip || 0,
      sort: query?.sort || [{ modifiedAt: 'desc' }],
    };

    const result = await this.db.find(defaultQuery);
    return result.docs;
  }

  /**
   * Create a new {{ENTITY_NAME}}
   * 
   * @throws ConflictException if ID already exists
   */
  async create(entity: Omit<{{ENTITY_NAME}}, '_rev'>): Promise<{{ENTITY_NAME}}> {
    try {
      const response = await this.db.insert(entity as {{ENTITY_NAME}});
      
      return {
        ...entity,
        _rev: response.rev,
      } as {{ENTITY_NAME}};
    } catch (error) {
      if (error.statusCode === 409) {
        throw new ConflictException(`{{ENTITY_NAME}} with ID ${entity._id} already exists`);
      }
      throw error;
    }
  }

  /**
   * Update an existing {{ENTITY_NAME}}
   * 
   * @throws NotFoundException if entity not found
   * @throws ConflictException if revision mismatch (optimistic locking)
   */
  async update(id: string, updates: Partial<{{ENTITY_NAME}}>, userId: string): Promise<{{ENTITY_NAME}}> {
    // Get current version
    const current = await this.findById(id);

    // Check for conflicts (offline sync)
    if (updates._rev && updates._rev !== current._rev) {
      throw new ConflictException(
        `Revision mismatch for {{ENTITY_NAME}} ${id}. Expected ${current._rev}, got ${updates._rev}`
      );
    }

    // Prepare updated document
    const updated: {{ENTITY_NAME}} = {
      ...current,
      ...updates,
      _id: id,
      _rev: current._rev,
      modifiedBy: userId,
      modifiedAt: new Date(),
      version: current.version + 1,
    };

    try {
      const response = await this.db.insert(updated);
      
      return {
        ...updated,
        _rev: response.rev,
      };
    } catch (error) {
      if (error.statusCode === 409) {
        throw new ConflictException(
          `Conflict detected when updating {{ENTITY_NAME}} ${id}. Please refresh and try again.`
        );
      }
      throw error;
    }
  }

  /**
   * Delete a {{ENTITY_NAME}}
   * 
   * For GoBD compliance, consider soft delete or tombstone pattern
   * 
   * @throws NotFoundException if entity not found
   */
  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    
    try {
      await this.db.destroy(id, entity._rev);
    } catch (error) {
      if (error.statusCode === 409) {
        throw new ConflictException(
          `Conflict detected when deleting {{ENTITY_NAME}} ${id}. Entity may have been modified.`
        );
      }
      throw error;
    }
  }

  /**
   * Soft delete (recommended for GoBD compliance)
   */
  async softDelete(id: string, userId: string): Promise<{{ENTITY_NAME}}> {
    const entity = await this.findById(id);
    
    // Add a deleted flag instead of actually deleting
    return await this.update(id, {
      ...entity,
      deletedAt: new Date(),
      deletedBy: userId,
    } as Partial<{{ENTITY_NAME}}>, userId);
  }

  /**
   * Find {{ENTITY_NAME}}s by owner (for RBAC filtering)
   */
  async findByOwner(ownerId: string): Promise<{{ENTITY_NAME}}[]> {
    return await this.findAll({
      selector: {
        type: '{{ENTITY_NAME_LOWER}}',
        owner: ownerId,
      },
    });
  }

  /**
   * Detect conflicts for offline sync
   */
  async detectConflicts(id: string): Promise<{{ENTITY_NAME}}[]> {
    try {
      const doc = await this.db.get(id, { conflicts: true });
      
      if (!doc._conflicts || doc._conflicts.length === 0) {
        return [];
      }

      // Fetch all conflicting revisions
      const conflicts: {{ENTITY_NAME}}[] = [];
      for (const rev of doc._conflicts) {
        try {
          const conflict = await this.db.get(id, { rev });
          conflicts.push(conflict);
        } catch (error) {
          console.warn(`Failed to fetch conflict revision ${rev}:`, error);
        }
      }

      return conflicts;
    } catch (error) {
      if (error.statusCode === 404) {
        throw new NotFoundException(`{{ENTITY_NAME}} with ID ${id} not found`);
      }
      throw error;
    }
  }

  /**
   * Resolve conflicts by choosing a winning revision
   */
  async resolveConflict(
    id: string,
    winningRev: string,
    losingRevs: string[]
  ): Promise<{{ENTITY_NAME}}> {
    // Delete losing revisions
    for (const rev of losingRevs) {
      try {
        await this.db.destroy(id, rev);
      } catch (error) {
        console.warn(`Failed to delete losing revision ${rev}:`, error);
      }
    }

    // Return winning version
    return await this.db.get(id, { rev: winningRev });
  }
}
