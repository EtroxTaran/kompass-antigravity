import { useState, useEffect, useCallback } from "react";
import { suppliersApi } from "@/services/apiClient";
import { Supplier } from "@kompass/shared";

export function useSupplier(id?: string) {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchSupplier = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await suppliersApi.get(id);
      setSupplier(result as unknown as Supplier);
      setError(null);
    } catch (err) {
      console.error("Error fetching supplier", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSupplier();
  }, [fetchSupplier]);

  const saveSupplier = async (data: Partial<Supplier>) => {
    setLoading(true);
    try {
      let result;
      if (id && supplier) {
        // Update
        result = await suppliersApi.update(id, data);
      } else {
        // Create
        result = await suppliersApi.create(data);
      }
      setSupplier(result as unknown as Supplier);
      return result;
    } catch (err) {
      console.error("Error saving supplier", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const blacklistSupplier = async (reason: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await suppliersApi.blacklist(id, reason);
      setSupplier(result as unknown as Supplier);
      return result;
    } catch (err) {
      console.error("Error blacklisting supplier", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reinstateSupplier = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await suppliersApi.reinstate(id);
      setSupplier(result as unknown as Supplier);
      return result;
    } catch (err) {
      console.error("Error reinstating supplier", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    supplier,
    loading,
    error,
    saveSupplier,
    blacklistSupplier,
    reinstateSupplier,
    refetch: fetchSupplier,
  };
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const result = await suppliersApi.list();
        if (result && Array.isArray(result.data)) {
          setSuppliers(result.data as unknown as Supplier[]);
        } else if (Array.isArray(result)) {
          setSuppliers(result as unknown as Supplier[]);
        } else {
          setSuppliers([]);
        }
      } catch (err) {
        console.error("Error fetching suppliers", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  return { suppliers, loading, error };
}
