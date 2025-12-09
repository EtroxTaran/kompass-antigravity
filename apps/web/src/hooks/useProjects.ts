import { useState, useEffect, useCallback } from "react";
import { projectsApi } from "@/services/apiClient";
import { Project } from "@kompass/shared";

export function useProjects(params?: { customerId?: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const result = await projectsApi.list(params);
      if (result && Array.isArray(result.data)) {
        setProjects(result.data as unknown as Project[]);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Error fetching projects", err);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, refetch: fetchProjects };
}

export function useProject(id?: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await projectsApi.get(id);
      setProject(result as unknown as Project);
      setError(null);
    } catch (err) {
      console.error("Error fetching project", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const saveProject = async (data: Partial<Project>) => {
    setLoading(true);
    try {
      let result;
      if (id && project) {
        result = await projectsApi.update(id, data);
      } else {
        result = await projectsApi.create(data);
      }
      setProject(result as unknown as Project);
      return result;
    } catch (err) {
      console.error("Error saving project", err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { project, loading, error, saveProject, refetch: fetchProject };
}
