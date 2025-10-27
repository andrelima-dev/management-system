import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { TaskPriority, TaskStatus } from './task.entity';
import type { CreateTaskDto as LocalCreateTaskDto } from './dto/create-task.dto';
import type { UpdateTaskDto as LocalUpdateTaskDto } from './dto/update-task.dto';
import { TASKS_PATTERNS } from '@jungle/types';
import type {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
  GetTasksByUserDto,
} from '@jungle/types';

@Controller()
export class TasksMicroserviceController {
  constructor(private readonly tasksService: TasksService) {}
  private mapPriority(p?: string): TaskPriority | undefined {
    if (!p) return undefined;
    switch (p.toLowerCase()) {
      case 'low':
        return TaskPriority.LOW;
      case 'medium':
        return TaskPriority.MEDIUM;
      case 'high':
        return TaskPriority.HIGH;
      case 'urgent':
        return TaskPriority.URGENT;
      default:
        return undefined;
    }
  }

  private mapStatus(s?: string): TaskStatus | undefined {
    if (!s) return undefined;
    switch (s.toLowerCase()) {
      case 'todo':
        return TaskStatus.TODO;
      case 'in_progress':
        return TaskStatus.IN_PROGRESS;
      case 'review':
        return TaskStatus.REVIEW;
      case 'done':
        return TaskStatus.DONE;
      default:
        return undefined;
    }
  }

  @MessagePattern(TASKS_PATTERNS.TASK_CREATE)
  async createTask(@Payload() payload: CreateTaskDto & { userId: string }) {
    const dto: LocalCreateTaskDto = {
      title: payload.title,
      description: payload.description,
      dueDate: payload.dueDate,
      priority: this.mapPriority(payload.priority),
      assigneeIds: payload.assigneeIds,
    } as LocalCreateTaskDto;
    return this.tasksService.create(dto, payload.userId);
  }

  @MessagePattern(TASKS_PATTERNS.TASK_GET_BY_ID)
  async getTaskById(@Payload() taskId: string) {
    return this.tasksService.findById(taskId);
  }

  @MessagePattern(TASKS_PATTERNS.TASK_GET_ALL)
  async getAllTasks() {
    return this.tasksService.findAll();
  }

  @MessagePattern(TASKS_PATTERNS.TASK_UPDATE)
  async updateTask(@Payload() payload: UpdateTaskDto) {
    const dto: LocalUpdateTaskDto = {
      title: payload.title,
      description: payload.description,
      dueDate: payload.dueDate,
      priority: this.mapPriority(payload.priority),
      status: this.mapStatus(payload.status) as TaskStatus | undefined,
      assigneeIds: payload.assigneeIds,
    } as LocalUpdateTaskDto;
    return this.tasksService.update(payload.id, dto, payload.userId);
  }

  @MessagePattern(TASKS_PATTERNS.TASK_DELETE)
  async deleteTask(@Payload() payload: { taskId: string; userId: string }) {
    return this.tasksService.delete(payload.taskId, payload.userId);
  }

  @MessagePattern(TASKS_PATTERNS.TASK_GET_BY_USER)
  async getTasksByUser(@Payload() payload: GetTasksByUserDto) {
    return this.tasksService.getByUser(payload.userId, {
      status: this.mapStatus(payload.status) as any,
      priority: this.mapPriority(payload.priority) as any,
    });
  }

  @MessagePattern(TASKS_PATTERNS.TASK_UPDATE_STATUS)
  async updateTaskStatus(@Payload() payload: UpdateTaskStatusDto) {
    const status = this.mapStatus(payload.status) as TaskStatus;
    return this.tasksService.updateStatus(payload.taskId, status, payload.userId);
  }

  @MessagePattern(TASKS_PATTERNS.COMMENT_CREATE)
  async createComment(@Payload() payload: any) {
    return this.tasksService.addComment(payload.taskId, payload, payload.userId);
  }

  @MessagePattern(TASKS_PATTERNS.COMMENT_GET_BY_TASK)
  async getCommentsByTask(@Payload() taskId: string) {
    return this.tasksService.getComments(taskId);
  }
}
