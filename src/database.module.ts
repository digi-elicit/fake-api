import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import databaseConfig from '../config/database.config';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...databaseConfig,
      autoLoadModels: true,
      synchronize: true, // Set to false in production
    }),
  ],
})
export class DatabaseModule {}
