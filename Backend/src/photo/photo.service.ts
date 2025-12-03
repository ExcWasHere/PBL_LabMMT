import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepo: Repository<Photo>,
  ) {}

  create(dto: CreatePhotoDto) {
    const photo = this.photoRepo.create(dto);
    return this.photoRepo.save(photo);
  }

  findAll() {
    return this.photoRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.photoRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdatePhotoDto) {
    await this.photoRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.photoRepo.delete(id);
    return { message: 'Photo deleted' };
  }
}
