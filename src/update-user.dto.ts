import { IsNotEmpty, IsEmail, Matches, IsOptional } from 'class-validator';

export class UpdateUserDto {
 
  @IsOptional()
  name: string;

  @IsOptional()
  status: string;

  @IsOptional()
  @Matches(/^[a-zA-Z0-9_.+-]+@(gmail|yahoo|elicit)\.com$/, {
    message: 'Invalid email format',
  })
  email: string;

  @IsOptional()
 role:string;
  
 @IsOptional()
 password:string;
  
}
