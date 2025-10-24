export type UserRole = 'admin' | 'manager' | 'member';

export interface UserSnapshot {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface TaskSnapshot {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeIds: string[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
}
