import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MicroservicesModule } from '../../infra/microservices/microservices.module';

@Module({
  imports: [MicroservicesModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
