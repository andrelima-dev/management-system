import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TaskEntity } from '../modules/tasks/task.entity';
import { CommentEntity } from '../modules/comments/comment.entity';
import { HistoryEntryEntity } from '../modules/history/history-entry.entity';
import { TaskAssigneeEntity } from '../modules/tasks/task-assignee.entity';

export const typeOrmConfig = async (
  configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  url: configService.get<string>('app.databaseUrl'),
  entities: [TaskEntity, CommentEntity, HistoryEntryEntity, TaskAssigneeEntity],
  synchronize: false,
  logging: true,
  migrations: ['dist/migrations/*.js']
});

export const createDataSource = (configService: ConfigService) =>
  new DataSource({
    type: 'postgres',
    url: configService.get<string>('app.databaseUrl'),
    entities: [TaskEntity, CommentEntity, HistoryEntryEntity, TaskAssigneeEntity],
    migrations: ['dist/migrations/*.js']
  });
