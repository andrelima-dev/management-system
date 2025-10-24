import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './config/app.config';
import { validationSchema } from './config/validation';
import { typeOrmConfig } from './database/typeorm.config';
import { TasksModule } from './modules/tasks/tasks.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig
    }),
    MessagingModule,
    TasksModule
  ]
})
export class AppModule {}
