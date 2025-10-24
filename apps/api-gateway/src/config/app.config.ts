import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  authServiceUrl: string;
  tasksServiceUrl: string;
  notificationsServiceUrl: string;
  jwtAccessPublicKey: string;
  rabbitMqUrl: string;
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    authServiceUrl: process.env.AUTH_SERVICE_URL ?? 'http://auth-service:3001',
    tasksServiceUrl: process.env.TASKS_SERVICE_URL ?? 'http://tasks-service:3002',
    notificationsServiceUrl:
      process.env.NOTIFICATIONS_SERVICE_URL ?? 'http://notifications-service:3003',
    jwtAccessPublicKey: process.env.JWT_ACCESS_PUBLIC_KEY ?? '',
    rabbitMqUrl: process.env.RABBITMQ_URL ?? ''
  })
);
