import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { NotificationEntity } from '../modules/notifications/notification.entity';

export const typeormConfig = (): TypeOrmModuleAsyncOptions => ({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    url: configService.get<string>('app.databaseUrl'),
    entities: [NotificationEntity],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    installExtensions: true
  }),
  inject: [ConfigService]
});
