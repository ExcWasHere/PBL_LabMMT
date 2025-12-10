/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) {}

  // replace the create(...) method in src/member/member.service.ts with this
  async create(createMemberDto: CreateMemberDto) {
    if (!createMemberDto || !createMemberDto.name) {
      throw new BadRequestException('Missing member data');
    }

    // decide default status based on role
    const roleLower = (createMemberDto.role ?? '').toLowerCase();
    const defaultStatus = roleLower === 'mahasiswa' ? 'pending' : 'active';
    const payload: DeepPartial<Member> = {
      userId: createMemberDto.userId,
      name: createMemberDto.name,
      identityNum: createMemberDto.identityNum ?? '',
      role: createMemberDto.role ?? 'mahasiswa',
      email: createMemberDto.email,
      phone: createMemberDto.phone,
      photoUrl: createMemberDto.photoUrl,
      cvUrl: createMemberDto.cvUrl,
      startDate: createMemberDto.startDate
        ? new Date(createMemberDto.startDate)
        : new Date(),
      status: (createMemberDto.status as any) ?? defaultStatus,
    };

    if (
      createMemberDto.position !== undefined &&
      createMemberDto.position !== null
    ) {
      payload.position = createMemberDto.position as any;
    }
    console.log('MemberService.create -> saving payload:', payload);

    const member = this.memberRepo.create(payload);
    return await this.memberRepo.save(member);
  }

  async findAllActive() {
    return await this.memberRepo.find({
      where: { status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }

  async findPending() {
    return await this.memberRepo.find({
      where: { status: 'pending' },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return await this.memberRepo.findOne({ where: { id } });
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    const exists = await this.memberRepo.findOne({ where: { id } });
    if (!exists) return null;

    const payload: DeepPartial<Member> = {
      name: updateMemberDto.name ?? exists.name,
      identityNum: updateMemberDto.identityNum ?? exists.identityNum,
      role: updateMemberDto.role ?? exists.role,
      position: updateMemberDto.position ?? exists.position,
      email: updateMemberDto.email ?? exists.email,
      phone: updateMemberDto.phone ?? exists.phone,
      photoUrl: updateMemberDto.photoUrl ?? exists.photoUrl,
      cvUrl: updateMemberDto.cvUrl ?? exists.cvUrl,
      status: updateMemberDto.status ?? exists.status,
    };

    await this.memberRepo.update(id, payload);
    return this.findOne(id);
  }

  async approve(id: string) {
    const existing = await this.memberRepo.findOne({ where: { id } });
    if (!existing) return null;
    await this.memberRepo.update(id, {
      status: 'active',
    } as DeepPartial<Member>);
    return true;
  }

  async reject(id: string) {
    const existing = await this.memberRepo.findOne({ where: { id } });
    if (!existing) return null;
    await this.memberRepo.delete(id);
    return true;
  }

  async remove(id: string) {
    await this.memberRepo.delete(id);
    return { message: 'Member deleted' };
  }
}
