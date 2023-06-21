import { Table, Column, Model, DataType } from 'sequelize-typescript';
import bcrypt from 'bcrypt';

@Table
export class User extends Model {
  @Column
  name: string;

  @Column
  email: string;

  @Column
  role: string;

  @Column
  status: string;

  @Column
  password: string;
}
