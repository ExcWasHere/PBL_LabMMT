/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  // ========= TAMBAHAN: GET by SLUG =========
  // PENTING: Taruh route ini SEBELUM route ':id'
  // supaya 'slug/xxx' tidak dianggap sebagai ID
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const member = await this.memberService.findBySlug(slug);
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }
  // =========================================

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

  // Guarded endpoints for current user
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Req() req: any) {
    const userId = Number(req.user?.sub ?? req.user?.id);
    const member = await this.memberService.findByUserId(userId);
    if (!member) {
      throw new NotFoundException('Member profile not found for current user');
    }
    return member;
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMyProfile(@Req() req: any, @Body() dto: UpdateMemberDto) {
    const userId = Number(req.user?.sub ?? req.user?.id);
    const updated = await this.memberService.updateByUserId(userId, dto);
    if (!updated) throw new NotFoundException('Member profile not found');
    return updated;
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  async approve(@Param('id') id: string, @Body() body: { field: string }) {
    if (!body.field) {
      throw new BadRequestException('Field wajib diisi');
    }
    return this.memberService.approve(id, body.field);
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
