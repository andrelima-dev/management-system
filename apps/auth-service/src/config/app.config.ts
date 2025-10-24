import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  accessSecret: string;
  accessTtl: string;
  refreshSecret: string;
  refreshTtl: string;
}

export interface AppConfig {
  port: number;
  jwt: JwtConfig;
  databaseUrl: string;
  databaseSsl: boolean;
  rabbitMqUrl: string;
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT ?? '3001', 10),
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET ?? 'change-me',
      accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
      refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-me-too',
      refreshTtl: process.env.JWT_REFRESH_TTL ?? '7d'
    },
    databaseUrl: process.env.DATABASE_URL ?? '',
    databaseSsl: process.env.DATABASE_SSL === 'true',
    rabbitMqUrl: process.env.RABBITMQ_URL ?? ''
  })
);
