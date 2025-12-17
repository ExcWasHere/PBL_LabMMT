import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:5173', 'https://pbl-lab-mmt.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const uploadsRoot = path.join(process.cwd(), 'uploads');

  if (!fs.existsSync(uploadsRoot)) {
    fs.mkdirSync(uploadsRoot, { recursive: true });
  }

  ['cv', 'photo', 'video'].forEach((dir) => {
    const fullPath = path.join(uploadsRoot, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  app.useStaticAssets(uploadsRoot, {
    prefix: '/uploads',
  });

  await app.listen(process.env.PORT || 3000);
  console.log('🚀 Server running');
}
bootstrap();
