import { DataSource } from 'typeorm';
import { join } from 'path';
// import 'dotenv/config';

// console.log({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   pass: process.env.DB_PASS,
// });

export default new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
	username: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASS || 'postgres',
	database: process.env.DB_NAME || 'hospital_booking',
	entities: [join(__dirname, 'src/**/*.entity{.ts,.js}')],
	migrations: [join(__dirname, 'src/database/migrations/*{.ts,.js}')],
	synchronize: false, 
});