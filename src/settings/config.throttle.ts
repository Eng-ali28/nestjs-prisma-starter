import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';

@Injectable()
export default class ThrottlerConfig implements ThrottlerOptionsFactory {
  constructor(private config: ConfigService) {}

  createThrottlerOptions():
    | ThrottlerModuleOptions
    | Promise<ThrottlerModuleOptions> {
    return {
      throttlers: [
        {
          ttl: this.config.get<number>('THROTTLE_TTL'),
          limit: this.config.get<number>('THROTTLE_LIMIT'),
        },
      ],
    };
  }
}
