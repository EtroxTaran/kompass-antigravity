export type NotificationType =
  | "ASSIGNMENT"
  | "MENTION"
  | "SYSTEM"
  | "REMINDER"
  | "APPROVAL"
  | "DEADLINE";

export interface Notification {
  _id: string;
  type: "notification";
  recipientId: string;
  notificationType: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  version: number;
}
