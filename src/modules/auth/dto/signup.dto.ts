import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/locales/generated/i18n.generated';
import { CreateUserDto } from 'src/modules/user/dto/create.dto';

export class SignUpDto extends CreateUserDto {}
