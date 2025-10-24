import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  databaseUrl: string;
  rabbitMqUrl: string;
  rabbitMqTasksExchange: string;
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT ?? '3002', 10),
    databaseUrl: process.env.DATABASE_URL ?? '',
    rabbitMqUrl: process.env.RABBITMQ_URL ?? '',
    rabbitMqTasksExchange: process.env.RABBITMQ_TASKS_EXCHANGE ?? 'tasks.events'
  })
);
