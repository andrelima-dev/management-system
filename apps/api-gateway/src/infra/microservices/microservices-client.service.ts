import { Inject, Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import {
  AUTH_PATTERNS,
  TASKS_PATTERNS,
  NOTIFICATIONS_PATTERNS,
  type RegisterUserDto,
  type LoginUserDto,
  type RefreshTokenDto,
  type CreateTaskDto,
  type UpdateTaskDto,
  type SendNotificationDto,
} from '@jungle/types';

@Injectable()
export class MicroservicesClientService {
  private readonly logger = new Logger(MicroservicesClientService.name);
  private readonly REQUEST_TIMEOUT = 30000; // 30 segundos

  constructor(
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    @Inject('TASKS_SERVICE') private tasksService: ClientProxy,
    @Inject('NOTIFICATIONS_SERVICE') private notificationsService: ClientProxy
  ) {}

  // ============= AUTH SERVICE CALLS =============

  async registerUser(dto: RegisterUserDto) {
    this.logger.log('Calling auth.user.register');
    try {
      const result = await firstValueFrom(
        this.authService.send(AUTH_PATTERNS.USER_REGISTER, dto).pipe(
          timeout(this.REQUEST_TIMEOUT)
        )
      );
      return result;
    } catch (error) {
      this.logger.error('Error registering user:', error);
      throw new BadRequestException('Failed to register user');
    }
  }

  async loginUser(dto: LoginUserDto) {
    this.logger.log('Calling auth.user.login');
    try {
      const result = await firstValueFrom(
        this.authService.send(AUTH_PATTERNS.USER_LOGIN, dto).pipe(
          timeout(this.REQUEST_TIMEOUT)
        )
      );
      return result;
    } catch (error) {
      this.logger.error('Error logging in user:', error);
      throw new BadRequestException('Failed to login');
    }
  }

  async refreshToken(dto: RefreshTokenDto) {
    this.logger.log('Calling auth.token.refresh');
    try {
      const result = await firstValueFrom(
        this.authService.send(AUTH_PATTERNS.TOKEN_REFRESH, dto).pipe(
          timeout(this.REQUEST_TIMEOUT)
        )
      );
      return result;
    } catch (error) {
      this.logger.error('Error refreshing token:', error);
      throw new BadRequestException('Failed to refresh token');
    }
  }

  async validateToken(token: string) {
    this.logger.log('Calling auth.token.validate');
    try {
      const result = await firstValueFrom(
        this.authService.send(AUTH_PATTERNS.TOKEN_VALIDATE, token).pipe(
          timeout(this.REQUEST_TIMEOUT)
        )
      );
      return result;
    } catch (error) {
      this.logger.error('Error validating token:', error);
      return { valid: false };
    }
  }

  async getUserById(userId: string) {
    this.logger.log('Calling auth.user.get_by_id');
    try {
      const result = await firstValueFrom(
        this.authService.send(AUTH_PATTERNS.USER_GET_BY_ID, userId).pipe(
          timeout(this.REQUEST_TIMEOUT)
        )
      );
      return result;
    } catch (error) {
      this.logger.error('Error getting user by ID:', error);
      return null;
    }
  }

  // ============= TASKS SERVICE CALLS =============

  async createTask(dto: CreateTaskDto & { userId: string }) {
    this.logger.log('Calling tasks.task.create');
    try {
      const result = await firstValueFrom(
        this.tasksService.send(TASKS_PATTERNS.TASK_CREATE, dto).pipe(
          timeout(this.REQUEST_TIMEOUT)
        )
      );
      return result;
    } catch (error) {
      this.logger.error('Error creating task:', error);
      throw new BadRequestException('Failed to create task');
    }
  }

  async getTaskById(taskId: string) {
    this.logger.log('Calling tasks.task.get_by_id');
    try {
      const result = await firstValueFrom(
        this.tasksService.send(TASKS_PATTERNS.TASK_GET_BY_ID, taskId).pipe(
          timeout(this.REQUEST_TIMEOUT)
        )
      );
      return result;
    } catch (error) {
      this.logger.error('Error getting task:', error);
      return null;
    }
  }

  async getAllTasks() {
    this.logger.log('Calling tasks.task.get_all');
    try {
      const result = await firstValueFrom(
        this.tasksService.send(TASKS_PATTERNS.TASK_GET_ALL, {}).pipe(
          timeout(this.REQUEST_TIMEOUT)
        )
      );
      return result;
    } catch (error) {
      this.logger.error('Error getting all tasks:', error);
      return [];
    }
  }

  async updateTask(dto: UpdateTaskDto) {
    this.logger.log('Calling tasks.task.update');
    try {
      const result = await firstValueFrom(
        this.tasksService.send(TASKS_PATTERNS.TASK_UPDATE, dto).pipe(
          timeout(this.REQUEST_TIMEOUT)
        )
      );
      return result;
    } catch (error) {
      this.logger.error('Error updating task:', error);
      throw new BadRequestException('Failed to update task');
    }
  }

  async deleteTask(taskId: string, userId: string) {
    this.logger.log('Calling tasks.task.delete');
    try {
      const result = await firstValueFrom(
        this.tasksService.send(TASKS_PATTERNS.TASK_DELETE, { taskId, userId }).pipe(
          timeout(this.REQUEST_TIMEOUT)
        )
      );
      return result;
    } catch (error) {
      this.logger.error('Error deleting task:', error);
      throw new BadRequestException('Failed to delete task');
    }
  }

  async getTasksByUser(userId: string, filters?: { status?: string; priority?: string }) {
    this.logger.log('Calling tasks.task.get_by_user');
    try {
      const result = await firstValueFrom(
        this.tasksService
          .send(TASKS_PATTERNS.TASK_GET_BY_USER, { userId, ...filters })
          .pipe(timeout(this.REQUEST_TIMEOUT))
      );
      return result;
    } catch (error) {
      this.logger.error('Error getting tasks by user:', error);
      return [];
    }
  }

  async updateTaskStatus(taskId: string, status: string, userId: string) {
    this.logger.log('Calling tasks.task.update_status');
    try {
      const result = await firstValueFrom(
        this.tasksService.send(TASKS_PATTERNS.TASK_UPDATE_STATUS, { taskId, status, userId }).pipe(
          timeout(this.REQUEST_TIMEOUT)
        )
      );
      return result;
    } catch (error) {
      this.logger.error('Error updating task status:', error);
      throw new BadRequestException('Failed to update task status');
    }
  }

  // ============= NOTIFICATIONS SERVICE CALLS =============

  async sendNotification(dto: SendNotificationDto) {
    this.logger.log('Calling notifications.notification.send');
    try {
      const result = await firstValueFrom(
        this.notificationsService.send(NOTIFICATIONS_PATTERNS.NOTIFICATION_SEND, dto).pipe(
          timeout(this.REQUEST_TIMEOUT)
        )
      );
      return result;
    } catch (error) {
      this.logger.error('Error sending notification:', error);
      return { success: false };
    }
  }

  async getNotificationsByUser(userId: string) {
    this.logger.log('Calling notifications.notification.get_by_user');
    try {
      const result = await firstValueFrom(
        this.notificationsService.send(NOTIFICATIONS_PATTERNS.NOTIFICATION_GET_BY_USER, userId).pipe(
          timeout(this.REQUEST_TIMEOUT)
        )
      );
      return result;
    } catch (error) {
      this.logger.error('Error getting notifications:', error);
      return [];
    }
  }
}
