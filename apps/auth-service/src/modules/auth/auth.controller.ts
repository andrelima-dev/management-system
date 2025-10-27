import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { AUTH_PATTERNS } from '@jungle/types';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.USER_REGISTER)
  async register(@Payload() dto: RegisterAuthDto) {
    return this.authService.register(dto);
  }

  @MessagePattern(AUTH_PATTERNS.USER_LOGIN)
  async login(@Payload() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  @MessagePattern(AUTH_PATTERNS.TOKEN_REFRESH)
  async refresh(@Payload() dto: RefreshAuthDto) {
    return this.authService.refresh(dto);
  }

  @MessagePattern(AUTH_PATTERNS.USER_GET_BY_ID)
  async getUserById(@Payload() userId: string) {
    return this.authService.getUserById(userId);
  }

  @MessagePattern(AUTH_PATTERNS.USER_GET_BY_EMAIL)
  async getUserByEmail(@Payload() email: string) {
    return this.authService.getUserByEmail(email);
  }

  @MessagePattern(AUTH_PATTERNS.TOKEN_VALIDATE)
  async validateToken(@Payload() token: string) {
    return this.authService.validateToken(token);
  }
}
