import { useState, useCallback } from "react";
import { apiClient } from "../services/apiClient";
import {
  ProjectSubcontractor,
  AssignSubcontractorDto,
  UpdateAssignmentDto,
  RateSubcontractorDto,
} from "@kompass/shared";

export function useProjectSubcontractor(projectId?: string) {
  const [subcontractors, setSubcontractors] = useState<ProjectSubcontractor[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubcontractors = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data =
        await apiClient.projectSubcontractor.findByProject(projectId);
      setSubcontractors(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch subcontractors";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const assignSubcontractor = async (dto: AssignSubcontractorDto) => {
    if (!projectId) return;
    setLoading(true);
    try {
      // dto.projectId might be needed if not in dto, but our DTO has it.
      // API client will handle the URL param.
      const result = await apiClient.projectSubcontractor.assign(
        projectId,
        dto,
      );
      setSubcontractors((prev) => [...prev, result]);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to assign subcontractor";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAssignment = async (id: string, dto: UpdateAssignmentDto) => {
    if (!projectId) return;
    // Don't set global loading for row updates typically, but for now ok.
    // try/catch removed as it was useless
    const result = await apiClient.projectSubcontractor.update(
      projectId,
      id,
      dto,
    );
    setSubcontractors((prev) =>
      prev.map((item) => (item._id === id ? result : item)),
    );
    return result;
  };

  const rateSubcontractor = async (id: string, dto: RateSubcontractorDto) => {
    if (!projectId) return;
    // try/catch removed
    const result = await apiClient.projectSubcontractor.rate(
      projectId,
      id,
      dto,
    );
    setSubcontractors((prev) =>
      prev.map((item) => (item._id === id ? result : item)),
    );
    return result;
  };

  return {
    subcontractors,
    loading,
    error,
    fetchSubcontractors,
    assignSubcontractor,
    updateAssignment,
    rateSubcontractor,
  };
}
