import { useState, useEffect, useCallback } from "react";
import { contractsApi } from "@/services/apiClient";
import { Contract } from "@kompass/shared";

export function useContract(id?: string) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchContract = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await contractsApi.get(id);
      setContract(result as unknown as Contract);
      setError(null);
    } catch (err) {
      console.error("Error fetching contract", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  const saveContract = async (data: Partial<Contract>) => {
    setLoading(true);
    try {
      let result;
      if (id && contract) {
        result = await contractsApi.update(id, data);
      } else {
        result = await contractsApi.create(data);
      }
      setContract(result as unknown as Contract);
      return result;
    } catch (err) {
      console.error("Error saving contract", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    status: Contract["status"],
    signedBy?: string,
  ) => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await contractsApi.updateStatus(id, status, signedBy);
      setContract(result as unknown as Contract);
    } catch (err) {
      console.error("Error updating status", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    contract,
    loading,
    error,
    saveContract,
    updateStatus,
    refetch: fetchContract,
  };
}

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await contractsApi.list();
      setContracts(result as unknown as Contract[]);
      setError(null);
    } catch (err) {
      console.error("Error fetching contracts", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return { contracts, loading, error, refetch: fetchContracts };
}
