import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from './gallery.entity';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { Video } from '../video/entities/video.entity';
import { Photo } from 'src/photo/entities/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery, Video, Photo])],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
