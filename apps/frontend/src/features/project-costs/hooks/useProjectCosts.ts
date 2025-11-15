/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useState, useEffect } from 'react';

import type {
  ProjectCostResponseDto,
  MaterialCostSummary,
} from '@kompass/shared';

import { projectCostQueriesApi } from '../services/project-cost-api';

/**
 * useProjectCosts Hook
 *
 * Custom hook for fetching project costs and summary.
 *
 * @see Phase 1 of Time Tracking Implementation Plan
 */
export function useProjectCosts(projectId: string) {
  const [costs, setCosts] = useState<ProjectCostResponseDto[]>([]);
  const [summary, setSummary] = useState<MaterialCostSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch project costs
   */
  const fetchCosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const [costsData, summaryData] = await Promise.all([
        projectCostQueriesApi.getProjectCosts(projectId),
        projectCostQueriesApi.getCostSummary(projectId),
      ]);

      setCosts(costsData);
      setSummary(summaryData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch project costs')
      );
      setCosts([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch on mount and when projectId changes
   */
  useEffect(() => {
    if (projectId) {
      fetchCosts();
    }
  }, [projectId]);

  /**
   * Refetch costs
   */
  const refetch = () => {
    fetchCosts();
  };

  return {
    costs,
    summary,
    loading,
    error,
    refetch,
  };
}
