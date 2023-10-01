import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { I18nExceptionFilter } from './common/exception-filter/i18n.filter';
import { I18nValidationPipe } from 'nestjs-i18n';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.use(helmet());
  app.use(compression());

  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new I18nExceptionFilter());

  // allows class-validator to use NestJS dependency injection container
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(config.get<number>('PORT'));
}
bootstrap();
