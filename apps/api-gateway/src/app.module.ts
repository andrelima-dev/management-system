import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { appConfig } from './config/app.config';
import { validationSchema } from './config/validation';
import { AuthModule } from './modules/auth/auth.module';
import { LoggingInterceptor } from './infra/logging.interceptor';
import { HealthModule } from './modules/health/health.module';
import { SecurityModule } from './infra/security/security.module';
import { JwtAuthGuard } from './infra/security/jwt-auth.guard';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 10
      }
    ]),
    HttpModule.register({ timeout: 5000, maxRedirects: 0 }),
    SecurityModule,
    AuthModule,
    HealthModule,
    TasksModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}
