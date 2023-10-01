import { ValidationOptions, registerDecorator } from 'class-validator';
import * as moment from 'moment';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/locales/generated/i18n.generated';

export function IsNotBeforeToday(provider: moment.unitOfTime.StartOf = 'day', validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'NumberLength',
            target: object.constructor,
            propertyName: propertyName,
            options: {
                ...validationOptions,
                message: i18nValidationMessage<I18nTranslations>('validation.IsNotBeforeToday'),
            },
            validator: {
                validate(value: string | Date, validationArguments) {
                    return !moment(value).isBefore(moment(), provider);
                },
            },
        });
    };
}
