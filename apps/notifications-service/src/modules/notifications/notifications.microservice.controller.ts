import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { NOTIFICATIONS_PATTERNS, EVENTS } from '@jungle/types';
import type { SendNotificationDto, MarkNotificationAsReadDto } from '@jungle/types';

@Controller()
export class NotificationsMicroserviceController {
  @MessagePattern(NOTIFICATIONS_PATTERNS.NOTIFICATION_SEND)
  async sendNotification(@Payload() payload: SendNotificationDto) {
    // Implementar lógica de envio de notificação
    console.log('Sending notification:', payload);
    return { success: true, notificationId: Math.random().toString() };
  }

  @MessagePattern(NOTIFICATIONS_PATTERNS.NOTIFICATION_GET_BY_USER)
  async getNotificationsByUser(@Payload() userId: string) {
    // Implementar lógica para recuperar notificações
    console.log('Getting notifications for user:', userId);
    return [];
  }

  @MessagePattern(NOTIFICATIONS_PATTERNS.NOTIFICATION_MARK_AS_READ)
  async markNotificationAsRead(@Payload() payload: MarkNotificationAsReadDto) {
    // Implementar lógica para marcar como lida
    console.log('Marking notification as read:', payload);
    return { success: true };
  }

  @MessagePattern(NOTIFICATIONS_PATTERNS.NOTIFICATION_GET_BY_ID)
  async getNotificationById(@Payload() notificationId: string) {
    // Implementar lógica para recuperar notificação
    console.log('Getting notification:', notificationId);
    return { id: notificationId };
  }

  // ============= Event Listeners =============

  @EventPattern(EVENTS.TASK_CREATED)
  async onTaskCreated(@Payload() data: any) {
    console.log('Task created event received:', data);
    // Enviar notificação para o usuário
  }

  @EventPattern(EVENTS.TASK_UPDATED)
  async onTaskUpdated(@Payload() data: any) {
    console.log('Task updated event received:', data);
    // Enviar notificação para usuários relacionados
  }

  @EventPattern(EVENTS.TASK_DELETED)
  async onTaskDeleted(@Payload() data: any) {
    console.log('Task deleted event received:', data);
  }

  @EventPattern(EVENTS.TASK_STATUS_CHANGED)
  async onTaskStatusChanged(@Payload() data: any) {
    console.log('Task status changed event received:', data);
  }

  @EventPattern(EVENTS.COMMENT_CREATED)
  async onCommentCreated(@Payload() data: any) {
    console.log('Comment created event received:', data);
  }

  @EventPattern(EVENTS.USER_CREATED)
  async onUserCreated(@Payload() data: any) {
    console.log('User created event received:', data);
  }
}
