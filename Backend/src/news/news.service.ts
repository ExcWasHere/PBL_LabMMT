import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);
  constructor(
    @InjectRepository(News)
    private readonly newsRepo: Repository<News>,
  ) {}

  create(dto: CreateNewsDto) {
    const news = this.newsRepo.create(dto);
    return this.newsRepo.save(news);
  }

  findAll() {
    return this.newsRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.newsRepo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateNewsDto) {
    await this.newsRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.newsRepo.delete(id);
    return { message: 'News deleted' };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleScheduledNews() {
    this.logger.debug('Checking for scheduled news to publish...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingNews = await this.newsRepo.find({
      where: {
        status: 'Waiting',
        year: LessThanOrEqual(today), 
      },
    });

    if (pendingNews.length > 0) {
      for (const news of pendingNews) {
        news.status = 'Published';
        await this.newsRepo.save(news);
        this.logger.log(`Auto-published news: ${news.title}`);
      }
    } else {
        this.logger.debug('No scheduled news found.');
    }
  }
}
