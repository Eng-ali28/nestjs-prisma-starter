import { IsNotEmpty, IsString, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/locales/generated/i18n.generated';

export class ResetPasswordDto {
    @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
    @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING') })
    @Length(8, 64, { message: i18nValidationMessage<I18nTranslations>('validation.LENGTH') })
    currentPassword: string;

    @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
    @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING') })
    @Length(8, 64, { message: i18nValidationMessage<I18nTranslations>('validation.LENGTH') })
    newPassword: string;
}
