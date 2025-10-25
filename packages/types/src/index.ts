export type UserRole = 'admin' | 'manager' | 'member';

export interface UserSnapshot {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export interface TeamMember {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
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
