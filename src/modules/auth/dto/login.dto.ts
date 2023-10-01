import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/locales/generated/i18n.generated';

export class LoginDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsPhoneNumber(null, { message: i18nValidationMessage<I18nTranslations>('validation.PHONENUMBER') })
  phoneNumber: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING') })
  @Length(8, 64, { message: i18nValidationMessage<I18nTranslations>('validation.LENGTH') })
  password: string;

  @IsOptional({ message: i18nValidationMessage<I18nTranslations>('validation.OPTIONAL') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING') })
  firebaseToken: string;
}
