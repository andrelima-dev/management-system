import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { TokensService } from '../tokens/tokens.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { JwtConfig } from '../../config/app.config';
import { UserEntity } from '../users/user.entity';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends TokenPair {
  user: {
    id: string;
    email: string;
    displayName: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  private readonly jwtConfig: JwtConfig;

  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly jwtService: JwtService,
    configService: ConfigService
  ) {
    this.jwtConfig = configService.get<JwtConfig>('app.jwt', {
      infer: true
    }) as JwtConfig;
  }

  private async signAccessToken(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.accessSecret,
      expiresIn: this.jwtConfig.accessTtl
    });
  }

  private async signRefreshToken(payload: Record<string, unknown>): Promise<{ token: string; expiresAt: Date }> {
    const token = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshTtl
    });
    const decoded = await this.jwtService.verifyAsync<{ exp: number }>(token, {
      secret: this.jwtConfig.refreshSecret
    });

    return {
      token,
      expiresAt: new Date(decoded.exp * 1000)
    };
  }

  private buildPayload(userId: string, email: string, role: string) {
    return {
      sub: userId,
      email,
      role
    };
  }

  private async issueTokens(user: UserEntity): Promise<AuthResponse> {
    const payload = this.buildPayload(user.id, user.email, user.role);
    const accessToken = await this.signAccessToken(payload);
    const { token: refreshToken, expiresAt } = await this.signRefreshToken(payload);
    await this.tokensService.issue(user, refreshToken, expiresAt);
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role
      }
    };
  }

  async register(dto: RegisterAuthDto): Promise<AuthResponse> {
    const passwordHash = await argon2.hash(dto.password, { type: argon2.argon2id });
    const user = await this.usersService.create({
      email: dto.email,
      displayName: dto.displayName,
      passwordHash
    });
    return this.issueTokens(user);
  }

  async login(dto: LoginAuthDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user);
  }

  async refresh(dto: RefreshAuthDto): Promise<AuthResponse> {
    const { userId, refreshToken } = dto;
    const isValid = await this.tokensService.validate(userId, refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = await this.jwtService.verifyAsync<{ sub: string; email: string; role: string }>(refreshToken, {
      secret: this.jwtConfig.refreshSecret
    });

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.issueTokens(user);
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.tokensService.revoke(userId, refreshToken);
  }
}
