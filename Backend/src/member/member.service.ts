import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) {}

  create(createMemberDto: CreateMemberDto) {
    const member = this.memberRepo.create(createMemberDto);
    return this.memberRepo.save(member);
  }

  findAll() {
    return this.memberRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.memberRepo.findOne({ where: { id } });
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    await this.memberRepo.update(id, updateMemberDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.memberRepo.delete(id);
    return { message: 'Member deleted' };
  }
}
