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

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAll() {
    return this.projectService.findAll();
  }

  @Get('pending')
  async findPending() {
    return this.projectService.findPending();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  createProject(@Req() req, @Body() createProjectDto: CreateProjectDto) {
    const user = req.user;
    console.log('POST /project user =', user);
    const rawRole = user?.role;
    const role = typeof rawRole === 'string' ? rawRole.toLowerCase() : '';
    const allowedRoles = ['admin', 'dosen', 'mahasiswa'];
    if (role && !allowedRoles.includes(role)) {
      throw new ForbiddenException('Kamu tidak boleh membuat project');
    }
    return this.projectService.create(createProjectDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: any,
  ) {
    const user = req.user;
    console.log('PATCH /project user =', user);

    const rawRole = user?.role;
    const role = typeof rawRole === 'string' ? rawRole.toLowerCase() : '';
    const allowedRoles = ['admin', 'dosen', 'mahasiswa'];
    if (role && !allowedRoles.includes(role)) {
      throw new ForbiddenException('Kamu tidak boleh mengupdate project');
    }

    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    console.log('DELETE /project user =', user);

    const rawRole = user?.role;
    const role = typeof rawRole === 'string' ? rawRole.toLowerCase() : '';
    if (role && role !== 'admin') {
      throw new ForbiddenException('Kamu tidak boleh menghapus project');
    }

    return this.projectService.remove(id);
  }
}
