import { Inject, Injectable } from '@nestjs/common';
import { OPERATIONAL_DB } from '../database/database.module';
import { AuditService } from './services/audit.service';
import * as Nano from 'nano';
import { v4 as uuidv4 } from 'uuid';

export interface BaseEntity {
  _id: string;
  _rev?: string;
  type: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
  version: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

@Injectable()
export abstract class BaseRepository<T extends BaseEntity> {
  protected abstract readonly entityType: string;

  constructor(
    @Inject(OPERATIONAL_DB) protected readonly db: Nano.DocumentScope<T>,
    protected readonly auditService: AuditService,
  ) {}

  /**
   * Generate a new ID for this entity type
   */
  protected generateId(): string {
    return `${this.entityType}-${uuidv4()}`;
  }

  /**
   * Find all documents of this entity type
   */
  async findAll(options: QueryOptions = {}): Promise<PaginatedResult<T>> {
    const {
      page = 1,
      limit = 20,
      sort = 'createdAt',
      order = 'desc',
    } = options;
    const skip = (page - 1) * limit;

    // Get total count
    const countResult = await this.db.find({
      selector: { type: this.entityType },
      fields: ['_id'],
      limit: 10000, // Max for counting
    });
    const total = countResult.docs.length;

    // Get paginated results
    const result = await this.db.find({
      selector: { type: this.entityType },
      sort: [{ [sort]: order }],
      skip,
      limit,
    });

    return {
      data: result.docs as T[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find a document by ID
   */
  async findById(id: string): Promise<T | null> {
    try {
      const doc = await this.db.get(id);
      if (doc.type !== this.entityType) {
        return null;
      }
      return doc as T;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Find documents by a custom selector
   */
  async findBySelector(
    selector: Nano.MangoSelector,
    options: QueryOptions = {},
  ): Promise<PaginatedResult<T>> {
    const {
      page = 1,
      limit = 20,
      sort = 'createdAt',
      order = 'desc',
    } = options;
    const skip = (page - 1) * limit;

    const fullSelector = {
      ...selector,
      type: this.entityType,
    };

    // Get total count
    const countResult = await this.db.find({
      selector: fullSelector,
      fields: ['_id'],
      limit: 10000,
    });
    const total = countResult.docs.length;

    // Get paginated results
    const result = await this.db.find({
      selector: fullSelector,
      sort: [{ [sort]: order }],
      skip,
      limit,
    });

    return {
      data: result.docs as T[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Create a new document with audit logging
   */
  async create(
    data: Partial<T>,
    userId: string,
    userEmail?: string,
  ): Promise<T> {
    const now = new Date().toISOString();
    const id = this.generateId();

    const document = {
      ...data,
      _id: id,
      type: this.entityType,
      createdBy: userId,
      createdAt: now,
      modifiedBy: userId,
      modifiedAt: now,
      version: 1,
    } as unknown as T;

    // Audit-then-write pattern
    await this.auditService.logChange(
      id,
      this.entityType,
      'CREATE',
      document,
      null,
      userId,
      userEmail,
    );

    // Write to database
    const response = await this.db.insert(document);

    return {
      ...document,
      _rev: response.rev,
    } as T;
  }

  /**
   * Update an existing document with audit logging
   */
  async update(
    id: string,
    data: Partial<T>,
    userId: string,
    userEmail?: string,
  ): Promise<T> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`${this.entityType} not found: ${id}`);
    }

    const now = new Date().toISOString();
    const updated = {
      ...existing,
      ...data,
      _id: id,
      _rev: existing._rev,
      type: this.entityType,
      modifiedBy: userId,
      modifiedAt: now,
      version: (existing.version || 0) + 1,
    } as T;

    // Audit-then-write pattern
    await this.auditService.logChange(
      id,
      this.entityType,
      'UPDATE',
      updated,
      existing,
      userId,
      userEmail,
    );

    // Write to database
    const response = await this.db.insert(updated);

    return {
      ...updated,
      _rev: response.rev,
    } as T;
  }

  /**
   * Delete a document with audit logging
   */
  async delete(id: string, userId: string, userEmail?: string): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`${this.entityType} not found: ${id}`);
    }

    // Audit-then-write pattern (log before delete)
    await this.auditService.logChange(
      id,
      this.entityType,
      'DELETE',
      { deleted: true },
      existing,
      userId,
      userEmail,
    );

    // Delete from database
    await this.db.destroy(id, existing._rev!);
  }
}
