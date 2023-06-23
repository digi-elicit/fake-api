import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
import { UserController } from './Controller/user.controller';
import { UserService } from './Services/user.service';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './auth/jwt.strategy';
// import { LocalStrategy } from './auth/local.strategy';
import { AuthController } from './auth/auth.controller';
import { DatabaseModule } from './database.module';
import { FileUploadModule } from './file uploads/file-upload.module';
import { ContributorController } from './Controller/contributor.controller';
import { ContributorService } from './Services/contributor.service';
import { UserRepository } from './admin/user.repository';

@Module({
  imports: [
   // FileUploadModule,
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    DatabaseModule,  
  ],
  controllers: [UserController, AuthController,ContributorController],
  providers: [UserService, AuthService , JwtStrategy,ContributorService,UserRepository],
})
export class AppModule {}
