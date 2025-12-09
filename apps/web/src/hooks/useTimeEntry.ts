import { useState, useEffect, useCallback } from "react";
import { timeEntriesApi } from "@/services/apiClient";
import { TimeEntry } from "@kompass/shared";
import { useNavigate } from "react-router-dom";

export function useTimeEntry(id?: string) {
  const [entry, setEntry] = useState<TimeEntry | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const fetchEntry = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await timeEntriesApi.get(id);
      setEntry(response as TimeEntry);
      setError(null);
    } catch (err) {
      console.error("Error fetching time entry", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);

  const saveEntry = async (data: Partial<TimeEntry>) => {
    setLoading(true);
    try {
      if (id) {
        await timeEntriesApi.update(id, data);
      } else {
        await timeEntriesApi.create(data);
      }
      navigate(-1); // Go back
    } catch (err) {
      console.error("Error saving time entry", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this time entry?")) return;

    setLoading(true);
    try {
      await timeEntriesApi.delete(id);
      navigate(-1);
    } catch (err) {
      console.error("Error deleting time entry", err);
      setError(err as Error);
      setLoading(false);
    }
  };

  return { entry, loading, error, saveEntry, deleteEntry };
}
