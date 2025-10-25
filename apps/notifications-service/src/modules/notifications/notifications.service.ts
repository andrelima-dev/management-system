import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './notification.entity';

export interface CreateNotificationDto {
  userId: string;
  type: 'task_assigned' | 'task_updated' | 'comment_added' | 'task_completed';
  message: string;
  relatedTaskId?: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>
  ) {}

  async create(dto: CreateNotificationDto): Promise<NotificationEntity> {
    const notification = this.notificationRepository.create({
      userId: dto.userId,
      type: dto.type,
      message: dto.message,
      relatedTaskId: dto.relatedTaskId,
      isRead: false
    });
    return this.notificationRepository.save(notification);
  }

  async list(userId: string, limit: number = 20, offset: number = 0) {
    const [items, total] = await this.notificationRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset
    });

    return {
      items,
      total,
      limit,
      offset
    };
  }

  async get(id: string, userId: string): Promise<NotificationEntity | null> {
    return this.notificationRepository.findOne({
      where: { id, userId }
    });
  }

  async markAsRead(id: string, userId: string): Promise<NotificationEntity> {
    await this.notificationRepository.update(
      { id, userId },
      { isRead: true }
    );
    return this.get(id, userId) as Promise<NotificationEntity>;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true }
    );
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.notificationRepository.delete({ id, userId });
  }
}
