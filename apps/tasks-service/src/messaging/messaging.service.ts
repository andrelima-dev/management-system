import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import type { Channel, ChannelModel } from 'amqplib';

@Injectable()
export class MessagingService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MessagingService.name);
  private connection?: ChannelModel;
  private channel?: Channel;
  private readonly exchange: string;
  private readonly rabbitUrl: string;

  constructor(configService: ConfigService) {
    this.exchange = configService.get<string>('app.rabbitMqTasksExchange', {
      infer: true
    }) as string;
    this.rabbitUrl = configService.get<string>('app.rabbitMqUrl', {
      infer: true
    }) as string;
  }

  async onModuleInit(): Promise<void> {
    await this.ensureConnection();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.channel) {
      try {
        await this.channel.close();
      } catch (error) {
        this.logger.warn(`Error closing channel: ${(error as Error).message}`);
      }
      this.channel = undefined;
    }

    if (this.connection) {
      try {
        await this.connection.close();
      } catch (error) {
        this.logger.warn(`Error closing connection: ${(error as Error).message}`);
      }
      this.connection = undefined;
    }
  }

  private async ensureConnection(): Promise<void> {
    if (this.connection && this.channel) {
      return;
    }

    this.connection = await amqp.connect(this.rabbitUrl);
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange(this.exchange, 'topic', { durable: true });
    this.logger.log(`Connected to RabbitMQ exchange ${this.exchange}`);
  }

  async publish(routingKey: string, payload: unknown): Promise<void> {
    await this.ensureConnection();

    const message = Buffer.from(JSON.stringify(payload));
    const published = this.channel!.publish(this.exchange, routingKey, message, {
      contentType: 'application/json'
    });

    if (!published) {
      this.logger.warn(`Failed to publish message for ${routingKey}`);
    }
  }
}
