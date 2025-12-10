import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}
  @Post()
  async create(@Body() createMemberDto: CreateMemberDto) {
    const created = await this.memberService.create(createMemberDto);
    return created;
  }

  @Get()
  async findAll() {
    return await this.memberService.findAllActive();
  }

  @Get('pending')
  async findPending() {
    return await this.memberService.findPending();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const m = await this.memberService.findOne(id);
    if (!m) throw new NotFoundException('Member not found');
    return m;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    const updated = await this.memberService.update(id, updateMemberDto);
    if (!updated) throw new NotFoundException('Member not found');
    return updated;
  }

  @Patch('approve/:id')
  async approve(@Param('id') id: string) {
    const ok = await this.memberService.approve(id);
    if (!ok) throw new NotFoundException('Member not found or cannot approve');
    return { message: 'Approved' };
  }

  @Patch('reject/:id')
  async reject(@Param('id') id: string) {
    const ok = await this.memberService.reject(id);
    if (!ok) throw new NotFoundException('Member not found or cannot reject');
    return { message: 'Rejected' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.memberService.remove(id);
    return { message: 'Member deleted' };
  }
}
