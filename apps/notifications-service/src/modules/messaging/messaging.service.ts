import { Injectable } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotificationsService } from '../notifications/notifications.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

interface TaskEvent {
  id: string;
  title: string;
  createdById: string;
  assigneeIds?: string[];
  oldStatus?: string;
  newStatus?: string;
}

interface CommentEvent {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
}

@Injectable()
export class MessagingService {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly realtimeGateway: RealtimeGateway
  ) {}

  // Alinha aos eventos definidos no README
  @EventPattern('task:created')
  async handleTaskCreated(@Payload() event: TaskEvent, @Ctx() context: RmqContext) {
    try {
      // Notificar todos os assignees
      if (event.assigneeIds && event.assigneeIds.length > 0) {
        for (const assigneeId of event.assigneeIds) {
          await this.notificationsService.create({
            userId: assigneeId,
            type: 'task_assigned',
            message: `Você foi atribuído à tarefa: ${event.title}`,
            relatedTaskId: event.id
          });
        }
        this.realtimeGateway.emit('task:created', event);
      }
      context.getChannelRef().ack(context.getMessage());
    } catch (error) {
      console.error('Error handling task.created event:', error);
    }
  }

  @EventPattern('task:updated')
  async handleTaskUpdated(@Payload() event: TaskEvent, @Ctx() context: RmqContext) {
    try {
      // Notificar sobre status changes
      if (event.oldStatus !== event.newStatus && event.assigneeIds) {
        const statusChangeMessage = `Tarefa "${event.title}" mudou para: ${event.newStatus}`;
        for (const assigneeId of event.assigneeIds) {
          await this.notificationsService.create({
            userId: assigneeId,
            type: 'task_updated',
            message: statusChangeMessage,
            relatedTaskId: event.id
          });
        }
        this.realtimeGateway.emit('task:updated', event);
      }
      context.getChannelRef().ack(context.getMessage());
    } catch (error) {
      console.error('Error handling task.updated event:', error);
    }
  }

  @EventPattern('comment:new')
  async handleCommentAdded(@Payload() event: CommentEvent, @Ctx() context: RmqContext) {
    try {
  // Notificar assignees sobre novo comentário (persistência e evento WS)
  this.realtimeGateway.emit('comment:new', event);
      context.getChannelRef().ack(context.getMessage());
    } catch (error) {
      console.error('Error handling comment.added event:', error);
    }
  }
}
