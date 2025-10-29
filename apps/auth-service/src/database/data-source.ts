import 'dotenv/config';
import { join } from 'path';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { UserEntity } from '../modules/users/user.entity';
import { RefreshTokenEntity } from '../modules/tokens/refresh-token.entity';

const fileExtension = __filename.endsWith('.ts') ? 'ts' : 'js';
const migrationsDir = join(__dirname, '..', '..', 'migrations', `*.${fileExtension}`);

export const authDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [UserEntity, RefreshTokenEntity],
  migrations: [migrationsDir],
  ssl:
    process.env.DATABASE_SSL === 'true'
      ? {
          rejectUnauthorized: false
        }
      : undefined
};

export const AuthDataSource = new DataSource(authDataSourceOptions);
