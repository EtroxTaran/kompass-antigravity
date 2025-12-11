import { useState, useEffect, useCallback } from "react";
import { dashboardApi, GFMetrics } from "@/services/apiClient";

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<GFMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getGFMetrics();
      setMetrics(data);
    } catch (err) {
      console.error("Error fetching dashboard metrics", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const refresh = useCallback(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refresh };
}
