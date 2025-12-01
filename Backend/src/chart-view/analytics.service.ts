import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageView } from '../chart-view/page-view.entity';
import { AnalyticsGateway } from '../chart-view/analytics.gateway';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(PageView)
    private readonly pvRepo: Repository<PageView>,
    private readonly gateway: AnalyticsGateway,
  ) {}

  async recordView(payload: {
    path?: string;
    ip?: string;
    userAgent?: string;
    sessionId?: string;
  }) {
    try {
      console.log('📝 Recording page view:', {
        path: payload.path,
        session: payload.sessionId,
        ip: payload.ip?.slice(0, 10) + '...',
      });

      await this.pvRepo.save({
        path: payload.path ?? '/',
        ip: payload.ip,
        user_agent: payload.userAgent,
        session_id: payload.sessionId,
      });

      console.log('✅ Page view saved successfully');
    } catch (err) {
      console.error('❌ Page view save error:', err);
    }
    const agg = await this.getAggregatedViews();
    this.gateway.broadcastTraffic(agg);

    return { ok: true };
  }

  async getAggregatedViews() {
    const firstView = await this.pvRepo
      .createQueryBuilder('pv')
      .select('pv.created_at')
      .orderBy('pv.created_at', 'ASC')
      .limit(1)
      .getOne();

    let startDate: Date;
    if (!firstView) {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      console.log(
        '📊 No data yet, starting from today:',
        startDate.toISOString(),
      );
      return [];
    } else {
      startDate = new Date(firstView.created_at);
      startDate.setHours(0, 0, 0, 0);
      console.log('📊 First view recorded on:', startDate.toISOString());
    }

    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const qb = this.pvRepo
      .createQueryBuilder('pv')
      .select("to_char(date_trunc('day', pv.created_at), 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(*)', 'views')
      .where('pv.created_at >= :from', { from: startDate.toISOString() })
      .groupBy('1')
      .orderBy('1');

    const rows = await qb.getRawMany<{ date: string; views: string }>();
    console.log(`📈 Query returned ${rows.length} rows with data`);
    const dataMap = new Map<string, number>();
    rows.forEach((r) => {
      dataMap.set(r.date, Number(r.views));
    });
    const daysDiff = Math.ceil(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const daysToShow = Math.min(daysDiff + 1, 30);
    const result: { date: string; views: number }[] = [];
    for (let i = 0; i < daysToShow; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateKey = currentDate.toISOString().slice(0, 10);
      result.push({
        date: dateKey,
        views: dataMap.get(dateKey) ?? 0,
      });
    }
    console.log(
      `✅ Returning ${result.length} data points:`,
      result.map((r) => `${r.date}: ${r.views}`).join(', '),
    );
    return result;
  }
}
