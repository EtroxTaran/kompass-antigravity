import { useState, useCallback, useEffect } from "react";
import { locationsApi } from "@/services/apiClient";
import { Location } from "@kompass/shared";

export function useLocation(id?: string) {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLocation = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      const result = await locationsApi.get(id);
      setLocation(result as unknown as Location);
      setError(null);
    } catch (err) {
      console.error("Error fetching location", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const saveLocation = async (data: Partial<Location>) => {
    setLoading(true);
    try {
      if (id && location) {
        await locationsApi.update(id, data);
      } else {
        await locationsApi.create(data);
      }
      // Optimize by updating local state or refetching
      // For now, simpler to not return anything and let caller refetch if needed, or update local state
      if (id && location) {
        setLocation({ ...location, ...data } as Location);
      }
    } catch (err) {
      console.error("Error saving location", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { location, loading, error, saveLocation };
}

export function useLocations(customerId?: string) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLocations = useCallback(async () => {
    try {
      const result = await locationsApi.list(customerId ? { customerId } : undefined);
      if (result && Array.isArray(result.data)) {
        setLocations(result.data as unknown as Location[]);
      } else if (Array.isArray(result)) {
        setLocations(result as unknown as Location[]);
      } else {
        setLocations([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching locations", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return { locations, loading, error, refresh: fetchLocations };
}
