import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MicroservicesModule } from '../../infra/microservices/microservices.module';

@Module({
  imports: [MicroservicesModule],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
