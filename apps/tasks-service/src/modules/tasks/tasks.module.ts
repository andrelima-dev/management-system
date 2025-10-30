import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { TaskAssigneeEntity } from './task-assignee.entity';
import { CommentEntity } from '../comments/comment.entity';
import { HistoryEntryEntity } from '../history/history-entry.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksMicroserviceController } from './tasks.microservice.controller';
import { MessagingModule } from '../../messaging/messaging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, TaskAssigneeEntity, CommentEntity, HistoryEntryEntity]),
    MessagingModule
  ],
  controllers: [TasksController, TasksMicroserviceController],
  providers: [TasksService],
  exports: [TasksService]
})
export class TasksModule {}
