/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { MemberService } from 'src/member/member.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private memberService: MemberService,
  ) {}

  async register(payload: {
    name: string;
    email: string;
    password: string;
    role?: string;
    validationField?: string;
    cvPath?: string | null;
    photo?: string | null;
  }) {
    const existing = await this.usersService.findByEmail(payload.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    // 1. Buat USER
    const user = await this.usersService.createUser(payload);
    const { password, ...rest } = user;

    // 2. Tentukan role (FIXED TYPE)
    const role = (payload.role ?? 'mahasiswa').toLowerCase() as
      | 'mahasiswa'
      | 'dosen'
      | 'admin';

    // 3. AUTO CREATE MEMBER (INILAH SOLUSI UTAMA)
    const existingMember = await this.memberService.findByUserId(user.id);
    const identityNum =
      payload.validationField && payload.validationField.trim() !== ''
        ? payload.validationField
        : `AUTO-${user.id}`;

    if (!existingMember) {
      await this.memberService.create({
        userId: user.id,
        name: user.name,
        identityNum,
        email: user.email,
        role,
        cvUrl: payload.cvPath ?? undefined,
        photoUrl: user.photo ?? undefined,
        status: role === 'mahasiswa' ? 'pending' : 'active',
        startDate: new Date().toISOString(),
      });
    }

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
