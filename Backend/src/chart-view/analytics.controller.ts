import { Controller, Post, Req, Body, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import express from 'express';

@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService) {}

  @Post('view')
  async recordView(
    @Req() req: express.Request,
    @Body() body: { path?: string; sessionId?: string },
  ) {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    return this.svc.recordView({
      path: body?.path,
      ip,
      userAgent: userAgent as string,
      sessionId: body?.sessionId,
    });
  }

  @Get('landing')
  async getLanding() {
    return this.svc.getAggregatedViews();
  }
}
