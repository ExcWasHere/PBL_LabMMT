import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsController } from './chart-view/analytics.controller';
import { AnalyticsService } from './chart-view/analytics.service';
import { AnalyticsGateway } from './chart-view/analytics.gateway';
import { PageView } from './chart-view/page-view.entity';
import { ProjectModule } from './project/project.module';
import { NewsModule } from './news/news.module';
import { VideoModule } from './video/video.module';
import { PhotoModule } from './photo/photo.module';
import { MemberModule } from './member/member.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([PageView]),
    ProjectModule,
    NewsModule,
    VideoModule,
    PhotoModule,
    MemberModule,
    StatsModule,
  ],
  controllers: [AppController, AnalyticsController],
  providers: [AppService, AnalyticsService, AnalyticsGateway],
})
export class AppModule {}
