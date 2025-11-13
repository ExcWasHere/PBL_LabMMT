/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(payload: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phoneNumber?: string;
    validationField?: string;
  }) {
    const existing = await this.usersService.findByEmail(payload.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    const user = await this.usersService.createUser(payload);
    const { password, ...rest } = user as any;
    return rest;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return null;
    const { password: _, ...rest } = user as any;
    return rest;
  }

  async login(user: { email: string; password?: string }) {
    const found = await this.usersService.findByEmail(user.email);
    if (!found) throw new UnauthorizedException('Invalid credentials');
    if (user.password) {
      const ok = await bcrypt.compare(user.password, found.password);
      if (!ok) throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: found.id,
      email: found.email,
      role: found.role,
      validationField: found.validationField ?? null,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: found.id,
        email: found.email,
        name: found.name,
        role: found.role,
        validationField: found.validationField ?? null,
      },
    };
  }
}
