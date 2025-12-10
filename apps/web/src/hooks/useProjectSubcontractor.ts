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
    } catch (err: any) {
      setError(err.message || "Failed to fetch subcontractors");
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
    } catch (err: any) {
      setError(err.message || "Failed to assign subcontractor");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAssignment = async (id: string, dto: UpdateAssignmentDto) => {
    if (!projectId) return;
    // Don't set global loading for row updates typically, but for now ok.
    try {
      const result = await apiClient.projectSubcontractor.update(
        projectId,
        id,
        dto,
      );
      setSubcontractors((prev) =>
        prev.map((item) => (item._id === id ? result : item)),
      );
      return result;
    } catch (err: any) {
      // setError(err.message); // Optional: global error vs local handling
      throw err;
    }
  };

  const rateSubcontractor = async (id: string, dto: RateSubcontractorDto) => {
    if (!projectId) return;
    try {
      const result = await apiClient.projectSubcontractor.rate(
        projectId,
        id,
        dto,
      );
      setSubcontractors((prev) =>
        prev.map((item) => (item._id === id ? result : item)),
      );
      return result;
    } catch (err: any) {
      throw err;
    }
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
