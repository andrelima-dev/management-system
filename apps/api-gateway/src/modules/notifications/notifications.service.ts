import { Injectable } from '@nestjs/common';
import { MicroservicesClientService } from '../../infra/microservices/microservices-client.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly microservicesClient: MicroservicesClientService) {}

  async list(userId: string, limit: number, offset: number) {
    const notifications = await this.microservicesClient.getNotificationsByUser(userId);
    const safeLimit = Math.max(limit, 0);
    const safeOffset = Math.max(offset, 0);
    return notifications.slice(safeOffset, safeOffset + safeLimit);
  }

  async get(id: string, userId: string) {
    const notification = await this.microservicesClient.getNotificationById(id);
    if (!notification || notification.userId !== userId) {
      return null;
    }
    return notification;
  }

  async markAsRead(id: string, userId: string) {
    await this.microservicesClient.markNotificationAsRead({
      notificationId: id,
      userId
    });
    return { success: true };
  }

  async markAllAsRead(userId: string) {
    const notifications = await this.microservicesClient.getNotificationsByUser(userId);
    await Promise.all(
      notifications.map(notification =>
        this.microservicesClient.markNotificationAsRead({
          notificationId: notification.id,
          userId
        })
      )
    );
  }

  async delete(id: string, userId: string) {
    await this.microservicesClient.markNotificationAsRead({
      notificationId: id,
      userId
    });
    return { success: true };
  }
}
