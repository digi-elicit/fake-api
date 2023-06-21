import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user.entity';
import { CreateUserDto } from '../create-user.dto';
import { UpdateUserDto } from '../update-user.dto';
import * as bcrypt from 'bcrypt';
import { Op, OrderItem, literal } from 'sequelize';
import express from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as multer from 'multer';
import { Roles, UserRoles } from '../enum/user';

@Injectable()
export class UserService {
  async findAll(
    page: number = 1,
    limit: number = 10,
    searchQuery?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ users: User[]; totalCount: number }> {
    const offset = (page - 1) * limit;

    const whereClause: { [key: string]: any } = {
      id: { [Op.ne]: 1 }, // Exclude user with ID 1
    };
    if (searchQuery) {
      whereClause[(Op.or as any)] = [
        { email: { [Op.like]: `%${searchQuery}%` } },
        { name: { [Op.like]: `%${searchQuery}%` } },
        { role: { [Op.like]: `%${searchQuery}%` } },
      ];
      // Add additional search filters as needed
    }

    const order: OrderItem[] = [['createdAt', sortOrder || 'asc']]; // Sort by createdAt field, defaulting to ascending order

    const { rows, count } = await User.findAndCountAll({
      where: whereClause,
      limit: +limit,
      offset: +offset,
      order,
    });

    return { users: rows, totalCount: count };
  }
  
  async create(createUserDto: CreateUserDto, file: Express.Multer.File | null, request: express.Request): Promise<User | any> {
    const { password, role, ...rest } = createUserDto;

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: createUserDto.email },
          //  { mobile_number: createUserDto.mobile_number },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        return { success: false, message: 'Email already exists' };
      } 
    }

    let userRole: Roles;

    if (role == UserRoles.ADMIN.toString()) {
      userRole = Roles.Admin;
    } else if (role == UserRoles.Contributor.toString()) {
      userRole = Roles.Contributor;
    } else {
      userRole = Roles.User;
    }

    if (file) {
      // Process the uploaded file
      const fileName = `${uuidv4()}${extname(file.originalname)}`;

      // Define the storage options
      const storage = diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, fileName);
        },
      });

      // Use the storage options with multer
      const upload = multer({ storage }).single('file');

      const newUser = await User.create({
        password: hashedPassword,
        file_url: fileName,
        role: userRole,
        ...rest,
      });

      return newUser;
    } else {
      const newUser = await User.create({
        password: hashedPassword,
        role: userRole,
        ...rest,
      });

      return newUser;
    }
  }

  async findById(id: number): Promise<User> {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | any> {
    if (id == 1) {
      return { message: 'Cannot update the user with ID 1' };
    }
  
    const user = await this.findById(id);
  
    const { email, ...rest } = updateUserDto;
  
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
  
      if (existingUser) {
        return { success: false, message: 'Email already exists' };
      }
  
      user.email = email;
    }
  
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      user.password = hashedPassword;
    }
  
    user.name = updateUserDto.name;
  
    await user.save();
    return user;
  }
  
  async delete(id: number): Promise<any> {
    if (id == 1) {
      return { message: 'Cannot delete with ID 1' };
    }
  
    const user = await this.findById(id);
    await user.destroy();
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    return user || null;
  }
}
