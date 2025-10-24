import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserEntity } from '../modules/users/user.entity';
import { RefreshTokenEntity } from '../modules/tokens/refresh-token.entity';

export const typeOrmConfig = async (
  configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  url: configService.get<string>('app.databaseUrl'),
  entities: [UserEntity, RefreshTokenEntity],
  synchronize: false,
  logging: true,
  migrations: ['dist/migrations/*.js'],
  ssl:
    configService.get<boolean>('app.databaseSsl')
      ? { rejectUnauthorized: false }
      : undefined
});

export const createDataSource = (configService: ConfigService) =>
  new DataSource({
    type: 'postgres',
    url: configService.get<string>('app.databaseUrl'),
    entities: [UserEntity, RefreshTokenEntity],
    migrations: ['dist/migrations/*.js'],
    ssl:
      configService.get<boolean>('app.databaseSsl')
        ? { rejectUnauthorized: false }
        : undefined
  });
