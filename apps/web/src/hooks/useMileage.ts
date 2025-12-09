import { useState, useEffect, useCallback } from "react";
import { mileageApi } from "@/services/apiClient";
import { Mileage } from "@kompass/shared";

export function useMileage(id?: string) {
  const [mileage, setMileage] = useState<Mileage | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchMileage = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await mileageApi.get(id);
      setMileage(result as unknown as Mileage);
      setError(null);
    } catch (err) {
      console.error("Error fetching mileage", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMileage();
  }, [fetchMileage]);

  const saveMileage = async (data: Partial<Mileage>) => {
    setLoading(true);
    try {
      let result;
      if (id && mileage) {
        result = await mileageApi.update(id, data);
      } else {
        result = await mileageApi.create(data);
      }
      setMileage(result as unknown as Mileage);
      return result;
    } catch (err) {
      console.error("Error saving mileage", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mileage, loading, error, saveMileage, refetch: fetchMileage };
}

export function useMileages() {
  const [mileages, setMileages] = useState<Mileage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMileages = useCallback(async () => {
    try {
      const result = await mileageApi.list();
      if (result && Array.isArray(result.data)) {
        setMileages(result.data as unknown as Mileage[]);
      } else {
        setMileages([]);
      }
    } catch (err) {
      console.error("Error fetching mileages", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMileages();
  }, [fetchMileages]);

  return { mileages, loading, refetch: fetchMileages };
}
