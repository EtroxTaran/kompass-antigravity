import { BaseEntity } from "./base";

export interface Protocol extends BaseEntity {
  type: "protocol";

  // Context
  title: string;
  date: string; // ISO Date of the meeting/visit
  customerId: string;
  opportunityId?: string;
  projectId?: string;

  // Participants
  participants: string[]; // List of names or IDs

  // Content
  summary: string;

  // Voice Note (Phase 1 placeholder)
  voiceNoteUrl?: string;
  transcription?: string; // For Phase 1 manual or future AI

  // Follow-up
  nextActions?: {
    task: string;
    assignee: string;
    dueDate?: string;
  }[];

  tags?: string[];
}
