import 'dotenv/config';
import { join } from 'path';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { UserEntity } from '../modules/users/user.entity';
import { RefreshTokenEntity } from '../modules/tokens/refresh-token.entity';

// Em desenvolvimento: busca *.ts em migrations/
// Em produção/build: busca *.js em dist/migrations/
const fileExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';
const migrationsGlob = process.env.NODE_ENV === 'production' 
  ? 'dist/migrations/*.js' 
  : join(__dirname, '..', '..', 'migrations', `*.${fileExtension}`);

export const authDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [UserEntity, RefreshTokenEntity],
  migrations: [migrationsGlob],
  ssl:
    process.env.DATABASE_SSL === 'true'
      ? {
          rejectUnauthorized: false
        }
      : undefined
};

export const AuthDataSource = new DataSource(authDataSourceOptions);

// Data source alternativa para migrations em CLI
export const createAuthDataSource = () => {
  // Em CLI, usa NODE_ENV=development explicitamente se não definido
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }
  return AuthDataSource;
};
