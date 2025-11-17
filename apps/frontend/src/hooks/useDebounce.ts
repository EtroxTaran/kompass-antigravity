import { useEffect, useState } from 'react';

/**
 * useDebounce Hook
 *
 * Debounces a value, updating the debounced value only after the specified delay.
 * Useful for search inputs to avoid excessive API calls.
 *
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Debounced value
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     performSearch(debouncedSearch);
 *   }
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
