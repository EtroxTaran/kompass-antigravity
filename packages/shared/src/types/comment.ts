export interface CommentAuthor {
  userId: string;
  name: string;
  avatarUrl?: string; // Optional for now
}

export interface Comment {
  id: string;
  content: string;
  author: CommentAuthor;
  createdAt: string; // ISO string
  updatedAt?: string;
  resolved?: boolean;
  replies?: Comment[];
  // Optional: references to specific parts of the entity (e.g. line item ID)
  contextId?: string;
}
