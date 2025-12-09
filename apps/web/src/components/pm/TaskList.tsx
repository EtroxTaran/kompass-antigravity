import { useNavigate } from "react-router-dom";
import { useProjectTasks } from "@/hooks/useProjectTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Check, Clock, AlertCircle, Edit } from "lucide-react";

interface TaskListProps {
  projectId: string;
}

export function TaskList({ projectId }: TaskListProps) {
  const { tasks, loading, updateTaskStatus } = useProjectTasks(projectId);
  const navigate = useNavigate();

  const handleAddTask = () => {
    navigate(`/projects/${projectId}/tasks/new`);
  };

  if (loading) return <div>Loading Assignments...</div>;

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Tasks</CardTitle>
        <Button size="sm" variant="outline" onClick={handleAddTask}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* Todo */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> To Do ({todoTasks.length})
            </h4>
            <div className="space-y-2">
              {todoTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={task._id}
                      onCheckedChange={() => updateTaskStatus(task, "done")}
                    />
                    <label
                      htmlFor={task._id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {task.title}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() =>
                        navigate(
                          `/projects/${projectId}/tasks/${task._id}/edit`,
                        )
                      }
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => updateTaskStatus(task, "in_progress")}
                    >
                      <Clock className="h-4 w-4 text-blue-500" />
                    </Button>
                  </div>
                </div>
              ))}
              {todoTasks.length === 0 && (
                <p className="text-xs text-muted-foreground italic">
                  No tasks to do.
                </p>
              )}
            </div>
          </div>

          {/* In Progress */}
          {inProgressTasks.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" /> In Progress (
                {inProgressTasks.length})
              </h4>
              <div className="space-y-2">
                {inProgressTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-2 border rounded-md bg-blue-50/50"
                  >
                    <span className="text-sm font-medium">{task.title}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() =>
                          navigate(
                            `/projects/${projectId}/tasks/${task._id}/edit`,
                          )
                        }
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => updateTaskStatus(task, "done")}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Done */}
          {doneTasks.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 text-muted-foreground flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> Completed (
                {doneTasks.length})
              </h4>
              {/* Hide completed items by default or show simplified */}
              <div className="space-y-1">
                {doneTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center gap-2 p-1 pl-2 justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground line-through">
                        {task.title}
                      </span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() =>
                        navigate(
                          `/projects/${projectId}/tasks/${task._id}/edit`,
                        )
                      }
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
