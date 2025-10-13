import { DataSource } from 'typeorm';
import { join } from 'path';
import { databaseConfig } from '../config/database.config';

export default new DataSource({
	 ...databaseConfig,
  entities: [join(__dirname, '../modules/**/entities/*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
});