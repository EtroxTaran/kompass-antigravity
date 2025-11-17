/**
 * Table Utility Functions
 *
 * Client-side utilities for sorting, pagination, and data manipulation
 * Used by list views until backend pagination/sorting is implemented
 */

/**
 * Sort direction type
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort data by a column key
 *
 * @param data - Array of data to sort
 * @param column - Column key to sort by
 * @param direction - Sort direction ('asc' or 'desc')
 * @returns Sorted array
 */
export function sortData<T>(
  data: T[],
  column: keyof T,
  direction: SortDirection
): T[] {
  return [...data].sort((a, b) => {
    const aValue = a[column];
    const bValue = b[column];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return direction === 'asc' ? -1 : 1;
    if (bValue == null) return direction === 'asc' ? 1 : -1;

    // Handle different types
    // Handle nested objects (e.g., billingAddress.city)
    if (
      typeof aValue === 'object' &&
      aValue !== null &&
      !(aValue instanceof Date)
    ) {
      // Try to access common nested properties
      const aNested =
        (aValue as { city?: string; name?: string }).city ||
        (aValue as { city?: string; name?: string }).name ||
        String(aValue);
      const bNested =
        (bValue as { city?: string; name?: string }).city ||
        (bValue as { city?: string; name?: string }).name ||
        String(bValue);
      const comparison = String(aNested).localeCompare(String(bNested), 'de', {
        sensitivity: 'base',
        numeric: true,
      });
      return direction === 'asc' ? comparison : -comparison;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue, 'de', {
        sensitivity: 'base',
        numeric: true,
      });
      return direction === 'asc' ? comparison : -comparison;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return direction === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    // Fallback: convert to string and compare
    const aStr = String(aValue);
    const bStr = String(bValue);
    const comparison = aStr.localeCompare(bStr, 'de', {
      sensitivity: 'base',
      numeric: true,
    });
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Paginate data array
 *
 * @param data - Array of data to paginate
 * @param page - Current page (1-based)
 * @param pageSize - Number of items per page
 * @returns Paginated array
 */
export function paginateData<T>(
  data: T[],
  page: number,
  pageSize: number
): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return data.slice(startIndex, endIndex);
}

/**
 * Get pagination information
 *
 * @param total - Total number of items
 * @param page - Current page (1-based)
 * @param pageSize - Number of items per page
 * @returns Pagination info object
 */
export function getPaginationInfo(
  total: number,
  page: number,
  pageSize: number
): {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} {
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  return {
    total,
    page,
    pageSize,
    totalPages,
    startIndex: startIndex + 1, // 1-based for display
    endIndex,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
