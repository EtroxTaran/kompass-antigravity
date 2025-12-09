import { useState } from "react";
import {
  useUserTasks,
  UserTask,
  UserTaskStatus,
  UserTaskPriority,
} from "@/hooks/useUserTasks";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Check,
  Clock,
  AlertTriangle,
  Calendar,
  Filter,
  ListTodo,
} from "lucide-react";
import { cn } from "@/lib/utils";

const priorityColors: Record<UserTaskPriority, string> = {
  urgent: "bg-red-100 text-red-800 border-red-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-blue-100 text-blue-800 border-blue-200",
  low: "bg-gray-100 text-gray-800 border-gray-200",
};

const priorityLabels: Record<UserTaskPriority, string> = {
  urgent: "Dringend",
  high: "Hoch",
  medium: "Mittel",
  low: "Niedrig",
};

interface TaskItemProps {
  task: UserTask;
  onStatusChange: (status: UserTaskStatus) => void;
}

function TaskItem({ task, onStatusChange }: TaskItemProps) {
  const isOverdue =
    task.dueDate &&
    task.dueDate < new Date().toISOString().split("T")[0] &&
    !["completed", "cancelled"].includes(task.status);

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors",
        task.status === "completed" && "opacity-60",
        isOverdue && "border-red-300 bg-red-50/50",
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Checkbox
          checked={task.status === "completed"}
          onCheckedChange={(checked) =>
            onStatusChange(checked ? "completed" : "open")
          }
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium truncate",
                task.status === "completed" &&
                  "line-through text-muted-foreground",
              )}
            >
              {task.title}
            </span>
            <Badge
              variant="outline"
              className={cn("text-xs", priorityColors[task.priority])}
            >
              {priorityLabels[task.priority]}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Überfällig
              </Badge>
            )}
          </div>
          {task.dueDate && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3" />
              Fällig: {new Date(task.dueDate).toLocaleDateString("de-DE")}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {task.status !== "in_progress" && task.status !== "completed" && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onStatusChange("in_progress")}
            title="In Bearbeitung"
          >
            <Clock className="h-4 w-4 text-blue-500" />
          </Button>
        )}
        {task.status === "in_progress" && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onStatusChange("completed")}
            title="Erledigt"
          >
            <Check className="h-4 w-4 text-green-500" />
          </Button>
        )}
      </div>
    </div>
  );
}

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (task: Partial<UserTask>) => Promise<void>;
}

function AddTaskDialog({ open, onOpenChange, onAdd }: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<UserTaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
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
        dueDate: dueDate || undefined,
        status: "open",
      });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
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
            <DialogTitle>Neue Aufgabe</DialogTitle>
            <DialogDescription>
              Erstellen Sie eine neue persönliche Aufgabe.
            </DialogDescription>
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
                placeholder="Optionale Details..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priorität</Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as UserTaskPriority)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Niedrig</SelectItem>
                    <SelectItem value="medium">Mittel</SelectItem>
                    <SelectItem value="high">Hoch</SelectItem>
                    <SelectItem value="urgent">Dringend</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Fälligkeitsdatum</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
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

export function UserTaskDashboard() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<UserTaskStatus | "all">(
    "all",
  );
  const [priorityFilter, setPriorityFilter] = useState<
    UserTaskPriority | "all"
  >("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const {
    tasks,
    loading,
    addTask,
    updateTaskStatus,
    overdueTasks,
    tasksByStatus,
  } = useUserTasks(user?._id || "user-1", {
    status: statusFilter === "all" ? undefined : statusFilter,
    priority: priorityFilter === "all" ? undefined : priorityFilter,
  });

  const handleAddTask = async (task: Partial<UserTask>) => {
    await addTask(task as any);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeTasks = tasks.filter(
    (t) => !["completed", "cancelled"].includes(t.status),
  );

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Offen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{tasksByStatus.open.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              In Bearbeitung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {tasksByStatus.in_progress.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Erledigt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {tasksByStatus.completed.length}
            </p>
          </CardContent>
        </Card>
        <Card
          className={cn(
            "text-white",
            overdueTasks.length > 0
              ? "bg-gradient-to-br from-red-500 to-red-600"
              : "bg-gradient-to-br from-gray-400 to-gray-500",
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Überfällig
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{overdueTasks.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Task List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Meine Aufgaben</CardTitle>
            <CardDescription>
              {activeTasks.length} aktive Aufgaben
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* Filters */}
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as UserTaskStatus | "all")
              }
            >
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="open">Offen</SelectItem>
                <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                <SelectItem value="completed">Erledigt</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={(v) =>
                setPriorityFilter(v as UserTaskPriority | "all")
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priorität" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Prioritäten</SelectItem>
                <SelectItem value="urgent">Dringend</SelectItem>
                <SelectItem value="high">Hoch</SelectItem>
                <SelectItem value="medium">Mittel</SelectItem>
                <SelectItem value="low">Niedrig</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Neue Aufgabe
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Keine Aufgaben</h3>
              <p className="text-muted-foreground mb-4">
                Sie haben noch keine Aufgaben. Erstellen Sie Ihre erste Aufgabe!
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Aufgabe erstellen
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onStatusChange={(status) => updateTaskStatus(task, status)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddTaskDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleAddTask}
      />
    </div>
  );
}
