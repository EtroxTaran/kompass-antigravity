import { BaseEntity } from './base';
export interface ProjectTask extends BaseEntity {
    type: 'project_task';
    projectId: string;
    parentTaskId?: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignedToId?: string;
    dueDate?: string;
    estimatedHours?: number;
    actualHours?: number;
}
