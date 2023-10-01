import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Is_Public_key } from 'src/common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(ctx: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(Is_Public_key, [ctx.getClass(), ctx.getHandler()]);

        if (isPublic) return true;

        return super.canActivate(ctx);
    }
}
