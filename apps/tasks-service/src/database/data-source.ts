import 'dotenv/config';
import { join } from 'path';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { TaskEntity } from '../modules/tasks/task.entity';
import { CommentEntity } from '../modules/comments/comment.entity';
import { HistoryEntryEntity } from '../modules/history/history-entry.entity';
import { TaskAssigneeEntity } from '../modules/tasks/task-assignee.entity';

// Em desenvolvimento: busca *.ts em migrations/
// Em produção/build: busca *.js em dist/migrations/
const fileExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
const migrationsGlob = process.env.NODE_ENV === 'production' 
  ? 'dist/migrations/*.js' 
  : join(__dirname, '..', '..', 'migrations', `*.${fileExtension}`);

export const taskDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [TaskEntity, CommentEntity, HistoryEntryEntity, TaskAssigneeEntity],
  migrations: [migrationsGlob],
  synchronize: process.env.NODE_ENV !== 'production'
};

export const TaskDataSource = new DataSource(taskDataSourceOptions);

// Data source alternativa para migrations em CLI
export const createTaskDataSource = () => {
  // Em CLI, usa NODE_ENV=development explicitamente se não definido
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }
  return TaskDataSource;
};
