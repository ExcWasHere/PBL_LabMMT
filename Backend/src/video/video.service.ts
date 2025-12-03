import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepo: Repository<Video>,
  ) {}

  create(dto: CreateVideoDto) {
    const video = this.videoRepo.create(dto);
    return this.videoRepo.save(video);
  }

  findAll() {
    return this.videoRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.videoRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateVideoDto) {
    await this.videoRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.videoRepo.delete(id);
    return { message: 'Video deleted' };
  }
}
