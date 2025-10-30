import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { TaskEntity } from '../modules/tasks/task.entity';
import { CommentEntity } from '../modules/comments/comment.entity';
import { HistoryEntryEntity } from '../modules/history/history-entry.entity';
import { TaskAssigneeEntity } from '../modules/tasks/task-assignee.entity';

const fileExtension = __filename.endsWith('.ts') ? 'ts' : 'js';
const migrationsDir = join(__dirname, '..', 'migrations', `*.${fileExtension}`);

export const taskDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  entities: [TaskEntity, CommentEntity, HistoryEntryEntity, TaskAssigneeEntity],
  migrations: [migrationsDir],
  // Em desenvolvimento, habilita sync para criar tabelas automaticamente
  synchronize: process.env.NODE_ENV !== 'production'
};

export const typeOrmConfig = async (
  configService: ConfigService
): Promise<TypeOrmModuleOptions> => {
  const options = {
    ...taskDataSourceOptions,
    url: configService.get<string>('app.databaseUrl'),
    logging: true
  } as DataSourceOptions;

  return options as TypeOrmModuleOptions;
};

export const createDataSource = (configService: ConfigService) =>
  new DataSource({
    ...taskDataSourceOptions,
    url: configService.get<string>('app.databaseUrl')
  } as DataSourceOptions);
