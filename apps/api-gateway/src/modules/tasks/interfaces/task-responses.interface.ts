import { TaskPriority, TaskStatus } from '@jungle/types';

export interface TaskAssigneeResponse {
  id: string;
  userId: string;
}

export interface TaskCommentResponse {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface TaskHistoryResponse {
  id: string;
  action: string;
  metadata?: Record<string, unknown> | null;
  performedById?: string | null;
  createdAt: string;
}

export interface TaskResponse {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  commentsCount?: number;
  assignees: TaskAssigneeResponse[];
  comments: TaskCommentResponse[];
  history: TaskHistoryResponse[];
}

export interface PaginatedTasksResponse {
  items: TaskResponse[];
  total: number;
  page: number;
  pageSize: number;
}
