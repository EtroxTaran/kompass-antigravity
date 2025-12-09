import { useState, useEffect, useCallback } from "react";
import { projectsApi } from "@/services/apiClient";
import { Project } from "@kompass/shared";

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
        // Update
        result = await projectsApi.update(id, data);
      } else {
        // Create
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

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await projectsApi.list();
        if (result && Array.isArray(result.data)) {
          setProjects(result.data as unknown as Project[]);
        } else if (Array.isArray(result)) {
          setProjects(result as unknown as Project[]);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return { projects, loading, error };
}
