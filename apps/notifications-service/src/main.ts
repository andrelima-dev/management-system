import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Conectar como microservice RabbitMQ
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://jungle:jungle_pass@rabbitmq:5672'],
      queue: 'notifications_queue',
      queueOptions: { durable: true },
      prefetch: 1
    }
  });

  const port = process.env.PORT || 3003;
  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`🚀 Notifications service running on http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('❌ Error starting notifications service:', error);
  process.exit(1);
});
