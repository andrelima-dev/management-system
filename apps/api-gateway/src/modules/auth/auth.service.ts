import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { LogoutAuthDto } from './dto/logout-auth.dto';
import { MicroservicesClientService } from '../../infra/microservices/microservices-client.service';
import { type AuthResponse } from '@jungle/types';

@Injectable()
export class AuthService {
  constructor(private readonly microservicesClient: MicroservicesClientService) {}

  register(dto: RegisterAuthDto): Promise<AuthResponse> {
    return this.microservicesClient.registerUser({
      email: dto.email,
      password: dto.password,
      displayName: dto.displayName
    });
  }

  login(dto: LoginAuthDto): Promise<AuthResponse> {
    return this.microservicesClient.loginUser({
      email: dto.email,
      password: dto.password
    });
  }

  refresh(dto: RefreshAuthDto): Promise<AuthResponse> {
    return this.microservicesClient.refreshToken({
      userId: dto.userId,
      refreshToken: dto.refreshToken
    });
  }

  async logout(dto: LogoutAuthDto): Promise<{ success: boolean }> {
    await this.microservicesClient.revokeToken({
      userId: dto.userId,
      refreshToken: dto.refreshToken
    });
    return { success: true };
  }
}
