import { useState, useEffect, useCallback } from "react";
import { activitiesApi } from "@/services/apiClient";

export type ActivityType = "call" | "email" | "meeting" | "visit" | "note";

export interface Activity {
  _id: string;
  _rev?: string;
  type: "activity";
  activityType: ActivityType;
  customerId: string;
  contactId?: string;
  locationId?: string;
  date: string;
  duration?: number;
  subject: string;
  description?: string;
  outcome?: string;
  followUpDate?: string;
  followUpNotes?: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  version: number;
}

export interface ActivityFilters {
  activityType?: ActivityType;
  customerId?: string;
  contactId?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
}

export function useActivities(
  customerId?: string,
  filters: ActivityFilters = {},
) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params: { customerId?: string; contactId?: string; type?: string } = {};
      if (customerId) params.customerId = customerId;
      if (filters.contactId) params.contactId = filters.contactId;
      if (filters.activityType) params.type = filters.activityType; // API uses 'type' for filter usually, wait, interface says 'activityType', backend likely uses 'type' or just filter.
      // Based on apiClient.ts: list(params?: { customerId?: string; type?: string })
      // So I should map activityType to type.
      if (filters.activityType) params.type = filters.activityType;

      const result = await activitiesApi.list(params);
      let fetchedActivities: Activity[] = [];

      if (result && Array.isArray(result.data)) {
        fetchedActivities = result.data as unknown as Activity[];
      } else if (Array.isArray(result)) {
        fetchedActivities = result as unknown as Activity[];
      }

      // Filter by date range in memory if backend doesn't support it yet
      if (filters.dateFrom) {
        fetchedActivities = fetchedActivities.filter(
          (a) => a.date >= filters.dateFrom!,
        );
      }
      if (filters.dateTo) {
        fetchedActivities = fetchedActivities.filter(
          (a) => a.date <= filters.dateTo!,
        );
      }

      // Sort by date descending (most recent first)
      fetchedActivities.sort((a, b) => b.date.localeCompare(a.date));

      setActivities(fetchedActivities);
      setError(null);
    } catch (err) {
      console.error("Error fetching activities", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [
    customerId,
    filters.contactId,
    filters.activityType,
    filters.dateFrom,
    filters.dateTo,
  ]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const addActivity = async (
    activity: Omit<
      Activity,
      | "_id"
      | "_rev"
      | "type"
      | "createdAt"
      | "createdBy"
      | "modifiedAt"
      | "modifiedBy"
      | "version"
    >,
  ) => {
    try {
      const result = await activitiesApi.create(activity);
      await fetchActivities();
      return result;
    } catch (err) {
      console.error("Error adding activity", err);
      throw err;
    }
  };

  const updateActivity = async (
    activity: Activity,
    updates: Partial<Activity>,
  ) => {
    try {
      await activitiesApi.update(activity._id, updates);
      await fetchActivities();
    } catch (err) {
      console.error("Error updating activity", err);
      throw err;
    }
  };

  const deleteActivity = async (activity: Activity) => {
    try {
      await activitiesApi.delete(activity._id);
      await fetchActivities();
    } catch (err) {
      console.error("Error deleting activity", err);
      throw err;
    }
  };

  // Get pending follow-ups
  const pendingFollowUps = activities.filter((a) => {
    if (!a.followUpDate) return false;
    const today = new Date().toISOString().split("T")[0];
    return a.followUpDate <= today;
  });

  return {
    activities,
    loading,
    error,
    addActivity,
    updateActivity,
    deleteActivity,
    pendingFollowUps,
    refetch: fetchActivities,
  };
}
