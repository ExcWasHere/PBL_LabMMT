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
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserRole } from '../user/user.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @Get()
  async findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
    const user = req.user;

    if (
      user?.role !== UserRole.ADMIN &&
      user?.role !== UserRole.DOSEN &&
      user?.role !== UserRole.MAHASISWA
    ) {
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

    if (
      user?.role !== UserRole.ADMIN &&
      user?.role !== UserRole.DOSEN &&
      user?.role !== UserRole.MAHASISWA
    ) {
      throw new ForbiddenException('Kamu tidak boleh mengupdate project');
    }

    return this.projectService.update(id, updateProjectDto);
  }
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const user = req.user;

    if (user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Kamu tidak boleh menghapus project');
    }

    return this.projectService.remove(id);
  }
}
