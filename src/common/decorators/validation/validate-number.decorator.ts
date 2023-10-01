import { ValidationOptions, registerDecorator } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/locales/generated/i18n.generated';

export function NumberLength(min: number, max: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'NumberLength',
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: i18nValidationMessage<I18nTranslations>('validation.NUMBER_LENGTH', { min: 5, max: 5 }),
                ...validationOptions,
            },
            validator: {
                validate(value: number, validationArguments) {
                    return value.toString().length < min ? false : value.toString().length > max ? false : true;
                },
            },
        });
    };
}
