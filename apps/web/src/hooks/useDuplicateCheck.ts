import { useState, useCallback } from "react";
import { customersApi } from "../services/apiClient";

// Simple debounce implementation if useDebounce is not available
// function useDebounce<T>(value: T, delay: number): T {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);
//   return debouncedValue;
// }

export interface DuplicateResult {
  id: string;
  companyName: string;
  matchReason: string;
  score: number;
}

export function useDuplicateCheck() {
  const [duplicates, setDuplicates] = useState<DuplicateResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  // We'll use a manual trigger or effect based approach in the form
  const checkDuplicates = useCallback(
    async (criteria: {
      name?: string;
      email?: string;
      phone?: string;
      excludeId?: string;
    }) => {
      // Don't check empty criteria
      if (!criteria.name && !criteria.email && !criteria.phone) {
        setDuplicates([]);
        return;
      }

      setIsChecking(true);
      try {
        const results = await customersApi.checkDuplicates(criteria);
        setDuplicates(results);
      } catch (error) {
        console.error("Failed to check duplicates", error);
        // Fail silently or handle error? For UX, silent is better here
      } finally {
        setIsChecking(false);
      }
    },
    [],
  );

  return {
    duplicates,
    isChecking,
    checkDuplicates,
  };
}
