/**
 * Padrões de mensagens para comunicação entre microserviços
 * Utilizados com @MessagePattern() nos controllers
 */
export declare const AUTH_PATTERNS: {
    readonly USER_REGISTER: "auth.user.register";
    readonly USER_LOGIN: "auth.user.login";
    readonly TOKEN_VALIDATE: "auth.token.validate";
    readonly TOKEN_REFRESH: "auth.token.refresh";
    readonly TOKEN_REVOKE: "auth.token.revoke";
    readonly USER_GET_BY_ID: "auth.user.get_by_id";
    readonly USER_GET_BY_EMAIL: "auth.user.get_by_email";
};
export declare const TASKS_PATTERNS: {
    readonly TASK_CREATE: "tasks.task.create";
    readonly TASK_GET_BY_ID: "tasks.task.get_by_id";
    readonly TASK_GET_ALL: "tasks.task.get_all";
    readonly TASK_UPDATE: "tasks.task.update";
    readonly TASK_DELETE: "tasks.task.delete";
    readonly TASK_GET_BY_USER: "tasks.task.get_by_user";
    readonly COMMENT_CREATE: "tasks.comment.create";
    readonly COMMENT_GET_BY_TASK: "tasks.comment.get_by_task";
    readonly TASK_UPDATE_STATUS: "tasks.task.update_status";
};
export declare const NOTIFICATIONS_PATTERNS: {
    readonly NOTIFICATION_SEND: "notifications.notification.send";
    readonly NOTIFICATION_GET_BY_USER: "notifications.notification.get_by_user";
    readonly NOTIFICATION_MARK_AS_READ: "notifications.notification.mark_as_read";
    readonly NOTIFICATION_GET_BY_ID: "notifications.notification.get_by_id";
};
export declare const EVENTS: {
    readonly USER_CREATED: "user.created";
    readonly USER_UPDATED: "user.updated";
    readonly TASK_CREATED: "task.created";
    readonly TASK_UPDATED: "task.updated";
    readonly TASK_DELETED: "task.deleted";
    readonly TASK_STATUS_CHANGED: "task.status_changed";
    readonly COMMENT_CREATED: "comment.created";
    readonly COMMENT_UPDATED: "comment.updated";
    readonly NOTIFICATION_CREATED: "notification.created";
};
