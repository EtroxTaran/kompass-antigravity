import { useCallback, useEffect, useRef, useState } from 'react';

import {
  fuzzyMatchCompanyName,
  isDuplicateCompanyName,
} from '@kompass/shared/utils/duplicate-detection.utils';
import type { Customer } from '@kompass/shared/types/entities/customer';

import { customerService } from '@/services/customer.service';
import { useDebounce } from '@/hooks/useDebounce';

import type { DuplicateMatch } from '@/types/duplicate-detection.types';

/**
 * useDuplicateDetection Hook
 *
 * Provides duplicate detection functionality for customer forms.
 * - Debounced company name checking (500ms) with fuzzy matching
 * - Immediate VAT number checking (exact match)
 * - Caches results to minimize API calls
 *
 * @param customerId - Optional customer ID to exclude from duplicate checks (for edit mode)
 * @returns Object with duplicate checking functions and state
 *
 * @example
 * ```tsx
 * const { checkCompanyNameDuplicate, checkVatNumberDuplicate, isLoading } = useDuplicateDetection(customerId);
 *
 * useEffect(() => {
 *   if (companyName) {
 *     checkCompanyNameDuplicate(companyName).then(duplicates => {
 *       if (duplicates.length > 0) {
 *         setDuplicateDialogOpen(true);
 *         setDetectedDuplicate(duplicates[0]);
 *       }
 *     });
 *   }
 * }, [companyName, checkCompanyNameDuplicate]);
 * ```
 */
export function useDuplicateDetection(customerId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Cache for company name checks (key: companyName, value: DuplicateMatch[])
  const companyNameCacheRef = useRef<Map<string, DuplicateMatch[]>>(new Map());
  // Cache for VAT number checks (key: vatNumber, value: Customer | null)
  const vatNumberCacheRef = useRef<Map<string, Customer | null>>(new Map());

  /**
   * Check for duplicate customers by company name (fuzzy matching)
   *
   * Uses debounced input (500ms) and applies fuzzy matching with 0.8 threshold.
   * Results are cached to minimize API calls.
   *
   * @param companyName - Company name to check
   * @returns Promise resolving to array of duplicate matches (empty if no duplicates)
   */
  const checkCompanyNameDuplicate = useCallback(
    async (companyName: string): Promise<DuplicateMatch[]> => {
      if (!companyName || companyName.trim().length < 2) {
        return [];
      }

      const normalizedName = companyName.trim().toLowerCase();

      // Check cache first
      if (companyNameCacheRef.current.has(normalizedName)) {
        return companyNameCacheRef.current.get(normalizedName) ?? [];
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch potential matches from API
        const candidates = await customerService.checkDuplicateCompanyName(
          companyName,
          customerId
        );

        // Apply fuzzy matching with 0.8 threshold
        const duplicates: DuplicateMatch[] = [];
        for (const candidate of candidates) {
          const similarity = fuzzyMatchCompanyName(
            companyName,
            candidate.companyName
          );

          if (isDuplicateCompanyName(companyName, candidate.companyName, 0.8)) {
            duplicates.push({
              customer: candidate,
              similarity,
              matchType: 'companyName',
            });
          }
        }

        // Sort by similarity (highest first)
        duplicates.sort((a, b) => b.similarity - a.similarity);

        // Cache result
        companyNameCacheRef.current.set(normalizedName, duplicates);

        return duplicates;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to check duplicates');
        setError(error);
        console.error('Error checking company name duplicates:', error);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [customerId]
  );

  /**
   * Check for duplicate customer by VAT number (exact match)
   *
   * No debouncing needed for exact match. Results are cached.
   *
   * @param vatNumber - VAT number to check
   * @returns Promise resolving to customer if duplicate found, null otherwise
   */
  const checkVatNumberDuplicate = useCallback(
    async (vatNumber: string): Promise<Customer | null> => {
      if (!vatNumber || vatNumber.trim().length === 0) {
        return null;
      }

      const normalizedVat = vatNumber.trim().toUpperCase();

      // Check cache first
      if (vatNumberCacheRef.current.has(normalizedVat)) {
        return vatNumberCacheRef.current.get(normalizedVat) ?? null;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Check for exact match
        const duplicate = await customerService.checkDuplicateVatNumber(
          normalizedVat,
          customerId
        );

        // Cache result
        vatNumberCacheRef.current.set(normalizedVat, duplicate);

        return duplicate;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('Failed to check VAT duplicate');
        setError(error);
        console.error('Error checking VAT number duplicate:', error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [customerId]
  );

  /**
   * Clear all caches
   *
   * Useful when form is reset or customer changes
   */
  const clearCache = useCallback(() => {
    companyNameCacheRef.current.clear();
    vatNumberCacheRef.current.clear();
  }, []);

  return {
    checkCompanyNameDuplicate,
    checkVatNumberDuplicate,
    isLoading,
    error,
    clearCache,
  };
}

/**
 * useDebouncedCompanyNameDuplicate Hook
 *
 * Wrapper around useDuplicateDetection that automatically debounces
 * company name input and checks for duplicates.
 *
 * @param companyName - Company name to check (will be debounced)
 * @param customerId - Optional customer ID to exclude from checks
 * @param debounceDelay - Debounce delay in milliseconds (default: 500)
 * @returns Object with duplicate matches and loading state
 *
 * @example
 * ```tsx
 * const { duplicates, isLoading } = useDebouncedCompanyNameDuplicate(companyName, customerId);
 *
 * useEffect(() => {
 *   if (duplicates.length > 0) {
 *     setDuplicateDialogOpen(true);
 *     setDetectedDuplicate(duplicates[0]);
 *   }
 * }, [duplicates]);
 * ```
 */
export function useDebouncedCompanyNameDuplicate(
  companyName: string,
  customerId?: string,
  debounceDelay: number = 500
) {
  const { checkCompanyNameDuplicate, isLoading, error } =
    useDuplicateDetection(customerId);
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);

  // Debounce company name input
  const debouncedCompanyName = useDebounce(companyName, debounceDelay);

  // Check for duplicates when debounced value changes
  useEffect(() => {
    if (!debouncedCompanyName || debouncedCompanyName.trim().length < 2) {
      setDuplicates([]);
      return;
    }

    checkCompanyNameDuplicate(debouncedCompanyName)
      .then(setDuplicates)
      .catch((err) => {
        console.error('Error checking duplicates:', err);
        setDuplicates([]);
      });
  }, [debouncedCompanyName, checkCompanyNameDuplicate]);

  return {
    duplicates,
    isLoading,
    error,
  };
}
