import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, ActivityType } from "@/hooks/useActivities";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Phone, Mail, Users, MapPin, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface ActivityFormProps {
  initialData?: Partial<Activity>;
  onSubmit: (data: Partial<Activity>) => Promise<void>;
  onCancel: () => void;
  customerId?: string;
}

const activityTypeConfig: Record<
  ActivityType,
  { label: string; icon: React.ReactNode }
> = {
  call: { label: "Anruf", icon: <Phone className="h-4 w-4" /> },
  email: { label: "E-Mail", icon: <Mail className="h-4 w-4" /> },
  meeting: { label: "Meeting", icon: <Users className="h-4 w-4" /> },
  visit: { label: "Besuch", icon: <MapPin className="h-4 w-4" /> },
  note: { label: "Notiz", icon: <FileText className="h-4 w-4" /> },
};

export function ActivityForm({
  initialData,
  onSubmit,
  onCancel,
  customerId,
}: ActivityFormProps) {
  const [activityType, setActivityType] = useState<ActivityType>(
    (initialData?.activityType as ActivityType) || "call",
  );
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [outcome, setOutcome] = useState(initialData?.outcome || "");
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split("T")[0],
  );
  const [duration, setDuration] = useState(
    initialData?.duration?.toString() || "",
  );
  const [followUpDate, setFollowUpDate] = useState(
    initialData?.followUpDate || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...initialData,
        activityType,
        customerId: customerId || initialData?.customerId,
        subject: subject.trim(),
        description: description.trim(), // Rich text HTML
        outcome: outcome.trim(),
        date,
        duration: duration ? parseInt(duration, 10) : undefined,
        followUpDate: followUpDate || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label>Aktivitätstyp</Label>
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(activityTypeConfig) as ActivityType[]).map((type) => {
            const cfg = activityTypeConfig[type];
            return (
              <Button
                key={type}
                type="button"
                variant={activityType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setActivityType(type)}
                className="flex items-center gap-1"
              >
                {cfg.icon}
                <span>{cfg.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="subject">Betreff *</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Kurze Beschreibung..."
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>Beschreibung (Details)</Label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Details zur Aktivität..."
          className="min-h-[200px]"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="outcome">Ergebnis</Label>
        <Input
          id="outcome"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          placeholder="Was wurde erreicht?"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label>Datum</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(new Date(date), "PPP")
                ) : (
                  <span>Datum wählen</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date ? new Date(date) : undefined}
                onSelect={(d) => d && setDate(d.toISOString().split("T")[0])}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="duration">Dauer (Min.)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
            max="480"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="followUp">Follow-up</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !followUpDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {followUpDate ? (
                  format(new Date(followUpDate), "PPP")
                ) : (
                  <span>Kein Follow-up</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={followUpDate ? new Date(followUpDate) : undefined}
                onSelect={(d) =>
                  setFollowUpDate(d ? d.toISOString().split("T")[0] : "")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isSubmitting || !subject.trim()}>
          {isSubmitting ? "Wird gespeichert..." : "Speichern"}
        </Button>
      </div>
    </form>
  );
}
