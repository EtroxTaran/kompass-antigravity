/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import axios from 'axios';

import type {
  ProjectCost,
  CreateProjectCostDto,
  UpdateProjectCostDto,
  ProjectCostResponseDto,
  MaterialCostSummary,
} from '@kompass/shared/types/entities/project-cost';

/**
 * Project Cost API Client
 *
 * Handles all HTTP requests for project cost functionality.
 *
 * @see Phase 1 of Time Tracking Implementation Plan
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Project Cost API
 */
export const projectCostApi = {
  /**
   * Create project cost
   */
  async create(dto: CreateProjectCostDto): Promise<ProjectCostResponseDto> {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/project-costs`,
      dto
    );
    return response.data;
  },

  /**
   * Get all project costs
   */
  async getAll(filters?: {
    projectId?: string;
    costType?: string;
    status?: string;
    supplierName?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<ProjectCostResponseDto[]> {
    const response = await axios.get(`${API_BASE_URL}/api/v1/project-costs`, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get project cost by ID
   */
  async getById(id: string): Promise<ProjectCostResponseDto> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/project-costs/${id}`
    );
    return response.data;
  },

  /**
   * Update project cost
   */
  async update(
    id: string,
    dto: UpdateProjectCostDto
  ): Promise<ProjectCostResponseDto> {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/project-costs/${id}`,
      dto
    );
    return response.data;
  },

  /**
   * Delete project cost
   */
  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/v1/project-costs/${id}`);
  },

  /**
   * Approve project cost
   */
  async approve(id: string): Promise<ProjectCostResponseDto> {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/project-costs/${id}/approve`
    );
    return response.data;
  },

  /**
   * Mark project cost as paid
   */
  async markAsPaid(id: string): Promise<ProjectCostResponseDto> {
    const response = await axios.patch(
      `${API_BASE_URL}/api/v1/project-costs/${id}/mark-paid`
    );
    return response.data;
  },

  /**
   * Get costs pending payment
   */
  async getPendingPayments(): Promise<ProjectCostResponseDto[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/project-costs/pending/payment`
    );
    return response.data;
  },

  /**
   * Get costs by supplier
   */
  async getBySupplier(supplierName: string): Promise<ProjectCostResponseDto[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/project-costs/supplier/${supplierName}`
    );
    return response.data;
  },
};

/**
 * Project Cost Queries API
 */
export const projectCostQueriesApi = {
  /**
   * Get project costs
   */
  async getProjectCosts(projectId: string): Promise<ProjectCostResponseDto[]> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/projects/${projectId}/costs`
    );
    return response.data;
  },

  /**
   * Get cost summary for a project
   */
  async getCostSummary(projectId: string): Promise<MaterialCostSummary> {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/projects/${projectId}/costs/summary`
    );
    return response.data;
  },
};
