/**
 * Customer Repository
 *
 * Data access layer for Customer entities
 * Handles CouchDB operations for customers
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { ServerScope as Nano } from 'nano';

import {
  normalizePaginationOptions,
  normalizeSortOptions,
} from '@kompass/shared/utils/pagination.utils';

import type {
  ICustomerRepository,
  CustomerFilters,
  CustomerQueryOptions,
} from './customer.repository.interface';
import type { Customer } from '@kompass/shared/types/entities/customer';
import type { CustomerRating } from '@kompass/shared/types/enums';

/**
 * CouchDB Mango Query Selector for Customers
 */
interface CustomerMangoSelector {
  type: string;
  owner?: string;
  rating?: CustomerRating;
  customerType?: Customer['customerType'];
  vatNumber?: string;
  companyName?:
    | string
    | {
        $regex?: string;
      };
  [key: string]: unknown; // Add index signature
}

/**
 * Allowed sort fields for Customer queries
 */
const ALLOWED_SORT_FIELDS = [
  'companyName',
  'createdAt',
  'modifiedAt',
  'rating',
  'customerType',
] as const;

/**
 * Default sort field and order
 */
const DEFAULT_SORT_FIELD = 'companyName';
const DEFAULT_SORT_ORDER = 'asc' as const;

/**
 * Customer Repository Implementation
 */
@Injectable()
export class CustomerRepository implements ICustomerRepository {
  private readonly logger = new Logger(CustomerRepository.name);

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

  async findById(id: string): Promise<Customer | null> {
    try {
      const doc = (await this.nano.use('kompass').get(id)) as Customer;
      if (doc.type !== 'customer') {
        this.logger.warn(
          `Document ${id} is not a customer (type: ${String(doc.type)})`
        );
        return null;
      }
      return doc;
    } catch (error: unknown) {
      if (this.isCouchDBError(error) && error.statusCode === 404) {
        return null;
      }
      this.logger.error(`Error finding customer ${id}:`, error);
      throw error;
    }
  }

  async findByOwner(
    ownerId: string,
    options?: CustomerQueryOptions
  ): Promise<Customer[]> {
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
      const selector: CustomerMangoSelector = {
        type: 'customer',
        owner: ownerId,
      };

      // Apply filters
      if (filters?.rating) {
        selector.rating = filters.rating;
      }

      if (filters?.customerType) {
        selector.customerType = filters.customerType;
      }

      if (filters?.vatNumber) {
        selector.vatNumber = filters.vatNumber;
      }

      if (filters?.search) {
        // Case-insensitive partial match on company name
        selector.companyName = {
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

      return result.docs as Customer[];
    } catch (error) {
      this.logger.error(`Error finding customers for owner ${ownerId}:`, error);
      throw error;
    }
  }

  async findAll(options?: CustomerQueryOptions): Promise<Customer[]> {
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
      const selector: CustomerMangoSelector = {
        type: 'customer',
      };

      // Apply filters
      if (filters?.ownerId) {
        selector.owner = filters.ownerId;
      }

      if (filters?.rating) {
        selector.rating = filters.rating;
      }

      if (filters?.customerType) {
        selector.customerType = filters.customerType;
      }

      if (filters?.vatNumber) {
        selector.vatNumber = filters.vatNumber;
      }

      if (filters?.search) {
        // Case-insensitive partial match on company name
        selector.companyName = {
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

      return result.docs as Customer[];
    } catch (error) {
      this.logger.error('Error finding all customers:', error);
      throw error;
    }
  }

  async create(customer: Omit<Customer, '_rev'>): Promise<Customer> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const result = await this.nano.use('kompass').insert(customer);
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...customer,
        _rev: result.rev,
      };
    } catch (error) {
      this.logger.error(`Error creating customer:`, error);
      throw error;
    }
  }

  async update(customer: Customer): Promise<Customer> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const result = await this.nano.use('kompass').insert(customer);
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...customer,
        _rev: result.rev,
      };
    } catch (error) {
      if (this.isCouchDBError(error) && error.statusCode === 409) {
        this.logger.warn(
          `Conflict updating customer ${customer._id}: document was modified`
        );
        throw new Error(
          `Conflict: Customer ${customer._id} was modified by another user`
        );
      }
      this.logger.error(`Error updating customer ${customer._id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const customer = await this.findById(id);
      if (!customer) {
        throw new Error(`Customer ${id} not found`);
      }
      await this.nano.use('kompass').destroy(id, customer._rev);
    } catch (error) {
      this.logger.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  }

  async findByVatNumber(vatNumber: string): Promise<Customer | null> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.nano.use('kompass').find({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        selector: {
          type: 'customer',
          vatNumber: vatNumber,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        limit: 1,
      });

      if (result.docs.length === 0) {
        return null;
      }

      return result.docs[0] as Customer;
    } catch (error) {
      this.logger.error(
        `Error finding customer by VAT number ${vatNumber}:`,
        error
      );
      throw error;
    }
  }

  async findByCompanyName(companyName: string): Promise<Customer[]> {
    try {
      // Case-insensitive partial match for duplicate detection
      // This will return all customers with similar company names
      // The service layer will do fuzzy matching (Levenshtein distance)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await this.nano.use('kompass').find({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        selector: {
          type: 'customer',
          companyName: {
            $regex: `(?i).*${this.escapeRegex(companyName)}.*`,
          },
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        limit: 100, // Reasonable limit for duplicate detection
      });

      return result.docs as Customer[];
    } catch (error) {
      this.logger.error(
        `Error finding customers by company name ${companyName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Count customers matching filters
   *
   * @param ownerId Optional owner ID for ADM role filtering
   * @param filters Optional filters for counting
   * @returns Total count of matching customers
   */
  async count(ownerId?: string, filters?: CustomerFilters): Promise<number> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const selector: CustomerMangoSelector = {
        type: 'customer',
      };

      // Apply owner filter if provided
      if (ownerId) {
        selector.owner = ownerId;
      }

      // Apply filters
      if (filters?.rating) {
        selector.rating = filters.rating;
      }

      if (filters?.customerType) {
        selector.customerType = filters.customerType;
      }

      if (filters?.vatNumber) {
        selector.vatNumber = filters.vatNumber;
      }

      if (filters?.search) {
        // Case-insensitive partial match on company name
        selector.companyName = {
          $regex: `(?i).*${this.escapeRegex(filters.search)}.*`,
        };
      }

      // CouchDB doesn't have a direct count endpoint, so we use _find with a high limit
      // and count the documents returned
      // TODO: Optimize with a proper count index or use CouchDB's _count endpoint if available
      // For now, use a workaround: fetch with a high limit and count
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const countResult = await this.nano.use('kompass').find({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        selector: selector as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        limit: 10000, // High limit to get accurate count (adjust if needed)
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return (countResult.docs as Customer[]).length;
    } catch (error) {
      this.logger.error('Error counting customers:', error);
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
