/**
 * Pagination Utilities
 *
 * Shared utilities for pagination and sorting across backend and frontend
 */

/**
 * Pagination options for queries
 */
export interface PaginationOptions {
  /** Page number (1-based) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Skip value (calculated: (page - 1) * pageSize) */
  skip?: number;
  /** Limit value (same as pageSize) */
  limit?: number;
}

/**
 * Sort options for queries
 */
export interface SortOptions {
  /** Column name to sort by */
  sortBy: string;
  /** Sort direction */
  sortOrder: 'asc' | 'desc';
}

/**
 * Calculate pagination metadata
 *
 * @param total - Total number of items
 * @param page - Current page number (1-based)
 * @param pageSize - Number of items per page
 * @returns Pagination metadata
 */
export function calculatePaginationMetadata(
  total: number,
  page: number,
  pageSize: number
): {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} {
  const totalPages = Math.ceil(total / pageSize);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Normalize pagination options
 *
 * Validates and normalizes pagination parameters with defaults
 *
 * @param page - Page number (default: 1)
 * @param pageSize - Items per page (default: 20, max: 100)
 * @returns Normalized pagination options
 */
export function normalizePaginationOptions(
  page?: number,
  pageSize?: number
): PaginationOptions {
  const normalizedPage = Math.max(1, page ?? 1);
  const normalizedPageSize = Math.min(100, Math.max(1, pageSize ?? 20));

  return {
    page: normalizedPage,
    pageSize: normalizedPageSize,
    skip: (normalizedPage - 1) * normalizedPageSize,
    limit: normalizedPageSize,
  };
}

/**
 * Validate sort options
 *
 * Validates that sortBy is in the allowed list of fields
 *
 * @param sortBy - Column name to sort by
 * @param allowedFields - Array of allowed field names
 * @returns Whether the sort field is valid
 */
export function validateSortField(
  sortBy: string,
  allowedFields: readonly string[]
): boolean {
  return allowedFields.includes(sortBy);
}

/**
 * Normalize sort options
 *
 * Validates and normalizes sort parameters with defaults
 *
 * @param sortBy - Column name to sort by
 * @param sortOrder - Sort direction
 * @param allowedFields - Array of allowed field names
 * @param defaultSortBy - Default sort field if sortBy is invalid
 * @param defaultSortOrder - Default sort order
 * @returns Normalized sort options or null if invalid
 */
export function normalizeSortOptions(
  sortBy: string | undefined,
  sortOrder: 'asc' | 'desc' | undefined,
  allowedFields: readonly string[],
  defaultSortBy: string,
  defaultSortOrder: 'asc' | 'desc' = 'asc'
): SortOptions {
  const normalizedSortBy =
    sortBy && validateSortField(sortBy, allowedFields) ? sortBy : defaultSortBy;

  const normalizedSortOrder =
    sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : defaultSortOrder;

  return {
    sortBy: normalizedSortBy,
    sortOrder: normalizedSortOrder,
  };
}
