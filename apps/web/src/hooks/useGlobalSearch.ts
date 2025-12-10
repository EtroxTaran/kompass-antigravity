import { useState, useCallback, useRef } from "react";
import { searchApi, SearchHit, GlobalSearchResult } from "@/services/apiClient";

export interface SearchResult extends SearchHit {
  type:
    | "customer"
    | "project"
    | "opportunity"
    | "supplier"
    | "material"
    | "unknown";
}

export function useGlobalSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);

  const search = useCallback(async (query: string) => {
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Don't search for empty or short queries
    if (!query || query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Debounce search by 300ms
    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const response: GlobalSearchResult = await searchApi.globalSearch(
          query,
          20,
        );

        // Transform grouped results into flat array with type annotation
        const flatResults: SearchResult[] = [
          ...response.results.customers.map((hit) => ({
            ...hit,
            type: "customer" as const,
          })),
          ...response.results.projects.map((hit) => ({
            ...hit,
            type: "project" as const,
          })),
          ...response.results.opportunities.map((hit) => ({
            ...hit,
            type: "opportunity" as const,
          })),
          ...response.results.suppliers.map((hit) => ({
            ...hit,
            type: "supplier" as const,
          })),
          ...response.results.materials.map((hit) => ({
            ...hit,
            type: "material" as const,
          })),
        ];

        setResults(flatResults);
      } catch (err) {
        console.error("Search failed", err);
        setError("Suche fehlgeschlagen");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clearResults };
}
