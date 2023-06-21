import { SequelizeOptions } from 'sequelize-typescript';
import * as dotenv from 'dotenv';

dotenv.config();

const config: SequelizeOptions = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  models: [__dirname + '/../**/*.entity.ts'], // Path to your entity files
};

export default config;
