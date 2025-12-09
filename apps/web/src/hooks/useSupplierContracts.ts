import { useState, useEffect, useCallback } from "react";
import { supplierContractsApi } from "@/services/apiClient";
import { SupplierContract } from "@kompass/shared";

export function useSupplierContracts(supplierId?: string) {
  const [contracts, setContracts] = useState<SupplierContract[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchContracts = useCallback(async () => {
    if (!supplierId) return;
    setLoading(true);
    try {
      const result = await supplierContractsApi.list(supplierId);
      if (result && Array.isArray(result.data)) {
        setContracts(result.data as unknown as SupplierContract[]);
      } else {
        setContracts([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching supplier contracts", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [supplierId]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return { contracts, loading, error, refetch: fetchContracts };
}

export function useSupplierContract(id?: string) {
  const [contract, setContract] = useState<SupplierContract | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchContract = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await supplierContractsApi.get(id);
      setContract(result as unknown as SupplierContract);
      setError(null);
    } catch (err) {
      console.error("Error fetching supplier contract", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  const createContract = async (supplierId: string, data: any) => {
    setLoading(true);
    try {
      const result = await supplierContractsApi.create(supplierId, data);
      setContract(result as unknown as SupplierContract);
      return result;
    } catch (err) {
      console.error("Error creating contract", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveContract = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await supplierContractsApi.approve(id);
      setContract(result as unknown as SupplierContract);
    } catch (err) {
      console.error("Error approving contract", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signContract = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await supplierContractsApi.sign(id);
      setContract(result as unknown as SupplierContract);
    } catch (err) {
      console.error("Error signing contract", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    contract,
    loading,
    error,
    createContract,
    approveContract,
    signContract,
    refetch: fetchContract,
  };
}
