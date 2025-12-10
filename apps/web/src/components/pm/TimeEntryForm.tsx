import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { timeEntriesApi } from "@/services/apiClient";
import { useTimeEntry } from "@/hooks/useTimeEntry";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TimeEntry } from "@kompass/shared";

export function TimeEntryForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultProjectId = searchParams.get("projectId") || "";

  const { entry, loading, saveEntry, deleteEntry } = useTimeEntry(id);
  const { projects } = useProjects(); // Fetches all projects for selection

  const form = useForm<Partial<TimeEntry>>({
    defaultValues: {
      projectId: defaultProjectId,
      description: "",
      startTime: new Date().toISOString(),
      durationMinutes: 60,
      isBillable: true,
      userId: "user-1", // Default, should be current user
    },
  });

  useEffect(() => {
    if (entry) {
      form.reset(entry);
    }
  }, [entry, form]);

  // Daily Limit Check
  const watchedStartTime = form.watch("startTime");
  const watchedDuration = form.watch("durationMinutes");
  const [dailyTotal, setDailyTotal] = useState(0);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  useEffect(() => {
    const checkDailyLimit = async () => {
      if (!watchedStartTime) return;
      try {
        const date = new Date(watchedStartTime).toISOString();
        const response = await timeEntriesApi.getDailyTotal(date);
        setDailyTotal(response.totalHours);
      } catch (error) {
        console.error("Failed to fetch daily total", error);
      }
    };
    checkDailyLimit();
  }, [watchedStartTime]);

  useEffect(() => {
    const currentHours = (watchedDuration || 0) / 60;
    if (dailyTotal + currentHours > 10) {
      setShowLimitWarning(true);
    } else {
      setShowLimitWarning(false);
    }
  }, [dailyTotal, watchedDuration]);

  const onSubmit = async (data: Partial<TimeEntry>) => {
    try {
      await saveEntry(data);
    } catch (error) {
      // Error handled in hook
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {id ? "Edit Time Entry" : "Log Time"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {id && (
            <Button variant="destructive" size="icon" onClick={deleteEntry}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button onClick={form.handleSubmit(onSubmit)}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Entry Details</CardTitle>
        </CardHeader>
        <CardContent>
          {showLimitWarning && (
            <div className="mb-4 p-4 border-l-4 border-yellow-500 bg-yellow-50 text-yellow-700">
              <p className="font-bold">Warning</p>
              <p>
                Total hours for this day ({dailyTotal.toFixed(1)} +{" "}
                {((watchedDuration || 0) / 60).toFixed(1)}) exceed the 10-hour
                limit.
              </p>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="projectId"
                rules={{ required: "Project is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project._id} value={project._id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activityType"
                rules={{ required: "Activity type is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Installation">Installation</SelectItem>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="What did you do?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(date?.toISOString())
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isBillable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Billable</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
