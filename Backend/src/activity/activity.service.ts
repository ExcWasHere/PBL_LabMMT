/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../project/entities/project.entity';
import { News } from '../news/entities/news.entity';
import { Photo } from '../photo/entities/photo.entity';
import { Video } from '../video/entities/video.entity';
import { Member } from '../member/entities/member.entity';

export type ActivityType = 'project' | 'news' | 'photo' | 'video' | 'member';

export interface ActivityItem {
  user: string;
  activity: string;
  at: Date;
  type: ActivityType;
}

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(News)
    private readonly newsRepo: Repository<News>,
    @InjectRepository(Photo)
    private readonly photoRepo: Repository<Photo>,
    @InjectRepository(Video)
    private readonly videoRepo: Repository<Video>,
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) {}

  async getRecent(limit = 3): Promise<ActivityItem[]> {
    const takePerSource = limit;

    const [projects, news, photos, videos, members] = await Promise.all([
      this.projectRepo.find({
        order: { createdAt: 'DESC' },
        take: takePerSource,
      }),
      this.newsRepo.find({
        order: { createdAt: 'DESC' },
        take: takePerSource,
      }),
      this.photoRepo.find({
        order: { createdAt: 'DESC' },
        take: takePerSource,
      }),
      this.videoRepo.find({
        order: { createdAt: 'DESC' },
        take: takePerSource,
      }),
      this.memberRepo.find({
        order: { createdAt: 'DESC' },
        take: takePerSource,
      }),
    ]);

    const items: ActivityItem[] = [];

    projects.forEach((p) => {
      if (!p.createdAt) return;
      items.push({
        user: p.publisher || 'Unknown',
        activity: `New project: ${p.title}`,
        at: p.createdAt,
        type: 'project',
      });
    });

    news.forEach((n) => {
      const at = (n as any).createdAt as Date | undefined;
      if (!at) return;
      items.push({
        user: (n as any).publisher || 'Unknown',
        activity: `New article: ${(n as any).title}`,
        at,
        type: 'news',
      });
    });

    photos.forEach((p) => {
      if (!p.createdAt) return;
      items.push({
        user: p.publisher || 'Unknown',
        activity: `New photo uploaded: ${p.title}`,
        at: p.createdAt,
        type: 'photo',
      });
    });

    videos.forEach((v) => {
      if (!v.createdAt) return;
      items.push({
        user: v.publisher || 'Unknown',
        activity: `New video uploaded: ${v.title}`,
        at: v.createdAt,
        type: 'video',
      });
    });

    members.forEach((m) => {
      const at = m.createdAt || m.startDate;
      if (!at) return;
      items.push({
        user: m.name,
        activity: `New member joined: ${m.position || m.role}`,
        at,
        type: 'member',
      });
    });

    items.sort((a, b) => b.at.getTime() - a.at.getTime());
    return items.slice(0, limit);
  }
}
