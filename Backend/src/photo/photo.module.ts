import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { Photo } from './entities/photo.entity';
import { GalleryModule } from 'src/gallery/gallery.module';

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), forwardRef(() => GalleryModule)],
  controllers: [PhotoController],
  providers: [PhotoService],
  exports: [PhotoService],
})
export class PhotoModule {}
