import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  databaseUrl: string;
  rabbitMqUrl: string;
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT ?? '3003', 10),
    databaseUrl: process.env.DATABASE_URL ?? 'postgres://jungle:jungle_pass@postgres:5432/jungle',
    rabbitMqUrl: process.env.RABBITMQ_URL ?? 'amqp://jungle:jungle_pass@rabbitmq:5672'
  })
);
