/**
 * DTOs e interfaces para mensagens de microserviços
 */
export interface RegisterUserDto {
    email: string;
    password: string;
    displayName: string;
}
export interface LoginUserDto {
    email: string;
    password: string;
}
export interface ValidateTokenDto {
    token: string;
}
export interface RefreshTokenDto {
    userId: string;
    refreshToken: string;
}
export interface LogoutTokenDto {
    userId: string;
    refreshToken: string;
}
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
export interface UserResponse {
    id: string;
    email: string;
    displayName: string;
    role: string;
    createdAt: Date;
}
export interface CreateTaskDto {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    status?: 'todo' | 'in_progress' | 'review' | 'done';
    assigneeIds?: string[];
    userId: string;
}
export interface UpdateTaskDto {
    id: string;
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    status?: 'todo' | 'in_progress' | 'review' | 'done';
    assigneeIds?: string[];
    userId: string;
}
export interface TaskResponse {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'todo' | 'in_progress' | 'review' | 'done';
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateCommentDto {
    taskId: string;
    userId: string;
    content: string;
}
export interface CommentResponse {
    id: string;
    taskId: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface GetTasksByUserDto {
    userId: string;
    status?: string;
    priority?: string;
}
export interface UpdateTaskStatusDto {
    taskId: string;
    status: 'todo' | 'in_progress' | 'review' | 'done';
    userId: string;
}
export interface SendNotificationDto {
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    metadata?: Record<string, any>;
}
export interface NotificationResponse {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    read: boolean;
    createdAt: Date;
}
export interface MarkNotificationAsReadDto {
    notificationId: string;
    userId: string;
}
export interface MicroserviceErrorResponse {
    statusCode: number;
    message: string;
    error: string;
    timestamp?: string;
}
export interface MicroserviceResponse<T> {
    success: boolean;
    data?: T;
    error?: MicroserviceErrorResponse;
}
