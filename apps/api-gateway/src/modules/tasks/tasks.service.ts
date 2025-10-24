import {
  HttpException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { lastValueFrom } from 'rxjs';
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

interface RequestOptions {
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

@Injectable()
export class TasksService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService
  ) {
    this.baseUrl = configService.get<string>('app.tasksServiceUrl', {
      infer: true
    }) as string;
  }

  private async request<T>(
    method: Method,
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      method,
      url: `${this.baseUrl}${path}`,
      data: options.data,
      params: options.params,
      headers: options.headers
    };

    try {
      const response = await lastValueFrom(this.httpService.request<T>(config));
      return this.unwrap(response);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private unwrap<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  private mapError(error: unknown): HttpException {
    if (error instanceof HttpException) {
      return error;
    }

    if (this.isAxiosError(error) && error.response) {
      return new HttpException(
        this.normalizeErrorPayload(error.response.data),
        error.response.status
      );
    }

    return new InternalServerErrorException('Tasks service unavailable');
  }

  private isAxiosError(value: unknown): value is AxiosError {
    return !!value && typeof value === 'object' && 'isAxiosError' in value;
  }

  private normalizeErrorPayload(data: unknown): string | Record<string, unknown> {
    if (typeof data === 'string') {
      return data;
    }

    if (data && typeof data === 'object') {
      return data as Record<string, unknown>;
    }

    return 'Unknown error';
  }

  private userHeaders(userId: string): Record<string, string> {
    return {
      'x-user-id': userId
    };
  }

  private compact(params: Record<string, unknown>): Record<string, unknown> {
    return Object.entries(params).reduce<Record<string, unknown>>((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  list(query: ListTasksDto): Promise<PaginatedTasksResponse> {
    const params = this.compact(query as unknown as Record<string, unknown>);
    return this.request<PaginatedTasksResponse>('get', '/tasks', { params });
  }

  get(id: string): Promise<TaskResponse> {
    return this.request<TaskResponse>('get', `/tasks/${id}`);
  }

  create(userId: string, dto: CreateTaskDto): Promise<TaskResponse> {
    return this.request<TaskResponse>('post', '/tasks', {
      data: dto,
      headers: this.userHeaders(userId)
    });
  }

  update(id: string, userId: string, dto: UpdateTaskDto): Promise<TaskResponse> {
    return this.request<TaskResponse>('patch', `/tasks/${id}`, {
      data: dto,
      headers: this.userHeaders(userId)
    });
  }

  remove(id: string): Promise<void> {
    return this.request<void>('delete', `/tasks/${id}`);
  }

  createComment(taskId: string, userId: string, dto: CreateCommentDto): Promise<TaskCommentResponse> {
    return this.request<TaskCommentResponse>(
      'post',
      `/tasks/${taskId}/comments`,
      {
        data: dto,
        headers: this.userHeaders(userId)
      }
    );
  }

  listComments(taskId: string): Promise<TaskCommentResponse[]> {
    return this.request<TaskCommentResponse[]>(
      'get',
      `/tasks/${taskId}/comments`
    );
  }

  listHistory(taskId: string): Promise<TaskHistoryResponse[]> {
    return this.request<TaskHistoryResponse[]>(
      'get',
      `/tasks/${taskId}/history`
    );
  }
}
