/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Photo } from './entities/photo.entity';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { DeepPartial } from 'typeorm';

@Injectable()
export class PhotoService {
  private readonly logger = new Logger(PhotoService.name);

  constructor(
    @InjectRepository(Photo)
    private readonly photoRepo: Repository<Photo>,
  ) {}

  async createPhoto(payload: {
    title: string;
    photoUrl: string;
    galleryId?: string;
    publisher?: string;
    location?: string;
    date?: string;
    status?: string;
    description?: string;
  }) {
    const photo = this.photoRepo.create({
      title: payload.title,
      photoUrl: payload.photoUrl,
      galleryId: payload.galleryId,
      publisher: payload.publisher ?? null,
      location: payload.location ?? null,
      date: payload.date ? new Date(payload.date) : null,
      description: payload.description ?? null,
      status: payload.status ?? 'Review',
    } as DeepPartial<Photo>);

    return this.photoRepo.save(photo);
  }

  findAll() {
    return this.photoRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.photoRepo.findOne({
      where: { id },
    });
  }

  async update(id: string, dto: UpdatePhotoDto) {
    const updateData: any = { ...dto };

    if (dto.galleryId) {
      updateData.galleryId = dto.galleryId;
    }

    await this.photoRepo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.photoRepo.delete(id);
    return { message: 'Photo deleted' };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleScheduledPhotos() {
    this.logger.debug('Checking for scheduled photos to publish...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingPhotos = await this.photoRepo.find({
      where: {
        status: 'Waiting',
        date: LessThanOrEqual(today),
      },
    });

    for (const photo of pendingPhotos) {
      photo.status = 'Published';
      await this.photoRepo.save(photo);
      this.logger.log(`Auto-published photo: ${photo.title}`);
    }
  }
}
