import { BaseEntity } from "./base";

export interface TimeEntry extends BaseEntity {
  type: "time_entry";

  projectId: string;
  taskId?: string; // Optional link to a specific task
  userId: string; // Who performed the work

  startTime: string; // ISO string
  endTime?: string; // ISO string
  durationMinutes: number; // Calculated or entered manually

  description: string;

  isBillable: boolean;
}
