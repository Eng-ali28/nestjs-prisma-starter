import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user ? (data ? req.user[data] : req.user) : undefined;
});
