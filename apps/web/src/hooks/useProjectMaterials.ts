import { useState, useCallback, useEffect } from "react";
import { projectMaterialsApi } from "@/services/apiClient";
import { ProjectMaterialRequirement } from "@kompass/shared";
import { toast } from "sonner";

export function useProjectMaterials(projectId?: string) {
  const [materials, setMaterials] = useState<ProjectMaterialRequirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMaterials = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const result = await projectMaterialsApi.list(projectId);
      setMaterials(result);
      setError(null);
    } catch (err) {
      console.error("Error fetching project materials", err);
      setError(err as Error);
      toast.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const addMaterial = async (data: Partial<ProjectMaterialRequirement>) => {
    if (!projectId) return;
    try {
      await projectMaterialsApi.create(projectId, data);
      toast.success("Material added");
      fetchMaterials();
    } catch (err) {
      console.error("Error adding material", err);
      toast.error("Failed to add material");
      throw err;
    }
  };

  const updateMaterial = async (
    id: string,
    data: Partial<ProjectMaterialRequirement>,
  ) => {
    if (!projectId) return;
    try {
      await projectMaterialsApi.update(projectId, id, data);
      toast.success("Material updated");
      fetchMaterials();
    } catch (err) {
      console.error("Error updating material", err);
      toast.error("Failed to update material");
      throw err;
    }
  };

  const deleteMaterial = async (id: string) => {
    if (!projectId) return;
    try {
      await projectMaterialsApi.delete(projectId, id);
      toast.success("Material deleted");
      fetchMaterials();
    } catch (err) {
      console.error("Error deleting material", err);
      toast.error("Failed to delete material");
      throw err;
    }
  };

  return {
    materials,
    loading,
    error,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    refetch: fetchMaterials,
  };
}
