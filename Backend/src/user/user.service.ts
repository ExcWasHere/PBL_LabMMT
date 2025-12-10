/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* src/user/user.service.ts */
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../user/user.entity';
import { MemberService } from '../member/member.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly memberService: MemberService,
  ) {}

  private mapRoleToPosition(role?: string): string | undefined {
    const r = (role ?? '').toLowerCase();
    if (r === 'admin') return 'admin';
    if (r === 'dosen' || r === 'lecturer') return 'lecturer';
    if (r === 'mahasiswa' || r === 'student') return 'student';
    return undefined;
  }

  async createUser(payload: {
    name: string;
    email: string;
    password: string;
    role?: string | UserRole;
    validationField?: string;
    photo?: string | null;
  }) {
    const existing = await this.findByEmail(payload.email);
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(payload.password, 10);

    const userObj: DeepPartial<User> = {
      name: payload.name,
      email: payload.email,
      password: hashed,
      role: (payload.role as UserRole) ?? ('mahasiswa' as UserRole),
      validationField: payload.validationField ?? undefined,
      photo: payload.photo ?? undefined,
    };

    const saved = await this.userRepo.save(
      this.userRepo.create(userObj as any),
    );
    const { password, ...rest } = saved as any;
    return rest;
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: number | string) {
    const numericId =
      typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : id;
    return this.userRepo.findOne({ where: { id: numericId as any } });
  }

  async getProfile(id: number | string) {
    const u = await this.findById(id);
    if (!u) throw new NotFoundException('User not found');
    const { password, ...rest } = u as any;
    return rest;
  }

  async updateBio(id: number | string, bio?: string) {
    const numericId =
      typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : id;
    const exists = await this.findById(numericId);
    if (!exists) throw new NotFoundException('User not found');

    await this.userRepo.update(
      numericId as any,
      {
        bio: bio ?? undefined,
      } as any,
    );

    return this.findById(numericId);
  }

  async updatePhoto(id: number | string, file: any) {
    const numericId =
      typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : id;
    const exists = await this.findById(numericId);
    if (!exists) throw new NotFoundException('User not found');

    const photoPath = file?.path ?? file?.filename ?? undefined;

    await this.userRepo.update(
      numericId as any,
      {
        photo: photoPath,
      } as any,
    );

    return this.findById(numericId);
  }

  async createPendingMember(payload: {
    userId?: number | string;
    name: string;
    identityNum?: string;
    email?: string;
    role?: string;
    cvUrl?: string | undefined;
    photoUrl?: string | undefined;
  }) {
    const dto = {
      userId: payload.userId,
      name: payload.name,
      identityNum: payload.identityNum ?? '',
      email: payload.email,
      role: payload.role ?? 'mahasiswa',
      cvUrl: payload.cvUrl,
      photoUrl: payload.photoUrl,
      status: 'pending',
    } as any;

    console.log('UsersService.createPendingMember ->', dto);
    return this.memberService.create(dto);
  }

  async createMember(payload: {
    userId?: number | string;
    name: string;
    identityNum?: string;
    email?: string;
    role?: string;
    cvUrl?: string | undefined;
    photoUrl?: string | undefined;
    status?: string | undefined;
    position?: string | undefined;
  }) {
    const dto = {
      userId: payload.userId,
      name: payload.name,
      identityNum: payload.identityNum ?? '',
      email: payload.email,
      role: payload.role ?? 'dosen',
      cvUrl: payload.cvUrl,
      photoUrl: payload.photoUrl,
      status: payload.status ?? 'active',
      position: payload.position ?? this.mapRoleToPosition(payload.role),
    } as any;

    console.log('UsersService.createMember ->', dto);
    return this.memberService.create(dto);
  }

  async updateUser(id: number | string, patch: Partial<User>) {
    const numericId =
      typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : id;
    const exists = await this.findById(numericId);
    if (!exists) throw new NotFoundException('User not found');

    await this.userRepo.update(numericId as any, {
      ...patch,
    });

    return this.findById(numericId);
  }

  async removeUser(id: number | string) {
    const numericId =
      typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : id;
    await this.userRepo.delete(numericId as any);
    return { message: 'User deleted' };
  }
}
