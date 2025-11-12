import axios from 'axios';
import type {
  TimeEntry,
  CreateTimeEntryDto,
  UpdateTimeEntryDto,
  TimeEntryResponseDto,
  LaborCostSummary,
} from '@kompass/shared/types/entities/time-entry';

/**
 * Time Tracking API Client
 * 
 * Handles all HTTP requests for time tracking functionality.
 * 
 * @see Phase 1 of Time Tracking Implementation Plan
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Time Entry API
 */
export const timeTrackingApi = {
  /**
   * Create time entry or start timer
   */
  async create(dto: CreateTimeEntryDto): Promise<TimeEntryResponseDto> {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/time-entries`,
      dto,
    );
    return response.data;
  },

  /**
   * Get all time entries
   */
  async getAll(filters?: {
    projectId?: string;
    userId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<TimeEntryResponseDto[]> {
    const response = await axios.get(`${API_BASE_URL}/api/v1/time-entries`, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get time entry by ID
   */
  async getById(id: string): Promise<TimeEntryResponseDto> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/time-entries/${id}`,
    );
    return response.data;
  },

  /**
   * Update time entry
   */
  async update(
    id: string,
    dto: UpdateTimeEntryDto,
  ): Promise<TimeEntryResponseDto> {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/time-entries/${id}`,
      dto,
    );
    return response.data;
  },

  /**
   * Delete time entry
   */
  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/v1/time-entries/${id}`);
  },

  /**
   * Stop running timer
   */
  async stopTimer(id: string): Promise<TimeEntryResponseDto> {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/time-entries/${id}/stop`,
    );
    return response.data;
  },

  /**
   * Pause running timer
   */
  async pauseTimer(id: string): Promise<TimeEntryResponseDto> {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/time-entries/${id}/pause`,
    );
    return response.data;
  },

  /**
   * Resume paused timer
   */
  async resumeTimer(dto: CreateTimeEntryDto): Promise<TimeEntryResponseDto> {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/time-entries/resume`,
      dto,
    );
    return response.data;
  },

  /**
   * Approve time entry
   */
  async approve(id: string): Promise<TimeEntryResponseDto> {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/time-entries/${id}/approve`,
    );
    return response.data;
  },

  /**
   * Reject time entry
   */
  async reject(id: string, reason: string): Promise<TimeEntryResponseDto> {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/time-entries/${id}/reject`,
      { reason },
    );
    return response.data;
  },

  /**
   * Bulk approve time entries
   */
  async bulkApprove(entryIds: string[]): Promise<{ approvedCount: number }> {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/time-entries/bulk-approve`,
      { entryIds },
    );
    return response.data;
  },

  /**
   * Get active timer for current user
   */
  async getActiveTimer(): Promise<TimeEntryResponseDto | null> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/time-entries/active/current`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 204) {
        return null; // No active timer
      }
      throw error;
    }
  },

  /**
   * Get my timesheets
   */
  async getMyTimesheets(filters?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<TimeEntryResponseDto[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/time-entries/my-timesheets/list`,
      { params: filters },
    );
    return response.data;
  },

  /**
   * Get team timesheets (for managers)
   */
  async getTeamTimesheets(filters?: {
    projectId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<TimeEntryResponseDto[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/time-entries/team/list`,
      { params: filters },
    );
    return response.data;
  },
};

/**
 * Project Time Queries API
 */
export const projectTimeApi = {
  /**
   * Get time entries for a project
   */
  async getProjectTimeEntries(projectId: string): Promise<TimeEntryResponseDto[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/projects/${projectId}/time-entries`,
    );
    return response.data;
  },

  /**
   * Get time summary for a project
   */
  async getProjectTimeSummary(projectId: string): Promise<any> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/projects/${projectId}/time-summary`,
    );
    return response.data;
  },

  /**
   * Get labor costs for a project
   */
  async getProjectLaborCosts(projectId: string): Promise<LaborCostSummary> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/projects/${projectId}/labor-costs`,
    );
    return response.data;
  },
};

