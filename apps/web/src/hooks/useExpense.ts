import { useState, useEffect, useCallback } from "react";
import { expensesApi } from "@/services/apiClient";
import { Expense } from "@kompass/shared";

export function useExpense(id?: string) {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchExpense = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await expensesApi.get(id);
      setExpense(result as unknown as Expense);
      setError(null);
    } catch (err) {
      console.error("Error fetching expense", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExpense();
  }, [fetchExpense]);

  const saveExpense = async (data: Partial<Expense>) => {
    setLoading(true);
    try {
      let result;
      if (id && expense) {
        result = await expensesApi.update(id, data);
      } else {
        result = await expensesApi.create(data);
      }
      setExpense(result as unknown as Expense);
      return result;
    } catch (err) {
      console.error("Error saving expense", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { expense, loading, error, saveExpense, refetch: fetchExpense };
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    try {
      const result = await expensesApi.list();
      if (result && Array.isArray(result.data)) {
        setExpenses(result.data as unknown as Expense[]);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.error("Error fetching expenses", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return { expenses, loading, refetch: fetchExpenses };
}
