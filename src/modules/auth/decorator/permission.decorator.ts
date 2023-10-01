import { SetMetadata } from '@nestjs/common';
import { PERMISSION } from '@prisma/client';

export const PERMISSION_KEY = 'permissions';

export const Permission = (...permissions: PERMISSION[]) => SetMetadata(PERMISSION_KEY, permissions);
