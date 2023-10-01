import { Request } from 'express';
import { Payload } from 'src/modules/auth/types/payload.types';

export interface AuthRequest extends Request {
    user: Payload;
}
