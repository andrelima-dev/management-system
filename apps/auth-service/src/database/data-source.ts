import { DataSource } from 'typeorm';
import { UserEntity } from '../modules/users/user.entity';
import { RefreshTokenEntity } from '../modules/tokens/refresh-token.entity';

export const AuthDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [UserEntity, RefreshTokenEntity],
  migrations: ['migrations/*.ts'],
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

export default AuthDataSource;
