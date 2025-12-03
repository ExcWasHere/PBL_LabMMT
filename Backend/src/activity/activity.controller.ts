import { Controller, Get, Query } from '@nestjs/common';
import { ActivityService, ActivityItem } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('recent')
  getRecent(@Query('limit') limit?: string): Promise<ActivityItem[]> {
    const parsed = parseInt(limit ?? '3', 10);
    const safeLimit = Number.isNaN(parsed) ? 3 : parsed;
    return this.activityService.getRecent(safeLimit);
  }
}
