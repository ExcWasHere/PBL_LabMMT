import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Project } from '../project/entities/project.entity';
import { News } from '../news/entities/news.entity';
import { Video } from '../video/entities/video.entity';
import { Photo } from '../photo/entities/photo.entity';
import { Member } from '../member/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, News, Video, Photo, Member])],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
