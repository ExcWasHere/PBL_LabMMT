import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Project } from '../project/entities/project.entity';
import { News } from '../news/entities/news.entity';
import { Photo } from '../photo/entities/photo.entity';
import { Video } from '../video/entities/video.entity';
import { Member } from '../member/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, News, Photo, Video, Member])],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
