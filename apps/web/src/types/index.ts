export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: string;
  };
}

export interface TeamMember {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'manager' | 'member';
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

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdById: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  assigneeIds?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Comment {
  id: string;
  content: string;
  createdBy: {
    id: string;
    displayName: string;
  };
  createdAt: string;
}

export interface TaskHistory {
  id: string;
  action: string;
  metadata: Record<string, any>;
  performedBy: {
    id: string;
    displayName: string;
  };
  createdAt: string;
}
