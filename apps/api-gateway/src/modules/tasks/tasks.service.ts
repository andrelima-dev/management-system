import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ListTasksDto } from './dto/list-tasks.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  PaginatedTasksResponse,
  TaskCommentResponse,
  TaskHistoryResponse,
  TaskResponse
} from './interfaces/task-responses.interface';
import { MicroservicesClientService } from '../../infra/microservices/microservices-client.service';

type RemoteTask = Record<string, any>;

@Injectable()
export class TasksService {
  constructor(private readonly microservicesClient: MicroservicesClientService) {}

  private toIso(value?: string | Date | null): string | undefined {
    if (!value) {
      return undefined;
    }
    if (typeof value === 'string') {
      return value;
    }
    return value.toISOString();
  }

  private mapComment(comment: Record<string, any>): TaskCommentResponse {
    return {
      id: comment.id,
      authorId: comment.authorId,
      content: comment.content,
      createdAt: this.toIso(comment.createdAt) ?? new Date().toISOString()
    };
  }

  private mapHistory(entry: Record<string, any>): TaskHistoryResponse {
    return {
      id: entry.id,
      action: entry.action,
      metadata: entry.metadata ?? null,
      performedById: entry.performedById ?? null,
      createdAt: this.toIso(entry.createdAt) ?? new Date().toISOString()
    };
  }

  private mapTask(task: RemoteTask): TaskResponse {
    const comments = Array.isArray(task.comments)
      ? task.comments.map(comment => this.mapComment(comment))
      : [];
    const history = Array.isArray(task.history)
      ? task.history
          .map(entry => this.mapHistory(entry))
          .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
      : [];

    return {
      id: task.id,
      title: task.title,
      description: task.description ?? null,
      dueDate: this.toIso(task.dueDate) ?? null,
      priority: task.priority,
      status: task.status,
      createdById: task.createdById,
      createdAt: this.toIso(task.createdAt) ?? new Date().toISOString(),
      updatedAt: this.toIso(task.updatedAt) ?? new Date().toISOString(),
      commentsCount: comments.length,
      assignees: Array.isArray(task.assignees)
        ? task.assignees.map((assignee: Record<string, any>) => ({
            id: assignee.id,
            userId: assignee.userId
          }))
        : [],
      comments,
      history
    };
  }

  private applySearch(tasks: RemoteTask[], search?: string): RemoteTask[] {
    if (!search) {
      return tasks;
    }
    const normalized = search.toLowerCase();
    return tasks.filter(task => {
      const title = String(task.title ?? '').toLowerCase();
      const description = String(task.description ?? '').toLowerCase();
      return title.includes(normalized) || description.includes(normalized);
    });
  }

  private paginate<T>(items: T[], page: number, pageSize: number): T[] {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }

  async list(query: ListTasksDto, userId?: string): Promise<PaginatedTasksResponse> {
    const filters = {
      status: query.status,
      priority: query.priority
    };

    const rawTasks: RemoteTask[] = userId
      ? await this.microservicesClient.getTasksByUser(userId, filters)
      : await this.microservicesClient.getAllTasks();

    const filtered = this.applySearch(rawTasks, query.search);
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 10;
    const total = filtered.length;

    const pageItems = this.paginate(filtered, page, pageSize).map(task => this.mapTask(task));

    return {
      items: pageItems,
      total,
      page,
      pageSize
    };
  }

  async get(id: string): Promise<TaskResponse> {
    const task = await this.microservicesClient.getTaskById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return this.mapTask(task as RemoteTask);
  }

  async create(userId: string, dto: CreateTaskDto): Promise<TaskResponse> {
    const created = await this.microservicesClient.createTask({
      ...dto,
      userId
    });
    return this.mapTask(created as RemoteTask);
  }

  async update(id: string, userId: string, dto: UpdateTaskDto): Promise<TaskResponse> {
    const updated = await this.microservicesClient.updateTask({
      id,
      userId,
      ...dto
    });
    return this.mapTask(updated as RemoteTask);
  }

  async remove(id: string, userId?: string): Promise<void> {
    if (!userId) {
      throw new BadRequestException('Missing user context');
    }
    await this.microservicesClient.deleteTask(id, userId);
  }

  async createComment(taskId: string, userId: string, dto: CreateCommentDto): Promise<TaskCommentResponse> {
    const comment = await this.microservicesClient.createComment({
      taskId,
      userId,
      content: dto.content
    });
    return this.mapComment(comment as Record<string, any>);
  }

  async listComments(taskId: string): Promise<TaskCommentResponse[]> {
    const comments = await this.microservicesClient.getCommentsByTask(taskId);
    return (comments as Record<string, any>[]).map(comment => this.mapComment(comment));
  }

  async listHistory(taskId: string): Promise<TaskHistoryResponse[]> {
    const task = await this.microservicesClient.getTaskById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return this.mapTask(task as RemoteTask).history;
  }
}
