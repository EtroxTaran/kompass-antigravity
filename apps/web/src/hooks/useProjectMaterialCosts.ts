import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface MaterialCosts {
  estimated: number;
  actual: number;
  variance: number;
  percentUsed: number;
  itemCount: number;
  deliveredCount: number;
}

/**
 * Hook to fetch project material costs summary
 */
export function useProjectMaterialCosts(projectId: string | undefined) {
  const [costs, setCosts] = useState<MaterialCosts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCosts = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${API_BASE_URL}/api/v1/projects/${projectId}/materials/costs`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setCosts(data);
    } catch (err) {
      console.error("Failed to fetch material costs", err);
      setError("Fehler beim Laden der Materialkosten");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchCosts();
  }, [fetchCosts]);

  return {
    costs,
    loading,
    error,
    refetch: fetchCosts,
  };
}
