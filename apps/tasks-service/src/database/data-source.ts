import { ConfigModule, ConfigService } from '@nestjs/config';
import { createDataSource } from './typeorm.config';

ConfigModule.forRoot({ isGlobal: true });

const configService = new ConfigService();

export default createDataSource(configService);
