/**
 * User Repository
 *
 * Data access layer for User entities
 * Handles CouchDB operations for users
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { ServerScope as Nano } from 'nano';

import {
  normalizePaginationOptions,
  normalizeSortOptions,
} from '@kompass/shared/utils/pagination.utils';

import type {
  IUserRepository,
  UserFilters,
  UserQueryOptions,
} from './user.repository.interface';
import type { UserRole } from '@kompass/shared/constants/rbac.constants';
import type { User } from '@kompass/shared/types/entities/user';

/**
 * CouchDB Mango Query Selector for Users
 */
interface UserMangoSelector {
  type: string;
  email?: string;
  active?: boolean;
  roles?: UserRole | { $in: UserRole[] };
  displayName?:
    | string
    | {
        $regex?: string;
      };
  [key: string]: unknown;
}

/**
 * Allowed sort fields for User queries
 */
const ALLOWED_SORT_FIELDS = [
  'displayName',
  'email',
  'createdAt',
  'modifiedAt',
  'primaryRole',
] as const;

/**
 * Default sort field and order
 */
const DEFAULT_SORT_FIELD = 'displayName';
const DEFAULT_SORT_ORDER = 'asc' as const;

/**
 * User Repository Implementation
 */
@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(@Inject('NANO') private readonly nano: Nano) {}

  /**
   * Check if error is a CouchDB error
   */
  private isCouchDBError(
    error: unknown
  ): error is { statusCode: number; message?: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      typeof (error as { statusCode: unknown }).statusCode === 'number'
    );
  }

  async findById(id: string): Promise<User | null> {
    try {
      const doc = (await this.nano.use('kompass').get(id)) as User;
      if (doc.type !== 'user') {
        this.logger.warn(
          `Document ${id} is not a user (type: ${String(doc.type)})`
        );
        return null;
      }
      return doc;
    } catch (error: unknown) {
      if (this.isCouchDBError(error) && error.statusCode === 404) {
        return null;
      }
      this.logger.error(`Error finding user ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.nano.use('kompass').find({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        selector: {
          type: 'user',
          email: email,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        limit: 1,
      });

      if (result.docs.length === 0) {
        return null;
      }

      return result.docs[0] as User;
    } catch (error) {
      this.logger.error(`Error finding user by email ${email}:`, error);
      throw error;
    }
  }

  async findAll(options?: UserQueryOptions): Promise<User[]> {
    try {
      const filters = options?.filters;
      const pagination = options?.pagination
        ? normalizePaginationOptions(
            options.pagination.page,
            options.pagination.pageSize
          )
        : undefined;
      const sort = options?.sort
        ? normalizeSortOptions(
            options.sort.sortBy,
            options.sort.sortOrder,
            ALLOWED_SORT_FIELDS,
            DEFAULT_SORT_FIELD,
            DEFAULT_SORT_ORDER
          )
        : { sortBy: DEFAULT_SORT_FIELD, sortOrder: DEFAULT_SORT_ORDER };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const selector: UserMangoSelector = {
        type: 'user',
      };

      // Apply filters
      if (filters?.email) {
        selector.email = filters.email;
      }

      if (filters?.active !== undefined) {
        selector.active = filters.active;
      }

      if (filters?.role) {
        selector.roles = {
          $in: [filters.role],
        };
      }

      if (filters?.search) {
        // Case-insensitive partial match on display name
        selector.displayName = {
          $regex: `(?i).*${this.escapeRegex(filters.search)}.*`,
        };
      }

      // Build sort array for CouchDB
      const sortArray: Array<Record<string, 'asc' | 'desc'>> = [
        { [sort.sortBy]: sort.sortOrder },
      ];

      // Build query options
      const queryOptions = {
        selector,
        sort: sortArray,
        ...(pagination
          ? { limit: pagination.limit, skip: pagination.skip }
          : { limit: 1000 }),
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      const result = await this.nano.use('kompass').find(queryOptions as any);

      return result.docs as User[];
    } catch (error) {
      this.logger.error('Error finding all users:', error);
      throw error;
    }
  }

  async findByRole(role: UserRole): Promise<User[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.nano.use('kompass').find({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        selector: {
          type: 'user',
          roles: {
            $in: [role],
          },
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        sort: [{ displayName: 'asc' }],
        limit: 1000,
      });

      return result.docs as User[];
    } catch (error) {
      this.logger.error(`Error finding users by role ${role}:`, error);
      throw error;
    }
  }

  async create(user: Omit<User, '_rev'>): Promise<User> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const result = await this.nano.use('kompass').insert(user);
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...user,
        _rev: result.rev,
      };
    } catch (error) {
      this.logger.error('Error creating user:', error);
      throw error;
    }
  }

  async update(user: User): Promise<User> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const result = await this.nano.use('kompass').insert(user);
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...user,
        _rev: result.rev,
      };
    } catch (error) {
      if (this.isCouchDBError(error) && error.statusCode === 409) {
        this.logger.warn(
          `Conflict updating user ${user._id}: document was modified`
        );
        throw new Error(
          `Conflict: User ${user._id} was modified by another user`
        );
      }
      this.logger.error(`Error updating user ${user._id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new Error(`User ${id} not found`);
      }
      // Soft delete: set active=false instead of actually deleting
      user.active = false;
      user.modifiedAt = new Date();
      await this.update(user);
    } catch (error) {
      this.logger.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Count users matching filters
   *
   * @param filters Optional filters for counting
   * @returns Total count of matching users
   */
  async count(filters?: UserFilters): Promise<number> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const selector: UserMangoSelector = {
        type: 'user',
      };

      // Apply filters
      if (filters?.email) {
        selector.email = filters.email;
      }

      if (filters?.active !== undefined) {
        selector.active = filters.active;
      }

      if (filters?.role) {
        selector.roles = {
          $in: [filters.role],
        };
      }

      if (filters?.search) {
        // Case-insensitive partial match on display name
        selector.displayName = {
          $regex: `(?i).*${this.escapeRegex(filters.search)}.*`,
        };
      }

      // Use a workaround: fetch with a high limit and count
      // TODO: Optimize with a proper count index or use CouchDB's _count endpoint if available
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const countResult = await this.nano.use('kompass').find({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        selector: selector as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        limit: 10000, // High limit to get accurate count (adjust if needed)
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return (countResult.docs as User[]).length;
    } catch (error) {
      this.logger.error('Error counting users:', error);
      throw error;
    }
  }

  /**
   * Escape special regex characters in search string
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
