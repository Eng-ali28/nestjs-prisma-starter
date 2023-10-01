import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
// import { I18nPath } from 'src/locales/generated/i18n.generated';

@Injectable()
export class TranslateException {
  constructor(private readonly i18n: I18nService) {}

  I18nNotFoundException(name: string) {
    const message = this.i18n.t('error.NOT_FOUND', {
      lang: I18nContext.current().lang,
      args: { name },
    });
    throw new NotFoundException(message);
  }

  I18nUnauthorizedException() {
    const message = this.i18n.t('error.UNAUTHORIZED', {
      lang: I18nContext.current().lang,
    });
    throw new ForbiddenException([message]);
  }

  I18nBlacklistMessageBan(hours: string) {
    const message = this.i18n.t('error.BLACKLIST', {
      lang: I18nContext.current().lang,
      args: { hours },
    });
    throw new BadRequestException(message);
  }
}
