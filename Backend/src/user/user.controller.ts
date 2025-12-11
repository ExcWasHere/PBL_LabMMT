/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Req,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any) {
    const userId = Number(req.user?.sub ?? req.user?.id);
    return this.usersService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('bio')
  async updateBio(@Req() req: any, @Body() dto: { bio?: string }) {
    const userId = Number(req.user?.sub ?? req.user?.id);
    return this.usersService.updateBio(userId, dto.bio ?? undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Post('photo')
  @UseInterceptors(FileInterceptor('file'))
  async updatePhoto(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = Number(req.user?.sub ?? req.user?.id);
    return this.usersService.updatePhoto(userId, file);
  }
}
