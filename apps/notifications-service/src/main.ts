import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('NotificationsService');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
        queue: 'jungle_notifications_service',
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

  await app.listen();
  logger.log('Notifications Microservice is listening on RabbitMQ');
}

void bootstrap();
