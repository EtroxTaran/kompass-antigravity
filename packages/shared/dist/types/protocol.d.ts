import { BaseEntity } from "./base";
export interface Protocol extends BaseEntity {
    type: "protocol";
    title: string;
    date: string;
    customerId: string;
    opportunityId?: string;
    projectId?: string;
    participants: string[];
    summary: string;
    voiceNoteUrl?: string;
    transcription?: string;
    nextActions?: {
        task: string;
        assignee: string;
        dueDate?: string;
    }[];
    tags?: string[];
}
