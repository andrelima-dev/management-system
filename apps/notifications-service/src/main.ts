import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('NotificationsService');

  // Cria app HTTP para hospedar o WebSocket Gateway
  const app = await NestFactory.create(AppModule, { cors: true });

  // Conecta microserviço RMQ para consumo de eventos
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
      queue: 'jungle_notifications_service',
      queueOptions: {
        durable: true,
        arguments: {
          'x-max-priority': 10
        }
      },
      prefetch: 10,
      isGlobal: true
    }
  });

  await app.startAllMicroservices();
  const port = parseInt(process.env.PORT || '3003', 10);
  await app.listen(port);
  logger.log(`Notifications Microservice is listening on RabbitMQ and WS on :${port}`);
}

void bootstrap();
