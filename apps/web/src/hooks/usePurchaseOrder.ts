import { useState, useEffect, useCallback } from "react";
import { purchaseOrdersApi } from "@/services/apiClient";
import { PurchaseOrder } from "@kompass/shared";

export function usePurchaseOrder(id?: string) {
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await purchaseOrdersApi.get(id);
      setOrder(result as unknown as PurchaseOrder);
      setError(null);
    } catch (err) {
      console.error("Error fetching purchase order", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const saveOrder = async (data: Partial<PurchaseOrder>) => {
    setLoading(true);
    try {
      let result;
      if (id && order) {
        result = await purchaseOrdersApi.update(id, data);
      } else {
        result = await purchaseOrdersApi.create(data);
      }
      setOrder(result as unknown as PurchaseOrder);
      return result;
    } catch (err) {
      console.error("Error saving purchase order", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitForApproval = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await purchaseOrdersApi.submitForApproval(id);
      setOrder(result as unknown as PurchaseOrder);
      return result;
    } catch (err) {
      console.error("Error submitting purchase order", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveOrder = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await purchaseOrdersApi.approve(id);
      setOrder(result as unknown as PurchaseOrder);
      return result;
    } catch (err) {
      console.error("Error approving purchase order", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectOrder = async (reason: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await purchaseOrdersApi.reject(id, reason);
      setOrder(result as unknown as PurchaseOrder);
      return result;
    } catch (err) {
      console.error("Error rejecting purchase order", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    order,
    loading,
    error,
    saveOrder,
    submitForApproval,
    approveOrder,
    rejectOrder,
    refetch: fetchOrder
  };
};

export function usePurchaseOrders(params?: {
  supplierId?: string;
  projectId?: string;
}) {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const result = await purchaseOrdersApi.list(params);
      if (result && Array.isArray(result.data)) {
        setOrders(result.data as unknown as PurchaseOrder[]);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching purchase orders", err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, refetch: fetchOrders };
}
