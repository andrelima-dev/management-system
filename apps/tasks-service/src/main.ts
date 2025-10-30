import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { TaskDataSource } from './database/data-source';

async function runMigrations() {
  const logger = new Logger('Migrations');
  try {
    if (!TaskDataSource.isInitialized) {
      await TaskDataSource.initialize();
    }
    logger.log('Running migrations...');
    await TaskDataSource.runMigrations();
    logger.log('Migrations completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
  }
}

async function bootstrap() {
  const logger = new Logger('TasksService');

  // Run migrations first
  await runMigrations();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
        queue: 'jungle_tasks_service',
        queueOptions: {
          durable: true,
          arguments: {
            'x-max-priority': 10,
          },
        },
        prefetch: 10,
        isGlobal: true,
      },
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  await app.listen();
  logger.log('Tasks Microservice is listening on RabbitMQ');
}

void bootstrap();
