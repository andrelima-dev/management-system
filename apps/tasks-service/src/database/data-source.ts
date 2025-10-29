import 'dotenv/config';
import { join } from 'path';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { TaskEntity } from '../modules/tasks/task.entity';
import { CommentEntity } from '../modules/comments/comment.entity';
import { HistoryEntryEntity } from '../modules/history/history-entry.entity';
import { TaskAssigneeEntity } from '../modules/tasks/task-assignee.entity';

const fileExtension = __filename.endsWith('.ts') ? 'ts' : 'js';
const migrationsDir = join(__dirname, '..', '..', 'migrations', `*.${fileExtension}`);

export const taskDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [TaskEntity, CommentEntity, HistoryEntryEntity, TaskAssigneeEntity],
  migrations: [migrationsDir],
  synchronize: false
};

export const TaskDataSource = new DataSource(taskDataSourceOptions);
