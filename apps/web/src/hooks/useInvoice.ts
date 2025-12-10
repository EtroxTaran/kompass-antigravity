import { useState, useCallback, useEffect } from "react";
import { invoicesApi } from "@/services/apiClient";
import { Invoice } from "@kompass/shared";

export function useInvoice(id?: string) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInvoice = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      const result = await invoicesApi.get(id);
      setInvoice(result as unknown as Invoice);
      setError(null);
    } catch (err) {
      console.error("Error fetching invoice:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const saveInvoice = async (data: Partial<Invoice>) => {
    setLoading(true);
    try {
      let result;
      if (id && invoice) {
        // Update
        result = await invoicesApi.update(id, data);
      } else {
        // Create
        result = await invoicesApi.create(data);
      }
      setInvoice(result as unknown as Invoice);
      return result;
    } catch (err) {
      console.error("Error saving invoice:", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { invoice, loading, error, saveInvoice };
}

export function useInvoices(params?: {
  customerId?: string;
  projectId?: string;
}) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const result = await invoicesApi.list(params);
      if (result && Array.isArray(result.data)) {
        setInvoices(result.data as unknown as Invoice[]);
      } else if (Array.isArray(result)) {
        setInvoices(result as unknown as Invoice[]);
      } else {
        setInvoices([]);
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError(err as Error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const exportLexware = useCallback(async () => {
    setExporting(true);
    try {
      const blob = await invoicesApi.exportLexware();
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `rechnungen_lexware_${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error("Error exporting invoices:", err);
      setError(err as Error);
      throw err;
    } finally {
      setExporting(false);
    }
  }, []);

  return { invoices, loading, exporting, error, exportLexware };
}
