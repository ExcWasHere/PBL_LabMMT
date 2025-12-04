/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Put,
  UseGuards,
  Req,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './user.service';
import { UpdateBioDto } from './dto/update-bio.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Req() req: any) {
    const userId = Number(req.user.id);
    return this.usersService.getProfile(userId);
  }

  @Put('bio')
  updateBio(@Req() req: any, @Body() dto: UpdateBioDto) {
    const userId = Number(req.user.id);
    return this.usersService.updateBio(userId, dto.bio);
  }

  @Put('photo')
  @UseInterceptors(FileInterceptor('photo', { dest: './uploads/photos' }))
  updatePhoto(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    const userId = Number(req.user.id);
    return this.usersService.updatePhoto(userId, file);
  }
}
