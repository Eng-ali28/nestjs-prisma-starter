import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { NumberLength } from 'src/common/decorators/validation/validate-number.decorator';
import { I18nTranslations } from 'src/locales/generated/i18n.generated';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsPhoneNumber(null, { message: i18nValidationMessage<I18nTranslations>('validation.PHONENUMBER') })
  phoneNumber: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage<I18nTranslations>('validation.IS_NUMBER') })
  @NumberLength(5, 5)
  @Type(() => Number)
  otp: number;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING') })
  @Length(8, 64, { message: i18nValidationMessage<I18nTranslations>('validation.LENGTH') })
  newPassword: string;
}
