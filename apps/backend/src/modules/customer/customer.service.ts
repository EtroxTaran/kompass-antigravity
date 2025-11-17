/**
 * Customer Service
 *
 * Business logic for Customer management
 *
 * Responsibilities:
 * - Validate customer data and business rules
 * - Check RBAC permissions (record-level and field-level)
 * - Detect duplicate customers (fuzzy matching)
 * - Filter fields based on user role
 * - Orchestrate repository calls
 * - Log audit trail
 *
 * Business Rules:
 * - CR-001: Default delivery location must be in locations array
 * - Duplicate detection: Check companyName (fuzzy) and VAT number (exact)
 * - ADM can only access own customers (owner === user.id)
 * - PLAN/GF can access all customers
 * - Financial fields (creditLimit, accountBalance, etc.) hidden from ADM
 */

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  UserRole,
  EntityType,
  Permission,
  canAccessRecord,
  hasPermission,
} from '@kompass/shared/constants/rbac.constants';
import { type PaginatedResponse } from '@kompass/shared/types/dtos/paginated-response.dto';
import {
  createCustomer,
  validateCustomer,
  type Customer,
} from '@kompass/shared/types/entities/customer';
import {
  calculatePaginationMetadata,
  normalizePaginationOptions,
  normalizeSortOptions,
} from '@kompass/shared/utils/pagination.utils';

import { ICustomerRepository } from './customer.repository.interface';
import { CustomerResponseDto } from './dto/customer-response.dto';

import type {
  CustomerFilters,
  CustomerQueryOptions,
} from './customer.repository.interface';
import type { CreateCustomerDto } from './dto/create-customer.dto';
import type { UpdateCustomerDto } from './dto/update-customer.dto';
import type { User } from '@kompass/shared/types/entities/user';

/**
 * Audit Service Interface (placeholder - will be implemented later)
 */
interface AuditLogEntry {
  entityType: string;
  entityId: string;
  action: string;
  oldValue: Record<string, unknown>;
  newValue: Record<string, unknown>;
  userId: string;
  timestamp: Date;
}

interface IAuditService {
  log(entry: AuditLogEntry): Promise<void>;
}

/**
 * Duplicate match result
 */
interface DuplicateMatch {
  customer: Customer;
  similarity: number; // 0-1, where 1 is exact match
  matchType: 'vat' | 'companyName';
}

/**
 * Customer Service
 */
