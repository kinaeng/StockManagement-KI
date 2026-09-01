import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminUsersService } from '../admin-users/admin-users.service';
import { User } from '../admin-users/entities/user.entity';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
  username: string;
  sub: number;
  role: string;
}

interface LoginResult {
  accessToken: string;
  user: Omit<User, 'passwordHash'>;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly adminUsersService: AdminUsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.adminUsersService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Omit<User, 'passwordHash'>): Promise<LoginResult> {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
