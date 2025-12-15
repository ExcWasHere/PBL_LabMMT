import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Gallery } from './gallery.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { Photo } from '../photo/entities/photo.entity';
import { Video } from '../video/entities/video.entity';

@Injectable()
export class GalleryService {
  private readonly logger = new Logger(GalleryService.name);
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepo: Repository<Gallery>,

    @InjectRepository(Photo)
    private readonly photoRepo: Repository<Photo>,

    @InjectRepository(Video)
    private readonly videoRepo: Repository<Video>,
  ) {}

  /* ================= CRON JOB (AUTO PUBLISH) ================= */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleAutoPublish() {
    const today = new Date();
    
    const galleriesToPublish = await this.galleryRepo.find({
      where: {
        status: 'Waiting',
        date: LessThanOrEqual(today), 
      },
    });

    if (galleriesToPublish.length > 0) {
      this.logger.debug(`Found ${galleriesToPublish.length} galleries to publish.`);

      for (const gallery of galleriesToPublish) {
        gallery.status = 'Published';
        await this.galleryRepo.save(gallery);
        this.logger.log(`Auto-published gallery: ${gallery.title}`);
      }
    }
  }

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
      relations: ['photos', 'videos'], 
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.galleryRepo.findOne({
      where: { id },
      relations: ['photos', 'videos'], 
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

    return galleries.map((g) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      location: g.location,
      date: g.date,
      thumbnailUrl: g.thumbnailUrl,
      media_types: g.media_types, 
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