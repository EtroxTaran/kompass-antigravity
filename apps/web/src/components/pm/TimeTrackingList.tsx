import { useNavigate } from "react-router-dom";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Clock, Edit } from "lucide-react";
import { format } from "date-fns";

interface TimeTrackingListProps {
  projectId?: string;
  userId?: string;
}

export function TimeTrackingList({ projectId, userId }: TimeTrackingListProps) {
  // If no projectId provided, we assume "my entries" logic or general list
  // But wait, existing hook `useTimeTracking` takes `projectId`.
  // I need to check `useTimeTracking` hook to see if it supports other filters or if I need to update it.
  // For now I'll assume I pass projectId if present.
  // Actually, I should inspect the hook first.
  //   const { timeEntries, loading, deleteTimeEntry } = useTimeTracking(projectId || "");
  const { timeEntries, deleteTimeEntry, loading } = useTimeTracking(
    projectId,
    userId,
  );
  const navigate = useNavigate();

  const totalMinutes = timeEntries.reduce(
    (acc, curr) => acc + curr.durationMinutes,
    0,
  );
  const totalHours = (totalMinutes / 60).toFixed(1);

  if (loading) return <div>Loading Time Entries...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Time Tracking</CardTitle>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            Total: {totalHours} hrs
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/time-entries/new?projectId=${projectId}`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Time
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {timeEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No time logs yet.
            </p>
          ) : (
            timeEntries.map((entry) => (
              <div
                key={entry._id}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{entry.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(entry.startTime), "MMM d, yyyy")} •{" "}
                    {entry.userId === "user-1" ? "You" : "Unknown"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold mr-2">
                    {entry.durationMinutes} min
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => navigate(`/time-entries/${entry._id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                    onClick={() => deleteTimeEntry(entry)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
