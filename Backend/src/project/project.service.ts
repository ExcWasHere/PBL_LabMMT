import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import slugify from 'slugify';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async create(dto: CreateProjectDto) {
    const slug = slugify(dto.title, {
      lower: true,
      strict: true,
    });

    const project = this.projectRepo.create({
      ...dto,
      slug,
      status: dto.status ?? 'Waiting',
      stars: 0,
    });

    return this.projectRepo.save(project);
  }

  async findBySlug(slug: string) {
    return this.projectRepo.findOne({
      where: { slug },
    });
  }

  async findPublished() {
    return this.projectRepo.find({
      where: { status: 'Published' },
      order: { createdAt: 'DESC' },
    });
  }

  findAll() {
    return this.projectRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findPending() {
    return this.projectRepo.find({
      where: [{ status: 'Waiting' }, { status: 'Review' }],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
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
