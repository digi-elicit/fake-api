import { IsNotEmpty, IsEmail, Matches, MaxLength, MinLength, IsIn } from 'class-validator';
import { Column, DataType, Unique } from 'sequelize-typescript';

export class CreateUserDto {
  // @Matches(/^([a-zA-Z]+)(\s[a-zA-Z]+)?(\s[a-zA-Z]+)$/, {
  //   message: 'Invalid name format. Please provide first name, optional middle name, and last name separated by a single space.',
  // })
  @IsNotEmpty()
  name: string;
  
  @Matches(/^[a-zA-Z0-9_.+-]+@(gmail|yahoo|elicit)\.com$/, {
    message: 'Invalid email format',
  })
  email: string;

  
  // @Matches(/^[^\s]+$/, {
  //   message: 'Password should not contain spaces.',
  // })
  password: string;

  // @IsNotEmpty()
  // hobbies: string;

 // file: string;

  // @IsIn(['male', 'female', 'other'], {
  //   message: 'Invalid gender. Allowed values are: male, female, other.',
  // })
  // gender: string;
  
  // @Matches(/^[0-9]+$/, {
  //   message: 'Invalid mobile number format. Only numbers are allowed.',
  // })
  // @MaxLength(10)
  // @MinLength(10)
  // @IsNotEmpty()
  // mobile_number: Number;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  status: string;

}
