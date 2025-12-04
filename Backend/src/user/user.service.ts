/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  async getProfile(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    return user;
  }

  async updateBio(id: number, bio?: string) {
    const bioToSave = bio ?? null;

    await this.repo.update({ id }, { bio: bioToSave as any });

    return { bio: bioToSave };
  }

  async updatePhoto(id: number, file: Express.Multer.File) {
    const photoUrl = `/uploads/photos/${file.filename}`;
    await this.repo.update({ id }, { photo: photoUrl });
    return { photo: photoUrl };
  }

  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async createUser(dto: RegisterDto): Promise<User> {
    const hashed = await bcrypt.hash(dto.password, 10);
    const partial: DeepPartial<User> = {
      name: dto.name,
      email: dto.email,
      password: hashed,
      role: (dto.role as UserRole) ?? UserRole.MAHASISWA,
      validationField: dto.validationField ?? null,
    };

    const user = this.repo.create(partial);
    return this.repo.save(user);
  }
}
