/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  getDashboardStats() {
    return this.statsService.getDashboardStats();
  }

  @Get('detailed')
  getDetailedStats() {
    return this.statsService.getDetailedStats();
  }

  @Get('projects')
  getProjectStats() {
    return this.statsService.getProjectStats();
  }

  @Get('news')
  getNewsStats() {
    return this.statsService.getNewsStats();
  }
}