@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    @Inject('IAuditService')
    private readonly auditService: IAuditService | null
  ) {}

  /**
   * Create a new customer
   *
   * RBAC: ADM can create (owner set to current user), PLAN/GF can create
   * Business rules: Validation, duplicate detection
   */
  async create(
    dto: CreateCustomerDto,
    user: User
  ): Promise<CustomerResponseDto> {
    // Check entity-level permission
    if (
      !hasPermission(user.primaryRole, EntityType.Customer, Permission.CREATE)
    ) {
      throw new ForbiddenException(
        'You do not have permission to create customers'
      );
    }

    // Set owner: ADM users own their customers, PLAN/GF can set owner
    const ownerId =
      user.primaryRole === UserRole.ADM
        ? user._id
        : (dto as CreateCustomerDto & { owner?: string }).owner || user._id;

    // Check for duplicates
    await this.checkDuplicates(dto.companyName, dto.vatNumber);

    // Create customer entity using helper
    // Map DTO to entity format (ensure country is set)
    const billingAddress = {
      ...dto.billingAddress,
      country: dto.billingAddress.country || 'Deutschland',
    };

    const customerData = {
      companyName: dto.companyName,
      vatNumber: dto.vatNumber,
      billingAddress,
      locations: [],
      contactPersons: [],
      phone: dto.phone,
      email: dto.email,
      website: dto.website,
      creditLimit: dto.creditLimit,
      paymentTerms: dto.paymentTerms,
      rating: dto.rating,
      customerType: dto.customerType as Customer['customerType'],
      industry: dto.industry,
      tags: dto.tags,
      notes: dto.notes,
      owner: ownerId,
    };

    const customer = createCustomer(customerData, user._id);

    // Validate customer
    const validationErrors = validateCustomer(customer);
    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors as Array<{ field: string; message: string }>,
      });
    }

    // Create in repository
    const created = await this.customerRepository.create(customer);

    // Log audit trail (if audit service available)
    if (this.auditService) {
      await this.auditService.log({
        entityType: 'Customer',
        entityId: created._id,
        action: 'CREATE',
        oldValue: {},
        newValue: {
          companyName: created.companyName,
          owner: created.owner,
        },
        userId: user._id,
        timestamp: new Date(),
      });
    }

    this.logger.log('Customer created', {
      customerId: created._id,
      companyName: created.companyName,
      owner: created.owner,
      userId: user._id,
    });

    // Map to response DTO (with field filtering)
    return this.mapToResponseDto(created, user);
  }

  /**
   * Find all customers (with RBAC filtering, pagination, and sorting)
   *
   * RBAC: ADM sees own customers, PLAN/GF see all
   *
   * @param user Current user (for RBAC checks)
   * @param filters Optional filters
   * @param page Optional page number (1-based, default: 1)
   * @param pageSize Optional page size (default: 20, max: 100)
   * @param sortBy Optional sort field (default: 'companyName')
   * @param sortOrder Optional sort order (default: 'asc')
   * @returns Paginated response with customers and pagination metadata
   */
  async findAll(
    user: User,
    filters?: CustomerFilters,
    page?: number,
    pageSize?: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<PaginatedResponse<CustomerResponseDto>> {
    // Check entity-level permission
    if (
      !hasPermission(user.primaryRole, EntityType.Customer, Permission.READ)
    ) {
      throw new ForbiddenException(
        'You do not have permission to view customers'
      );
    }

    // Normalize pagination options
    const pagination = normalizePaginationOptions(page, pageSize);

    // Normalize sort options
    const allowedSortFields = [
      'companyName',
      'createdAt',
      'modifiedAt',
      'rating',
      'customerType',
    ] as const;
    const sort = normalizeSortOptions(
      sortBy,
      sortOrder,
      allowedSortFields,
      'companyName',
      'asc'
    );

    // Build query options
    const queryOptions: CustomerQueryOptions = {
      filters,
      pagination,
      sort,
    };

    // Get customers and total count
    let customers: Customer[];
    let total: number;

    // Record-level filtering: ADM only sees own customers
    if (user.primaryRole === UserRole.ADM) {
      customers = await this.customerRepository.findByOwner(
        user._id,
        queryOptions
      );
      total = await this.customerRepository.count(user._id, filters);
    } else {
      // PLAN/GF see all customers
      customers = await this.customerRepository.findAll(queryOptions);
      total = await this.customerRepository.count(undefined, filters);
    }

    // Map to response DTOs (with field filtering)
    const data = customers.map((customer) =>
      this.mapToResponseDto(customer, user)
    );

    // Calculate pagination metadata
    const paginationMetadata = calculatePaginationMetadata(
      total,
      pagination.page,
      pagination.pageSize
    );

    return {
      data,
      pagination: paginationMetadata,
    };
  }

  /**
   * Find customer by ID (with RBAC check)
   *
   * RBAC: ADM can only access own customers, PLAN/GF can access all
   */
  async findById(id: string, user: User): Promise<CustomerResponseDto> {
    // Check entity-level permission
    if (
      !hasPermission(user.primaryRole, EntityType.Customer, Permission.READ)
    ) {
      throw new ForbiddenException(
        'You do not have permission to view customers'
      );
    }

    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundException(`Customer ${id} not found`);
    }

    // Record-level permission check
    if (
      !canAccessRecord(
        user.primaryRole,
        EntityType.Customer,
        customer,
        user._id
      )
    ) {
      throw new ForbiddenException(
        'You do not have permission to view this customer'
      );
    }

    // Map to response DTO (with field filtering)
    return this.mapToResponseDto(customer, user);
  }

  /**
   * Update customer (with RBAC check and validation)
   *
   * RBAC: ADM can only update own customers, PLAN/GF can update all
   */
  async update(
    id: string,
    dto: UpdateCustomerDto,
    user: User
  ): Promise<CustomerResponseDto> {
    // Check entity-level permission
    if (
      !hasPermission(user.primaryRole, EntityType.Customer, Permission.UPDATE)
    ) {
      throw new ForbiddenException(
        'You do not have permission to update customers'
      );
    }

    const existing = await this.customerRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Customer ${id} not found`);
    }

    // Record-level permission check
    if (
      !canAccessRecord(
        user.primaryRole,
        EntityType.Customer,
        existing,
        user._id
      )
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this customer'
      );
    }

    // Check for duplicates if company name or VAT number changed
    if (dto.companyName || dto.vatNumber) {
      await this.checkDuplicates(
        dto.companyName || existing.companyName,
        dto.vatNumber || existing.vatNumber,
        id // Exclude current customer from duplicate check
      );
    }

    // Prepare updates - map DTO to entity format
    const updates: Partial<Customer> = {
      ...(dto.companyName && { companyName: dto.companyName }),
      ...(dto.vatNumber !== undefined && { vatNumber: dto.vatNumber }),
      ...(dto.billingAddress && {
        billingAddress: {
          ...dto.billingAddress,
          country: dto.billingAddress.country || 'Deutschland',
        },
      }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.website !== undefined && { website: dto.website }),
      ...(dto.creditLimit !== undefined && { creditLimit: dto.creditLimit }),
      ...(dto.paymentTerms !== undefined && { paymentTerms: dto.paymentTerms }),
      ...(dto.rating !== undefined && { rating: dto.rating }),
      ...(dto.customerType && {
        customerType: dto.customerType as Customer['customerType'],
      }),
      ...(dto.industry !== undefined && { industry: dto.industry }),
      ...(dto.tags !== undefined && { tags: dto.tags }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      modifiedBy: user._id,
      modifiedAt: new Date(),
      version: existing.version + 1,
      _rev: dto._rev || existing._rev,
    };

    // Merge with existing customer
    const updatedCustomer: Customer = {
      ...existing,
      ...updates,
    };

    // Validate updated customer
    const validationErrors = validateCustomer(updatedCustomer);
    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors as Array<{ field: string; message: string }>,
      });
    }

    // Update in repository
    const updated = await this.customerRepository.update(updatedCustomer);

    // Log audit trail (if audit service available)
    if (this.auditService) {
      await this.auditService.log({
        entityType: 'Customer',
        entityId: updated._id,
        action: 'UPDATE',
        oldValue: {
          companyName: existing.companyName,
          vatNumber: existing.vatNumber,
        },
        newValue: {
          companyName: updated.companyName,
          vatNumber: updated.vatNumber,
        },
        userId: user._id,
        timestamp: new Date(),
      });
    }

    this.logger.log('Customer updated', {
      customerId: updated._id,
      userId: user._id,
    });

    // Map to response DTO (with field filtering)
    return this.mapToResponseDto(updated, user);
  }

  /**
   * Delete customer (with RBAC check)
   *
   * RBAC: Only GF can delete customers
   */
  async delete(id: string, user: User): Promise<void> {
    // Check entity-level permission
    if (
      !hasPermission(user.primaryRole, EntityType.Customer, Permission.DELETE)
    ) {
      throw new ForbiddenException(
        'You do not have permission to delete customers'
      );
    }

    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundException(`Customer ${id} not found`);
    }

    // Record-level permission check
    if (
      !canAccessRecord(
        user.primaryRole,
        EntityType.Customer,
        customer,
        user._id
      )
    ) {
      throw new ForbiddenException(
        'You do not have permission to delete this customer'
      );
    }

    // Delete from repository
    await this.customerRepository.delete(id);

    // Log audit trail (if audit service available)
    if (this.auditService) {
      await this.auditService.log({
        entityType: 'Customer',
        entityId: id,
        action: 'DELETE',
        oldValue: {
          companyName: customer.companyName,
        },
        newValue: {},
        userId: user._id,
        timestamp: new Date(),
      });
    }

    this.logger.log('Customer deleted', {
      customerId: id,
      userId: user._id,
    });
  }

  /**
   * Check for duplicate customers
   *
   * - VAT number: Exact match
   * - Company name: Fuzzy matching (Levenshtein distance)
   */
  private async checkDuplicates(
    companyName: string,
    vatNumber?: string,
    excludeId?: string
  ): Promise<void> {
    const duplicates: DuplicateMatch[] = [];

    // Check VAT number (exact match)
    if (vatNumber) {
      const existingByVat =
        await this.customerRepository.findByVatNumber(vatNumber);
      if (existingByVat && (!excludeId || existingByVat._id !== excludeId)) {
        duplicates.push({
          customer: existingByVat,
          similarity: 1.0,
          matchType: 'vat',
        });
      }
    }

    // Check company name (fuzzy matching)
    const candidates =
      await this.customerRepository.findByCompanyName(companyName);
    for (const candidate of candidates) {
      if (excludeId && candidate._id === excludeId) {
        continue;
      }

      const similarity = this.calculateSimilarity(
        companyName.toLowerCase(),
        candidate.companyName.toLowerCase()
      );

      // Threshold: 0.8 (80% similarity) for duplicate detection
      if (similarity >= 0.8) {
        duplicates.push({
          customer: candidate,
          similarity,
          matchType: 'companyName',
        });
      }
    }

    // If duplicates found, throw ConflictException
    if (duplicates.length > 0) {
      const duplicateInfo = duplicates
        .map(
          (d) =>
            `${d.customer.companyName} (${d.matchType}, ${Math.round(d.similarity * 100)}% match)`
        )
        .join(', ');

      throw new ConflictException(
        `Potential duplicate customer detected: ${duplicateInfo}. Please review before creating.`
      );
    }
  }

  /**
   * Calculate similarity between two strings using Levenshtein distance
   * Returns a value between 0 and 1 (1 = exact match)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) {
      return 1.0;
    }

    const distance = this.levenshteinDistance(str1, str2);
    return 1 - distance / maxLength;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      const firstRow = matrix[0];
      if (firstRow) {
        firstRow[j] = j;
      }
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        const prevRow = matrix[i - 1];
        const currRow = matrix[i];
        if (!prevRow || !currRow) {
          continue;
        }
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          currRow[j] = prevRow[j - 1] ?? 0;
        } else {
          const prevPrev = prevRow[j - 1] ?? 0;
          const prevCurr = prevRow[j] ?? 0;
          const currPrev = currRow[j - 1] ?? 0;
          currRow[j] = Math.min(
            prevPrev + 1, // substitution
            currPrev + 1, // insertion
            prevCurr + 1 // deletion
          );
        }
      }
    }

    const lastRow = matrix[str2.length];
    return lastRow?.[str1.length] ?? 0;
  }

  /**
   * Map Customer entity to CustomerResponseDto
   * Filters fields based on user role (RBAC)
   */
  private mapToResponseDto(
    customer: Customer,
    user: User
  ): CustomerResponseDto {
    const dto = new CustomerResponseDto();

    // Basic fields (all roles can see)
    dto.id = customer._id;
    dto.companyName = customer.companyName;
    dto.vatNumber = customer.vatNumber;
    dto.billingAddress = customer.billingAddress;
    dto.locations = customer.locations || [];
    dto.defaultDeliveryLocationId = customer.defaultDeliveryLocationId;
    dto.phone = customer.phone;
    dto.email = customer.email;
    dto.website = customer.website;
    dto.contactPersons = customer.contactPersons || [];
    dto.rating = customer.rating;
    dto.customerType = customer.customerType;
    dto.customerBusinessType = customer.customerBusinessType;
    dto.industry = customer.industry;
    dto.tags = customer.tags;
    dto.notes = customer.notes;
    dto.owner = customer.owner;
    dto.createdAt = customer.createdAt;
    dto.modifiedAt = customer.modifiedAt;
    dto.createdBy = customer.createdBy;
    dto.modifiedBy = customer.modifiedBy;

    // Financial fields: Only BUCH and GF can see
    if (
      user.primaryRole === UserRole.BUCH ||
      user.primaryRole === UserRole.GF
    ) {
      dto.creditLimit = customer.creditLimit;
      dto.paymentTerms = customer.paymentTerms;
    }

    // Offline sync status
    dto.hasPendingSync = customer._queuedForSync === true;
    dto.hasConflicts = (customer._conflicts?.length ?? 0) > 0;

    return dto;
  }
}
