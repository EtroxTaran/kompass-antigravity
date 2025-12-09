import { useState, useEffect, useCallback } from "react";
import { opportunitiesApi } from "@/services/apiClient";
import { Opportunity } from "@kompass/shared";

export function useOpportunities(params?: { customerId?: string }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const result = await opportunitiesApi.list(params);
      if (result && Array.isArray(result.data)) {
        setOpportunities(result.data as unknown as Opportunity[]);
      } else {
        setOpportunities([]);
      }
    } catch (err) {
      console.error("Error fetching opportunities", err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  return { opportunities, loading, refetch: fetchOpportunities };
}

export function useOpportunity(id?: string) {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchOpportunity = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await opportunitiesApi.get(id);
      setOpportunity(result as unknown as Opportunity);
      setError(null);
    } catch (err) {
      console.error("Error fetching opportunity", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOpportunity();
  }, [fetchOpportunity]);

  const saveOpportunity = async (data: Partial<Opportunity>) => {
    setLoading(true);
    try {
      let result;
      if (id && opportunity) {
        result = await opportunitiesApi.update(id, data);
      } else {
        result = await opportunitiesApi.create(data);
      }
      setOpportunity(result as unknown as Opportunity);
      return result;
    } catch (err) {
      console.error("Error saving opportunity", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    opportunity,
    loading,
    error,
    saveOpportunity,
    refetch: fetchOpportunity,
  };
}
