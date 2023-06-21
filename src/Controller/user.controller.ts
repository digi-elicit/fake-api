import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, UseInterceptors, UploadedFile,Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { User } from '../user.entity';
import { UserService } from '../Services/user.service';
import { CreateUserDto } from '../create-user.dto';
import { UpdateUserDto } from '../update-user.dto';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import express from 'express';
import { multerOptions } from '../multer.middleware';

enum UserRole {
  Admin = 'admin',
  User = 'user',
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

//  @UseGuards(AuthGuard('jwt'), new AdminGuard(['admin']))
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') searchQuery?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ): Promise<{ users: User[]; totalCount: number }> {
    return this.userService.findAll(page, limit, searchQuery, sortOrder);
  }
  
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @Post()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
    @Req() req: express.Request,
  ): Promise<User | any> {
    if (!file) {
      return this.userService.create(createUserDto, null, req);
    }
    return this.userService.create(createUserDto, file, req);
  }

//  @UseGuards(AuthGuard('jwt'), new AdminGuard(['admin']))
  @Get(':id')
  async findById(@Req() req: any, @Param('id') id: number): Promise<User | any> {
    // const userId = req.user.id;
    // const userRole = req.user.role;

    // if (id != userId && userRole != UserRole.Admin) {
    //   return { message: 'You are not authorized to see this resource' };
    // }

    if (id == 1) {
      return {message:'User not found'};
    }
    const user = await User.findByPk(id);
    if (!user) {
      return {message:'User not found'};
    }
    return user;
  }

 // @UseGuards(AuthGuard('jwt'), new AdminGuard(['admin', 'user']))
  @Put(':id')
  async update(@Req() req: any, @Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User | any> {
    // const userId = req.user.id;
    // const userRole = req.user.role;
    // console.log(userRole)

    // if (id != userId && userRole != UserRole.Admin) {
    //   return { mesaage: 'You are not authorized to update this resource' };
    // }

    const updatedUser = await this.userService.update(id, updateUserDto);
    return updatedUser;
  }

 // @UseGuards(AuthGuard('jwt'), new AdminGuard(['admin', 'user']))
  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: number): Promise<void | any> {
    // const userId = req.user.id;
    // const userRole = req.user.role;
    // console.log(userRole)
    // if (id != userId && userRole != UserRole.Admin) {
    //   return { message: 'You are not authorized to delete this resource' };
    // }
    await this.userService.delete(id);
    return { mesaage: 'user is deleted' };
  }
}
