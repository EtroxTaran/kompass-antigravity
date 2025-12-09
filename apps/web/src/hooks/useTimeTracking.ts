import { useState, useCallback, useEffect } from "react";
import { timeEntriesApi } from "@/services/apiClient";
import { TimeEntry } from "@kompass/shared";

export function useTimeTracking(projectId: string) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeEntries = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await timeEntriesApi.list({ projectId });
      // Client-side sort if API doesn't sort
      const sorted = (response.data as TimeEntry[]).sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      );
      setTimeEntries(sorted);
    } catch (err) {
      console.error("Error fetching time entries", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTimeEntries();
  }, [fetchTimeEntries]);

  const addTimeEntry = async (entry: Partial<TimeEntry>) => {
    await timeEntriesApi.create({ ...entry, projectId });
    fetchTimeEntries();
  };

  const deleteTimeEntry = async (entry: TimeEntry) => {
    if (entry._id) {
      await timeEntriesApi.delete(entry._id);
      fetchTimeEntries();
    }
  };

  return { timeEntries, loading, addTimeEntry, deleteTimeEntry };
}
