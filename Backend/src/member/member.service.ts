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

  // ====================================
  // HELPER: Generate Slug dari Name
  // ====================================
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars (titik, koma, dll)
      .trim()
      .replace(/\s+/g, '-') // Replace spaces dengan dash
      .replace(/-+/g, '-'); // Remove duplicate dashes
  }

  // ====================================
  // HELPER: Normalize Array Input
  // ====================================
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

  // ====================================
  // CREATE Member (dengan auto-generate slug)
  // ====================================
  async create(createMemberDto: CreateMemberDto) {
    if (!createMemberDto || !createMemberDto.name) {
      throw new BadRequestException('Missing member data');
    }

    // Generate slug dari name
    const slug = this.generateSlug(createMemberDto.name);

    // Check if slug already exists
    const existingSlug = await this.memberRepo.findOne({ where: { slug } });
    let finalSlug = slug;

    // Jika slug sudah ada, tambahkan nomor di belakang
    if (existingSlug) {
      let counter = 1;
      while (
        await this.memberRepo.findOne({ where: { slug: `${slug}-${counter}` } })
      ) {
        counter++;
      }
      finalSlug = `${slug}-${counter}`;
    }

    const roleLower = (createMemberDto.role ?? '').toLowerCase();
    const defaultStatus = roleLower === 'mahasiswa' ? 'pending' : 'active';

    const payload: DeepPartial<Member> = {
      userId: createMemberDto.userId,
      name: createMemberDto.name,
      slug: finalSlug, // TAMBAHAN: slug field
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
      nip: createMemberDto.nip ?? undefined,
      nidn: createMemberDto.nidn ?? undefined,
      prodi: createMemberDto.prodi ?? undefined,
      jabatan_akademik: createMemberDto.jabatan_akademik ?? undefined,
      bio: createMemberDto.bio ?? undefined,
      social_links: createMemberDto.social_links ?? undefined,
      tags: this.normalizeToStringArray(createMemberDto.tags),
      pendidikan: this.normalizeToStringArray(createMemberDto.pendidikan),
      sertifikasi: this.normalizeToStringArray(createMemberDto.sertifikasi),
      matkul_ganjil: this.normalizeToStringArray(createMemberDto.matkul_ganjil),
      matkul_genap: this.normalizeToStringArray(createMemberDto.matkul_genap),
    };

    if (
      createMemberDto.position !== undefined &&
      createMemberDto.position !== null
    ) {
      payload.position = createMemberDto.position as any;
    }

    const member = this.memberRepo.create(payload as any);
    return await this.memberRepo.save(member);
  }

  // ====================================
  // FIND ALL Active Members
  // ====================================
  async findAllActive() {
    return await this.memberRepo.find({
      where: { status: 'active' },
      order: { createdAt: 'DESC' },
    });
  }

  // ====================================
  // FIND Pending Members
  // ====================================
  async findPending() {
    return await this.memberRepo.find({
      where: { status: 'pending' },
      order: { createdAt: 'DESC' },
    });
  }

  // ====================================
  // FIND ONE by ID (UUID)
  // ====================================
  async findOne(id: string) {
    return await this.memberRepo.findOne({ where: { id } });
  }

  // ====================================
  // FIND by SLUG (NEW!)
  // ====================================
  async findBySlug(slug: string) {
    return await this.memberRepo.findOne({ where: { slug } });
  }

  // ====================================
  // FIND by User ID
  // ====================================
  async findByUserId(userId: number) {
    if (!userId) return null;
    return await this.memberRepo.findOne({ where: { userId } });
  }

  // ====================================
  // UPDATE Member by ID
  // ====================================
  async update(id: string, updateMemberDto: UpdateMemberDto) {
    const exists = await this.memberRepo.findOne({ where: { id } });
    if (!exists) return null;

    // Regenerate slug jika name berubah
    let newSlug = exists.slug;
    if (updateMemberDto.name && updateMemberDto.name !== exists.name) {
      newSlug = this.generateSlug(updateMemberDto.name);

      // Check slug conflict
      const existingSlug = await this.memberRepo.findOne({
        where: { slug: newSlug },
      });

      if (existingSlug && existingSlug.id !== id) {
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
      name: updateMemberDto.name ?? exists.name,
      slug: newSlug, // Update slug jika name berubah
      identityNum: updateMemberDto.identityNum ?? exists.identityNum,
      role: updateMemberDto.role ?? exists.role,
      position: updateMemberDto.position ?? exists.position,
      email: updateMemberDto.email ?? exists.email,
      phone: updateMemberDto.phone ?? exists.phone,
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

  // ====================================
  // UPDATE by User ID (for /member/me)
  // ====================================
  async updateByUserId(userId: number, updateMemberDto: UpdateMemberDto) {
    const existing = await this.findByUserId(userId);
    if (!existing) return null;

    // Regenerate slug jika name berubah
    let newSlug = existing.slug;
    if (updateMemberDto.name && updateMemberDto.name !== existing.name) {
      newSlug = this.generateSlug(updateMemberDto.name);

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
      position: updateMemberDto.position ?? existing.position,
      email: updateMemberDto.email ?? existing.email,
      phone: updateMemberDto.phone ?? existing.phone,
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

  // ====================================
  // APPROVE Member
  // ====================================
  async approve(id: string) {
    const existing = await this.memberRepo.findOne({ where: { id } });
    if (!existing) return null;
    await this.memberRepo.update(id, {
      status: 'active',
    } as DeepPartial<Member>);
    return true;
  }

  // ====================================
  // REJECT Member
  // ====================================
  async reject(id: string) {
    const existing = await this.memberRepo.findOne({ where: { id } });
    if (!existing) return null;
    await this.memberRepo.delete(id);
    return true;
  }

  // ====================================
  // DELETE Member
  // ====================================
  async remove(id: string) {
    await this.memberRepo.delete(id);
    return { message: 'Member deleted' };
  }
}
