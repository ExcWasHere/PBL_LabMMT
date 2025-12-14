import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from './gallery.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { Photo } from '../photo/entities/photo.entity';
import { Video } from '../video/entities/video.entity';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepo: Repository<Gallery>,

    @InjectRepository(Photo)
    private readonly photoRepo: Repository<Photo>,

    @InjectRepository(Video)
    private readonly videoRepo: Repository<Video>,
  ) {}

  /* ================= CREATE ================= */
  create(dto: CreateGalleryDto) {
    const gallery = this.galleryRepo.create({
      ...dto,
      status: 'Review',
    });
    return this.galleryRepo.save(gallery);
  }

  /* ================= ADMIN ================= */
  async findAll() {
    return this.galleryRepo.find({
      relations: ['photos', 'videos'], // ✅ TAMBAHKAN INI
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.galleryRepo.findOne({
      where: { id },
      relations: ['photos', 'videos'], // ✅ TAMBAHKAN INI
    });
  }

  async update(id: string, dto: UpdateGalleryDto) {
    await this.galleryRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.galleryRepo.delete(id);
    return { message: 'Gallery deleted' };
  }

  /* ================= PUBLIC ================= */
  async findPublic() {
    const galleries = await this.galleryRepo.find({
      where: { status: 'Published' },
      relations: ['photos', 'videos'],
      order: { createdAt: 'DESC' },
    });

    // optional: rapihin response biar FE enak
    return galleries.map((g) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      location: g.location,
      date: g.date,
      thumbnailUrl: g.thumbnailUrl,
      createdAt: g.createdAt,
      photos: (g.photos || []).map((p) => ({
        id: p.id,
        photoUrl: p.photoUrl,
      })),
      videos: (g.videos || []).map((v) => ({
        id: v.id,
        videoUrl: v.videoUrl,
      })),
    }));
  }
}
