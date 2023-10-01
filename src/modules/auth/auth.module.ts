import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenStrategey } from './strategy/accessToken.strategey';

import { RefreshTokenStrategy } from './strategy/refreshToken.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PassportModule, JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategey, RefreshTokenStrategy],
})
export class AuthModule {}
