import { BaseEntity } from './base';

export interface ProjectTask extends BaseEntity {
    type: 'project_task';

    // Associations
    projectId: string;
    parentTaskId?: string; // Hierarchical tasks

    // Core Info
    title: string;
    description?: string;

    // Status
    status: 'todo' | 'in_progress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high' | 'urgent';

    // Execution
    assignedToId?: string;
    dueDate?: string;

    estimatedHours?: number;
    actualHours?: number;
}
