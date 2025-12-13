/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('public')
  async findPublished() {
    return this.projectService.findPublished();
  }

  @Get()
  async findAll() {
    return this.projectService.findAll();
  }

  @Get('pending')
  async findPending() {
    return this.projectService.findPending();
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.projectService.findBySlug(slug);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.projectService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProject(
    @Req() req: any,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    const user = req.user;
    console.log('POST /project user =', user);
    const role = typeof user?.role === 'string' ? user.role.toLowerCase() : '';
    const allowedRoles = ['admin', 'dosen', 'mahasiswa'];
    if (!allowedRoles.includes(role)) {
      throw new ForbiddenException('Kamu tidak boleh membuat project');
    }
    return this.projectService.create(createProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: any,
  ) {
    const user = req.user;
    console.log('PATCH /project user =', user);
    const role = typeof user?.role === 'string' ? user.role.toLowerCase() : '';
    const allowedRoles = ['admin', 'dosen', 'mahasiswa'];
    if (!allowedRoles.includes(role)) {
      throw new ForbiddenException('Kamu tidak boleh mengupdate project');
    }
    return this.projectService.update(id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    console.log('DELETE /project user =', user);
    const role = typeof user?.role === 'string' ? user.role.toLowerCase() : '';
    if (role !== 'admin') {
      throw new ForbiddenException('Kamu tidak boleh menghapus project');
    }
    return this.projectService.remove(id);
  }
}
