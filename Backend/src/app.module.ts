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
import { ActivityModule } from './activity/activity.module';
import { UploadModule } from './upload/upload.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GalleryModule } from './gallery/gallery.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
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
    ActivityModule,
    UploadModule,
    GalleryModule,
  ],
  controllers: [AppController, AnalyticsController],
  providers: [AppService, AnalyticsService, AnalyticsGateway],
})
export class AppModule {}
