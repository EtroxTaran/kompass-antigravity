import { useState, useEffect, useCallback } from "react";
import { protocolsApi } from "@/services/apiClient";
import { Protocol } from "@kompass/shared";

export function useProtocol(id?: string) {
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchProtocol = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await protocolsApi.get(id);
      setProtocol(result as unknown as Protocol);
      setError(null);
    } catch (err) {
      console.error("Error fetching protocol", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProtocol();
  }, [fetchProtocol]);

  const saveProtocol = async (data: Partial<Protocol>) => {
    setLoading(true);
    try {
      let result;
      if (id && protocol) {
        result = await protocolsApi.update(id, data);
      } else {
        result = await protocolsApi.create(data);
      }
      setProtocol(result as unknown as Protocol);
      return result;
    } catch (err) {
      console.error("Error saving protocol", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { protocol, loading, error, saveProtocol, refetch: fetchProtocol };
}

export function useProtocols(params?: {
  customerId?: string;
  projectId?: string;
}) {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProtocols = useCallback(async () => {
    try {
      const result = await protocolsApi.list(params);
      if (result && Array.isArray(result.data)) {
        setProtocols(result.data as unknown as Protocol[]);
      } else {
        setProtocols([]);
      }
    } catch (err) {
      console.error("Error fetching protocols", err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);

  return { protocols, loading, refetch: fetchProtocols };
}
