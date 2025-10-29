import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroservicesClientService } from './microservices-client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
          queue: 'jungle_auth_service',
          queueOptions: {
            durable: true,
          },
          prefetchCount: 10,
        },
      },
      {
        name: 'TASKS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
          queue: 'jungle_tasks_service',
          queueOptions: {
            durable: true,
          },
          prefetchCount: 10,
        },
      },
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
          queue: 'jungle_notifications_service',
          queueOptions: {
            durable: true,
          },
          prefetchCount: 10,
        },
      },
    ]),
  ],
  providers: [MicroservicesClientService],
  exports: [ClientsModule, MicroservicesClientService],
})
export class MicroservicesModule {}
