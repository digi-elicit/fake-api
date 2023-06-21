import { Module } from '@nestjs/common';
import { multerMiddleware } from './multer.middleware';

import { MulterModule } from '@nestjs/platform-express';
import { UserController } from 'src/Controller/user.controller';
import { UserService } from 'src/Services/user.service';

@Module({
    imports: [MulterModule.register()],
    controllers: [UserController],
    providers: [UserService],
  })
  export class FileUploadModule {}