import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  create(dto: CreateProjectDto) {
    const project = this.projectRepo.create(dto);
    return this.projectRepo.save(project);
  }

  findAll() {
    return this.projectRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.projectRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.projectRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.projectRepo.delete(id);
    return { message: 'Project deleted' };
  }
}
