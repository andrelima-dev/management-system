/**
 * Padrões de mensagens para comunicação entre microserviços
 * Utilizados com @MessagePattern() nos controllers
 */

// ============= AUTH SERVICE PATTERNS =============
export const AUTH_PATTERNS = {
  // User registration
  USER_REGISTER: 'auth.user.register',
  
  // User login
  USER_LOGIN: 'auth.user.login',
  
  // Validate token
  TOKEN_VALIDATE: 'auth.token.validate',
  
  // Refresh token
  TOKEN_REFRESH: 'auth.token.refresh',

  // Revoke refresh token
  TOKEN_REVOKE: 'auth.token.revoke',
  
  // Get user by ID
  USER_GET_BY_ID: 'auth.user.get_by_id',
  
  // Get user by email
  USER_GET_BY_EMAIL: 'auth.user.get_by_email',
} as const;

// ============= TASKS SERVICE PATTERNS =============
export const TASKS_PATTERNS = {
  // Create task
  TASK_CREATE: 'tasks.task.create',
  
  // Get task by ID
  TASK_GET_BY_ID: 'tasks.task.get_by_id',
  
  // Get all tasks
  TASK_GET_ALL: 'tasks.task.get_all',
  
  // Update task
  TASK_UPDATE: 'tasks.task.update',
  
  // Delete task
  TASK_DELETE: 'tasks.task.delete',
  
  // Get tasks by user
  TASK_GET_BY_USER: 'tasks.task.get_by_user',
  
  // Create comment
  COMMENT_CREATE: 'tasks.comment.create',
  
  // Get comments by task
  COMMENT_GET_BY_TASK: 'tasks.comment.get_by_task',
  
  // Update task status
  TASK_UPDATE_STATUS: 'tasks.task.update_status',
} as const;

// ============= NOTIFICATIONS SERVICE PATTERNS =============
export const NOTIFICATIONS_PATTERNS = {
  // Send notification
  NOTIFICATION_SEND: 'notifications.notification.send',
  
  // Get notifications by user
  NOTIFICATION_GET_BY_USER: 'notifications.notification.get_by_user',
  
  // Mark notification as read
  NOTIFICATION_MARK_AS_READ: 'notifications.notification.mark_as_read',
  
  // Get notification by ID
  NOTIFICATION_GET_BY_ID: 'notifications.notification.get_by_id',
} as const;

// ============= EVENTS (para pub/sub) =============
export const EVENTS = {
  // User events
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  
  // Task events
  TASK_CREATED: 'task.created',
  TASK_UPDATED: 'task.updated',
  TASK_DELETED: 'task.deleted',
  TASK_STATUS_CHANGED: 'task.status_changed',
  
  // Comment events
  COMMENT_CREATED: 'comment.created',
  COMMENT_UPDATED: 'comment.updated',
  
  // Notification events
  NOTIFICATION_CREATED: 'notification.created',
} as const;
