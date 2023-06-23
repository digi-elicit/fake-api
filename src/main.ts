import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { UserRepository } from './admin/user.repository';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());

  // UserRepository instance
  const userRepository = app.get(UserRepository);

  // Check if the admin already exists
  const adminExists = await userRepository.findOne({ where: { role: 'admin' } });
  if (!adminExists) {
    // Retrieve admin details from environment variables
    const adminName = process.env.ADMIN_NAME;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminRole = process.env.ADMIN_ROLE;
    const adminStatus = process.env.ADMIN_STATUS;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Create a new admin instance
    const user = new User();
    user.name = adminName;
    user.email = adminEmail;
    user.role = adminRole;
    user.status = adminStatus;
    user.password = await bcrypt.hash(adminPassword, 10);

    // Call the create method on the UserRepository
    await userRepository.create(user);
    console.log('Admin user created successfully.');
  }

  await app.listen(process.env.PORT);
  console.log('Server is connected at', process.env.PORT);
}

bootstrap();
