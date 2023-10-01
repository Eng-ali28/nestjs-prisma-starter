import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';
import { Lang } from '../dto/paginate.dto';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
    intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const request = ctx.switchToHttp().getRequest() as Request;
        const lang = (request.query.lang as string) || Lang.ENGLISH;
        return next.handle().pipe(
            map((data) => {
                if (Array.isArray(data) && data.length !== 0) {
                    data = data.map((obj) => {
                        return this.handleObject(obj, lang);
                    });
                } else if (typeof data == 'object') {
                    data = this.handleObject(data, lang);
                }
                return data;
            }),
        );
    }

    handleObject(obj: object, lang: string) {
        if (Object.keys(obj).length > 0) {
            for (let key in obj) {
                if (!obj[key]) {
                    continue;
                } else if (typeof obj[key] == 'object' && Object.keys(obj[key]).length > 0) {
                    this.handleObject(obj[key], lang);
                } else if (Array.isArray(obj[key]) && obj[key].length > 0) {
                    for (let i = 0; i < obj[key].length; i++) {
                        this.handleObject(obj[key][i], lang);
                    }
                } else if (typeof obj[key] == 'string') {
                    const pureField = this.checkIfLocalsField(key, lang);
                    if (pureField) {
                        const pureFieldValue = obj[key];
                        delete obj[key];
                        obj[pureField] = pureFieldValue;
                    } else if (key.split('_').includes(Lang.ARABIC) || key.split('_').includes(Lang.ENGLISH)) {
                        delete obj[key];
                    }
                }
            }
        }
        return obj;
    }

    checkIfLocalsField(key: string, lang: string): string {
        const splitField = key.split('_');
        if (splitField.length > 1 && splitField[1] == lang) return splitField[0];
        return '';
    }
}
