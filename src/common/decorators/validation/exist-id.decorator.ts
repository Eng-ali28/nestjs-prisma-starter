import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PrismaService } from 'nestjs-prisma';
import { I18nTranslations } from 'src/locales/generated/i18n.generated';

@ValidatorConstraint({ async: true })
@Injectable()
export class IdExsit implements ValidatorConstraintInterface {
    constructor(private readonly prisma: PrismaService) {}

    async validate(id: string, args?: ValidationArguments): Promise<boolean> {
        const [model, field] = args.constraints;
        const data = await this.prisma[model as Prisma.ModelName].findUnique({ where: { [field]: id } });

        if (!data) return false;

        return true;
    }
}

export function IdExists(model: string, validationOptions?: ValidationOptions, field: string = 'id') {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: {
                message: i18nValidationMessage<I18nTranslations>('validation.ID_EXISTS', { model }),
                ...validationOptions,
            },
            constraints: [model, field],
            validator: IdExsit,
        });
    };
}
