import { useState, useEffect, useCallback } from "react";
import { projectCostsApi } from "@/services/apiClient";
import { ProjectCost } from "@kompass/shared";

export function useProjectCost(id?: string) {
  const [cost, setCost] = useState<ProjectCost | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchCost = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await projectCostsApi.get(id);
      setCost(result as unknown as ProjectCost);
      setError(null);
    } catch (err) {
      console.error("Error fetching project cost", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCost();
  }, [fetchCost]);

  const saveCost = async (data: Partial<ProjectCost>) => {
    setLoading(true);
    try {
      let result;
      if (id && cost) {
        result = await projectCostsApi.update(id, data);
      } else {
        result = await projectCostsApi.create(data);
      }
      setCost(result as unknown as ProjectCost);
      return result;
    } catch (err) {
      console.error("Error saving project cost", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { cost, loading, error, saveCost, refetch: fetchCost };
}

export function useProjectCosts(params?: { projectId?: string }) {
  const [costs, setCosts] = useState<ProjectCost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCosts = useCallback(async () => {
    try {
      const result = await projectCostsApi.list(params);
      if (result && Array.isArray(result.data)) {
        setCosts(result.data as unknown as ProjectCost[]);
      } else {
        setCosts([]);
      }
    } catch (err) {
      console.error("Error fetching project costs", err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchCosts();
  }, [fetchCosts]);

  return { costs, loading, refetch: fetchCosts };
}
