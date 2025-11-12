import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ProfitabilityReport } from '@kompass/shared/types/entities/project';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * useProfitability Hook
 * 
 * Custom hook for fetching project profitability report.
 * 
 * @see Phase 1.4 of Time Tracking Implementation Plan
 */
export function useProfitability(projectId: string) {
  const [report, setReport] = useState<ProfitabilityReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch profitability report
   */
  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/projects/${projectId}/profitability`,
      );
      setReport(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch profitability report'),
      );
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch on mount and when projectId changes
   */
  useEffect(() => {
    if (projectId) {
      fetchReport();
    }
  }, [projectId]);

  /**
   * Refetch report
   */
  const refetch = () => {
    fetchReport();
  };

  return {
    report,
    loading,
    error,
    refetch,
  };
}

