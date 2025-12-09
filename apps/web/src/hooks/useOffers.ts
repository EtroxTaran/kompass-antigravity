import { useState, useEffect, useCallback } from "react";
import { offersApi } from "@/services/apiClient";
import { Offer } from "@kompass/shared";

export function useOffer(id?: string) {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchOffer = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await offersApi.get(id);
      setOffer(result as unknown as Offer);
      setError(null);
    } catch (err) {
      console.error("Error fetching offer", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOffer();
  }, [fetchOffer]);

  const saveOffer = async (data: Partial<Offer>) => {
    setLoading(true);
    try {
      let result;
      if (id && offer) {
        result = await offersApi.update(id, data);
      } else {
        result = await offersApi.create(data);
      }
      setOffer(result as unknown as Offer);
      return result;
    } catch (err) {
      console.error("Error saving offer", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    status: Offer["status"],
    rejectionReason?: string,
  ) => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await offersApi.updateStatus(id, status, rejectionReason);
      setOffer(result as unknown as Offer);
    } catch (err) {
      console.error("Error updating status", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    offer,
    loading,
    error,
    saveOffer,
    updateStatus,
    refetch: fetchOffer,
  };
}

export function useOffers(params?: {
  customerId?: string;
  projectId?: string;
}) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await offersApi.list(params);
      if (result && Array.isArray(result.data)) {
        setOffers(result.data as unknown as Offer[]);
      } else {
        setOffers([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching offers", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return { offers, loading, error, refetch: fetchOffers };
}
