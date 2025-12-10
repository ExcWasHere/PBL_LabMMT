/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* src/photo/photo.controller.ts */
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
// import DTOs if you have them
// import { CreatePhotoDto } from './dto/create-photo.dto';
// import { UpdatePhotoDto } from './dto/update-photo.dto';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  // UPLOAD FILE
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
        fileSize: 30 * 1024 * 1024, // 30MB
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

  // CRUD metadata endpoints (used by frontend)
  @Get()
  findAll() {
    return this.photoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photoService.findOne(id);
  }

  @Post()
  async create(@Body() createDto: any) {
    // set default status to Review if not provided
    if (!createDto.status) createDto.status = 'Review';
    // optionally attach publisher from req.user if using auth
    // createDto.publisher = req?.user?.name ?? createDto.publisher ?? 'Unknown';
    return this.photoService.create(createDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.photoService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photoService.remove(id);
  }
}
