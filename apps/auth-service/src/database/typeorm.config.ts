import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { authDataSourceOptions } from './data-source';

export const typeOrmConfig = async (
  configService: ConfigService
): Promise<TypeOrmModuleOptions> => {
  const ssl = configService.get<boolean>('app.databaseSsl')
    ? { rejectUnauthorized: false }
    : undefined;

  const options = {
    ...authDataSourceOptions,
    url: configService.get<string>('app.databaseUrl') ?? undefined,
    synchronize: false,
    logging: true,
    ssl
  } as DataSourceOptions;

  return options as TypeOrmModuleOptions;
};

export const createDataSource = (configService: ConfigService) =>
  new DataSource({
    ...authDataSourceOptions,
    url: configService.get<string>('app.databaseUrl') ?? undefined,
    ssl:
      configService.get<boolean>('app.databaseSsl')
        ? { rejectUnauthorized: false }
        : undefined
  } as DataSourceOptions);
