import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ModelCtor, FindOptions } from 'sequelize';
import { User } from '../user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: ModelCtor<User>,
  ) {}

  async findOne(options: FindOptions<User|any>): Promise<User | null> {
    return this.userModel.findOne(options);
  }

  async create(user: User): Promise<void> {
    await user.save();
  }
}
