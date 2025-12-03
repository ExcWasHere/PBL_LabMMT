/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from '../project/entities/project.entity';
import { News } from '../news/entities/news.entity';
import { Video } from '../video/entities/video.entity';
import { Photo } from '../photo/entities/photo.entity';
import { Member } from '../member/entities/member.entity';

@Injectable()
export class StatsService {
  getProjectStats: any;
  getNewsStats() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(Member)
    private userRepository: Repository<Member>,
  ) {}

  async getDashboardStats() {
    try {
      const [totalProject, totalNews, totalVideo, totalPhoto, totalMembers] =
        await Promise.all([
          this.projectRepository.count(),
          this.newsRepository.count(),
          this.videoRepository.count(),
          this.photoRepository.count(),
          this.userRepository.count(),
        ]);

      return {
        totalProject,
        totalNews,
        totalVideo,
        totalPhoto,
        totalMembers,
      };
    } catch (error) {
      throw new Error(`Failed to fetch stats: ${error.message}`);
    }
  }

  async getDetailedStats() {
    const projectStats = await this.projectRepository
      .createQueryBuilder('project')
      .select('project.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('project.status')
      .getRawMany();

    const newsStats = await this.newsRepository
      .createQueryBuilder('news')
      .select('news.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('news.status')
      .getRawMany();

    return {
      projects: projectStats,
      news: newsStats,
    };
  }
}
