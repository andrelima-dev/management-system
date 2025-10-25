import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { lastValueFrom } from 'rxjs';

interface RequestOptions {
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

@Injectable()
export class NotificationsService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService
  ) {
    this.baseUrl = configService.get<string>('app.notificationsServiceUrl', {
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
      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const axiosError = error as AxiosError;
      if (axiosError.response) {
        throw new HttpException(axiosError.response.data as any, axiosError.response.status);
      }

      throw new InternalServerErrorException('Failed to communicate with Notifications Service');
    }
  }

  list(userId: string, limit: number, offset: number) {
    return this.request('GET', '', {
      params: { limit, offset },
      headers: { 'x-user-id': userId }
    });
  }

  get(id: string, userId: string) {
    return this.request('GET', `/${id}`, {
      headers: { 'x-user-id': userId }
    });
  }

  markAsRead(id: string, userId: string) {
    return this.request('PATCH', `/${id}/read`, {
      headers: { 'x-user-id': userId }
    });
  }

  markAllAsRead(userId: string) {
    return this.request('PATCH', '/read-all', {
      headers: { 'x-user-id': userId }
    });
  }

  delete(id: string, userId: string) {
    return this.request('DELETE', `/${id}`, {
      headers: { 'x-user-id': userId }
    });
  }
}
