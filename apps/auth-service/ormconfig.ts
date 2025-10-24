import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/modules/**/*.entity.js'],
  migrations: ['dist/migrations/*.js']
});
