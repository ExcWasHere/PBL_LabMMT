/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Video } from './entities/video.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeepPartial } from 'typeorm';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  constructor(
    @InjectRepository(Video)
    private readonly videoRepo: Repository<Video>,
  ) {}

  async createVideo(payload: {
    title: string;
    videoUrl: string;
    galleryId?: string;
    publisher?: string; // ✅ Tambahkan
    date?: string;
    status?: string; // ✅ Tambahkan
    description?: string;
  }) {
    const video = this.videoRepo.create({
      title: payload.title,
      videoUrl: payload.videoUrl,
      galleryId: payload.galleryId,
      publisher: payload.publisher ?? null, // ✅ Tambahkan
      date: payload.date ? new Date(payload.date) : null,
      description: payload.description ?? null,
      status: payload.status ?? 'Review', // ✅ Ubah dari 'Published' ke 'Review'
    } as DeepPartial<Video>);

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
    const updateData: any = { ...dto };
    if (dto.cover_url) {
      updateData.thumbnailUrl = dto.cover_url;
      delete updateData.cover_url;
    }

    await this.videoRepo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.videoRepo.delete(id);
    return { message: 'Video deleted' };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleScheduledVideos() {
    this.logger.debug('Checking for scheduled videos to publish...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingVideos = await this.videoRepo.find({
      where: {
        status: 'Waiting',
        date: LessThanOrEqual(today),
      },
    });

    if (pendingVideos.length > 0) {
      for (const video of pendingVideos) {
        video.status = 'Published';
        await this.videoRepo.save(video);
        this.logger.log(`Auto-published video: ${video.title}`);
      }
    }
  }
}
