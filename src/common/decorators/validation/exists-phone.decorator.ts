import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PrismaService } from 'nestjs-prisma';
import { I18nTranslations } from 'src/locales/generated/i18n.generated';

@ValidatorConstraint({ async: true })
@Injectable()
export class PhoneExists implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}
  async validate(phoneNumber: string, args?: ValidationArguments): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { phoneNumber } });

    if (!user) return false;

    return true;
  }
  defaultMessage(args?: ValidationArguments): string {
    return 'User with this phone not exists.';
  }
}

export function PhoneExsits(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: i18nValidationMessage<I18nTranslations>('validation.USER_PHONE_EXISTS'),
        ...validationOptions,
      },
      validator: PhoneExists,
    });
  };
}
