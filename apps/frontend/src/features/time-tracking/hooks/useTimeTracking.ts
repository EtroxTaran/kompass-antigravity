import { useState, useEffect } from 'react';

import type { TimeEntryResponseDto } from '@kompass/shared/types/entities/time-entry';

import { timeTrackingApi } from '../services/time-tracking-api';

/**
 * Time Tracking Filters
 */
interface TimeTrackingFilters {
  projectId?: string;
  userId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * useTimeTracking Hook
 *
 * Custom hook for fetching and managing time entries with filtering.
 *
 * Features:
 * - Fetch time entries with filters
 * - Loading state management
 * - Error handling
 * - Refresh capability
 *
 * @see Phase 1.3 of Time Tracking Implementation Plan
 */
export function useTimeTracking(filters?: TimeTrackingFilters) {
  const [entries, setEntries] = useState<TimeEntryResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch time entries
   */
  const fetchEntries = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await timeTrackingApi.getAll(filters);
      setEntries(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch time entries')
      );
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch on mount and when filters change
   */
  useEffect(() => {
    fetchEntries();
  }, [
    filters?.projectId,
    filters?.userId,
    filters?.status,
    filters?.startDate,
    filters?.endDate,
  ]);

  /**
   * Refetch entries
   */
  const refetch = () => {
    fetchEntries();
  };

  return {
    entries,
    loading,
    error,
    refetch,
  };
}

/**
 * useMyTimesheets Hook
 *
 * Specialized hook for fetching current user's timesheets.
 */
export function useMyTimesheets(filters?: {
  startDate?: Date;
  endDate?: Date;
}) {
  const [entries, setEntries] = useState<TimeEntryResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch my timesheets
   */
  const fetchTimesheets = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await timeTrackingApi.getMyTimesheets(filters);
      setEntries(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch timesheets')
      );
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, [filters?.startDate, filters?.endDate]);

  const refetch = () => {
    fetchTimesheets();
  };

  return {
    entries,
    loading,
    error,
    refetch,
  };
}

/**
 * useTeamTimesheets Hook
 *
 * Specialized hook for fetching team timesheets (for managers).
 */
export function useTeamTimesheets(filters?: TimeTrackingFilters) {
  const [entries, setEntries] = useState<TimeEntryResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch team timesheets
   */
  const fetchTeamTimesheets = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await timeTrackingApi.getTeamTimesheets(filters);
      setEntries(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch team timesheets')
      );
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamTimesheets();
  }, [
    filters?.projectId,
    filters?.status,
    filters?.startDate,
    filters?.endDate,
  ]);

  const refetch = () => {
    fetchTeamTimesheets();
  };

  return {
    entries,
    loading,
    error,
    refetch,
  };
}
