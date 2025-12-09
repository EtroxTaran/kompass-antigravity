import { useState } from "react";
import { useActivities, Activity, ActivityType } from "@/hooks/useActivities";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Phone,
  Mail,
  Users,
  MapPin,
  FileText,
  Calendar,
  Clock,
  ChevronRight,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ActivityForm } from "./ActivityForm";

const activityTypeConfig: Record<
  ActivityType,
  { label: string; icon: React.ReactNode; color: string; bgColor: string }
> = {
  call: {
    label: "Anruf",
    icon: <Phone className="h-4 w-4" />,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  email: {
    label: "E-Mail",
    icon: <Mail className="h-4 w-4" />,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  meeting: {
    label: "Meeting",
    icon: <Users className="h-4 w-4" />,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  visit: {
    label: "Besuch",
    icon: <MapPin className="h-4 w-4" />,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  note: {
    label: "Notiz",
    icon: <FileText className="h-4 w-4" />,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
};

interface ActivityItemProps {
  activity: Activity;
  onEdit?: (activity: Activity) => void;
}

function ActivityItem({ activity, onEdit }: ActivityItemProps) {
  const config = activityTypeConfig[activity.activityType];
  const activityDate = new Date(activity.date);
  const isToday = activity.date === new Date().toISOString().split("T")[0];
  const hasFollowUp =
    activity.followUpDate &&
    activity.followUpDate <= new Date().toISOString().split("T")[0];

  return (
    <div className="flex gap-4 group">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            config.bgColor,
            config.color,
          )}
        >
          {config.icon}
        </div>
        <div className="w-0.5 flex-1 bg-border" />
      </div>

      {/* Content */}
      <Card className="flex-1 mb-4 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="outline"
                  className={cn("text-xs", config.color)}
                >
                  {config.label}
                </Badge>
                {isToday && (
                  <Badge variant="secondary" className="text-xs">
                    Heute
                  </Badge>
                )}
                {hasFollowUp && (
                  <Badge variant="destructive" className="text-xs">
                    Follow-up fällig
                  </Badge>
                )}
              </div>
              <h4 className="font-semibold text-sm">{activity.subject}</h4>
              {activity.description && (
                <div
                  className="text-sm text-muted-foreground mt-1 line-clamp-3 prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: activity.description }}
                />
              )}
              {activity.outcome && (
                <p className="text-sm mt-2 p-2 bg-muted rounded">
                  <strong>Ergebnis:</strong> {activity.outcome}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {activityDate.toLocaleDateString("de-DE")}
                </span>
                {activity.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.duration} Min.
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onEdit?.(activity)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  onSave: (activity: Partial<Activity>) => Promise<void>;
  initialData?: Activity;
}

function ActivityDialog({
  open,
  onOpenChange,
  customerId,
  onSave,
  initialData,
}: ActivityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Aktivität bearbeiten" : "Neue Aktivität erfassen"}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] overflow-y-auto px-1">
          <ActivityForm
            customerId={customerId}
            initialData={initialData}
            onSubmit={async (data) => {
              await onSave(data);
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ActivityTimelineProps {
  customerId: string;
  contactId?: string;
  customerName?: string;
}

export function ActivityTimeline({
  customerId,
  contactId,
  customerName,
}: ActivityTimelineProps) {
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>(
    undefined,
  );

  const { activities, loading, addActivity, updateActivity, pendingFollowUps } =
    useActivities(customerId, {
      activityType: typeFilter === "all" ? undefined : typeFilter,
      contactId: contactId,
    });

  const handleOpenAdd = () => {
    setEditingActivity(undefined);
    setDialogOpen(true);
  };

  const handleOpenEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setDialogOpen(true);
  };

  const handleSave = async (data: Partial<Activity>) => {
    if (editingActivity) {
      await updateActivity(editingActivity, data);
    } else {
      await addActivity(data as any);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Aktivitäten</CardTitle>
          <CardDescription>
            {customerName
              ? `Aktivitätsprotokoll für ${customerName}`
              : "Kundeninteraktionen"}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v as ActivityType | "all")}
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Typen</SelectItem>
              {(Object.keys(activityTypeConfig) as ActivityType[]).map(
                (type) => (
                  <SelectItem key={type} value={type}>
                    {activityTypeConfig[type].label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <Button onClick={handleOpenAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Aktivität erfassen
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {pendingFollowUps.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-800 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {pendingFollowUps.length} Follow-up
              {pendingFollowUps.length > 1 ? "s" : ""} fällig
            </h4>
          </div>
        )}

        {activities.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Keine Aktivitäten</h3>
            <p className="text-muted-foreground mb-4">
              Es wurden noch keine Aktivitäten für diesen Kunden erfasst.
            </p>
            <Button onClick={handleOpenAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Erste Aktivität erfassen
            </Button>
          </div>
        ) : (
          <div className="relative">
            {activities.map((activity) => (
              <ActivityItem
                key={activity._id}
                activity={activity}
                onEdit={handleOpenEdit}
              />
            ))}
          </div>
        )}
      </CardContent>

      <ActivityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customerId={customerId}
        onSave={handleSave}
        initialData={editingActivity}
      />
    </Card>
  );
}
