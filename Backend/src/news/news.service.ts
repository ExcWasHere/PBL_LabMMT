import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
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
}
