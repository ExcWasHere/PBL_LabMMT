import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Photo } from './entities/photo.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotoService {
  private readonly logger = new Logger(PhotoService.name);
  
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepo: Repository<Photo>,
  ) {}

  async remove(id: string) {
    await this.photoRepo.delete(id);
    return { message: 'Photo deleted' };
  }

  create(dto: CreatePhotoDto) {
    const photo = this.photoRepo.create({
    ...dto,
    thumbnailUrl: dto.cover_url,
  });
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
    const updateData: any = { ...dto };
  
  if (dto.cover_url) {
    updateData.thumbnailUrl = dto.cover_url;
    delete updateData.cover_url;
  }
  
  await this.photoRepo.update(id, updateData);
  return this.findOne(id);
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

    if (pendingPhotos.length > 0) {
      for (const photo of pendingPhotos) {
        photo.status = 'Published';
        await this.photoRepo.save(photo);
        this.logger.log(`Auto-published photo: ${photo.title}`);
      }
    }
  }
}
