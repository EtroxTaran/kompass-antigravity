import { BaseEntity } from '../../../shared/base.repository';

export enum NotificationType {
    ASSIGNMENT = 'ASSIGNMENT',
    STATUS_CHANGE = 'STATUS_CHANGE',
    APPROVAL = 'APPROVAL',
    MENTION = 'MENTION',
    SYSTEM = 'SYSTEM',
}

export interface Notification extends BaseEntity {
    type: 'notification';
    recipientId: string;
    notificationType: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    isRead: boolean;
}
