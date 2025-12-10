import { BaseEntity } from "./base";

export enum TimeEntryActivityType {
  INSTALLATION = "Installation",
  PLANNING = "Planning",
  TRAVEL = "Travel",
  CONSULTING = "Consulting",
  OTHER = "Other",
}

export interface TimeEntry extends BaseEntity {
  type: "time_entry";

  projectId: string;
  taskId?: string; // Optional link to a specific task
  userId: string; // Who performed the work

  startTime: string; // ISO string
  durationMinutes: number; // Calculated or entered manually

  activityType: TimeEntryActivityType;
  description: string;

  isBillable: boolean;
}
