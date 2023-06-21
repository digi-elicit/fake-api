import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../Services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user.entity';
import { LoginDto } from './login.dto';
import { bcryptCompare } from '../utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && bcryptCompare(password, user.password)) {
      return user;
    }
    return null;
  }


  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcryptCompare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { token,...user  };
  }

  private generateToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
