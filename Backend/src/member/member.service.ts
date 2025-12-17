import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import slugify from 'slugify';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) {}

  private makeSlug(name: string) {
    return slugify(name, {
      lower: true,
      strict: true,
    });
  }

  private normalizeToStringArray(input: any): string[] {
    if (!input) return [];
    if (Array.isArray(input)) return input.map((v) => String(v));
    if (typeof input === 'string') {
      const trimmed = input.trim();
      if (!trimmed) return [];
      if (trimmed.includes('\n')) {
        return trimmed
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return trimmed
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [String(input)];
  }

  async create(createMemberDto: CreateMemberDto) {
    if (!createMemberDto || !createMemberDto.name) {
      throw new BadRequestException('Missing member data');
    }

    const baseSlug = this.makeSlug(createMemberDto.name);
    let finalSlug = baseSlug;
    let counter = 1;

    while (await this.memberRepo.findOne({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const defaultStatus =
      createMemberDto.role === 'mahasiswa' ? 'pending' : 'active';

    const payload: DeepPartial<Member> = {
      userId: createMemberDto.userId,
      name: createMemberDto.name,
      slug: finalSlug,
      identityNum: createMemberDto.identityNum ?? null,
      role: createMemberDto.role,
      email: createMemberDto.email,
      field: createMemberDto.field,
      photoUrl: createMemberDto.photoUrl,
      cvUrl: createMemberDto.cvUrl,
      startDate: createMemberDto.startDate
        ? new Date(createMemberDto.startDate)
        : new Date(),
      status: createMemberDto.status ?? defaultStatus,
      nip: createMemberDto.nip,
      nidn: createMemberDto.nidn,
      prodi: createMemberDto.prodi,
      jabatan_akademik: createMemberDto.jabatan_akademik,
      bio: createMemberDto.bio,
      social_links: createMemberDto.social_links,
      tags: this.normalizeToStringArray(createMemberDto.tags),
      pendidikan: this.normalizeToStringArray(createMemberDto.pendidikan),
      sertifikasi: this.normalizeToStringArray(createMemberDto.sertifikasi),
      matkul_ganjil: this.normalizeToStringArray(createMemberDto.matkul_ganjil),
      matkul_genap: this.normalizeToStringArray(createMemberDto.matkul_genap),
    };

    const member = this.memberRepo.create(payload);
    return this.memberRepo.save(member);
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

  async findBySlug(slug: string) {
    return await this.memberRepo.findOne({ where: { slug } });
  }

  async findByUserId(userId: number) {
    if (!userId) return null;
    return await this.memberRepo.findOne({ where: { userId } });
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    const exists = await this.memberRepo.findOne({ where: { id } });
    if (!exists) return null;

    let newSlug = exists.slug;
    if (updateMemberDto.name && updateMemberDto.name !== exists.name) {
      const baseSlug = this.makeSlug(updateMemberDto.name);
      newSlug = baseSlug;

      let counter = 1;
      while (
        await this.memberRepo.findOne({
          where: { slug: newSlug },
        })
      ) {
        newSlug = `${baseSlug}-${counter++}`;
      }
    }

    const payload: DeepPartial<Member> = {
      name: updateMemberDto.name ?? exists.name,
      slug: newSlug,
      identityNum: updateMemberDto.identityNum ?? exists.identityNum,
      role: updateMemberDto.role ?? exists.role,
      email: updateMemberDto.email ?? exists.email,
      field: updateMemberDto.field ?? exists.field,
      photoUrl: updateMemberDto.photoUrl ?? exists.photoUrl,
      cvUrl: updateMemberDto.cvUrl ?? exists.cvUrl,
      status: updateMemberDto.status ?? exists.status,
      nip: updateMemberDto.nip ?? exists.nip,
      nidn: updateMemberDto.nidn ?? exists.nidn,
      prodi: updateMemberDto.prodi ?? exists.prodi,
      jabatan_akademik:
        updateMemberDto.jabatan_akademik ?? exists.jabatan_akademik,
      bio: updateMemberDto.bio ?? exists.bio,
      social_links: updateMemberDto.social_links ?? exists.social_links,
      tags:
        updateMemberDto.tags !== undefined
          ? this.normalizeToStringArray(updateMemberDto.tags)
          : (exists.tags ?? []),
      pendidikan:
        updateMemberDto.pendidikan !== undefined
          ? this.normalizeToStringArray(updateMemberDto.pendidikan)
          : (exists.pendidikan ?? []),
      sertifikasi:
        updateMemberDto.sertifikasi !== undefined
          ? this.normalizeToStringArray(updateMemberDto.sertifikasi)
          : (exists.sertifikasi ?? []),
      matkul_ganjil:
        updateMemberDto.matkul_ganjil !== undefined
          ? this.normalizeToStringArray(updateMemberDto.matkul_ganjil)
          : (exists.matkul_ganjil ?? []),
      matkul_genap:
        updateMemberDto.matkul_genap !== undefined
          ? this.normalizeToStringArray(updateMemberDto.matkul_genap)
          : (exists.matkul_genap ?? []),
    };

    await this.memberRepo.update(id, payload as any);
    return this.findOne(id);
  }

  async updateByUserId(userId: number, updateMemberDto: UpdateMemberDto) {
    const existing = await this.findByUserId(userId);
    if (!existing) return null;

    let newSlug = existing.slug;
    if (updateMemberDto.name && updateMemberDto.name !== existing.name) {
      newSlug = this.makeSlug(updateMemberDto.name);

      const existingSlug = await this.memberRepo.findOne({
        where: { slug: newSlug },
      });

      if (existingSlug && existingSlug.id !== existing.id) {
        let counter = 1;
        while (
          await this.memberRepo.findOne({
            where: { slug: `${newSlug}-${counter}` },
          })
        ) {
          counter++;
        }
        newSlug = `${newSlug}-${counter}`;
      }
    }

    const payload: DeepPartial<Member> = {
      name: updateMemberDto.name ?? existing.name,
      slug: newSlug,
      identityNum: updateMemberDto.identityNum ?? existing.identityNum,
      role: updateMemberDto.role ?? existing.role,
      email: updateMemberDto.email ?? existing.email,
      field: updateMemberDto.field ?? existing.field,
      photoUrl: updateMemberDto.photoUrl ?? existing.photoUrl,
      cvUrl: updateMemberDto.cvUrl ?? existing.cvUrl,
      status: updateMemberDto.status ?? existing.status,
      nip: updateMemberDto.nip ?? existing.nip,
      nidn: updateMemberDto.nidn ?? existing.nidn,
      prodi: updateMemberDto.prodi ?? existing.prodi,
      jabatan_akademik:
        updateMemberDto.jabatan_akademik ?? existing.jabatan_akademik,
      bio: updateMemberDto.bio ?? existing.bio,
      social_links: updateMemberDto.social_links ?? existing.social_links,
      tags:
        updateMemberDto.tags !== undefined
          ? this.normalizeToStringArray(updateMemberDto.tags)
          : (existing.tags ?? []),
      pendidikan:
        updateMemberDto.pendidikan !== undefined
          ? this.normalizeToStringArray(updateMemberDto.pendidikan)
          : (existing.pendidikan ?? []),
      sertifikasi:
        updateMemberDto.sertifikasi !== undefined
          ? this.normalizeToStringArray(updateMemberDto.sertifikasi)
          : (existing.sertifikasi ?? []),
      matkul_ganjil:
        updateMemberDto.matkul_ganjil !== undefined
          ? this.normalizeToStringArray(updateMemberDto.matkul_ganjil)
          : (existing.matkul_ganjil ?? []),
      matkul_genap:
        updateMemberDto.matkul_genap !== undefined
          ? this.normalizeToStringArray(updateMemberDto.matkul_genap)
          : (existing.matkul_genap ?? []),
    };

    Object.assign(existing, payload);
    return await this.memberRepo.save(existing);
  }

  async approve(id: string, field: string) {
    const member = await this.memberRepo.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException('Member tidak ditemukan');
    }

    if (member.status !== 'pending') {
      throw new BadRequestException('Member sudah aktif');
    }

    member.status = 'active';
    member.field = field;

    return this.memberRepo.save(member);
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

  async findPublicTeam() {
    return await this.memberRepo.find({
      where: [
        { role: 'dosen', status: 'active' },
        { role: 'admin', status: 'active' },
      ],
      select: [
        'id',
        'name',
        'slug',
        'photoUrl',
        'role',
        'tags',
        'social_links',
        'email',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async updateMyProfile(userId: number, dto: UpdateMemberDto) {
    const member = await this.memberRepo.findOne({
      where: { userId },
    });
    if (!member) throw new NotFoundException();
    if (member.role === 'mahasiswa') {
      delete dto.field;
    }
    Object.assign(member, dto);
    return this.memberRepo.save(member);
  }
}
