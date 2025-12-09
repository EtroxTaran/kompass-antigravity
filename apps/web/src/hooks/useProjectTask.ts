import { useState, useEffect, useCallback } from "react";
import { projectTasksApi } from "@/services/apiClient";
import { ProjectTask } from "@kompass/shared";
import { useNavigate } from "react-router-dom";

export function useProjectTask(projectId: string, taskId?: string) {
  const [task, setTask] = useState<ProjectTask | null>(null);
  const [loading, setLoading] = useState(!!taskId);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const fetchTask = useCallback(async () => {
    if (!projectId || !taskId) return;
    setLoading(true);
    try {
      const response = await projectTasksApi.get(projectId, taskId);
      setTask(response as ProjectTask);
      setError(null);
    } catch (err) {
      console.error("Error fetching task", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [projectId, taskId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const saveTask = async (data: Partial<ProjectTask>) => {
    setLoading(true);
    try {
      if (taskId) {
        await projectTasksApi.update(projectId, taskId, data);
      } else {
        await projectTasksApi.create(projectId, data);
      }
      navigate(`/projects/${projectId}`); // Or wherever appropriate
    } catch (err) {
      console.error("Error saving task", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    if (!taskId) return;
    if (!confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    try {
      await projectTasksApi.delete(projectId, taskId);
      navigate(`/projects/${projectId}`);
    } catch (err) {
      console.error("Error deleting task", err);
      setError(err as Error);
      setLoading(false);
    }
  };

  return { task, loading, error, saveTask, deleteTask };
}
