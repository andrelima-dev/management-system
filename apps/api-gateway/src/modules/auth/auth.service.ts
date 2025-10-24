import {
  HttpException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { LogoutAuthDto } from './dto/logout-auth.dto';

export interface AuthUserPayload {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUserPayload;
}

@Injectable()
export class AuthService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService
  ) {
    this.baseUrl = configService.get<string>('app.authServiceUrl', {
      infer: true
    }) as string;
  }

  private async request<T>(
    method: 'post' | 'patch' | 'get',
    path: string,
    payload?: unknown
  ): Promise<T> {
    try {
      const response = await lastValueFrom(
        this.httpService.request<T>({
          method,
          url: `${this.baseUrl}${path}`,
          data: payload
        })
      );
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

    return new InternalServerErrorException('Auth service unavailable');
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

  register(dto: RegisterAuthDto) {
    return this.request<AuthResponse>('post', '/auth/register', dto);
  }

  login(dto: LoginAuthDto) {
    return this.request<AuthResponse>('post', '/auth/login', dto);
  }

  refresh(dto: RefreshAuthDto) {
    return this.request<AuthResponse>('post', '/auth/refresh', dto);
  }

  async logout(dto: LogoutAuthDto) {
    await this.request<{ success: boolean }>('post', '/auth/logout', dto);
    return { success: true };
  }
}
