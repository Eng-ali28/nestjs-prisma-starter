import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { PrismaConfig } from './settings/config.prisma';
import { validate } from './settings/env.validation';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import ThrottlerConfig from './settings/config.throttle';
import { GlobalExceptionFilters } from './common/global/global.exception';
import { GlobalInterceptors } from './common/global/global.interceptor';
import UtilModule from './common/util/util.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    PrismaModule.forRootAsync({ isGlobal: true, useClass: PrismaConfig }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfig,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          fallbackLanguage: 'en',
          fallbacks: {
            en: 'en',
            ar: 'ar',
          },
          loaderOptions: {
            path: join(process.cwd(), 'src', 'locales', 'i18n'),
            watch: configService.get('NODE_ENV') === 'development',
          },
          typesOutputPath: join(process.cwd(), 'src/locales/generated/i18n.generated.ts'),
        };
      },
      inject: [ConfigService],
      resolvers: [
        {
          use: QueryResolver,
          options: ['lang'],
        },
        AcceptLanguageResolver,
      ],
    }),
    UtilModule,
  ],
  controllers: [],
  providers: [...GlobalExceptionFilters, ...GlobalInterceptors],
})
export class AppModule {}
