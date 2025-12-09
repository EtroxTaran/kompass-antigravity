import { useState, useEffect, useCallback } from "react";
import { projectTasksApi } from "@/services/apiClient";
import { ProjectTask } from "@kompass/shared";

export function useProjectTasks(projectId: string) {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await projectTasksApi.list(projectId);
      setTasks(response.data as ProjectTask[]);
    } catch (err) {
      console.error("Error fetching tasks", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (task: Partial<ProjectTask>) => {
    await projectTasksApi.create(projectId, task);
    fetchTasks();
  };

  const updateTaskStatus = async (
    task: ProjectTask,
    newStatus: ProjectTask["status"],
  ) => {
    if (!task._id) return;
    await projectTasksApi.update(projectId, task._id, { status: newStatus });
    fetchTasks();
  };

  return { tasks, loading, addTask, updateTaskStatus };
}
