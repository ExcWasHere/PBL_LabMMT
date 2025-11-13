import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret =
          config.get<string>('JWT_SECRET') || 'fallback_dev_secret';
        const expires = Number(config.get<string>('JWT_EXPIRES_IN') ?? 3600);
        return {
          secret,
          signOptions: { expiresIn: expires },
        };
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
