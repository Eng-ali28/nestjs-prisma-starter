import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from '../types/payload.types';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AccessTokenStrategey extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET'),
    });
  }
  async validate(payload: Payload): Promise<Payload> {
    return payload;
  }
}
