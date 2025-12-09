import { useState, useEffect, useCallback } from "react";
import { customersApi } from "@/services/apiClient";
import { Customer } from "@kompass/shared";

export function useCustomer(id?: string) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchCustomer = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await customersApi.get(id);
      setCustomer(result as unknown as Customer);
      setError(null);
    } catch (err) {
      console.error("Error fetching customer", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  const saveCustomer = async (data: Partial<Customer>) => {
    setLoading(true);
    try {
      let result;
      if (id && customer) {
        // Update
        result = await customersApi.update(id, data);
      } else {
        // Create
        result = await customersApi.create(data);
      }
      setCustomer(result as unknown as Customer);
      return result;
    } catch (err) {
      console.error("Error saving customer", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { customer, loading, error, saveCustomer, refetch: fetchCustomer };
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const result = await customersApi.list();
        // Handle ListResponse structure
        if (result && Array.isArray(result.data)) {
          setCustomers(result.data as unknown as Customer[]);
        } else if (Array.isArray(result)) {
          setCustomers(result as unknown as Customer[]);
        } else {
          setCustomers([]);
        }
      } catch (err) {
        console.error("Error fetching customers", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return { customers, loading, error };
}
