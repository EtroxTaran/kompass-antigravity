import type { Customer } from '@kompass/shared/types/entities/customer';

/**
 * Duplicate match result
 *
 * Represents a potential duplicate customer with similarity information
 */
export interface DuplicateMatch {
  /** The customer that matches */
  customer: Customer;
  /** Similarity score (0-1, where 1 = exact match) */
  similarity: number;
  /** Type of match (companyName for fuzzy match, vat for exact match) */
  matchType: 'companyName' | 'vat';
}
