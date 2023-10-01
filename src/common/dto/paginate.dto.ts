import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/locales/generated/i18n.generated';

export enum Lang {
  ENGLISH = 'en',
  ARABIC = 'ar',
}

export class PaginateDto {
  @IsOptional({
    message: i18nValidationMessage<I18nTranslations>('validation.OPTIONAL'),
  })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.IS_NUMBER'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @Type(() => Number)
  pageNumber?: number;

  @IsOptional({
    message: i18nValidationMessage<I18nTranslations>('validation.OPTIONAL'),
  })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.IS_NUMBER'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @Type(() => Number)
  pageSize?: number;

  @IsOptional({
    message: i18nValidationMessage<I18nTranslations>('validation.OPTIONAL'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING'),
  })
  lang: Lang;
}
