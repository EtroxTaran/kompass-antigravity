import { useState } from "react";
import { useProjectTasks } from "@/hooks/useProjectTasks";
import type {
  ProjectTask,
  ProjectTaskStatus,
  ProjectTaskPriority,
} from "@kompass/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  GripVertical,
  User,
  AlertTriangle,
  Clock,
  CheckCircle,
  Circle,
  Eye,
  OctagonX,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ProjectTaskStatus,
  { label: string; icon: React.ReactNode; color: string; bgColor: string }
> = {
  todo: {
    label: "Zu erledigen",
    icon: <Circle className="h-4 w-4" />,
    color: "text-gray-600",
    bgColor: "bg-gray-50 border-gray-200",
  },
  in_progress: {
    label: "In Bearbeitung",
    icon: <Clock className="h-4 w-4" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
  },
  review: {
    label: "Review",
    icon: <Eye className="h-4 w-4" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
  },
  done: {
    label: "Erledigt",
    icon: <CheckCircle className="h-4 w-4" />,
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
  },
  blocked: {
    label: "Blockiert",
    icon: <OctagonX className="h-4 w-4" />,
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
  },
};

const priorityColors: Record<ProjectTaskPriority, string> = {
  critical: "bg-red-500 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-blue-500 text-white",
  low: "bg-gray-400 text-white",
};

interface KanbanColumnProps {
  status: ProjectTaskStatus;
  tasks: ProjectTask[];
  onMoveTask: (task: ProjectTask, newStatus: ProjectTaskStatus) => void;
  onAddTask?: () => void;
}

function KanbanColumn({
  status,
  tasks,
  onMoveTask,
  onAddTask,
}: KanbanColumnProps) {
  const config = statusConfig[status];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("ring-2", "ring-primary", "ring-opacity-50");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove(
      "ring-2",
      "ring-primary",
      "ring-opacity-50",
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove(
      "ring-2",
      "ring-primary",
      "ring-opacity-50",
    );
    const taskData = e.dataTransfer.getData("application/json");
    if (taskData) {
      const task = JSON.parse(taskData) as ProjectTask;
      if (task.status !== status) {
        onMoveTask(task, status);
      }
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border p-4 min-h-[400px]",
        config.bgColor,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={config.color}>{config.icon}</span>
          <h3 className={cn("font-semibold", config.color)}>{config.label}</h3>
          <Badge variant="secondary" className="ml-1">
            {tasks.length}
          </Badge>
        </div>
        {status === "todo" && onAddTask && (
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={onAddTask}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 space-y-2">
        {tasks.map((task) => (
          <KanbanCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}

interface KanbanCardProps {
  task: ProjectTask;
}

function KanbanCard({ task }: KanbanCardProps) {
  const priority = task.priority as ProjectTaskPriority;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(task));
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
  };

  return (
    <Card
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={cn("text-xs", priorityColors[priority])}>
                {priority === "critical"
                  ? "Kritisch"
                  : priority === "high"
                    ? "Hoch"
                    : priority === "medium"
                      ? "Mittel"
                      : "Niedrig"}
              </Badge>
              {task.status === "blocked" && task.blockingReason && (
                <span title={task.blockingReason}>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </span>
              )}
            </div>
            <p className="text-sm font-medium truncate">{task.title}</p>
            {task.phase && (
              <p className="text-xs text-muted-foreground mt-1">
                Phase:{" "}
                {task.phase === "planning"
                  ? "Planung"
                  : task.phase === "execution"
                    ? "Ausführung"
                    : task.phase === "delivery"
                      ? "Lieferung"
                      : "Abschluss"}
              </p>
            )}
            {task.assignedToId && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span className="truncate">{task.assignedToId}</span>
              </div>
            )}
            {task.status === "blocked" && task.blockingReason && (
              <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-700">
                <strong>Blockiert:</strong> {task.blockingReason}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (
    task: Omit<
      ProjectTask,
      | "_id"
      | "_rev"
      | "type"
      | "projectId"
      | "createdAt"
      | "createdBy"
      | "modifiedAt"
      | "modifiedBy"
      | "version"
    >,
  ) => Promise<void>;
}

function AddTaskDialog({ open, onOpenChange, onAdd }: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<ProjectTaskPriority>("medium");
  const [phase, setPhase] = useState<string>("execution");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        phase: phase as any,
        status: "todo",
        assignedToId: "user-1",
      });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setPhase("execution");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Neue Projekt-Aufgabe</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Aufgabe eingeben..."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Priorität</Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as ProjectTaskPriority)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Niedrig</SelectItem>
                    <SelectItem value="medium">Mittel</SelectItem>
                    <SelectItem value="high">Hoch</SelectItem>
                    <SelectItem value="critical">Kritisch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Phase</Label>
                <Select value={phase} onValueChange={setPhase}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planung</SelectItem>
                    <SelectItem value="execution">Ausführung</SelectItem>
                    <SelectItem value="delivery">Lieferung</SelectItem>
                    <SelectItem value="closure">Abschluss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim()}>
              {isSubmitting ? "Wird erstellt..." : "Erstellen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface ProjectTaskKanbanProps {
  projectId: string;
}

export function ProjectTaskKanban({ projectId }: ProjectTaskKanbanProps) {
  const { tasks, loading, addTask, updateTaskStatus } =
    useProjectTasks(projectId);
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const tasksByStatus: Record<ProjectTaskStatus, ProjectTask[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    review: tasks.filter((t) => t.status === "review"),
    done: tasks.filter((t) => t.status === "done"),
    blocked: tasks.filter((t) => t.status === "blocked"),
  };

  const handleMoveTask = async (
    task: ProjectTask,
    newStatus: ProjectTaskStatus,
  ) => {
    // For blocked status, we would need a dialog for reason
    // For now, just update the status
    await updateTaskStatus(task, newStatus);
  };

  const handleAddTask = async (task: any) => {
    await addTask(task);
  };

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasksByStatus.done.length;
  const blockedTasks = tasksByStatus.blocked.length;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="flex items-center gap-6 p-4 bg-muted/50 rounded-lg">
        <div>
          <p className="text-sm text-muted-foreground">Gesamt</p>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Erledigt</p>
          <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Blockiert</p>
          <p className="text-2xl font-bold text-red-600">{blockedTasks}</p>
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">Fortschritt</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-medium">{progressPercent}%</span>
          </div>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Aufgabe hinzufügen
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {(
          [
            "todo",
            "in_progress",
            "review",
            "done",
            "blocked",
          ] as ProjectTaskStatus[]
        ).map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            onMoveTask={handleMoveTask}
            onAddTask={
              status === "todo" ? () => setShowAddDialog(true) : undefined
            }
          />
        ))}
      </div>

      <AddTaskDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddTask}
      />
    </div>
  );
}
