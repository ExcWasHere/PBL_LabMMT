import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  handleFiles(files: Express.Multer.File[]) {
    return files.map((file) => ({
      url: `http://localhost:3000/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    }));
  }
}
