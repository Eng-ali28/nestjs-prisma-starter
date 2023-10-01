import { Gender } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsString, Length, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/locales/generated/i18n.generated';

export class CreateUserDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING') })
  @Length(2, 55, { message: i18nValidationMessage<I18nTranslations>('validation.LENGTH') })
  name: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsPhoneNumber(null, { message: i18nValidationMessage<I18nTranslations>('validation.PHONENUMBER') })
  phoneNumber: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING') })
  countryCode: string;

  @IsOptional({ message: i18nValidationMessage<I18nTranslations>('validation.OPTIONAL') })
  @IsEmail({}, { message: i18nValidationMessage<I18nTranslations>('validation.INVALID_EMAIL') })
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsEnum(Gender, {
    message: i18nValidationMessage<I18nTranslations>('validation.ENUMS', {
      values: Object.values(Gender).join(' , '),
    }),
  })
  gender: Gender;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING') })
  @Length(8, 64, { message: i18nValidationMessage<I18nTranslations>('validation.LENGTH') })
  password: string;

  @IsOptional({ message: i18nValidationMessage<I18nTranslations>('validation.OPTIONAL') })
  role: string;

  @IsOptional({ message: i18nValidationMessage<I18nTranslations>('validation.OPTIONAL') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING') })
  firebaseToken: string;

  refreshToken?: string;
}
