import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/photo',
        filename: (_req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 30 * 1024 * 1024,
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const base = process.env.SERVER_BASE_URL || 'http://localhost:3000';
    const publicUrl = `${base}/uploads/photo/${file.filename}`;
    return { url: publicUrl };
  }

  @Get()
  findAll() {
    return this.photoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photoService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreatePhotoDto) {
    return this.photoService.createPhoto(createDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdatePhotoDto) {
    return this.photoService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photoService.remove(id);
  }
}
