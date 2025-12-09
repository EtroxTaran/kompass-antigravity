import { useState, useEffect, useCallback } from "react";
import { dbService } from "@/lib/db";

export type UserTaskStatus = "open" | "in_progress" | "completed" | "cancelled";
export type UserTaskPriority = "low" | "medium" | "high" | "urgent";

export interface UserTask {
  _id: string;
  _rev?: string;
  type: "user_task";
  title: string;
  description?: string;
  status: UserTaskStatus;
  priority: UserTaskPriority;
  dueDate?: string;
  assignedTo: string;
  relatedCustomerId?: string;
  relatedOpportunityId?: string;
  relatedProjectId?: string;
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  version: number;
}

export interface UserTaskFilters {
  status?: UserTaskStatus;
  priority?: UserTaskPriority;
  overdue?: boolean;
}

export function useUserTasks(
  userId: string = "user-1",
  filters: UserTaskFilters = {},
) {
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const db = dbService.getDB();
    try {
      const selector: Record<string, any> = {
        type: "user_task",
        assignedTo: userId,
      };

      if (filters.status) {
        selector.status = filters.status;
      }
      if (filters.priority) {
        selector.priority = filters.priority;
      }

      const result = await db.find({ selector });
      let filteredTasks = result.docs as unknown as UserTask[];

      // Filter overdue tasks in memory
      if (filters.overdue) {
        const today = new Date().toISOString().split("T")[0];
        filteredTasks = filteredTasks.filter(
          (t) =>
            t.dueDate &&
            t.dueDate < today &&
            ["open", "in_progress"].includes(t.status),
        );
      }

      // Sort by priority and due date
      filteredTasks.sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        const aPriority = priorityOrder[a.priority] ?? 2;
        const bPriority = priorityOrder[b.priority] ?? 2;
        if (aPriority !== bPriority) return aPriority - bPriority;
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        return 0;
      });

      setTasks(filteredTasks);
    } catch (err) {
      console.error("Error fetching user tasks", err);
    } finally {
      setLoading(false);
    }
  }, [userId, filters.status, filters.priority, filters.overdue]);

  useEffect(() => {
    fetchTasks();
    const db = dbService.getDB();
    const changes = db
      .changes({
        since: "now",
        live: true,
        include_docs: true,
        filter: (doc) => doc.type === "user_task" && doc.assignedTo === userId,
      })
      .on("change", () => {
        fetchTasks();
      });

    return () => {
      changes.cancel();
    };
  }, [fetchTasks, userId]);

  const addTask = async (
    task: Omit<
      UserTask,
      | "_id"
      | "_rev"
      | "type"
      | "assignedTo"
      | "createdAt"
      | "createdBy"
      | "modifiedAt"
      | "modifiedBy"
      | "version"
    >,
  ) => {
    const db = dbService.getDB();
    const newDoc = {
      ...task,
      type: "user_task",
      assignedTo: userId,
      _id: `user_task-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      version: 1,
      createdBy: userId,
      modifiedBy: userId,
    } as UserTask;
    await db.put(newDoc);
    return newDoc;
  };

  const updateTask = async (task: UserTask, updates: Partial<UserTask>) => {
    const db = dbService.getDB();
    const updatedDoc = {
      ...task,
      ...updates,
      modifiedAt: new Date().toISOString(),
      version: (task.version || 0) + 1,
    };

    // If completing, set completed timestamp
    if (updates.status === "completed" && task.status !== "completed") {
      updatedDoc.completedAt = new Date().toISOString();
      updatedDoc.completedBy = userId;
    }

    await db.put(updatedDoc);
  };

  const updateTaskStatus = async (
    task: UserTask,
    newStatus: UserTaskStatus,
  ) => {
    await updateTask(task, { status: newStatus });
  };

  const deleteTask = async (task: UserTask) => {
    const db = dbService.getDB();
    await db.remove(task._id, task._rev!);
  };

  // Computed values
  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const today = new Date().toISOString().split("T")[0];
    return t.dueDate < today && ["open", "in_progress"].includes(t.status);
  });

  const tasksByStatus = {
    open: tasks.filter((t) => t.status === "open"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    completed: tasks.filter((t) => t.status === "completed"),
    cancelled: tasks.filter((t) => t.status === "cancelled"),
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    overdueTasks,
    tasksByStatus,
    refetch: fetchTasks,
  };
}
