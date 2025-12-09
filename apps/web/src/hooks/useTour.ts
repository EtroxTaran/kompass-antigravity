import { useState, useEffect, useCallback } from "react";
import { toursApi } from "@/services/apiClient";
import { Tour } from "@kompass/shared";

export function useTour(id?: string) {
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchTour = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await toursApi.get(id);
      setTour(result as unknown as Tour);
      setError(null);
    } catch (err) {
      console.error("Error fetching tour", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTour();
  }, [fetchTour]);

  const saveTour = async (data: Partial<Tour>) => {
    setLoading(true);
    try {
      let result;
      if (id && tour) {
        result = await toursApi.update(id, data);
      } else {
        result = await toursApi.create(data);
      }
      setTour(result as unknown as Tour);
      return result;
    } catch (err) {
      console.error("Error saving tour", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { tour, loading, error, saveTour, refetch: fetchTour };
}

export function useTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTours = useCallback(async () => {
    try {
      const result = await toursApi.list();
      if (result && Array.isArray(result.data)) {
        setTours(result.data as unknown as Tour[]);
      } else {
        setTours([]);
      }
    } catch (err) {
      console.error("Error fetching tours", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  return { tours, loading, refetch: fetchTours };
}
